import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtUser {
  id: string;
}

export const GetUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const { user } = context.switchToHttp().getRequest<{ user: JwtUser }>();

    return user.id;
  },
);
