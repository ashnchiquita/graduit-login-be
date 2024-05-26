import { Injectable } from "@nestjs/common";
import { Notifikasi } from "src/entities/notifikasi.entity";
import { CreateNotifDto, IdDto, MsgDto } from "./notifikasi.dto";
import { TransactionService } from "src/transaction/transaction.service";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class NotifikasiService {
  constructor(private transactionService: TransactionService) {}

  async create(dto: CreateNotifDto): Promise<IdDto> {
    const id = uuidv4();

    await this.transactionService.transaction(async (qr1, qr2) => {
      await Promise.all([
        qr1.manager.getRepository(Notifikasi).save({
          id,
          ...dto,
        }),
        qr2.manager.getRepository(Notifikasi).save({
          id,
          ...dto,
        }),
      ]);
    });

    return { id };
  }

  async delete(id: string): Promise<MsgDto> {
    await this.transactionService.transaction(async (qr1, qr2) => {
      await Promise.all([
        qr1.manager.getRepository(Notifikasi).delete(id),
        qr2.manager.getRepository(Notifikasi).delete(id),
      ]);
    });

    return { message: "success" };
  }

  async findByUserId(userId: string): Promise<Notifikasi[]> {
    return this.transactionService.transaction(async (qr1) => {
      return qr1.manager.getRepository(Notifikasi).find({
        where: {
          penggunaId: userId,
        },
        order: {
          createdAt: "DESC",
        },
      });
    });
  }
}
