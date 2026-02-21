import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ThrottlerGuard } from "@nestjs/throttler";
import { ProductService } from "../../../application/services/product.service";
import { CreateProductDto } from "../../../application/dtos/product/create-product.dto";
import { UpdateProductDto } from "../../../application/dtos/product/update-product.dto";
import { ProductResponseDto } from "../../../application/dtos/product/product-response.dto";

@ApiTags("Products")
@Controller("products")
@UseGuards(ThrottlerGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: "Create a new product" })
  @ApiResponse({
    status: 201,
    description: "Product created successfully",
    type: ProductResponseDto,
  })
  async create(@Body() dto: CreateProductDto): Promise<ProductResponseDto> {
    return this.productService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "Get all products" })
  @ApiResponse({
    status: 200,
    description: "List of products",
    type: [ProductResponseDto],
  })
  async findAll(): Promise<ProductResponseDto[]> {
    return this.productService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get product by ID" })
  @ApiResponse({
    status: 200,
    description: "Product found",
    type: ProductResponseDto,
  })
  async findById(@Param("id") id: string): Promise<ProductResponseDto> {
    return this.productService.findById(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update product" })
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete product" })
  async delete(@Param("id") id: string): Promise<void> {
    return this.productService.delete(id);
  }
}
