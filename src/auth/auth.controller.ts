import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "src/middlewares/local-auth.guard";
import { JwtAuthGuard } from "src/middlewares/jwt-auth.guard";
import { AkunService } from "../akun/akun.service";
import { MicrosoftAuthGuard } from "src/middlewares/microsoft-auth.guard";
import { AuthDto } from "src/auth/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private akunService: AkunService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post("/login/credentials")
  async loginWithCredentials(@Req() req: Request, @Res() res: Response) {
    const { accessToken } = await this.authService.login(req.user as AuthDto);

    // TODO: remove third-party cookies
    res
      .cookie("gradu-it.access-token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
      })
      .send({ status: "ok" });
  }

  @UseGuards(MicrosoftAuthGuard)
  @Get("/login/microsoft")
  loginWithMicrosoft() {}

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

    // TODO: remove third-party cookies
    res
      .cookie("gradu-it.access-token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
      })
      .redirect(`${process.env.LOGIN_FE_URL}`);
  }

  @UseGuards(JwtAuthGuard)
  @Get("self")
  getSelf(@Req() req: Request) {
    const { id } = req.user as { id: string };
    return this.akunService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  logout(@Res() res: Response) {
    res.clearCookie("gradu-it.access-token").send({ status: "ok" });
  }
}
