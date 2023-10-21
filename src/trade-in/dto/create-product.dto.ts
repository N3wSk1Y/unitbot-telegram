import { IsString, Length } from "class-validator";

export class CreateProductDto {
    @IsString()
    @Length(5)
    description: string;
}
