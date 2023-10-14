import { Action, Ctx, On, Scene, SceneEnter } from "nestjs-telegraf";
import { Context } from "telegraf";
import { SupportService } from "./support.service";
import * as manageTookCallResponse from "./responses/manager-took-call.response.json";
import { BotService } from "../bot.service";
import { SceneContext } from "telegraf/typings/scenes";

@Scene("SCENE_SUPPORT_MANAGER")
export class SupportManagerScene {
    public constructor(
        private readonly supportService: SupportService,
        private readonly botService: BotService
    ) {}
    @SceneEnter()
    async enterScene(@Ctx() ctx: Context) {
        const call = await this.supportService.getCallByManager(ctx.from.id);
        await this.botService.sendMessage(
            call.client.id,
            manageTookCallResponse.text,
            manageTookCallResponse.options
        );
        await ctx.reply(`<b>Вы начали диалог с @${call.client.username}</b>`, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "\uD83C\uDFC1 Завершить диалог с клиентом",
                            callback_data: "BUTTON_FINISH_CALL",
                        },
                    ],
                ],
            },
        });
    }

    @On("message")
    async onMessage(@Ctx() ctx: SceneContext) {
        const call = await this.supportService.getCallByManager(ctx.from.id);
        if (!call) {
            await ctx.reply("Диалог завершен.");
            await ctx.scene.leave();
            return;
        }

        await this.botService.copyMessage(
            call.client.id,
            ctx.from.id,
            ctx.message.message_id
        );
    }

    @Action("BUTTON_FINISH_CALL")
    async onCallFinish(@Ctx() ctx: SceneContext) {
        const call = await this.supportService.getCallByManager(ctx.from.id);
        await this.botService.sendMessage(
            call.client.id,
            "<b>Диалог завершен менеджером.</b>"
        );
        await ctx.answerCbQuery("Диалог завершен.");
        await ctx.scene.leave();
        await this.supportService.closeCall(call.id);
    }

    @On("callback_query")
    async onEmptyAction(@Ctx() ctx: SceneContext) {
        const call = await this.supportService.getCallByManager(ctx.from.id);
        if (!call) await ctx.scene.leave();

        await ctx.answerCbQuery();
    }
}
