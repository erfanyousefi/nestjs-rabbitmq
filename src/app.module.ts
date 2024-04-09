import {Module} from "@nestjs/common";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {UserModule} from "./user/user.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {QueueModule} from "./queue/queue.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      database: "postgres",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
      port: 15432,
      host: "localhost",
      username: "admin",
      password: "master123",
    }),
    UserModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
