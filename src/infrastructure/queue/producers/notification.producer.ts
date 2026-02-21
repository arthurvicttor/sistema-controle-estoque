import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

interface MovementNotification {
  movementId: string;
  productName: string;
  type: string;
  quantity: number;
}

@Injectable()
export class NotificationProducer {
  constructor(
    @InjectQueue("notifications")
    private notificationQueue: Queue,
  ) {}

  async sendMovementNotification(data: MovementNotification): Promise<void> {
    await this.notificationQueue.add("stock-movement", data, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
    });
  }
}
