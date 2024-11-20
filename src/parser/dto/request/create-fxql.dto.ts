import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateFxqlDto {
  @ApiProperty({
    description: 'The FXQL statement to be parsed',
    example: `USD-GBP {\\n BUY 100\\n SELL 200\\n CAP 93800\\n}`,
    required: true,
    type: String,
    minLength: 1,
  })
  @IsNotEmpty()
  @IsString()
  FXQL: string;
}
