import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BotModule } from "./bot/bot.module";
import { TelegrafModule } from "nestjs-telegraf";
import { UserModule } from "./user/user.module";
import { session } from "telegraf";
import { PromotionModule } from "./promotion/promotion.module";
import { TradeInModule } from "./trade-in/trade-in.module";
import { LocalFileModule } from "./local-file/local-file.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: "./.env",
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                type: "postgres",
                host: configService.get("DB_HOST"),
                port: configService.get("DB_PORT"),
                username: configService.get("DB_USER"),
                password: configService.get("DB_PASSWORD"),
                database: configService.get("DB_DATABASE"),
                entities: ["dist/**/*.entity.js"],
                synchronize: true,
                // logging: ["query"],
            }),
            inject: [ConfigService],
        }),
        TelegrafModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                token: configService.get<string>("TELEGRAM_BOT_TOKEN"),
                middlewares: [session()],
            }),
            inject: [ConfigService],
        }),
        BotModule,
        UserModule,
        PromotionModule,
        TradeInModule,
        LocalFileModule,
    ],
})
export class AppModule {}
