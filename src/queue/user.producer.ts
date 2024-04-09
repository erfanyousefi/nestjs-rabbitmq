import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import amqp, {ChannelWrapper} from "amqp-connection-manager";
import {Channel} from "amqplib";
import {CreateUserDto} from "../user/dto/create-user.dto";
import {QueueKeys} from "./queue.enum";
import {UserService} from "src/user/user.service";

@Injectable()
export class ProducerService {
  private channelWrapper: ChannelWrapper;
  constructor(private userService: UserService) {
    const connection = amqp.connect(["amqp://localhost:5672"]);
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => {
        console.log("init-queue");
        return channel.assertQueue(QueueKeys.SignupQueue, {durable: true});
      },
    });
  }

  async addToUserQueue(user: CreateUserDto) {
    try {
      await this.userService.checkExist(user.email);
      const data = Buffer.from(JSON.stringify(user));
      await this.channelWrapper.sendToQueue(QueueKeys.SignupQueue, data, {
        persistent: true,
      });
      Logger.log("Sent To Queue");
    } catch (error) {
      throw new InternalServerErrorException("Error creating new user");
    }
  }
}
