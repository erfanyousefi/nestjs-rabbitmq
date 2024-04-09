import {Controller, Get, Post, Body, Param} from "@nestjs/common";
import {UserService} from "./user.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {ProducerService} from "src/queue/user.producer";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private producerService: ProducerService
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    await this.producerService.addToUserQueue(createUserDto);
    return {
      message: "success",
    };
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(+id);
  }
}
