import {
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import mongoose from 'mongoose';

import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ErrorMessages } from './messages';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message;

      if (status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: message,
        });
      } else {
        this.logger.error(exception);

        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: ErrorMessages.InternalServerError,
        });
      }
    } else {
      this.logger.error(exception);

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: ErrorMessages.InternalServerError,
      });
    }

    super.catch(exception, host);
  }
}
export enum AccountRoles {
  ADMIN = 'admin',
  DONOR = 'donor',
  SUPPLIER = 'supplier',
}

export enum AllowedAccountRoles {
  DONOR = 'donor',
  CUSTOMER = 'customer',
}

export interface UserAccount {
  id: mongoose.Schema.Types.ObjectId;
  role: AccountRoles;
  email: string;
  fullName: string;
}
export var currentUser: UserAccount | null = null;
export const setCurrentUser = (user: UserAccount) => {
  currentUser = user;
};

export enum AccountStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}
