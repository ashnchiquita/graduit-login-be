import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
} from "@nestjs/common";
import { AkunService } from "./akun.service";
import { CreateAkunDto } from "src/akun/akun.dto";

@Controller("akun")
export class AkunController {
  constructor(private akunService: AkunService) {}

  @Get("/")
  findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("search") search: string = "",
  ) {
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
}
