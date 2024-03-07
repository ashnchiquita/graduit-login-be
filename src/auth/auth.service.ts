import { Injectable } from "@nestjs/common";
import { AkunService } from "src/akun/akun.service";
import * as bcrypt from "bcrypt";
import { GetAkunDto } from "src/dto/akun.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private akunService: AkunService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<GetAkunDto | null> {
    const user = await this.akunService.findByEmail(email);

    if (user) {
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        return {
          id: user.id,
          nama: user.nama,
          email: user.email,
          roles: user.roles,
        };
      }
    }

    return null;
  }

  async login(user: GetAkunDto) {
    const payload = { sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
