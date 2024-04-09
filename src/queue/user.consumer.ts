import {Injectable, OnModuleInit, Logger} from "@nestjs/common";
import amqp, {ChannelWrapper} from "amqp-connection-manager";
import {ConfirmChannel} from "amqplib";
import {UserService} from "../user/user.service";
import {QueueKeys} from "./queue.enum";

@Injectable()
export class ConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(ConsumerService.name);
  constructor(private userService: UserService) {
    const connection = amqp.connect(["amqp://localhost:5672"]);
    this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue(QueueKeys.SignupQueue, {durable: true});
        await channel
          .consume(QueueKeys.SignupQueue, async (message) => {
            if (message) {
              const content = JSON.parse(message.content.toString());
              this.logger.log("Received message:", content);
              await this.userService.create(content).catch((err) => {
                this.logger.error("Error starting the consumer:", err);
                channel.ack(message);
              });
              channel.ack(message);
            }
          })
          .catch((err) => {
            this.logger.error("Error starting the consumer:", err);
          }); 
      });
      this.logger.log("Consumer service started and listening for messages.");
    } catch (err) {
      this.logger.error("Error starting the consumer:", err);
    }
  }
}
