import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { UserService } from "../../user/user.service";
import { InjectBot } from "nestjs-telegraf";
import { Telegraf } from "telegraf";
import { InjectRepository } from "@nestjs/typeorm";
import { CallType, SupportCall } from "./support-call.entity";
import { Repository } from "typeorm";

@Injectable()
export class SupportService {
    public constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        @InjectBot()
        private readonly bot: Telegraf,
        @InjectRepository(SupportCall)
        private readonly callRepository: Repository<SupportCall>
    ) {
        callRepository.clear();
    }

    async getCallById(callId: number): Promise<SupportCall> {
        return await this.callRepository.findOne({
            relations: {
                client: true,
                manager: true,
            },
            where: { id: callId },
        });
    }

    async getCallByClient(id: number): Promise<SupportCall> {
        return await this.callRepository.findOne({
            relations: {
                client: true,
                manager: true,
            },
            where: { client: { id } },
        });
    }

    async getCallByManager(id: number): Promise<SupportCall> {
        return await this.callRepository.findOne({
            relations: {
                client: true,
                manager: true,
            },
            where: { manager: { id } },
        });
    }

    async createCall(clientId: number, type: CallType): Promise<SupportCall> {
        const user = await this.userService.getOneByTelegramId(clientId);
        return await this.callRepository.save({
            client: user,
            type: type,
        });
    }

    async attachManagerToCall(
        managerId: number,
        callId: number
    ): Promise<SupportCall> {
        const manager = await this.userService.getOneByTelegramId(managerId);
        const call = await this.getCallById(callId);
        call.manager = manager;
        return await this.callRepository.save(call);
    }

    async closeCall(callId: number): Promise<void> {
        await this.callRepository.delete({ id: callId });
    }

    async notifyManagers(callId: number): Promise<void> {
        const call = await this.getCallById(callId);
        const managers = await this.userService.getAllManagers();
        for (const manager of managers) {
            await this.bot.telegram.sendMessage(
                manager.id,
                `
<b>Новое обращение в поддержку</b>
======================
            
<b>Пользователь:</b> @${call.client.username}
<b>Тип обращения:</b> ${
                    call.type === CallType.TradeIn ? "Trade-In" : "Поддержка"
                }`,
                {
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "Взять в обращение",
                                    callback_data: `BUTTON_TAKE_CALL_${callId}`,
                                },
                            ],
                        ],
                    },
                }
            );
        }
    }
}
