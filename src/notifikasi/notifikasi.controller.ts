import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CreateNotifDto, IdDto, MsgDto } from "./notifikasi.dto";
import { NotifikasiService } from "./notifikasi.service";
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/middlewares/jwt-auth.guard";
import { Notifikasi } from "src/entities/notifikasi.entity";
import { AuthDto } from "src/auth/auth.dto";
import { Request } from "express";

@ApiTags("Notifikasi")
@Controller("notifikasi")
export class NotifikasiController {
  constructor(private notifService: NotifikasiService) {}

  @ApiCookieAuth()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: IdDto })
  @UseGuards(JwtAuthGuard)
  @Post("/")
  create(@Body() dto: CreateNotifDto): Promise<IdDto> {
    return this.notifService.create(dto);
  }

  @ApiCookieAuth()
  @ApiBearerAuth()
  @ApiOkResponse({ type: MsgDto })
  @UseGuards(JwtAuthGuard)
  @Delete("/:id")
  delete(@Param() param: IdDto): Promise<MsgDto> {
    return this.notifService.delete(param.id);
  }

  @ApiCookieAuth()
  @ApiBearerAuth()
  @ApiOkResponse({ type: Notifikasi, isArray: true })
  @UseGuards(JwtAuthGuard)
  @Get("/")
  findByUserId(@Req() req: Request): Promise<Notifikasi[]> {
    const { id } = req.user as AuthDto;
    return this.notifService.findByUserId(id);
  }
}
