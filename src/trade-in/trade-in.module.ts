import { forwardRef, Module } from "@nestjs/common";
import { TradeInService } from "./trade-in.service";
import { TradeInController } from "./trade-in.controller";
import { LocalFileModule } from "../local-file/local-file.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { BotModule } from "../bot/bot.module";
import { UserModule } from "../user/user.module";
import { TradeInScene } from "./trade-in.scene";
import { SupportModule } from "../support/support.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Product]),
        LocalFileModule,
        forwardRef(() => BotModule),
        UserModule,
        SupportModule,
    ],
    providers: [TradeInService, TradeInScene],
    controllers: [TradeInController],
})
export class TradeInModule {}
