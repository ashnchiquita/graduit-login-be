import { Module } from "@nestjs/common";
import { NotifikasiService } from "./notifikasi.service";
import { NotifikasiController } from "./notifikasi.controller";

@Module({
  providers: [NotifikasiService],
  controllers: [NotifikasiController],
})
export class NotifikasiModule {}
