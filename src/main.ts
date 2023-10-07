import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import * as compression from "compression";
import helmet from "helmet";
import * as process from "process";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(compression());
    app.use(
        helmet({
            crossOriginEmbedderPolicy: false,
            crossOriginResourcePolicy: false,
        })
    );
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());
    app.enableCors({
        origin: "*",
        allowedHeaders: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        credentials: true,
    });
    await app.listen(process.env.port);
}
bootstrap();
