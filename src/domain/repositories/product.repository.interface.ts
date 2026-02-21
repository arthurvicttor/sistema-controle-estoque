import { Product } from "../entities/product.entity";

export interface IProductRepository {
  create(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  update(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
}

export const PRODUCT_REPOSITORY = Symbol("PRODUCT_REPOSITORY");
