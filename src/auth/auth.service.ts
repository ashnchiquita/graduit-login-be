import { Injectable } from "@nestjs/common";
import { AkunService } from "src/akun/akun.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { AuthDto } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private akunService: AkunService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<AuthDto | null> {
    const user = await this.akunService.findByEmail(email);

    if (user) {
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        return {
          id: user.id,
        };
      }
    }

    return null;
  }

  async login(user: AuthDto) {
    const payload = { sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
