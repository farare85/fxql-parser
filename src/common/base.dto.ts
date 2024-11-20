import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse {
  @ApiProperty()
  message: string;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  response?: Object;
}
