import { Module } from "@nestjs/common";
import { GreetingService } from "./greeting.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Greeting } from "./greeting.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Greeting])],
    providers: [GreetingService],
    exports: [GreetingService],
})
export class GreetingModule {}
