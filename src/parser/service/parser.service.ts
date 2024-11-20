import { BadRequestException, Injectable } from '@nestjs/common';
import { ExceptionsService } from '../../common/exceptions/exceptions.service';
import { LoggerService } from '../../common/logger/logger.service';
import { mapToCreateFxqlResponseDto } from '../dto/response/create-fxql-response.dto';
import { FXQLEntryRepository } from '../repository/fxql-entry.repository';
import {
  isValidCurrency,
  isValidNumber,
  isValidWholeNumber,
  MAX_CURRENCY_PAIRS,
  ParsedFXQL,
} from '../util/processor';

@Injectable()
export class ParserService {
  constructor(
    private readonly exceptionService: ExceptionsService,
    private readonly fxqlRepository: FXQLEntryRepository,
    private readonly logger: LoggerService,
  ) {}

  async processFXQL(fxql: string): Promise<any> {
    try {
      const errors = this.validateInputWithNewlineSeparation(fxql);
      if (errors.length) {
        this.exceptionService.badRequestException({
          message: 'Invalid FXQL Statement.',
          code: 'FXQL-400',
          error: errors,
        });
      }
      const entries = this.parseFxql(fxql);
      const savedEntries = await this.fxqlRepository.store(entries);

      return {
        message: 'Rates Parsed Successfully.',
        code: 'FXQL-201',
        data: mapToCreateFxqlResponseDto(savedEntries),
      };
    } catch (error) {
      throw error;
    }
  }

  validateInputWithNewlineSeparation(input: string): string[] {
    const errors: string[] = [];

    if (input.includes('\n')) {
      errors.push('Please replace \n with \\n');
      return errors;
    }

    // This splits the input into blocks of currency pairs by '}' and add a closing brace to each block
    const fxqlBlocks = input
      .trim()
      .split('}')
      .map((block) => block.trim() + '}')
      .filter((block) => block !== '}'); //remove last closing brace if any

    if (fxqlBlocks.length > MAX_CURRENCY_PAIRS) {
      errors.push(
        `Request exceeds the maximum limit of ${MAX_CURRENCY_PAIRS} currency pairs.`,
      );
      return errors;
    }

    for (let i = 0; i < fxqlBlocks.length; i++) {
      const block = fxqlBlocks[i];
      //Ensures appropriate seperation between the individual blocks by making sure each is succeeded by ''\\n\\n'
      if (i !== 0 && !block.startsWith('\\n\\n')) {
        errors.push(
          `Block ${i} and ${i + 1} must be separated by exactly one newline.`,
        );
        continue;
      }
      const blockErrors = this.validateBlock(block);
      if (blockErrors.length > 0) {
        errors.push(`Block ${i + 1} errors: ${blockErrors.join(', ')}`);
      }
    }

    return errors;
  }

  private validateBlock(block: string): string[] {
    const errors: string[] = [];

    const lines = block
      .replace('\\n\\n', '')
      .split('\\n')
      .map((line) => line.trim());

    const [pair, openingBrace] = lines[0].split(' ');

    if (openingBrace !== '{') {
      errors.push(`Currency pair must be followed by a space and '{'`);
    }

    const currencies = pair.trim().split('-');

    if (currencies.length !== 2) {
      errors.push(`Invalid currency pair format`);
      return errors;
    }
    const curr1 = currencies[0].trim();
    const curr2 = currencies[1].trim();

    if (!isValidCurrency(curr1)) {
      errors.push(`Invalid source currency: "${curr1}"`);
    }
    if (!isValidCurrency(curr2)) {
      errors.push(`Invalid destination currency: "${curr2}"`);
    }

    const commands = new Set(['BUY', 'SELL', 'CAP']);
    const foundCommands = new Set<string>();

    //Checks for valid commands and ensures there are no duplicates
    for (let i = 1; i < lines.length - 1; i++) {
      const [command, value] = lines[i].split(/\s+/);
      if (!commands.has(command)) {
        errors.push(`Invalid command: ${command}`);
      } else if (foundCommands.has(command)) {
        errors.push(`Duplicate command: ${command}`);
      } else {
        foundCommands.add(command);
        if (command === 'BUY' || command === 'SELL') {
          if (!isValidNumber(value)) {
            errors.push(`Invalid value for ${command}: ${value}`);
          }
        } else if (command === 'CAP') {
          if (!isValidWholeNumber(value)) {
            errors.push(`Invalid value for CAP: ${value}`);
          }
        }
      }
    }

    if (
      !foundCommands.has('BUY') ||
      !foundCommands.has('SELL') ||
      !foundCommands.has('CAP')
    ) {
      errors.push(`Missing one or more required commands (BUY, SELL, CAP).`);
    }
    if (!lines[lines.length - 1].endsWith('}')) {
      errors.push('Missing closing brace.');
    }

    return errors;
  }

  parseFxql(fxql: string): ParsedFXQL[] {
    const result = [];
    const lines = fxql.trim().split('\\n');

    let entry: any = null;

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (trimmedLine.endsWith('{')) {
        const currencies = trimmedLine.replace('{', '').trim().split('-');
        entry = {
          SourceCurrency: currencies[0].trim(),
          DestinationCurrency: currencies[1].trim(),
        };
      } else if (trimmedLine.endsWith('}')) {
        if (entry) result.push(entry);
        entry = null;
      } else if (entry) {
        const [command, value] = trimmedLine.split(/\s+/);
        const numericValue =
          command === 'CAP' ? parseInt(value, 10) : parseFloat(value);
        switch (command) {
          case 'BUY':
            entry.BuyPrice = numericValue;
            break;
          case 'SELL':
            entry.SellPrice = numericValue;
            break;
          case 'CAP':
            entry.CapAmount = numericValue;
            break;
        }
      }
    }

    return result;
  }
}
