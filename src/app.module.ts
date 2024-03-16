import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Pengguna } from "./entities/pengguna.entity";
import { AkunModule } from "./akun/akun.module";
import { AuthModule } from "./auth/auth.module";
import { TransactionModule } from "./transaction/transaction.module";

const defaultOptions: TypeOrmModuleOptions = {
  type: "postgres",
  entities: [Pengguna],
  synchronize: false,
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    // TypeOrmModule.forRoot({
    //   ...defaultOptions,
    //   host: process.env.POSTGRES_HOST,
    //   port: +process.env.POSTGRES_PORT || 5432,
    //   username: process.env.POSTGRES_USER,
    //   password: process.env.POSTGRES_PASSWORD,
    //   database: process.env.POSTGRES_DATABASE,
    // }),
    TypeOrmModule.forRoot({
      ...defaultOptions,
      host: process.env.S1_POSTGRES_HOST,
      port: +process.env.S1_POSTGRES_PORT || 5432,
      username: process.env.S1_POSTGRES_USER,
      password: process.env.S1_POSTGRES_PASSWORD,
      database: process.env.S1_POSTGRES_DATABASE,
      name: "S1Connection",
    }),
    TypeOrmModule.forRoot({
      ...defaultOptions,
      host: process.env.S2_POSTGRES_HOST,
      port: +process.env.S2_POSTGRES_PORT || 5432,
      username: process.env.S2_POSTGRES_USER,
      password: process.env.S2_POSTGRES_PASSWORD,
      database: process.env.S2_POSTGRES_DATABASE,
      name: "S2Connection",
    }),
    AkunModule,
    AuthModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
