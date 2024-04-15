import { IsEnum, IsUUID } from "@nestjs/class-validator";
import { ApiProperty, ApiPropertyOptional, PickType } from "@nestjs/swagger";
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

export class BatchUpdateRoleDto {
  @IsUUID("all", {
    each: true,
  })
  @IsArray()
  @ApiProperty({
    type: [String],
    example: [
      "9322c384-fd8e-4a13-80cd-1cbd1ef95ba8",
      "9422c384-fd8e-4a13-80cd-1cbd1ef95ba8",
    ],
  })
  ids: string[];

  @IsEnum(RoleEnum, {
    each: true,
  })
  @IsArray()
  @ApiProperty({ enum: RoleEnum, isArray: true })
  newRoles: RoleEnum[];
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
  @IsArray()
  @ApiPropertyOptional({ enum: RoleEnum, isArray: true })
  roles?: RoleEnum[];
}

export class BatchUpdateRoleRespDto {
  @ApiProperty()
  message: string;
}

export class IdDto extends PickType(Pengguna, ["id"] as const) {}

export class PatchKontakDto {
  @IsString()
  @ApiProperty()
  kontak: string;
}
