import {ConflictException, Injectable} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}
  async create(createUserDto: CreateUserDto) {
    const {email, name} = createUserDto;
    await this.checkExist(email);
    await this.userRepository.insert({name, email});
  }

  findAll() {
    return this.userRepository.find({});
  }
  async checkExist(email: string) {
    const user = await this.userRepository.findOneBy({email});
    if (user) throw new ConflictException();
  }
  findOne(id: number) {
    return this.userRepository.findOneBy({id});
  }
}
