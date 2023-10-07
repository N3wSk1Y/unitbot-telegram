import { Ctx, Start, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { Injectable } from "@nestjs/common";

@Update()
@Injectable()
export class BotUpdate {
    @Start()
    async start(@Ctx() ctx: Context) {
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
}
