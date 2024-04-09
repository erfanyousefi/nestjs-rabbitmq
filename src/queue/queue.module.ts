import {Module} from "@nestjs/common";
import {ConsumerService} from "./user.consumer";
import {ProducerService} from "./user.producer";
import {UserService} from "src/user/user.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "src/user/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [ProducerService, ConsumerService, UserService],
  exports: [ProducerService],
})
export class QueueModule {}
