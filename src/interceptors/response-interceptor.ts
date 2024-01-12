import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UnitOfWorkService } from '../modules/unit-of-work/unit-of-work.service';
import { DomainErrorsService } from '../modules/unit-of-work/domain-errors/domain-errors.service';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  domainErrorsService: DomainErrorsService;

  constructor(private readonly unitOfWorkService: UnitOfWorkService) {
    this.domainErrorsService = unitOfWorkService.domainErrorsService;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: unknown) => {
        const { error: errors } = this.unitOfWorkService.domainErrorsService;
        const hasErrors = errors.length;
        if (hasErrors) {
          this.errorHandler(errors, context);
          this.unitOfWorkService.domainErrorsService.cleanErrors();
          return;
        }

        return this.responseHandler(res, context);
      }),
      catchError((err: HttpException) => {
        return throwError(() => this.errorHandler(err, context));
      }),
    );
  }

  errorHandler(exception: HttpException | string, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    let errors;
    let type: string;
    let statusCode: HttpStatus;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      errors = exception.message;
    } else {
      type = this.domainErrorsService.type;
      statusCode = this.domainErrorsService.status || 500;
      errors = this.domainErrorsService.error || exception;
    }

    return response.status(statusCode).json({
      type,
      error: errors,
      statusCode,
      success: false,
    });
  }

  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    const statusCode = response.statusCode;

    return {
      statusCode,
      message: 'Operação realizada com sucesso!',
      data: res,
      success: true,
    };
  }
}
