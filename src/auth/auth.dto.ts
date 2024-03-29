import { IsEmail, IsNotEmpty, IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AuthDto {
  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440000",
    description: "User ID",
  })
  id: string;
}

export class CredentialsDto {
  @ApiProperty({
    example: "13521999@mahasiswa.itb.ac.id",
    description: "User's email",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "123456789",
    description: "User's password",
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class TokenDto {
  @ApiProperty({
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    description: "JWT Token",
  })
  token: string;
}
