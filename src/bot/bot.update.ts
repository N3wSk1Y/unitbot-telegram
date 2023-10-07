import { Command, Ctx, Message, Start, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { BotService } from "./bot.service";

@Update()
@Injectable()
export class BotUpdate {
    public constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        @Inject(forwardRef(() => BotService))
        private readonly botService: BotService
    ) {}
    @Start()
    async start(@Ctx() ctx: Context) {
        const user = ctx.from;
        await this.userService.createIfNotExist({
            id: user.id,
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
        });
        await ctx.reply("<b>Выберите интересующий вас раздел:</b>", {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Каталог",
                            web_app: { url: "https://telegaads.ru/" },
                        },
                    ],
                    [
                        {
                            text: "Мой профиль",
                            web_app: { url: "https://telegaads.ru/" },
                        },
                    ],
                    [
                        {
                            text: "Мои заказы",
                            web_app: { url: "https://telegaads.ru/" },
                        },
                    ],
                ],
            },
        });
    }

    @Command("massmail")
    async massMail(@Message() message: any, @Ctx() ctx: Context) {
        const rawMessage = message.text;
        if (rawMessage.split(" ").length < 2) {
            await ctx.reply("Введите текст для рассылки.");
        } else {
            const argument = rawMessage
                .slice(rawMessage.indexOf(" ") + 1)
                .trim();
            await this.botService.emitMassMailing(argument);
        }
    }

    @Command("getusers")
    async getUsers(@Ctx() ctx: Context) {
        const message = await this.botService.getAllUsersMessage();
        await ctx.reply(message);
    }
}
