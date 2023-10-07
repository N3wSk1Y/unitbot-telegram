import { forwardRef, Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { BotModule } from "../bot/bot.module";

@Module({
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => BotModule)],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
