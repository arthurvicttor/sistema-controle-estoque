import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { LoggerService } from "../../logging/logger.service";

@Processor("notifications")
export class NotificationConsumer {
  constructor(private readonly logger: LoggerService) {}

  @Process("stock-movement")
  async handleStockMovement(job: Job) {
    const { movementId, productName, type, quantity } = job.data;

    this.logger.log("Processing stock movement notification", {
      movementId,
      productName,
      type,
      quantity,
    });

    // Simular envio de notificação (email, SMS, webhook, etc.)
    await this.simulateNotification(job.data);

    this.logger.log("Notification sent successfully", { movementId });
  }

  private async simulateNotification(data: any): Promise<void> {
    // Simular delay de envio
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("📧 Notification sent:", JSON.stringify(data, null, 2));
        resolve();
      }, 1000);
    });
  }
}
