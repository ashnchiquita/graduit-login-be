import { IsEmail, IsNotEmpty, IsString } from "@nestjs/class-validator";

export class AuthDto {
  id: string;
}

export class CredentialsDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
