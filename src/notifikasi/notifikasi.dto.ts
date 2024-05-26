import { ApiProperty, OmitType, PickType } from "@nestjs/swagger";
import { Notifikasi } from "src/entities/notifikasi.entity";

export class CreateNotifDto extends OmitType(Notifikasi, [
  "createdAt",
  "id",
] as const) {}

export class IdDto extends PickType(Notifikasi, ["id"] as const) {}

export class MsgDto {
  @ApiProperty()
  message: string;
}
