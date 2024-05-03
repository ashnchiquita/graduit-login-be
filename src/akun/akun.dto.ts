import { IsEnum, IsUUID } from "@nestjs/class-validator";
import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from "@nestjs/swagger";
import { IsArray, IsNumberString, IsOptional, IsString } from "class-validator";
import { Pengguna, RoleEnum } from "src/entities/pengguna.entity";

export class FindAllResDto {
  @ApiProperty({ type: [Pengguna] })
  akun: Pengguna[];

  @ApiProperty()
  count: number;
}

export class CreateAkunDto extends PickType(Pengguna, [
  "nama",
  "email",
  "nim",
] as const) {
  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({ example: "550e8400-e29b-41d4-a716-446655440000" })
  id?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  password?: string;

  @IsEnum(RoleEnum, {
    each: true,
  })
  @IsArray()
  @ApiProperty({ enum: RoleEnum, isArray: true })
  access: RoleEnum[];
}

// intermediate dto
export class UpsertExtDto {
  id: string;
  email: string;
  nama: string;
  nim: string | null;
}

export class FindAllQueryDto {
  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional({ description: "default: 1" })
  page?: number;

  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional({ description: "default: 10" })
  limit?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  search?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  nama?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  email?: string;

  @IsOptional()
  @IsEnum(RoleEnum, {
    each: true,
  })
  @ApiPropertyOptional({
    enum: RoleEnum,
    isArray: true,
    description: "default: [], use roles=...&roles=...&roles=...",
  })
  roles?: RoleEnum | RoleEnum[];
}

export class IdsDto {
  @ApiProperty()
  @IsUUID("all", {
    each: true,
  })
  @IsArray()
  ids: string[];
}

export class BatchAddRoleDto extends IdsDto {
  @IsEnum(RoleEnum, {
    each: true,
  })
  @IsArray()
  @ApiProperty({ enum: RoleEnum, isArray: true })
  newRoles: RoleEnum[];
}

export class IdDto extends PickType(Pengguna, ["id"] as const) {}

class PickedProfileDto extends PickType(Pengguna, [
  "kontakWhatsApp",
  "kontakMsTeams",
  "kontakEmail",
  "kontakTelp",
  "kontakLainnya",
  "keahlian",
] as const) {}

export class PatchProfileDto extends PartialType(PickedProfileDto) {}
