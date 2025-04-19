import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export interface ResponseData<T> {
  status?: string;
  message?: string;
  data?: T;
  code?: number;
}

export interface ResponseError {
  status?: string;
  message?: string;
  errors?: { error: string } | string;
  code?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function responseData(data: any, message: string, code = HttpStatus.OK, status = 'success'): ResponseData<any>  {
  return {
    status,
    message,
    data,
    code,
  };
}

export function responseError(
  error: { code?: number; message?: string } | string,
  message: string,
  code = HttpStatus.INTERNAL_SERVER_ERROR,
): never {
  const errorMessage =
    typeof error === 'string'
      ? error
      : error?.message || 'Ocurrió un error inesperado.';

  const errorBody = (code: number) => ({
    status: 'error',
    message,
    errors: { error: errorMessage },
    code
  });

  switch (code) {
    case HttpStatus.BAD_REQUEST:
      throw new BadRequestException(errorBody(HttpStatus.BAD_REQUEST));
    case HttpStatus.UNAUTHORIZED:
      throw new UnauthorizedException(errorBody(HttpStatus.UNAUTHORIZED));
    case HttpStatus.FORBIDDEN:
      throw new ForbiddenException(errorBody(HttpStatus.FORBIDDEN));
    case HttpStatus.NOT_FOUND:
      throw new NotFoundException(errorBody(HttpStatus.NOT_FOUND));
    case HttpStatus.CONFLICT:
      throw new ConflictException(errorBody(HttpStatus.CONFLICT));
    case HttpStatus.INTERNAL_SERVER_ERROR:
      throw new InternalServerErrorException(errorBody(HttpStatus.INTERNAL_SERVER_ERROR));
    default:
      throw new HttpException(errorBody(code), code);
  }
}

