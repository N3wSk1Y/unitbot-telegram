import { forwardRef, Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { BotUpdate } from "./bot.update";
import { UserModule } from "../user/user.module";
import { MassMailingScene } from "./massmailing/massmailing.scene";
import { TradeInScene } from "./trade-in/trade-in.scene";
import { SupportClientScene } from "./support/support-client.scene";
import { SupportManagerScene } from "./support/support-manager.scene";
import { SupportService } from "./support/support.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SupportCall } from "./support/support-call.entity";
import { PromotionScene } from "../promotion/promotion.scene";
import { PromotionModule } from "../promotion/promotion.module";
import { GreetingModule } from "../greeting/greeting.module";
import { GreetingScene } from "./greeting/greeting.scene";

@Module({
    imports: [
        TypeOrmModule.forFeature([SupportCall]),
        forwardRef(() => UserModule),
        forwardRef(() => PromotionModule),
        GreetingModule,
    ],
    providers: [
        BotService,
        BotUpdate,
        SupportService,
        MassMailingScene,
        TradeInScene,
        SupportClientScene,
        SupportManagerScene,
        PromotionScene,
        GreetingScene,
    ],
    exports: [BotUpdate, BotService],
})
export class BotModule {}
