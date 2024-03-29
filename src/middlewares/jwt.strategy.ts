import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthDto } from "src/auth/auth.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
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

  validate(payload: any): AuthDto {
    return { id: payload.sub };
  }
}
