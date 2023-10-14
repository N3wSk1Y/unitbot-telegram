import { FileInterceptor } from "@nestjs/platform-express";
import { Injectable, mixin, NestInterceptor, Type } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { diskStorage } from "multer";

interface LocalFilesInterceptorOptions {
    fieldName: string;
    path: string;
    fileFilter?: MulterOptions["fileFilter"];
    limits?: MulterOptions["limits"];
}

export function LocalFileInterceptor(
    options: LocalFilesInterceptorOptions
): Type<NestInterceptor> {
    @Injectable()
    class Interceptor implements NestInterceptor {
        fileInterceptor: NestInterceptor;
        constructor(configService: ConfigService) {
            const destination = `files/${options.path}`;
            const multerOptions: MulterOptions = {
                storage: diskStorage({
                    destination,
                }),
                fileFilter: options.fileFilter,
                limits: options.limits,
            };

            this.fileInterceptor = new (FileInterceptor(
                options.fieldName,
                multerOptions
            ))();
        }

        intercept(...args: Parameters<NestInterceptor["intercept"]>) {
            return this.fileInterceptor.intercept(...args);
        }
    }
    return mixin(Interceptor);
}
