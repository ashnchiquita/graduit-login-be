import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Pengguna } from "./pengguna.entity";
import { IsString } from "@nestjs/class-validator";

@Entity()
export class Notifikasi {
  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsUUID()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @IsString()
  @Column({ type: "text" })
  title: string;

  @ApiProperty()
  @IsString()
  @Column({ type: "text" })
  description: string;

  @ApiProperty()
  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @ManyToOne(() => Pengguna, (pengguna) => pengguna.id)
  @JoinColumn({ name: "penggunaId" })
  pengguna: Pengguna;

  @ApiProperty()
  @IsUUID()
  @Column()
  penggunaId: string;
}
