import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "src/middlewares/local-auth.guard";
import { JwtAuthGuard } from "src/middlewares/jwt-auth.guard";
import { AkunService } from "../akun/akun.service";
import { MicrosoftAuthGuard } from "src/middlewares/microsoft-auth.guard";
import { AuthDto } from "src/dto/auth.dto";
import { RolesGuard } from "src/middlewares/roles.guard";
import { Roles } from "src/middlewares/roles.decorator";
import { RoleEnum } from "src/entities/pengguna.entity";

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

    res
      .cookie("gradu-it.access-token", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
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

    res
      .cookie("gradu-it.access-token", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
      })
      .redirect("/auth/self"); // TODO: Redirect to the frontend
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

  // TODO: delete (for example only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Get("/admin")
  adminOnly() {
    return "hi >:3";
  }
}
