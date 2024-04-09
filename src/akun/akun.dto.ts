import { IsEnum, IsNotEmpty, IsUUID } from "@nestjs/class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsEmail,
  IsNumberString,
  IsOptional,
  IsString,
} from "class-validator";
import { Pengguna, RoleEnum } from "src/entities/pengguna.entity";

export class FindAllResDto {
  @ApiProperty({ type: [Pengguna] })
  akun: Pengguna[];

  @ApiProperty()
  count: number;
}
export class CreateAkunDto {
  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({ example: "550e8400-e29b-41d4-a716-446655440000" })
  id?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nama: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: "a@gmail.com" })
  email: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  password?: string;

  @IsEnum(RoleEnum, {
    each: true,
  })
  @IsArray()
  @ApiProperty({ enum: RoleEnum, isArray: true })
  access: RoleEnum[];

  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional({ example: "13521129" })
  nim?: string;
}

// intermediate dto
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
  @IsArray()
  @ApiProperty({
    type: [String],
    example: [
      "9322c384-fd8e-4a13-80cd-1cbd1ef95ba8",
      "9422c384-fd8e-4a13-80cd-1cbd1ef95ba8",
    ],
  })
  ids: string[];

  @IsEnum(RoleEnum, {
    each: true,
  })
  @IsArray()
  @ApiProperty({ enum: RoleEnum, isArray: true })
  newRoles: RoleEnum[];
}

export class FindAllQueryDto {
  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional({ description: "default: 1" })
  page?: number;

  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional({ description: "default: 10" })
  limit?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  search?: string;
}

export class BatchUpdateRoleRespDto {
  @ApiProperty()
  message: string;
}

export class ByIdParamDto {
  @ApiProperty({ example: "9322c384-fd8e-4a13-80cd-1cbd1ef95ba8" })
  @IsUUID()
  id: string;
}
