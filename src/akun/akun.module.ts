import { Module } from "@nestjs/common";
import { AkunController } from "./akun.controller";
import { AkunService } from "./akun.service";

@Module({
  exports: [AkunService],
  controllers: [AkunController],
  providers: [AkunService],
})
export class AkunModule {}
