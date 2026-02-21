import { Inject, Injectable } from "@nestjs/common";
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from "../../domain/repositories/product.repository.interface";
import {
  IStockMovementRepository,
  STOCK_MOVEMENT_REPOSITORY,
} from "../../domain/repositories/stock-movement.repository.interface";
import {
  StockMovement,
  MovementType,
} from "../../domain/entities/stock-movement.entity";
import { CreateMovementDto } from "../dtos/stock-movement/create-movement.dto";
import { NotificationProducer } from "../../infrastructure/queue/producers/notification.producer";
import { LoggerService } from "../../infrastructure/logging/logger.service";

@Injectable()
export class StockMovementService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(STOCK_MOVEMENT_REPOSITORY)
    private readonly movementRepository: IStockMovementRepository,
    private readonly notificationProducer: NotificationProducer,
    private readonly logger: LoggerService,
  ) {}

  async createMovement(dto: CreateMovementDto) {
    this.logger.log("Creating stock movement", dto);

    const product = await this.productRepository.findById(dto.productId);

    if (!product) {
      throw new Error("Product not found");
    }

    // Aplicar regra de negócio na entidade
    if (dto.type === MovementType.IN) {
      product.addStock(dto.quantity);
    } else {
      product.removeStock(dto.quantity);
    }

    // Criar movimentação
    const movement = new StockMovement(
      crypto.randomUUID(),
      dto.productId,
      dto.type,
      dto.quantity,
      dto.reason,
      new Date(),
    );

    // Salvar movimentação e atualizar produto
    const [createdMovement] = await Promise.all([
      this.movementRepository.create(movement),
      this.productRepository.update(product),
    ]);

    // Publicar evento na fila (assíncrono)
    await this.notificationProducer.sendMovementNotification({
      movementId: createdMovement.id,
      productName: product.name,
      type: dto.type,
      quantity: dto.quantity,
    });

    this.logger.log("Stock movement created and queued", {
      id: createdMovement.id,
    });

    return createdMovement;
  }

  async getHistory(productId: string) {
    return this.movementRepository.findByProductId(productId);
  }
}
