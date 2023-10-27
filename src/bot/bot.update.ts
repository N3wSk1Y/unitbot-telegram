import { Action, Command, Ctx, On, Start, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { forwardRef, Inject, Injectable, UseGuards } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { BotService } from "./bot.service";
import * as startResponse from "./common/start.response.json";
import * as adminResponse from "./common/admin.response.json";
import * as contactsResponse from "./common/contacts.response.json";
import * as tt from "telegraf/src/telegram-types";
import { SceneContext } from "telegraf/typings/scenes";
import { SupportService } from "./support/support.service";
import { CallType } from "./support/support-call.entity";
import { PromotionService } from "../promotion/promotion.service";
import { AdminGuard } from "../guards/admin.guard";
import { GreetingService } from "../greeting/greeting.service";

@Update()
@Injectable()
export class BotUpdate {
    public constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        @Inject(forwardRef(() => BotService))
        private readonly botService: BotService,
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
    // @UseGuards(AdminGuard)
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
        await this.supportService.createCall(ctx.from.id, CallType.Support);
        await ctx.answerCbQuery();
        await ctx.scene.enter(`SCENE_SUPPORT_CLIENT`);
    }

    @On("callback_query")
    async takeCallButtonHandler(@Ctx() ctx: SceneContext) {
        const callbackQuery = (ctx.callbackQuery as any).data;
        if (!callbackQuery.includes("BUTTON_TAKE_CALL_")) {
            await ctx.answerCbQuery();
            return;
        }

        const callId = parseInt(
            callbackQuery.slice(callbackQuery.lastIndexOf("_") + 1)
        );
        const call = await this.supportService.getCallById(callId);

        if (call == null) {
            await ctx.answerCbQuery("Обращение уже обработано.");
            return;
        }
        if (
            (await this.supportService.getCallByManager(ctx.from.id)) !== null
        ) {
            await ctx.answerCbQuery("У вас уже есть обращение в обработке.");
            return;
        }
        if (call.manager !== null) {
            await ctx.answerCbQuery("Обращение уже в обработке.");
            return;
        }

        await this.supportService.attachManagerToCall(ctx.from.id, callId);
        await ctx.scene.enter(`SCENE_SUPPORT_MANAGER`);
    }
}
