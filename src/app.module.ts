import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Pengguna } from "./entities/pengguna.entity";
import { AkunModule } from "./akun/akun.module";
import { AuthModule } from "./auth/auth.module";
import { TransactionModule } from "./transaction/transaction.module";
import { validate } from "./env.validation";
import { NotifikasiModule } from "./notifikasi/notifikasi.module";
import { Notifikasi } from "./entities/notifikasi.entity";

const defaultOptions: TypeOrmModuleOptions = {
  type: "postgres",
  entities: [Pengguna, Notifikasi],
  synchronize: false,
};

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      /* WARNING: allowUnknown is set to true, but please only use 
      environment variables defined in env.validation.ts */
      validationOptions: { abortEarly: true, allowUnknown: true },
    }),
    TypeOrmModule.forRoot({
      ...defaultOptions,
      host: process.env.S1_POSTGRES_HOST,
      port: +process.env.S1_POSTGRES_PORT || 5432,
      username: process.env.S1_POSTGRES_USER,
      password: process.env.S1_POSTGRES_PASSWORD,
      database: process.env.S1_POSTGRES_DATABASE,
      synchronize: true,
      name: "S1Connection",
    }),
    TypeOrmModule.forRoot({
      ...defaultOptions,
      host: process.env.S2_POSTGRES_HOST,
      port: +process.env.S2_POSTGRES_PORT || 5432,
      username: process.env.S2_POSTGRES_USER,
      password: process.env.S2_POSTGRES_PASSWORD,
      database: process.env.S2_POSTGRES_DATABASE,
      synchronize: true,
      name: "S2Connection",
    }),
    AkunModule,
    AuthModule,
    TransactionModule,
    NotifikasiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
