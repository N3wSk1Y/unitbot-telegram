import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Greeting } from "./greeting.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class GreetingService {
    public constructor(
        @InjectRepository(Greeting)
        private readonly greetingRepository: Repository<Greeting>
    ) {}

    async get(): Promise<Greeting> {
        return (await this.greetingRepository.find())[0];
    }

    async create(fromChatId: number, messageId: number): Promise<Greeting> {
        await this.greetingRepository.clear();
        return await this.greetingRepository.save({
            fromChatId,
            messageId,
        });
    }
}
