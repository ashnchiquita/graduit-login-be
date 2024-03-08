import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthDto } from "src/dto/auth.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJwtFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  private static extractJwtFromCookie(req: Request) {
    if (req?.cookies?.["gradu-it.access-token"]) {
      return req.cookies["gradu-it.access-token"];
    }

    return null;
  }

  validate(payload: any): AuthDto {
    return { id: payload.sub };
  }
}
