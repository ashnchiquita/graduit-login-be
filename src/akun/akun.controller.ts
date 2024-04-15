import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AkunService } from "./akun.service";
import {
  BatchAddRoleDto,
  IdsDto,
  IdDto,
  CreateAkunDto,
  FindAllQueryDto,
  FindAllResDto,
  PatchKontakDto,
} from "src/akun/akun.dto";
import { RolesGuard } from "src/middlewares/roles.guard";
import { Pengguna, RoleEnum } from "src/entities/pengguna.entity";
import { Roles } from "src/middlewares/roles.decorator";
import { JwtAuthGuard } from "src/middlewares/jwt-auth.guard";
import { ApiCookieAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthDto } from "src/auth/auth.dto";
import { Request } from "express";

@ApiTags("Akun")
@Controller("akun")
export class AkunController {
  constructor(private akunService: AkunService) {}

  @ApiCookieAuth()
  @ApiOkResponse({ type: FindAllResDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.S1_TIM_TA, RoleEnum.S2_TIM_TESIS)
  @Get("/")
  findAll(@Query() query: FindAllQueryDto): Promise<FindAllResDto> {
    return this.akunService.findAll(
      query.page || 1,
      query.limit || 10,
      query.search || "",
      query.nama || "",
      query.email || "",
      query.roles || [],
    );
  }

  @ApiCookieAuth()
  @ApiOkResponse({ type: Pengguna })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    RoleEnum.ADMIN,
    RoleEnum.S1_TIM_TA,
    RoleEnum.S2_TIM_TESIS,
    RoleEnum.S1_PEMBIMBING,
    RoleEnum.S2_PEMBIMBING,
  )
  @Get("/:id")
  findById(@Param() param: IdDto): Promise<Pengguna> {
    return this.akunService.findById(param.id);
  }

  // TODO: protect/secure this endpoint
  @Put("/")
  createOrUpdateAccount(@Body() createAkunDto: CreateAkunDto) {
    return this.akunService.createOrUpdateAccount(createAkunDto);
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.S1_TIM_TA, RoleEnum.S2_TIM_TESIS)
  @Delete("/:id")
  deleteAccount(@Param() param: IdDto) {
    return this.akunService.deleteAccount(param.id);
  }

  @ApiCookieAuth()
  @ApiOkResponse({ type: IdsDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.S1_TIM_TA, RoleEnum.S2_TIM_TESIS)
  @Patch("/roles/batch-add")
  batchUpdateRole(@Body() batchAddRoleDto: BatchAddRoleDto): Promise<IdsDto> {
    return this.akunService.batchAddRole(batchAddRoleDto);
  }

  @ApiCookieAuth()
  @ApiOkResponse({ type: IdsDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.S1_TIM_TA, RoleEnum.S2_TIM_TESIS)
  @Patch("/roles/batch-remove")
  batchRemoveRole(@Body() batchAddRoleDto: BatchAddRoleDto): Promise<IdsDto> {
    return this.akunService.batchRemoveRole(batchAddRoleDto);
  }

  @ApiCookieAuth()
  @ApiOkResponse({ type: IdDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.S1_PEMBIMBING, RoleEnum.S2_PEMBIMBING)
  @Patch("/kontak")
  updateKontak(@Body() body: PatchKontakDto, @Req() req: Request) {
    const { id } = req.user as AuthDto;
    return this.akunService.updateKontak(id, body.kontak);
  }
}
