import {
    IsArray,
    IsOptional,
    IsString,
    IsUUID,
} from "class-validator";

export class MessageDto {
    @IsString()
    @IsOptional()
    text: string;

    @IsArray()
    @IsUUID("all", { each: true })
    @IsOptional()
    files?: string[];
}
