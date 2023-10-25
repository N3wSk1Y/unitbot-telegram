import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { TradeInService } from "./trade-in.service";
import { Product } from "./product.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { LocalFileInterceptor } from "../interceptors/local-file.interceptor";
import { CheckoutDto } from "./dto/checkout.dto";

@Controller("product")
export class TradeInController {
    public constructor(private readonly tradeInService: TradeInService) {}

    @Get()
    async getAll(): Promise<Product[]> {
        return await this.tradeInService.getAll();
    }

    @Get(":id")
    async getOne(@Param("id") id: number): Promise<Product> {
        return await this.tradeInService.getOne(id);
    }

    @Get("/category/:id")
    async getOneByCategory(@Param("id") id: number): Promise<Product[]> {
        return await this.tradeInService.getAllByCategory(id);
    }

    @Post()
    async createProduct(
        @Body() productData: CreateProductDto
    ): Promise<Product> {
        return await this.tradeInService.create(productData);
    }

    @Post("remind/:id")
    async remindArrival(@Param("id") id: number): Promise<void> {
        return await this.tradeInService.remindArrival(id);
    }

    @Post(":id/file")
    @UseInterceptors(
        LocalFileInterceptor({
            fieldName: "file",
            path: "/products/avatars",
            fileFilter: (request, file, callback) => {
                if (
                    !file.mimetype.includes("image") &&
                    !file.mimetype.includes("video")
                )
                    return callback(new Error("Provide a valid image"), false);

                callback(null, true);
            },
            limits: {
                fileSize: Math.pow(1024, 2) * 10, // 10MB
            },
        })
    )
    async addFile(
        @Param("id") companyId: number,
        @UploadedFile() file: Express.Multer.File
    ): Promise<Product> {
        if (!file) throw new Error("Provide a valid file.");

        return await this.tradeInService.addFile(companyId, {
            fileName: file.filename,
            path: file.path,
            mimetype: file.mimetype,
        });
    }

    @Delete(":id")
    async deleteOne(@Param("id") id: number): Promise<void> {
        await this.tradeInService.delete(id);
    }

    // Оформление заказа
    @Post(":productId/book/:userId")
    async bookProduct(
        @Param("productId") productId: number,
        @Param("userId") userId: number
    ): Promise<void> {
        await this.tradeInService.bookProduct(userId, productId);
    }

    @Post("/checkout/:id")
    async checkout(
        @Param("id") userId: number,
        @Body() checkoutData: CheckoutDto
    ): Promise<void> {
        await this.tradeInService.checkout(userId, checkoutData);
    }
}
