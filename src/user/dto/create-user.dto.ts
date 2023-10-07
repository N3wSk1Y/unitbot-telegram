import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsNumber()
    id: number;

    @IsString()
    @IsOptional()
    username: string;

    @IsString()
    @IsOptional()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName: string;
}
