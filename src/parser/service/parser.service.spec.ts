import { Test, TestingModule } from '@nestjs/testing';
import { ParserService } from './parser.service';
import { ExceptionsService } from '../../common/exceptions/exceptions.service';
import { FXQLEntryRepository } from '../repository/fxql-entry.repository';
import { LoggerService } from '../../common/logger/logger.service';

describe('ParserService', () => {
  let service: ParserService;
  let exceptionsService: ExceptionsService;
  let fxqlRepository: FXQLEntryRepository;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const mockLoggerService = {
      log: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
    };

    const mockExceptionsService = {
      badRequestException: jest.fn(),
      internalServerErrorException: jest.fn(),
    };

    const mockFxqlRepository = {
      store: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParserService,
        {
          provide: ExceptionsService,
          useValue: mockExceptionsService,
        },
        {
          provide: FXQLEntryRepository,
          useValue: mockFxqlRepository,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    service = module.get<ParserService>(ParserService);
    exceptionsService = module.get<ExceptionsService>(ExceptionsService);
    fxqlRepository = module.get<FXQLEntryRepository>(FXQLEntryRepository);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  it('should parse a correct FXQL statement', async () => {
    const input = `USD-GBP {\\n BUY 100\\n SELL 200\\n CAP 93800\\n}`;
    const result = service.parseFxql(input);
    expect(result).toEqual([
      {
        SourceCurrency: 'USD',
        DestinationCurrency: 'GBP',
        BuyPrice: 100,
        SellPrice: 200,
        CapAmount: 93800,
      },
    ]);
  });

  it('should reject FXQL with invalid currency format', () => {
    const input = `usd-GBP {\\n BUY 100\\n SELL 200\\n CAP 93800\\n}`;
    const errors = service.validateInputWithNewlineSeparation(input);
    expect(errors).toEqual([
      'Block 1 (usd-GBP {\\n BUY 100\\n SELL 200\\n CAP 93800\\n}) errors: Invalid currency pair or missing opening brace: usd-GBP {. Should follow format "USD-GBP {" after previous block',
    ]);
  });

  it('should reject FXQL with a negative CAP value', () => {
    const input = `USD-GBP {\\n BUY 0.85\\n SELL 0.90\\n CAP -100\\n}`;
    const errors = service.validateInputWithNewlineSeparation(input);
    expect(errors).toEqual([
      'Block 1 (USD-GBP {\\n BUY 0.85\\n SELL 0.90\\n CAP -100\\n}) errors: Invalid value for CAP: -100',
    ]);
  });

  it('should reject FXQL with missing newline separation', () => {
    const input = `USD-GBP {\\n  BUY 0.85\\nSELL 0.90\\nCAP 10000\\n}\\nEUR-JPY {\\n  BUY 145.20\\n  SELL 146.50\\n  CAP 50000\\n}`;
    const errors = service.validateInputWithNewlineSeparation(input);
    expect(errors).toContain(
      'Block 1 and 2 must be separated by exactly one newline.',
    );
  });
});
