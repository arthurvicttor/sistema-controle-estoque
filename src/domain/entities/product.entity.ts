export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public price: number,
    public quantity: number,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error("Product name is required");
    }

    if (this.price < 0) {
      throw new Error("Price cannot be negative");
    }

    if (this.quantity < 0) {
      throw new Error("Quantity cannot be negative");
    }
  }

  // Regra de negócio: adicionar estoque
  addStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error("Quantity to add must be positive");
    }
    this.quantity += quantity;
    this.updatedAt = new Date();
  }

  // Regra de negócio: remover estoque
  removeStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error("Quantity to remove must be positive");
    }

    if (this.quantity < quantity) {
      throw new Error("Insufficient stock");
    }

    this.quantity -= quantity;
    this.updatedAt = new Date();
  }

  // Método para atualizar informações
  update(name?: string, description?: string, price?: number): void {
    if (name !== undefined) this.name = name;
    if (description !== undefined) this.description = description;
    if (price !== undefined) {
      if (price < 0) throw new Error("Price cannot be negative");
      this.price = price;
    }
    this.updatedAt = new Date();
  }
}
