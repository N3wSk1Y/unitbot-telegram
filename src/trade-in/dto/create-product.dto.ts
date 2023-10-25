import { IsNumber, IsString, Length } from "class-validator";

export class CreateProductDto {
    @IsString()
    @Length(5)
    description: string;

    @IsNumber()
    category: number;
}
