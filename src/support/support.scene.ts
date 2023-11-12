import { Action, Ctx, Message, On, Scene, SceneEnter } from "nestjs-telegraf";
import { Context } from "telegraf";
import * as supportUserResponse from "./responses/support-user.response.json";
import * as tt from "telegraf/src/telegram-types";
import { SceneContext } from "telegraf/typings/scenes";
import { SupportService } from "./support.service";
import { LocalFileService } from "../local-file/local-file.service";

@Scene("SCENE_SUPPORT")
export class SupportScene {
    public constructor(
        private readonly supportService: SupportService,
        private readonly localFileService: LocalFileService
    ) {}
    @SceneEnter()
    async enterScene(@Ctx() ctx: Context) {
        await ctx.reply(
            supportUserResponse.text,
            supportUserResponse.options as tt.ExtraReplyMessage
        );
    }

    @On("message")
    async onMessage(@Ctx() ctx: Context, @Message() message: any) {
        const chatMessage = await this.supportService.sendUserMessage(
            ctx.from.id,
            {
                text: message.text || message.caption,
            }
        );
        if (message.photo) {
            for (const photo of message.photo) {
                const filePath = (await ctx.telegram.getFile(photo.file_id))
                    .file_path;
                const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`;
                const localFile = await this.localFileService.saveFileByUrl(
                    fileUrl,
                    "/support",
                    "image/jpeg"
                );
                await this.supportService.addFileViaId(
                    chatMessage.id,
                    localFile.id
                );
            }
        }
    }

    @Action("BUTTON_QUIT_SUPPORT")
    async onCallFinish(@Ctx() ctx: SceneContext) {
        await ctx.reply("Вы вышли из чата с менеджером.");
        await ctx.scene.leave();
        await this.supportService.sendUserMessage(ctx.from.id, {
            text: "<b>Пользователь покинул чат с менеджером.</b>",
        });
    }
}
