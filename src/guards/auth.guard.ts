import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { HttpTypeErrors } from 'src/enums/http-type-errors';
import { Error } from 'src/services/domain-errors/domain-errors.service';
import { IS_PUBLIC_KEY } from '../modules/auth/decorators/is-public-route';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
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
      const error: Error = {
        message: 'O usuário não está logado na aplicação',
        type: HttpTypeErrors.NOT_LOGGED_IN_APPLICATION,
      };
      return response.status(HttpStatus.FORBIDDEN).json(error);
    });
  }
}
