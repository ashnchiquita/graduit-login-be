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
  PatchProfileDto,
} from "src/akun/akun.dto";
import { RolesGuard } from "src/middlewares/roles.guard";
import { Pengguna, RoleEnum } from "src/entities/pengguna.entity";
import { Roles } from "src/middlewares/roles.decorator";
import { JwtAuthGuard } from "src/middlewares/jwt-auth.guard";
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { AuthDto } from "src/auth/auth.dto";
import { Request } from "express";

@ApiTags("Akun")
@Controller("akun")
export class AkunController {
  constructor(private akunService: AkunService) {}

  @ApiCookieAuth()
  @ApiBearerAuth()
  @ApiOkResponse({ type: FindAllResDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.S1_TIM_TA, RoleEnum.S2_TIM_TESIS)
  @Get("/")
  findAll(@Query() query: FindAllQueryDto): Promise<FindAllResDto> {
    let roles: RoleEnum[] = [];

    if (query.roles) {
      if (typeof query.roles === "string") {
        roles = [query.roles];
      } else {
        roles = query.roles;
      }
    }

    return this.akunService.findAll(
      query.page || 1,
      query.limit || 10,
      query.search || "",
      query.nama || "",
      query.email || "",
      roles,
    );
  }

  @ApiCookieAuth()
  @ApiBearerAuth()
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
  @ApiOkResponse({ type: IdDto })
  @Put("/")
  createOrUpdateAccount(@Body() createAkunDto: CreateAkunDto) {
    return this.akunService.createOrUpdateAccount(createAkunDto);
  }

  @ApiCookieAuth()
  @ApiBearerAuth()
  @ApiOkResponse({ type: IdDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.S1_TIM_TA, RoleEnum.S2_TIM_TESIS)
  @Delete("/:id")
  deleteAccount(@Param() param: IdDto) {
    return this.akunService.deleteAccount(param.id);
  }

  @ApiCookieAuth()
  @ApiBearerAuth()
  @ApiOkResponse({ type: IdsDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.S1_TIM_TA, RoleEnum.S2_TIM_TESIS)
  @Patch("/roles/batch-add")
  batchUpdateRole(@Body() batchAddRoleDto: BatchAddRoleDto): Promise<IdsDto> {
    return this.akunService.batchAddRole(batchAddRoleDto);
  }

  @ApiCookieAuth()
  @ApiBearerAuth()
  @ApiOkResponse({ type: IdsDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.S1_TIM_TA, RoleEnum.S2_TIM_TESIS)
  @Patch("/roles/batch-remove")
  batchRemoveRole(@Body() batchRemoveRoleDto: IdsDto): Promise<IdsDto> {
    return this.akunService.batchRemoveRole(batchRemoveRoleDto);
  }

  @ApiCookieAuth()
  @ApiBearerAuth()
  @ApiOkResponse({ type: IdDto })
  @ApiOperation({ summary: "Any falsify value in body will set field to null" })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.S1_PEMBIMBING, RoleEnum.S2_PEMBIMBING)
  @Patch("/profile")
  updateProfile(@Body() body: PatchProfileDto, @Req() req: Request) {
    const { id } = req.user as AuthDto;
    return this.akunService.updateProfile(id, body);
  }

  @ApiCookieAuth()
  @ApiBearerAuth()
  @ApiOkResponse({ type: IdDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.S1_TIM_TA, RoleEnum.S2_TIM_TESIS)
  @Patch("/archive")
  archiveAkun(@Body() body: IdDto) {
    return this.akunService.archiveAkun(body.id);
  }
}
