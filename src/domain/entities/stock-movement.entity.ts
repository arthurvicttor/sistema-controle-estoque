export enum MovementType {
  IN = "IN",
  OUT = "OUT",
}

export class StockMovement {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly type: MovementType,
    public readonly quantity: number,
    public readonly reason: string,
    public readonly createdAt: Date,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.productId) {
      throw new Error("Product ID is required");
    }

    if (this.quantity <= 0) {
      throw new Error("Quantity must be positive");
    }

    if (!this.reason || this.reason.trim().length === 0) {
      throw new Error("Reason is required");
    }
  }
}
