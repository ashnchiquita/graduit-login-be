import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-microsoft";
import { Injectable } from "@nestjs/common";
import { AkunService } from "../akun/akun.service";
import { AuthDto } from "src/auth/auth.dto";

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
      nama: displayName as string,
    };

    const existingUser = await this.akunService.findById(user.id);

    if (existingUser && !existingUser.aktif) {
      done(null, false);
      return;
    }

    const splittedEmail = user.email.split("@")[0];
    let nim: null | string = null;

    if (splittedEmail.match(/^\d{8}$/)) {
      nim = splittedEmail;
    }

    await this.akunService.upsertExternalAccount({
      ...user,
      nim,
    });

    const dto: AuthDto = { id: user.id };

    done(null, dto);
  }
}
