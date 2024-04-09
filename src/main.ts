import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
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

  const options = new DocumentBuilder()
    .setTitle("GraduIT API")
    .setDescription(
      "GraduIT API Documentation for account and authentication services",
    )
    .setVersion("1.0")
    .addTag("Akun")
    .addTag("Auth")
    .addBearerAuth()
    .addCookieAuth(process.env.COOKIE_NAME)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api-docs", app, document);

  await app.listen(Number(process.env.PORT));
}
bootstrap();
