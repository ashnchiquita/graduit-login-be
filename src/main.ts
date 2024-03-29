import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { ForbiddenExceptionFilter } from "./middlewares/forbidden-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new ForbiddenExceptionFilter());

  app.use(cookieParser());
  app.enableCors({
    origin: process.env.LOGIN_FE_URL,
    credentials: true,
  });

  await app.listen(Number(process.env.PORT));
}
bootstrap();
