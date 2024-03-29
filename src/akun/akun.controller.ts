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
  CreateAkunDto,
  FindAllResDto,
} from "src/akun/akun.dto";
import { RolesGuard } from "src/middlewares/roles.guard";
import { RoleEnum } from "src/entities/pengguna.entity";
import { Roles } from "src/middlewares/roles.decorator";
import { JwtAuthGuard } from "src/middlewares/jwt-auth.guard";

@Controller("akun")
export class AkunController {
  constructor(private akunService: AkunService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.S2_TIM_TESIS)
  @Get("/")
  findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("search") search: string = "",
  ): Promise<FindAllResDto> {
    return this.akunService.findAll(page, limit, search);
  }

  @Get("/:id")
  findById(@Param("id") accountId) {
    return this.akunService.findById(accountId);
  }

  @Put("/")
  createOrUpdateAccount(@Body() createAkunDto: CreateAkunDto) {
    return this.akunService.createOrUpdateAccount(createAkunDto);
  }

  @Delete("/:id")
  deleteAccount(@Param("id") accountId) {
    return this.akunService.deleteAccount(accountId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.S2_TIM_TESIS)
  @Patch("/roles-batch")
  batchUpdateRole(@Body() batchUpdateRoleDto: BatchUpdateRoleDto): Promise<{
    message: string;
  }> {
    return this.akunService.batchUpdateRole(batchUpdateRoleDto);
  }
}
