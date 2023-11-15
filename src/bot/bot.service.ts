import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { Telegraf } from "telegraf";
import { InjectBot } from "nestjs-telegraf";

@Injectable()
export class BotService {
    public constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        @InjectBot()
        private readonly bot: Telegraf
    ) {}

    async emitMassMailing(
        messageId: number,
        fromChatId: number
    ): Promise<void> {
        const users = await this.userService.getAll();
        for (const user of users) {
            await this.bot.telegram.copyMessage(user.id, fromChatId, messageId);
        }
    }

    async sendMessage(
        chatId: number,
        message: string,
        options?: any
    ): Promise<void> {
        if (options) {
            await this.bot.telegram.sendMessage(chatId, message, options);
        } else {
            await this.bot.telegram.sendMessage(chatId, message, {
                parse_mode: "HTML",
            });
        }
    }

    async sendPhoto(chatId: number, photoPath: string): Promise<void> {
        await this.bot.telegram.sendPhoto(chatId, { source: photoPath });
    }

    async copyMessage(chatId: number, fromChatId: number, messageId: number) {
        await this.bot.telegram.copyMessage(chatId, fromChatId, messageId);
    }

    async getAllUsersMessage(): Promise<string> {
        const users = await this.userService.getAll();
        let table = "";
        for (const user of users) {
            table += `${user.id}${" ".repeat(25 - user.id.toString().length)}${
                user.username
            }${" ".repeat(25 - user.username.length)}${
                user.firstName
            }${" ".repeat(25 - user.firstName.length)}${user.lastName}\n`;
        }
        return `<code>${table}</code>`;
    }
}
