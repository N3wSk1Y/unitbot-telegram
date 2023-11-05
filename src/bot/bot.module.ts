import { forwardRef, Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { BotUpdate } from "./bot.update";
import { UserModule } from "../user/user.module";
import { MassMailingScene } from "./massmailing/massmailing.scene";
import { PromotionScene } from "../promotion/promotion.scene";
import { PromotionModule } from "../promotion/promotion.module";
import { GreetingModule } from "../greeting/greeting.module";
import { GreetingScene } from "./greeting/greeting.scene";
import { TradeInModule } from "../trade-in/trade-in.module";
import { SupportModule } from "../support/support.module";

@Module({
    imports: [
        forwardRef(() => UserModule),
        forwardRef(() => PromotionModule),
        forwardRef(() => TradeInModule),
        forwardRef(() => SupportModule),
        GreetingModule,
    ],
    providers: [
        BotService,
        BotUpdate,
        MassMailingScene,
        PromotionScene,
        GreetingScene,
    ],
    exports: [BotUpdate, BotService],
})
export class BotModule {}
