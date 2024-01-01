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
import {
  DomainErrorsService,
  Error,
} from 'src/services/domain-errors/domain-errors.service';

interface HttpReturn {
  message: string;
  status: number;
  success: boolean;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly domainErrorService: DomainErrorsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: unknown) => {
        const errors = this.domainErrorService.errors;
        const hasErrors = errors.length;
        if (hasErrors) {
          this.errorHandler(errors, context);
          this.domainErrorService.cleanErrors();
          return;
        }

        return this.responseHandler(res, context);
      }),
      catchError((err: HttpException) => {
        return throwError(() => this.errorHandler(err, context));
      }),
    );
  }

  errorHandler(exception: HttpException | Error[], context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    let error: HttpReturn | Error[];
    let status: number;

    if (exception instanceof HttpException) {
      (status = exception.getStatus()),
        (error = {
          status,
          message: exception.message,
          success: false,
        });
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      error = exception;
    }

    return response.status(status).json(error);
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
