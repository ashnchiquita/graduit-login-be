import { IsEnum, IsUUID } from "@nestjs/class-validator";
import { Pengguna, RoleEnum } from "src/entities/pengguna.entity";

export class FindAllResDto {
  akun: Pengguna[];
  count: number;
}
export class CreateAkunDto {
  id?: string;
  nama: string;
  email: string;
  password?: string;
  access: RoleEnum[];
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
