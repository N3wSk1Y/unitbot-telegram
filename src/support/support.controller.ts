import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { SupportService } from "./support.service";
import { Chat } from "./entities/chat.entity";
import { MessageDto } from "./dto/message.dto";

@Controller("support")
export class SupportController {
    public constructor(private readonly supportService: SupportService) {}

    @Get()
    async getChats(): Promise<Chat[]> {
        return await this.supportService.getChats();
    }

    @Get(":id")
    async getChatById(@Param("id") id: number): Promise<Chat> {
        return await this.supportService.getChatByUser(id);
    }

    @Post(":id")
    async sendManagerMessage(
        @Param("id") id: number,
        @Body() messageData: MessageDto
    ): Promise<void> {
        return await this.supportService.sendManagerMessage(id, messageData);
    }
}
