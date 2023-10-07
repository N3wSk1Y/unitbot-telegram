import { forwardRef, Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { BotUpdate } from "./bot.update";
import { UserModule } from "../user/user.module";

@Module({
    imports: [forwardRef(() => UserModule)],
    providers: [BotService, BotUpdate],
    exports: [BotUpdate],
})
export class BotModule {}
