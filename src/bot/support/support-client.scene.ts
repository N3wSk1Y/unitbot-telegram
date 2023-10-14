import { Action, Ctx, On, Scene, SceneEnter } from "nestjs-telegraf";
import { Context } from "telegraf";
import * as supportUserResponse from "./responses/support-user.response.json";
import * as tt from "telegraf/src/telegram-types";
import { SupportService } from "./support.service";
import { BotService } from "../bot.service";
import { SceneContext } from "telegraf/typings/scenes";

@Scene("SCENE_SUPPORT_CLIENT")
export class SupportClientScene {
    public constructor(
        private readonly supportService: SupportService,
        private readonly botService: BotService
    ) {}
    @SceneEnter()
    async enterScene(@Ctx() ctx: Context) {
        const call = await this.supportService.getCallByClient(ctx.from.id);
        await this.supportService.notifyManagers(call.id);
        await ctx.reply(
            supportUserResponse.text,
            supportUserResponse.options as tt.ExtraReplyMessage
        );
    }

    @On("message")
    async onMessage(@Ctx() ctx: SceneContext) {
        const call = await this.supportService.getCallByClient(ctx.from.id);
        if (!call) {
            await ctx.reply("Диалог завершен.");
            await ctx.scene.leave();
            return;
        }
        if (call.manager) {
            await this.botService.copyMessage(
                call.manager.id,
                ctx.from.id,
                ctx.message.message_id
            );
        }
    }

    @Action("BUTTON_FINISH_CALL")
    async onCallFinish(@Ctx() ctx: SceneContext) {
        const call = await this.supportService.getCallByClient(ctx.from.id);
        if (call.manager) {
            await this.botService.sendMessage(
                call.manager.id,
                "<b>Диалог завершен пользователем.</b>"
            );
        }
        await ctx.answerCbQuery("Диалог завершен.");
        await ctx.scene.leave();
        await this.supportService.closeCall(call.id);
    }

    @On("callback_query")
    async onEmptyAction(@Ctx() ctx: SceneContext) {
        const call = await this.supportService.getCallByClient(ctx.from.id);
        if (!call) await ctx.scene.leave();

        await ctx.answerCbQuery();
    }
}
