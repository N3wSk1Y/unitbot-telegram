import { Action, Ctx, On, Scene, SceneEnter } from "nestjs-telegraf";
import { Context } from "telegraf";
import { Injectable } from "@nestjs/common";
import { SceneContext } from "telegraf/typings/scenes";
import * as addPromotion from "./add-promotion.response.json";
import * as tt from "telegraf/src/telegram-types";
import { PromotionService } from "./promotion.service";

@Scene("SCENE_ADD_PROMOTION")
@Injectable()
export class PromotionScene {
    public constructor(private readonly promotionService: PromotionService) {}
    @SceneEnter()
    async enterScene(@Ctx() ctx: Context) {
        await ctx.reply(
            addPromotion.text,
            addPromotion.options as tt.ExtraReplyMessage
        );
    }

    @On("message")
    async onAction(@Ctx() ctx: SceneContext) {
        await this.promotionService.create(ctx.from.id, ctx.message.message_id);
        await ctx.reply("Акция добавлена.");
        await ctx.scene.leave();
    }

    @Action("BUTTON_MAIN_MENU")
    async returnToMainMenu(@Ctx() ctx: SceneContext) {
        await ctx.answerCbQuery(`Отмена.`);
        await ctx.scene.leave();
    }
}
