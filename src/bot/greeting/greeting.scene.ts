import { Action, Ctx, On, Scene, SceneEnter } from "nestjs-telegraf";
import { Context } from "telegraf";
import { BotService } from "../bot.service";
import { Injectable } from "@nestjs/common";
import { SceneContext } from "telegraf/typings/scenes";
import * as greetingResponse from "./greeting.response.json";
import * as tt from "telegraf/src/telegram-types";
import { GreetingService } from "../../greeting/greeting.service";

@Scene("SCENE_SET_GREETING")
@Injectable()
export class GreetingScene {
    public constructor(private readonly greetingService: GreetingService) {}
    @SceneEnter()
    async enterScene(@Ctx() ctx: Context) {
        await ctx.reply(
            greetingResponse.text,
            greetingResponse.options as tt.ExtraReplyMessage
        );
    }

    @On("message")
    async onAction(@Ctx() ctx: SceneContext) {
        await this.greetingService.create(ctx.from.id, ctx.message.message_id);
        await ctx.reply("Сообщение установлено.");
        await ctx.scene.leave();
    }

    @Action("BUTTON_MAIN_MENU")
    async returnToMainMenu(@Ctx() ctx: SceneContext) {
        await ctx.answerCbQuery(`Отмена.`);
        await ctx.scene.leave();
    }
}
