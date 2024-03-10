import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: process.env.LOGIN_FE_URL,
    credentials: true,
  });

  await app.listen(Number(process.env.PORT));
}
bootstrap();
