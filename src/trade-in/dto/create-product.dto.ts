import {
    IsArray,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
} from "class-validator";

export class CreateProductDto {
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsNumber()
    category: number;

    @IsArray()
    @IsUUID("all", { each: true })
    @IsOptional()
    files?: string[];
}
