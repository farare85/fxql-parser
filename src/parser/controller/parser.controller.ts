import { Body, Controller, Post } from '@nestjs/common';
import { ParserService } from '../service/parser.service';
import { CreateFxqlDto } from '../dto/request/create-fxql.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateFxqlResponseDto } from '../dto/response/create-fxql-response.dto';

@Controller('parser')
export class ParserController {
  constructor(private readonly _service: ParserService) {}

  @ApiOperation({
    summary: 'Parse FXQL statement',
    description:
      'Validates and processes an FXQL statement containing currency pair rates',
  })
  @ApiResponse({
    status: 201,
    description: 'FXQL statement successfully parsed',
    schema: {
      example: {
        message: 'Rates Parsed Successfully.',
        code: 'FXQL-200',
        data: CreateFxqlResponseDto,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid FXQL statement',
    schema: {
      example: {
        message: 'Invalid FXQL Statement.',
        code: 'FXQL-400',
        errors: ['Invalid currency pair format', 'Unknown command'],
      },
    },
  })
  @Post('/fxql-statements')
  async parseFXQL(@Body() body: CreateFxqlDto): Promise<any> {
    return this._service.processFXQL(body.FXQL);
  }
}
