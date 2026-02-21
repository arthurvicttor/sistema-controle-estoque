import { Test, TestingModule } from "@nestjs/testing";
import { ProductService } from "../../../src/application/services/product.service";
import { PRODUCT_REPOSITORY } from "../../../src/domain/repositories/product.repository.interface";
import { CacheService } from "../../../src/infrastructure/cache/cache.service";
import { LoggerService } from "../../../src/infrastructure/logging/logger.service";

describe("ProductService", () => {
  let service: ProductService;
  let mockRepository: any;
  let mockCache: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockCache = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: mockRepository,
        },
        {
          provide: CacheService,
          useValue: mockCache,
        },
        {
          provide: LoggerService,
          useValue: { log: jest.fn(), warn: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  describe("create", () => {
    it("should create a product and invalidate cache", async () => {
      const dto = {
        name: "Test Product",
        description: "Test Description",
        price: 100,
        quantity: 10,
      };

      const mockProduct = {
        ...dto,
        id: "123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockRepository.create.mockResolvedValue(mockProduct);

      const result = await service.create(dto);

      expect(result.name).toBe(dto.name);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockCache.del).toHaveBeenCalledWith("products:all");
    });
  });

  describe("findAll", () => {
    it("should return cached products if available", async () => {
      const cachedProducts = [{ id: "1", name: "Cached Product" }];
      mockCache.get.mockResolvedValue(cachedProducts);

      const result = await service.findAll();

      expect(result).toEqual(cachedProducts);
      expect(mockRepository.findAll).not.toHaveBeenCalled();
    });

    it("should fetch from database and cache if not in cache", async () => {
      mockCache.get.mockResolvedValue(null);
      const dbProducts = [
        {
          id: "1",
          name: "DB Product",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockRepository.findAll.mockResolvedValue(dbProducts);

      await service.findAll();

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(mockCache.set).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("should throw error if product not found", async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById("invalid-id")).rejects.toThrow(
        "Product not found",
      );
    });
  });
});
