import { Module } from "@nestjs/common";
import { TradeInService } from "./trade-in.service";
import { TradeInController } from "./trade-in.controller";
import { LocalFileModule } from "../local-file/local-file.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./product.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Product]), LocalFileModule],
    providers: [TradeInService],
    controllers: [TradeInController],
})
export class TradeInModule {}
