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

    async emitMassMailing(message: string): Promise<void> {
        const users = await this.userService.getAll();
        for (const user of users) {
            await this.bot.telegram.sendMessage(user.id, message);
        }
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
        return table;
    }
}
