import {
    IsArray,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from "class-validator";

export class MessageDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    text: string;

    @IsArray()
    @IsUUID("all", { each: true })
    @IsOptional()
    files?: string[];
}
