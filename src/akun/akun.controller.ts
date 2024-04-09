import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AkunService } from "./akun.service";
import {
  BatchUpdateRoleDto,
  BatchUpdateRoleRespDto,
  ByIdParamDto,
  CreateAkunDto,
  FindAllQueryDto,
  FindAllResDto,
} from "src/akun/akun.dto";
import { RolesGuard } from "src/middlewares/roles.guard";
import { Pengguna, RoleEnum } from "src/entities/pengguna.entity";
import { Roles } from "src/middlewares/roles.decorator";
import { JwtAuthGuard } from "src/middlewares/jwt-auth.guard";
import { ApiCookieAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";

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
    );
  }

  @ApiCookieAuth()
  @ApiOkResponse({ type: Pengguna })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.S1_TIM_TA, RoleEnum.S2_TIM_TESIS)
  @Get("/:id")
  findById(@Param() param: ByIdParamDto): Promise<Pengguna> {
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
  deleteAccount(@Param() param: ByIdParamDto) {
    return this.akunService.deleteAccount(param.id);
  }

  @ApiCookieAuth()
  @ApiOkResponse({ type: BatchUpdateRoleRespDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.S1_TIM_TA, RoleEnum.S2_TIM_TESIS)
  @Patch("/roles-batch")
  batchUpdateRole(
    @Body() batchUpdateRoleDto: BatchUpdateRoleDto,
  ): Promise<BatchUpdateRoleRespDto> {
    return this.akunService.batchUpdateRole(batchUpdateRoleDto);
  }
}
