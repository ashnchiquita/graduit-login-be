import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { CookieOptions, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "src/middlewares/local-auth.guard";
import { JwtAuthGuard } from "src/middlewares/jwt-auth.guard";
import { AkunService } from "../akun/akun.service";
import { MicrosoftAuthGuard } from "src/middlewares/microsoft-auth.guard";
import {
  AuthDto,
  CredentialsDto,
  LogoutDto,
  TokenDto,
} from "src/auth/auth.dto";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiCookieAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiFoundResponse,
} from "@nestjs/swagger";
import { Pengguna } from "src/entities/pengguna.entity";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private akunService: AkunService,
  ) {}

  private static cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  @ApiOperation({
    summary:
      "Login with credentials. If success, cookie will be set with token value.",
  })
  @ApiBody({ type: CredentialsDto })
  @ApiCreatedResponse({ description: "Login success", type: TokenDto })
  @UseGuards(LocalAuthGuard)
  @Post("/login/credentials")
  async loginWithCredentials(@Req() req: Request, @Res() res: Response) {
    const { accessToken } = await this.authService.login(req.user as AuthDto);

    res
      .cookie(process.env.COOKIE_NAME, accessToken, {
        ...AuthController.cookieOptions,
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      })
      .send({ token: accessToken });
  }

  @ApiOperation({
    summary: "Login with Microsoft. Redirect to Microsoft login page.",
  })
  @ApiFoundResponse({ description: "Redirect to Microsoft login page" })
  @UseGuards(MicrosoftAuthGuard)
  @Get("/login/microsoft")
  loginWithMicrosoft() {}

  @ApiExcludeEndpoint()
  @UseGuards(MicrosoftAuthGuard)
  @Get("/microsoft-redirect")
  async microsoftAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!req.user) {
      return "No user from microsoft";
    }

    const { accessToken } = await this.authService.login(req.user as AuthDto);

    res
      .cookie(process.env.COOKIE_NAME, accessToken, {
        ...AuthController.cookieOptions,
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      })
      .redirect(`${process.env.LOGIN_FE_URL}`);
  }

  @ApiBearerAuth()
  @ApiCookieAuth()
  @ApiOperation({
    summary: "Get self account data. Can be used for authorization purposes.",
  })
  @ApiOkResponse({ description: "Authorized/valid", type: Pengguna })
  @UseGuards(JwtAuthGuard)
  @Get("self")
  getSelf(@Req() req: Request): Promise<Pengguna> {
    const { id } = req.user as AuthDto;
    return this.akunService.findById(id);
  }

  @ApiBearerAuth()
  @ApiCookieAuth()
  @ApiOperation({
    summary: "Logout. Clear the cookie.",
  })
  @ApiCreatedResponse({ description: "Logout success", type: LogoutDto })
  @UseGuards(JwtAuthGuard)
  @Post("logout")
  logout(@Res() res: Response) {
    res.clearCookie(process.env.COOKIE_NAME).send({ status: "ok" });
  }
}
