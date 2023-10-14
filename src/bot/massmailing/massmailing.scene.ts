import { Action, Ctx, On, Scene, SceneEnter } from "nestjs-telegraf";
import { Context } from "telegraf";
import { BotService } from "../bot.service";
import { Injectable } from "@nestjs/common";
import { SceneContext } from "telegraf/typings/scenes";
import * as massMailingResponse from "./massmailing.response.json";
import * as tt from "telegraf/src/telegram-types";

@Scene("SCENE_MASS_MAILING")
@Injectable()
export class MassMailingScene {
    public constructor(private readonly botService: BotService) {}
    @SceneEnter()
    async enterScene(@Ctx() ctx: Context) {
        await ctx.reply(
            massMailingResponse.text,
            massMailingResponse.options as tt.ExtraReplyMessage
        );
    }

    @On("message")
    async onAction(@Ctx() ctx: SceneContext) {
        await this.botService.emitMassMailing(
            ctx.message.message_id,
            ctx.from.id
        );
        await ctx.scene.leave();
    }

    @Action("BUTTON_MAIN_MENU")
    async returnToMainMenu(@Ctx() ctx: SceneContext) {
        await ctx.answerCbQuery(`Отмена.`);
        await ctx.scene.leave();
    }
}
