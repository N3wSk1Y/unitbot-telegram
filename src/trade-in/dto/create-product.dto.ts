import {IsString, Min} from "class-validator";

export class CreateProductDto {
    @IsString()
    @Min(5)
    description: string;
}
