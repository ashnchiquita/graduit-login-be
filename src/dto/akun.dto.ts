import { RoleEnum } from "src/entities/pengguna.entity";

export class CreateAkunDto {
  id?: string;
  nama: string;
  email: string;
  password?: string;
  roles: RoleEnum[];
}

export class GetAkunDto {
  id: string;
  nama: string;
  email: string;
  roles: RoleEnum[];
}
