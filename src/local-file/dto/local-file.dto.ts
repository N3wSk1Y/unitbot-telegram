import { IsMimeType, IsString } from "class-validator";

export class LocalFileDto {
    @IsString()
    fileName: string;

    @IsString()
    path: string;

    @IsMimeType()
    mimetype: string;
}
