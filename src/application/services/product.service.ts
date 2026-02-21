import { Inject, Injectable } from "@nestjs/common";
import { Product } from "../../domain/entities/product.entity";
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from "../../domain/repositories/product.repository.interface";
import { CreateProductDto } from "../dtos/product/create-product.dto";
import { ProductResponseDto } from "../dtos/product/product-response.dto";
import { CacheService } from "../../infrastructure/cache/cache.service";
import { LoggerService } from "../../infrastructure/logging/logger.service";

@Injectable()
export class ProductService {
  private readonly CACHE_KEY = "products:all";
  private readonly CACHE_TTL = 300; // 5 minutos

  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly cacheService: CacheService,
    private readonly logger: LoggerService,
  ) {}

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    this.logger.log("Creating new product", { name: dto.name });

    const product = new Product(
      crypto.randomUUID(),
      dto.name,
      dto.description,
      dto.price,
      dto.quantity,
      new Date(),
      new Date(),
    );

    const created = await this.productRepository.create(product);

    // Invalidar cache ao criar
    await this.cacheService.del(this.CACHE_KEY);

    this.logger.log("Product created successfully", { id: created.id });

    return ProductResponseDto.fromEntity(created);
  }

  async findAll(): Promise<ProductResponseDto[]> {
    // Tentar buscar do cache primeiro
    const cached = await this.cacheService.get<ProductResponseDto[]>(
      this.CACHE_KEY,
    );

    if (cached) {
      this.logger.log("Products retrieved from cache");
      return cached;
    }

    // Se não estiver em cache, buscar do banco
    const products = await this.productRepository.findAll();
    const response = products.map(ProductResponseDto.fromEntity);

    // Armazenar em cache
    await this.cacheService.set(this.CACHE_KEY, response, this.CACHE_TTL);

    this.logger.log("Products retrieved from database and cached");

    return response;
  }

  async findById(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      this.logger.warn("Product not found", { id });
      throw new Error("Product not found");
    }

    return ProductResponseDto.fromEntity(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    product.update(dto.name, dto.description, dto.price);

    const updated = await this.productRepository.update(product);

    // Invalidar cache ao atualizar
    await this.cacheService.del(this.CACHE_KEY);

    this.logger.log("Product updated successfully", { id });

    return ProductResponseDto.fromEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.productRepository.delete(id);
    await this.cacheService.del(this.CACHE_KEY);
    this.logger.log("Product deleted successfully", { id });
  }
}
