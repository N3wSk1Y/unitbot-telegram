import { Action, Ctx, Message, On, Scene, SceneEnter } from "nestjs-telegraf";
import { Context } from "telegraf";
import { BotService } from "../bot/bot.service";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { SceneContext } from "telegraf/typings/scenes";
import * as tradeInResponse from "./response/trade-in.response.json";
import * as tt from "telegraf/src/telegram-types";
import * as process from "process";
import { SupportService } from "../support/support.service";

@Scene("SCENE_TRADE_IN")
@Injectable()
export class TradeInScene {
    public constructor(
        @Inject(forwardRef(() => BotService))
        private readonly botService: BotService,
        private readonly supportService: SupportService
    ) {}
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
        await this.supportService.sendUserMessage(ctx.from.id, {
            text: `
<b>Заявка на Trade-In</b>
======================
            
<b>Информация об устройстве:</b>
            
${message.text}`,
        });
        await ctx.scene.enter(`SCENE_SUPPORT`);
    }

    @Action("BUTTON_MAIN_MENU")
    async returnToMainMenu(@Ctx() ctx: SceneContext) {
        await ctx.answerCbQuery(`Отмена.`);
        await ctx.scene.leave();
    }
}
