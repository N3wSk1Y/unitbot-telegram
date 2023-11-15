import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Message } from "./entities/message.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { BotService } from "../bot/bot.service";
import { Chat } from "./entities/chat.entity";
import { UserService } from "../user/user.service";
import { MessageDto } from "./dto/message.dto";
import { LocalFileDto } from "../local-file/dto/local-file.dto";
import { LocalFileService } from "../local-file/local-file.service";
import { LocalFile } from "../local-file/local-file.entity";

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
        private readonly userService: UserService,
        private readonly localFileService: LocalFileService
    ) {}

    async getChats(): Promise<Chat[]> {
        return await this.chatRepository.find({
            relations: {
                target: true,
                messages: {
                    author: true,
                    files: true,
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
                    author: true,
                    files: true,
                },
            },
            order: {
                messages: {
                    date: "DESC",
                },
            },
        });
    }

    async getMessageById(id: string): Promise<Message> {
        return await this.messageRepository.findOne({
            where: {
                id: id,
            },
            relations: {
                author: true,
                files: true,
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
                    author: true,
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
            return await this.getChatByUser(user.id);
        }
    }

    async addFile(messageId: string, fileData: LocalFileDto): Promise<Message> {
        const message = await this.getMessageById(messageId);
        const file = await this.localFileService.saveFile(fileData);
        message.files.push(file);
        return await this.messageRepository.save(message);
    }

    async addFileViaId(messageId: string, fileId: string): Promise<Message> {
        const message = await this.getMessageById(messageId);
        const file = await this.localFileService.getOne(fileId);
        message.files.push(file);
        return await this.messageRepository.save(message);
    }

    async sendManagerMessage(
        targetId: number,
        messageData: MessageDto
    ): Promise<void> {
        const chat = await this.createChat(targetId);
        let files: LocalFile[] = [];
        messageData.files =
            messageData.files?.length > 0 ? messageData.files : [];
        if (messageData.files.length > 0) {
            for (const fileId of messageData.files) {
                const localFile = await this.localFileService.getOne(fileId);
                await this.botService.sendPhoto(targetId, localFile.path);
                files.push(localFile);
            }
        }
        if (messageData.text) {
            await this.botService.sendMessage(
                targetId,
                `<b>Сообщение от менеджера</b>
${messageData.text}
`
            );
        }
        chat.messages.push(
            await this.messageRepository.save({
                text: messageData.text,
                author: await this.userService.getOneByTelegramId(5167143165), // ID аккаунта менеджера
                files: files,
            })
        );
        await this.chatRepository.save(chat);
    }

    async sendUserMessage(
        userId: number,
        messageData: MessageDto
    ): Promise<Message> {
        const chat = await this.createChat(userId);
        const message = await this.messageRepository.save({
            text: messageData.text,
            author: await this.userService.getOneByTelegramId(userId),
        });
        chat.messages.push(message);
        await this.chatRepository.save(chat);
        return message;
    }
}
