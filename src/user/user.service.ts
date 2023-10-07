import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { BotUpdate } from "../bot/bot.update";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
    public constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(forwardRef(() => BotUpdate))
        private readonly botService: BotUpdate
    ) {}

    async getAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async getOneByTelegramId(id: number): Promise<User> {
        return await this.userRepository.findOneBy({ id });
    }

    async createIfNotExist(userData: CreateUserDto): Promise<User> {
        if (!(await this.getOneByTelegramId(userData.id))) {
            return await this.userRepository.save(userData);
        }
    }
}
