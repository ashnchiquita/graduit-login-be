import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AkunModule } from "src/akun/akun.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { LocalStrategy } from "src/middlewares/local.strategy";
import { JwtStrategy } from "src/middlewares/jwt.strategy";
import { MicrosoftStrategy } from "src/middlewares/microsoft.strategy";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    AkunModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "1d" },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, MicrosoftStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
