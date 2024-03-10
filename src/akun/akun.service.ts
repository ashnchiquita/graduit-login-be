import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAkunDto } from "src/akun/akun.dto";
import { Pengguna } from "src/entities/pengguna.entity";
import { Repository } from "typeorm";

@Injectable()
export class AkunService {
  constructor(
    @InjectRepository(Pengguna)
    private penggunaRepository: Repository<Pengguna>,
  ) {}

  async findAll(page: number, limit: number, search: string) {
    return await this.penggunaRepository
      .createQueryBuilder("pengguna")
      .where("pengguna.nama ILIKE :search", { search: `%${search}%` })
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async findById(accountId: string) {
    return await this.penggunaRepository.findOneBy({ id: accountId });
  }

  async createOrUpdateAccount(createAkunDto: CreateAkunDto) {
    return await this.penggunaRepository.upsert(
      {
        id: createAkunDto.id,
        nama: createAkunDto.nama,
        email: createAkunDto.email,
        status: createAkunDto.status,
        roles: createAkunDto.access,
      },
      ["id"],
    );

    // return await this.penggunaRepository.save(newUser);
  }

  async deleteAccount(accountId: string) {
    return await this.penggunaRepository.delete(accountId);
  }
}
