import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AkunService } from "src/akun/akun.service";
import { AuthDto } from "src/auth/auth.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private akunService: AkunService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJwtFromReq,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  private static extractJwtFromReq(req: Request) {
    if (req?.cookies?.[process.env.COOKIE_NAME]) {
      return req.cookies[process.env.COOKIE_NAME];
    }

    if (req.headers?.authorization) {
      return req.headers.authorization.slice(7);
    }

    return null;
  }

  async validate(payload: any): Promise<AuthDto | boolean> {
    const user = await this.akunService.findById(payload.sub);

    if (!user.aktif) {
      return false;
    }

    return { id: payload.sub };
  }
}
