import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Product } from "./product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { LocalFileDto } from "../local-file/dto/local-file.dto";
import { LocalFileService } from "../local-file/local-file.service";

@Injectable()
export class TradeInService {
    public constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly localFileService: LocalFileService
    ) {}

    async getAll(): Promise<Product[]> {
        return await this.productRepository.find({
            relations: {
                files: true,
            },
            order: {
                description: "ASC"
            }
        });
    }

    async getOne(id: number): Promise<Product> {
        return await this.productRepository.findOne({
            where: { id },
            relations: {
                files: true,
            },
        });
    }

    async create(productData: CreateProductDto): Promise<Product> {
        return await this.productRepository.save(productData);
    }

    async addFile(productId: number, fileData: LocalFileDto): Promise<Product> {
        const product = await this.getOne(productId);
        const file = await this.localFileService.saveFile(fileData);
        product.files.push(file);
        return await this.productRepository.save(product);
    }

    async delete(id: number): Promise<void> {
        await this.productRepository.delete({ id });
    }
}
