import { Action, Ctx, Message, On, Scene, SceneEnter } from "nestjs-telegraf";
import { Context } from "telegraf";
import * as supportUserResponse from "./responses/support-user.response.json";
import * as tt from "telegraf/src/telegram-types";
import { SceneContext } from "telegraf/typings/scenes";
import { SupportService } from "./support.service";

@Scene("SCENE_SUPPORT")
export class SupportScene {
    public constructor(private readonly supportService: SupportService) {}
    @SceneEnter()
    async enterScene(@Ctx() ctx: Context) {
        await ctx.reply(
            supportUserResponse.text,
            supportUserResponse.options as tt.ExtraReplyMessage
        );
    }

    @On("message")
    async onMessage(@Ctx() ctx: Context, @Message() message: any) {
        await this.supportService.sendUserMessage(ctx.from.id, {
            text: message.text,
        });
    }

    @Action("BUTTON_QUIT_SUPPORT")
    async onCallFinish(@Ctx() ctx: SceneContext) {
        await ctx.reply("Вы вышли из чата с менеджером.");
        await ctx.scene.leave();
        await this.supportService.sendUserMessage(ctx.from.id, {
            text: "Пользователь покинул чат с менеджером.",
        });
    }
}
