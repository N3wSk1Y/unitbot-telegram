import { Controller, Get, Param, Res, StreamableFile } from "@nestjs/common";
import { LocalFileService } from "./local-file.service";
import { createReadStream } from "fs";
import * as path from "path";

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
}
