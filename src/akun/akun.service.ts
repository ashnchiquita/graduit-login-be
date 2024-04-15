import { Injectable } from "@nestjs/common";
import {
  BatchAddRoleDto,
  CreateAkunDto,
  FindAllResDto,
  IdDto,
  IdsDto,
  UpsertExtDto,
} from "src/akun/akun.dto";
import { Pengguna, RoleEnum } from "src/entities/pengguna.entity";
import * as bcrypt from "bcrypt";
import { TransactionService } from "src/transaction/transaction.service";
import { v4 as uuidv4 } from "uuid";
import { Brackets } from "typeorm";

@Injectable()
export class AkunService {
  constructor(private transactionService: TransactionService) {}

  async findAll(
    page: number,
    limit: number,
    search: string,
    nama: string,
    email: string,
    roles: RoleEnum[],
  ): Promise<FindAllResDto> {
    const [akun, count] = await this.transactionService.transaction(
      async (qr1, qr2) => {
        return await qr2.manager
          .getRepository(Pengguna)
          .createQueryBuilder("pengguna")
          .select([
            "pengguna.id",
            "pengguna.nama",
            "pengguna.email",
            "pengguna.roles",
            "pengguna.nim",
          ])
          .where(
            new Brackets((qb) => {
              qb.where("pengguna.nama ILIKE :search", {
                search: `%${search}%`,
              }).orWhere("pengguna.email ILIKE :search", {
                search: `%${search}%`,
              });
            }),
          )
          .andWhere("pengguna.nama ILIKE :nama", { nama: `%${nama}%` })
          .andWhere("pengguna.email ILIKE :email", { email: `%${email}%` })
          .andWhere("pengguna.roles @> :...roles", { roles })
          .skip((page - 1) * limit)
          .take(limit)
          .getManyAndCount();
      },
    );

    return {
      akun,
      count,
    };
  }

  async findById(accountId: string) {
    return await this.transactionService.transaction(async (qr1, qr2) => {
      return await qr2.manager.getRepository(Pengguna).findOne({
        select: {
          id: true,
          nama: true,
          email: true,
          roles: true,
          nim: true,
          kontak: true,
        },
        where: {
          id: accountId,
        },
      });
    });
  }

  async findByEmail(email: string) {
    return await this.transactionService.transaction(async (qr1, qr2) => {
      return await qr2.manager.getRepository(Pengguna).findOneBy({
        email,
      });
    });
  }

  async createOrUpdateAccount(createAkunDto: CreateAkunDto) {
    const hash = createAkunDto.password
      ? await bcrypt.hash(createAkunDto.password, 10)
      : undefined;

    if (!createAkunDto.id) {
      createAkunDto.id = uuidv4();
    }

    const val = {
      ...createAkunDto,
      password: hash,
      roles: createAkunDto.access,
    };

    return await this.transactionService.transaction(async (qr1, qr2) => {
      const [res1] = await Promise.all([
        qr1.manager.getRepository(Pengguna).upsert(val, ["id"]),
        qr2.manager.getRepository(Pengguna).upsert(val, ["id"]),
      ]);

      return res1;
    });
  }

  async deleteAccount(accountId: string) {
    return await this.transactionService.transaction(async (qr1, qr2) => {
      const [res1] = await Promise.all([
        qr1.manager.getRepository(Pengguna).delete(accountId),
        qr2.manager.getRepository(Pengguna).delete(accountId),
      ]);

      return res1;
    });
  }

  async upsertExternalAccount(upsertExtDto: UpsertExtDto) {
    return await this.transactionService.transaction(async (qr1, qr2) => {
      const val = {
        ...upsertExtDto,
        roles: [],
      };

      const [res1] = await Promise.all([
        qr1.manager
          .getRepository(Pengguna)
          .createQueryBuilder()
          .insert()
          .into(Pengguna)
          .values(val)
          .orUpdate(["email", "nama", "nim"], ["id"])
          .execute(),
        qr2.manager
          .getRepository(Pengguna)
          .createQueryBuilder()
          .insert()
          .into(Pengguna)
          .values(val)
          .orUpdate(["email", "nama", "nim"], ["id"])
          .execute(),
      ]);

      return res1;
    });
  }

  async batchAddRole({ ids, newRoles }: BatchAddRoleDto): Promise<IdsDto> {
    await this.transactionService.transaction(async (qr1, qr2) => {
      const s1Repo = qr1.manager.getRepository(Pengguna);
      const s2Repo = qr2.manager.getRepository(Pengguna);

      for (const id of ids) {
        await Promise.all([
          s1Repo.update({ id }, { roles: newRoles }),
          s2Repo.update({ id }, { roles: newRoles }),
        ]);
      }

      for (const id of ids) {
        const currUserQuery = s2Repo.findOne({
          select: ["id", "roles"],
          where: { id },
        });

        const currRoles = (await currUserQuery).roles;
        const mergedRoles = [...new Set([...currRoles, ...newRoles])];

        await Promise.all([
          s1Repo.update({ id }, { roles: mergedRoles }),
          s2Repo.update({ id }, { roles: mergedRoles }),
        ]);
      }
    });

    return { ids };
  }

  async batchRemoveRole({ ids }: IdsDto): Promise<IdsDto> {
    await this.transactionService.transaction(async (qr1, qr2) => {
      const s1Repo = qr1.manager.getRepository(Pengguna);
      const s2Repo = qr2.manager.getRepository(Pengguna);

      s1Repo
        .createQueryBuilder()
        .update()
        .set({ roles: [] })
        .where("id IN (:...ids)", { ids });

      await Promise.all([
        s1Repo
          .createQueryBuilder()
          .update()
          .set({ roles: [] })
          .where("id IN (:...ids)", { ids }),
        s2Repo
          .createQueryBuilder()
          .update()
          .set({ roles: [] })
          .where("id IN (:...ids)", { ids }),
      ]);
    });

    return { ids };
  }

  async updateKontak(id: string, kontak: string): Promise<IdDto> {
    return await this.transactionService.transaction(async (qr1, qr2) => {
      const s1Repo = qr1.manager.getRepository(Pengguna);
      const s2Repo = qr2.manager.getRepository(Pengguna);

      await Promise.all([
        s1Repo.update({ id }, { kontak }),
        s2Repo.update({ id }, { kontak }),
      ]);

      return { id: id };
    });
  }
}
