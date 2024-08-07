import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import {
  ApiProperty,
  ApiHideProperty,
  ApiPropertyOptional,
} from "@nestjs/swagger";
import {
  IsBoolean,
  IsEmail,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export enum RoleEnum {
  ADMIN = "ADMIN",
  S2_MAHASISWA = "S2_MAHASISWA",
  S2_PEMBIMBING = "S2_PEMBIMBING",
  S2_PENGUJI = "S2_PENGUJI",
  S2_TIM_TESIS = "S2_TIM_TESIS",
  S1_MAHASISWA = "S1_MAHASISWA",
  S1_PEMBIMBING = "S1_PEMBIMBING",
  S1_PENGUJI = "S1_PENGUJI",
  S1_TIM_TA = "S1_TIM_TA",
}

@Entity()
export class Pengguna {
  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440000",
    description: "User ID",
  })
  @IsUUID()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({
    example: "Azikri Maulana",
    description: "User's name",
  })
  @IsString()
  @Column({ type: "text", nullable: true })
  nama: string;

  @ApiProperty({
    example: "13521999@mahasiswa.itb.ac.id",
    description: "User's email",
  })
  @IsEmail()
  @Column({ type: "text", unique: true })
  email: string;

  @ApiHideProperty()
  @Column({ type: "text", nullable: true })
  password: string;

  @ApiPropertyOptional({
    example: "13521999",
    description: "User's NIM",
  })
  @IsOptional()
  @IsNumberString()
  @Column({ type: "varchar", length: 8, nullable: true })
  nim?: string;

  @ApiProperty({
    example: '[ "S2_MAHASISWA", "S2_TIM_TESIS" ]',
    description: "User's roles",
  })
  @Column({
    type: "enum",
    enum: RoleEnum,
    array: true,
    default: [],
  })
  roles: RoleEnum[];

  @ApiPropertyOptional()
  @IsString()
  @Column({ type: "text", nullable: true })
  kontakWhatsApp: string;

  @ApiPropertyOptional()
  @IsString()
  @Column({ type: "text", nullable: true })
  kontakMsTeams: string;

  @ApiPropertyOptional()
  @IsString()
  @Column({ type: "text", nullable: true })
  kontakEmail: string;

  @ApiPropertyOptional()
  @IsString()
  @Column({ type: "text", nullable: true })
  kontakTelp: string;

  @ApiPropertyOptional()
  @IsString()
  @Column({ type: "text", nullable: true })
  kontakLainnya: string;

  @ApiPropertyOptional()
  @IsString()
  @Column({ type: "text", nullable: true })
  keahlian: string;

  @ApiHideProperty()
  @IsBoolean()
  @Column({ type: "boolean", default: true })
  aktif: boolean;
}
