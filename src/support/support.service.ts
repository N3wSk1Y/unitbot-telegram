import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Message } from "./entities/message.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { BotService } from "../bot/bot.service";
import { Chat } from "./entities/chat.entity";
import { UserService } from "../user/user.service";
import { MessageDto } from "./dto/message.dto";

@Injectable()
export class SupportService {
    public constructor(
        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        @Inject(forwardRef(() => BotService))
        private readonly botService: BotService,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService
    ) {}

    async getChats(): Promise<Chat[]> {
        return await this.chatRepository.find({
            relations: {
                target: true,
                messages: {
                    author: true
                },
            },
            order: {
                messages: {
                    date: "DESC",
                },
            },
        });
    }

    async getChatByUser(id: number): Promise<Chat> {
        const user = await this.userService.getOneByTelegramId(id);
        return await this.chatRepository.findOne({
            where: {
                target: user,
            },
            relations: {
                target: true,
                messages: {
                    author: true
                },
            },
            order: {
                messages: {
                    date: "DESC",
                },
            },
        });
    }

    async doesChatExist(id: number): Promise<boolean> {
        const user = await this.userService.getOneByTelegramId(id);
        return await this.chatRepository.exist({
            where: {
                target: user,
            },
            relations: {
                target: true,
                messages: {
                    author: true
                },
            },
        });
    }

    async createChat(id: number): Promise<Chat> {
        const user = await this.userService.getOneByTelegramId(id);
        if (await this.doesChatExist(id)) {
            return await this.getChatByUser(id);
        } else {
            await this.chatRepository.save({
                target: user,
            });
            return await this.getChatByUser(user.id)
        }
    }

    async sendManagerMessage(
        targetId: number,
        messageData: MessageDto
    ): Promise<void> {
        const chat = await this.createChat(targetId);
        chat.messages.push(
            await this.messageRepository.save({
                text: messageData.text,
                author: await this.userService.getOneByTelegramId(5167143165),
            })
        );
        await this.botService.sendMessage(
            targetId,
            `<b>Сообщение от менеджера</b>
${messageData.text}
`
        );
        await this.chatRepository.save(chat);
    }

    async sendUserMessage(
        userId: number,
        messageData: MessageDto
    ): Promise<void> {
        const chat = await this.createChat(userId);
        chat.messages.push(
            await this.messageRepository.save({
                text: messageData.text,
                author: await this.userService.getOneByTelegramId(userId),
            })
        );
        await this.chatRepository.save(chat);
    }
}
