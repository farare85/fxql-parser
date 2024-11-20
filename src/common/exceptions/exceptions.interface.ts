export interface IFormatExceptionMessage {
  message?: string;
  error?: any;
  code?: string;
}

export interface IException {
  badRequestException(data: IFormatExceptionMessage): void;
  internalServerErrorException(data?: IFormatExceptionMessage): void;
  forbiddenException(data?: IFormatExceptionMessage): void;
  unauthorizedException(data?: IFormatExceptionMessage): void;
  unprocessableEntityException(data?: IFormatExceptionMessage): void;
  notFoundException(data?: IFormatExceptionMessage): void;
}
