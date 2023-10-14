import { Action, Ctx, Message, On, Scene, SceneEnter } from "nestjs-telegraf";
import { Context } from "telegraf";
import { BotService } from "../bot.service";
import { Injectable } from "@nestjs/common";
import { SceneContext } from "telegraf/typings/scenes";
import * as tradeInResponse from "./trade-in.response.json";
import * as tt from "telegraf/src/telegram-types";
import * as process from "process";

@Scene("SCENE_TRADE_IN")
@Injectable()
export class TradeInScene {
    public constructor(private readonly botService: BotService) {}
    @SceneEnter()
    async enterScene(@Ctx() ctx: Context) {
        await ctx.reply(
            tradeInResponse.text,
            tradeInResponse.options as tt.ExtraReplyMessage
        );
    }

    @On("message")
    async onAction(@Message() message: any, @Ctx() ctx: SceneContext) {
        await this.botService.sendMessage(
            parseInt(process.env.SUPPORT_CHAT_ID),
            `
<b>Новая заявка на Trade-In</b>
======================
            
<b>Пользователь:</b> @${ctx.from.username}
<b>Информация об устройстве:</b>
            
${message.text}`
        );
        await ctx.reply("<b>Заявка на Trade-In отправлена</b>", {
            parse_mode: "HTML",
        });
        await ctx.scene.leave();
    }

    @Action("BUTTON_MAIN_MENU")
    async returnToMainMenu(@Ctx() ctx: SceneContext) {
        await ctx.answerCbQuery(`Отмена.`);
        await ctx.scene.leave();
    }
}
