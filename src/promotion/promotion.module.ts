import { forwardRef, Module } from "@nestjs/common";
import { PromotionService } from "./promotion.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Promotion } from "./promotion.entity";
import { BotModule } from "../bot/bot.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Promotion]),
        forwardRef(() => BotModule),
    ],
    providers: [PromotionService],
    exports: [PromotionService],
})
export class PromotionModule {}
