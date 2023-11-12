import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { SupportService } from "./support.service";
import { Chat } from "./entities/chat.entity";
import { MessageDto } from "./dto/message.dto";
import { LocalFileInterceptor } from "../interceptors/local-file.interceptor";
import { Message } from "./entities/message.entity";

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

    @Post(":id/file")
    @UseInterceptors(
        LocalFileInterceptor({
            fieldName: "file",
            path: "/support",
            fileFilter: (request, file, callback) => {
                if (!file.mimetype.includes("image"))
                    return callback(new Error("Provide a valid image"), false);

                callback(null, true);
            },
            limits: {
                fileSize: Math.pow(1024, 2) * 10, // 10MB
            },
        })
    )
    async addFile(
        @Param("id") messageId: string,
        @UploadedFile() file: Express.Multer.File
    ): Promise<Message> {
        if (!file) throw new Error("Provide a valid file.");

        return await this.supportService.addFile(messageId, {
            fileName: file.filename,
            path: file.path,
            mimetype: file.mimetype,
        });
    }
}
