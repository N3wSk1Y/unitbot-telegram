import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BotModule } from "./bot/bot.module";
import { TelegrafModule } from "nestjs-telegraf";

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
            }),
            inject: [ConfigService],
        }),
        BotModule,
    ],
})
export class AppModule {}
