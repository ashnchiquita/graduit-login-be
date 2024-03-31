import { IsEnum, IsNotEmpty, IsUUID } from "@nestjs/class-validator";
import { IsOptional, IsString } from "class-validator";
import { Pengguna, RoleEnum } from "src/entities/pengguna.entity";

export class FindAllResDto {
  akun: Pengguna[];
  count: number;
}
export class CreateAkunDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsEnum(RoleEnum, {
    each: true,
  })
  access: RoleEnum[];

  @IsString()
  @IsOptional()
  nim?: string;
}

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
  ids: string[];

  @IsEnum(RoleEnum, {
    each: true,
  })
  newRoles: RoleEnum[];
}
