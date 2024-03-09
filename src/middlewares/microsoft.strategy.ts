import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-microsoft";
import { Injectable } from "@nestjs/common";
import { AkunService } from "../akun/akun.service";
import { AuthDto } from "src/dto/auth.dto";

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, "microsoft") {
  constructor(private akunService: AkunService) {
    super({
      clientID: process.env.AAD_CLIENT_ID,
      clientSecret: process.env.AAD_CLIENT_SECRET,
      tenant: process.env.AAD_TENANT,
      callbackURL: `${process.env.AUTH_SERVICE_URL}/auth/microsoft-redirect`,
      scope: ["user.read"],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { displayName, emails, id } = profile;

    const user = {
      id: id as string,
      email: emails[0].value as string,
      name: displayName as string,
    };

    await this.akunService.upsertExternalAccount(
      user.id,
      user.email,
      user.name,
    );

    const dto: AuthDto = { id: user.id };

    done(null, dto);
  }
}
