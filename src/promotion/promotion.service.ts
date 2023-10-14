import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Promotion } from "./promotion.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { BotService } from "../bot/bot.service";

@Injectable()
export class PromotionService {
    public constructor(
        @InjectRepository(Promotion)
        private readonly promotionRepository: Repository<Promotion>,
        @Inject(forwardRef(() => BotService))
        private readonly botService: BotService
    ) {}

    async getAll(): Promise<Promotion[]> {
        return await this.promotionRepository.find({
            order: {
                createdAt: "ASC",
            },
        });
    }

    async sendAll(userId: number): Promise<void> {
        const promotions = await this.getAll();
        for (const promotion of promotions) {
            try {
                await this.botService.copyMessage(
                    userId,
                    promotion.fromChatId,
                    promotion.messageId
                );
            } catch (e) {
                await this.delete(promotion.id);
            }
        }
    }

    async create(fromChatId: number, messageId: number): Promise<Promotion> {
        return await this.promotionRepository.save({
            fromChatId,
            messageId,
        });
    }

    async delete(id: number): Promise<void> {
        await this.promotionRepository.delete({ id });
    }
}
