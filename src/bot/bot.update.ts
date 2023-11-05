import { Action, Command, Ctx, Start, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { BotService } from "./bot.service";
import * as startResponse from "./common/start.response.json";
import * as adminResponse from "./common/admin.response.json";
import * as contactsResponse from "./common/contacts.response.json";
import * as tt from "telegraf/src/telegram-types";
import { SceneContext } from "telegraf/typings/scenes";
import { PromotionService } from "../promotion/promotion.service";
import { GreetingService } from "../greeting/greeting.service";
import { SupportService } from "../support/support.service";

@Update()
@Injectable()
export class BotUpdate {
    public constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        @Inject(forwardRef(() => BotService))
        private readonly botService: BotService,
        @Inject(forwardRef(() => SupportService))
        private readonly supportService: SupportService,
        @Inject(forwardRef(() => PromotionService))
        private readonly promotionService: PromotionService,
        private readonly greetingService: GreetingService
    ) {}

    @Start()
    async start(@Ctx() ctx: Context) {
        const user = ctx.from;
        await this.userService.createIfNotExist({
            id: user.id,
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
        });
        try {
            const greeting = await this.greetingService.get();
            await this.botService.copyMessage(
                user.id,
                greeting.fromChatId,
                greeting.messageId
            );
        } catch (e) {}

        await ctx.reply(
            startResponse.text,
            startResponse.options as tt.ExtraReplyMessage
        );
    }

    @Command("menu")
    async menu(@Ctx() ctx: Context) {
        await ctx.reply(
            startResponse.text,
            startResponse.options as tt.ExtraReplyMessage
        );
    }

    @Action("BUTTON_PROMOTIONS")
    async promotionsButtonHandler(@Ctx() ctx: Context) {
        await ctx.answerCbQuery();
        await this.promotionService.sendAll(ctx.from.id);
    }

    @Action("BUTTON_TRADE_IN")
    async tradeInButtonHandler(@Ctx() ctx: SceneContext) {
        await ctx.answerCbQuery();
        await ctx.scene.enter(`SCENE_TRADE_IN`);
    }

    @Action("BUTTON_CONTACTS")
    async contactsButtonHandler(@Ctx() ctx: SceneContext) {
        await ctx.answerCbQuery();
        await ctx.reply(
            contactsResponse.text,
            contactsResponse.options as tt.ExtraReplyMessage
        );
    }

    @Command("massmail")
    async massMail(@Ctx() ctx: SceneContext) {
        await ctx.scene.enter("SCENE_MASS_MAILING");
    }

    @Command("addpromotion")
    async addPromotion(@Ctx() ctx: SceneContext) {
        await ctx.scene.enter("SCENE_ADD_PROMOTION");
    }

    @Command("admin")
    // @UseGuards(AdminGuard)
    async adminButtonHandler(@Ctx() ctx: Context) {
        await this.botService.sendMessage(
            ctx.from.id,
            adminResponse.text,
            adminResponse.options
        );
    }

    @Command("changegreeting")
    async changeGreetingButtonHandler(@Ctx() ctx: SceneContext) {
        await ctx.scene.enter("SCENE_SET_GREETING");
    }

    @Command("chatinfo")
    async getChatInfo(@Ctx() ctx: Context) {
        await ctx.reply(`ID: <code>${ctx.chat.id}</code>`, {
            parse_mode: "HTML",
        });
    }

    @Action("BUTTON_SUPPORT")
    async supportButtonHandler(@Ctx() ctx: SceneContext) {
        await this.supportService.sendUserMessage(ctx.from.id, {
            text: "<b>Новое обращение в поддержку</b>",
        });
        await ctx.answerCbQuery();
        await ctx.scene.enter(`SCENE_SUPPORT`);
    }
}
