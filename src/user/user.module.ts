import { forwardRef, Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { BotModule } from "../bot/bot.module";
import { UserController } from "./user.controller";

@Module({
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => BotModule)],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
