import {
    Controller,
    Get,
    Param,
    Post,
    Res,
    StreamableFile,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { LocalFileService } from "./local-file.service";
import { createReadStream } from "fs";
import * as path from "path";
import { LocalFileInterceptor } from "../interceptors/local-file.interceptor";
import { LocalFile } from "./local-file.entity";

@Controller("file")
export class LocalFileController {
    public constructor(private readonly localFileService: LocalFileService) {}

    @Get(":id")
    async getFileByName(
        @Param("id") id: string,
        @Res({ passthrough: true }) res
    ): Promise<StreamableFile> {
        const file = await this.localFileService.getOne(id);
        const stream = createReadStream(path.join(process.cwd(), file.path));
        res.set({
            "Content-Disposition": `inline; filename="${file.fileName}"`,
            "Content-Type": file.mimetype,
        });
        return new StreamableFile(stream);
    }

    @Post()
    @UseInterceptors(
        LocalFileInterceptor({
            fieldName: "file",
            path: "/common",
            fileFilter: (request, file, callback) => {
                if (
                    !file.mimetype.includes("image") &&
                    !file.mimetype.includes("video")
                )
                    return callback(new Error("Provide a valid image"), false);

                callback(null, true);
            },
            limits: {
                fileSize: Math.pow(1024, 2) * 100, // 100MB
            },
        })
    )
    async addFile(
        @UploadedFile() file: Express.Multer.File
    ): Promise<LocalFile> {
        if (!file) throw new Error("Provide a valid file.");

        return await this.localFileService.saveFile({
            fileName: file.filename,
            path: file.path,
            mimetype: file.mimetype,
        });
    }
}
