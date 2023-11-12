import { forwardRef, Module } from "@nestjs/common";
import { SupportController } from "./support.controller";
import { SupportService } from "./support.service";
import { BotModule } from "../bot/bot.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "./entities/message.entity";
import { Chat } from "./entities/chat.entity";
import { UserModule } from "../user/user.module";
import { SupportScene } from "./support.scene";
import { LocalFileModule } from "../local-file/local-file.module";

@Module({
    imports: [
        forwardRef(() => BotModule),
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature([Chat, Message]),
        LocalFileModule,
    ],
    controllers: [SupportController],
    providers: [SupportService, SupportScene],
    exports: [SupportService],
})
export class SupportModule {}
