import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { LocalFile } from "./local-file.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { LocalFileDto } from "./dto/local-file.dto";
import * as path from "path";
import * as fsSync from "fs";
import * as fs from "fs/promises";
import axios from "axios";

@Injectable()
export class LocalFileService {
    public constructor(
        @InjectRepository(LocalFile)
        private readonly localFileRepository: Repository<LocalFile>
    ) {}

    async getOne(id: string): Promise<LocalFile> {
        const file = await this.localFileRepository.findOneOrFail({
            where: { id },
        });

        if (!file) {
            throw new Error(`File with id ${id} does not exist.`);
        }

        return file;
    }

    async saveFile(fileData: LocalFileDto): Promise<LocalFile> {
        return await this.localFileRepository.save(fileData);
    }

    async saveFileByUrl(
        url: string,
        localPath: string,
        expectedMimetype: string
    ): Promise<LocalFile> {
        const res = await axios.get(url, { responseType: "arraybuffer" });
        const mimetype = res.headers["content-type"] as string;

        const fileName = (Math.random() * 10000).toString();
        const localFilePath = path.join("../files", localPath, fileName);
        const dir = path.join(localPath);
        if (!fsSync.existsSync(dir)) {
            await fs.mkdir(dir);
        }
        await fs.writeFile(localFilePath, res.data);

        const localFile = new LocalFile();
        localFile.path = path.join("/files", localPath, fileName);
        localFile.fileName = fileName;
        localFile.mimetype = expectedMimetype;

        return await this.localFileRepository.save(localFile);
    }

    async deleteFileById(id: string): Promise<void> {
        const file = await this.getOne(id);
        // await fs.unlink(file.path);
        await this.localFileRepository.delete({ id });
    }
}
