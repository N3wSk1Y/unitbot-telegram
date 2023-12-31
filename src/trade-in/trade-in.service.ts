import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Product } from "./product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { LocalFileDto } from "../local-file/dto/local-file.dto";
import { LocalFileService } from "../local-file/local-file.service";
import { BotService } from "../bot/bot.service";
import { UserService } from "../user/user.service";
import { Telegraf } from "telegraf";
import { InjectBot } from "nestjs-telegraf";
import * as process from "process";
import { CheckoutDto } from "./dto/checkout.dto";
import { LocalFile } from "../local-file/local-file.entity";

@Injectable()
export class TradeInService {
    public constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly localFileService: LocalFileService,
        @Inject(forwardRef(() => BotService))
        private readonly botService: BotService,
        private readonly userService: UserService,
        @InjectBot()
        private readonly bot: Telegraf
    ) {}

    async getAll(): Promise<Product[]> {
        return await this.productRepository.find({
            relations: {
                files: true,
            },
            order: {
                date: "DESC",
            },
        });
    }

    async getAllByCategory(id: number): Promise<Product[]> {
        return await this.productRepository.find({
            where: {
                category: id,
            },
            relations: {
                files: true,
            },
            order: {
                date: "DESC",
            },
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
        let files: LocalFile[] = [];
        productData.files =
            productData.files?.length > 0 ? productData.files : [];
        if (productData.files.length > 0) {
            for (const fileId of productData.files) {
                const localFile = await this.localFileService.getOne(fileId);
                files.push(localFile);
            }
        }
        return await this.productRepository.save({
            title: productData.title,
            description: productData.description,
            category: productData.category,
            files: files,
        });
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

    async remindArrival(id: number): Promise<void> {
        const user = await this.userService.getOneByTelegramId(id);
        await this.bot.telegram.sendMessage(
            user.id,
            `<b>Оставить заявку на уведомление о появлении товара в наличии</b>`,
            {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Продолжить оформление заявки",
                                callback_data: `BUTTON_SUPPORT`,
                            },
                        ],
                    ],
                },
            }
        );
    }

    // Оформление заказа
    async checkout(userid: number, checkoutData: CheckoutDto): Promise<void> {
        const user = await this.userService.getOneByTelegramId(userid);
        await this.botService.sendMessage(
            parseInt(process.env.SUPPORT_CHAT_ID),
            `
<b>Завяка на оформление заказа</b>
${user.firstName || ""} ${user.lastName || ""} | ${
                checkoutData.phoneNumber
            } | @${user.username}

======================
            
<b>Состав заказа:</b> 
${checkoutData.products}

<b>Стоимость заказа:</b> ${checkoutData.total} рублей.
<b>Способ оплаты:</b> ${checkoutData.paymentMethod}.
<b>Способ получения:</b> ${checkoutData.obtainingMethod}.

${checkoutData.address}
======================

${checkoutData.comment || ""}`
        );
        await this.bot.telegram.sendMessage(
            user.id,
            `
<b>Оформление заказа</b>
${user.firstName || ""} ${user.lastName || ""} | ${
                checkoutData.phoneNumber
            } | @${user.username}

======================
            
<b>Состав заказа:</b> 
${checkoutData.products}

<b>Стоимость заказа:</b> ${checkoutData.total} рублей.
<b>Способ оплаты:</b> ${checkoutData.paymentMethod}.
<b>Способ получения:</b> ${checkoutData.obtainingMethod}.

${checkoutData.address}
======================

${checkoutData.comment || ""}
`,
            {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Продолжить оформление",
                                callback_data: `BUTTON_SUPPORT`,
                            },
                        ],
                    ],
                },
            }
        );
    }
    async bookProduct(userid: number, productId: number): Promise<void> {
        const product = await this.getOne(productId);
        const user = await this.userService.getOneByTelegramId(userid);
        await this.botService.sendMessage(
            parseInt(process.env.SUPPORT_CHAT_ID),
            `
<b>Заявка на бронирование товара</b>
======================
            
<b>Пользователь:</b> @${user.username}
<b>Товар:</b> ${product.description}

${
    product.files.length > 0
        ? `<a href="https://xn--h1ajq9b.store/api/file/${product.files[0].id}">Медиа</a>`
        : ""
}`
        );
        await this.bot.telegram.sendMessage(
            user.id,
            `
<b>Заявка на бронирование товара</b>
======================
            
<b>Товар:</b> ${product.description}

${
    product.files.length > 0
        ? `<a href="https://xn--h1ajq9b.store/api/file/${product.files[0].id}">Медиа</a>`
        : ""
}`,
            {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Продолжить бронирование",
                                callback_data: `BUTTON_SUPPORT`,
                            },
                        ],
                    ],
                },
            }
        );
    }
}
