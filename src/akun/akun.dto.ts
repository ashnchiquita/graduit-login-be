import { RoleEnum } from "src/entities/pengguna.entity";

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
