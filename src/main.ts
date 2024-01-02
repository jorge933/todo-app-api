import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/response-interceptor';
import { PARAMS_VALIDATION_PIPE } from './pipes/validate-params/validate-params';
import { DomainErrorsService } from './services/domain-errors/domain-errors.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(
    new ResponseInterceptor(await app.resolve(DomainErrorsService)),
  );
  app.useGlobalPipes(PARAMS_VALIDATION_PIPE);

  await app.listen(3000);
}
bootstrap();
