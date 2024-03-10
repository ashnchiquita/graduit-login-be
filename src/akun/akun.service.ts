import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAkunDto } from "src/akun/akun.dto";
import { Pengguna } from "src/entities/pengguna.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";

@Injectable()
export class AkunService {
  constructor(
    @InjectRepository(Pengguna)
    private penggunaRepository: Repository<Pengguna>,
  ) {}

  async findAll(page: number, limit: number, search: string) {
    return await this.penggunaRepository
      .createQueryBuilder("pengguna")
      .select([
        "pengguna.id",
        "pengguna.nama",
        "pengguna.email",
        "pengguna.roles",
      ])
      .where("pengguna.nama ILIKE :search", { search: `%${search}%` })
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async findById(accountId: string) {
    return await this.penggunaRepository.findOne({
      select: {
        id: true,
        nama: true,
        email: true,
        roles: true,
      },
      where: {
        id: accountId,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.penggunaRepository.findOneBy({
      email,
    });
  }

  async createOrUpdateAccount(createAkunDto: CreateAkunDto) {
    const hash = createAkunDto.password
      ? await bcrypt.hash(createAkunDto.password, 10)
      : undefined;

    return await this.penggunaRepository.upsert(
      {
        id: createAkunDto.id,
        nama: createAkunDto.nama,
        email: createAkunDto.email,
        password: hash,
        roles: createAkunDto.roles,
      },
      ["id"],
    );
  }

  async deleteAccount(accountId: string) {
    return await this.penggunaRepository.delete(accountId);
  }

  async upsertExternalAccount(id: string, email: string, nama: string) {
    return await this.penggunaRepository
      .createQueryBuilder()
      .insert()
      .into(Pengguna)
      .values({
        id,
        email,
        nama,
        roles: [],
      })
      .orUpdate(["email", "nama"], ["id"])
      .execute();
  }
}
