// NestJS
import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/is-public-route';
import { UnitOfWorkService } from 'src/modules/unit-of-work/unit-of-work.service';
import { HttpErrors } from 'src/enums/http-erros.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly unitOfWork: UnitOfWorkService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const canActivate = super.canActivate(context);

    if (typeof canActivate === 'boolean') {
      return canActivate;
    }

    const canActivatePromise = canActivate as Promise<boolean>;
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return canActivatePromise.catch(() => {
      return response.status(HttpStatus.FORBIDDEN).json({
        error: 'O usuário não está logado na aplicação',
        type: HttpErrors.NOT_LOGGED,
        statusCode: HttpStatus.FORBIDDEN,
        success: false,
      });
    });
  }
}
