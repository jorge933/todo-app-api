import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/response-interceptor';
import { PARAMS_VALIDATION_PIPE } from './pipes/validate-params/validate-params';
import { UnitOfWorkService } from './modules/unit-of-work/unit-of-work.service';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
  });

  app.useGlobalInterceptors(
    new ResponseInterceptor(await app.resolve(UnitOfWorkService)),
  );
  app.useGlobalPipes(PARAMS_VALIDATION_PIPE);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3000);
}
bootstrap();
