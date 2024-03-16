import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource, QueryRunner } from "typeorm";

@Injectable()
export class TransactionService {
  constructor(
    @InjectDataSource("S1Connection") private S1DataSource: DataSource,
    @InjectDataSource("S2Connection") private S2DataSource: DataSource,
  ) {}

  /**
   *
   * @param tryBlock write your queries here
   * @param catchBlock don't throw anything here
   * @returns
   */
  async transaction<T>(
    tryBlock: (...queryRunners: QueryRunner[]) => Promise<T>,
    catchBlock?: () => Promise<void> | void,
  ) {
    const queryRunners: QueryRunner[] = [];

    if (this.S1DataSource) {
      const qr = this.S1DataSource.createQueryRunner();
      await qr.connect();
      await qr.startTransaction();
      queryRunners.push(qr);
    }

    if (this.S2DataSource) {
      const qr = this.S2DataSource.createQueryRunner();
      await qr.connect();
      await qr.startTransaction();
      queryRunners.push(qr);
    }

    try {
      const result = await tryBlock(...queryRunners);

      for (const qr of queryRunners) {
        await qr.commitTransaction();
      }

      return result;
    } catch (error) {
      await catchBlock?.();

      for (const qr of queryRunners) {
        await qr.rollbackTransaction();
      }
      throw error;
    } finally {
      for (const qr of queryRunners) {
        await qr.release();
      }
    }
  }
}
