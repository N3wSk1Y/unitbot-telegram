import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { LocalFile } from "./local-file.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { LocalFileDto } from "./dto/local-file.dto";

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

    async deleteFileById(id: string): Promise<void> {
        const file = await this.getOne(id);
        // await fs.unlink(file.path);
        await this.localFileRepository.delete({ id });
    }
}
