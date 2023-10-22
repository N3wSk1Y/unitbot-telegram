import { IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CheckoutDto {
    @IsString()
    products: string;

    @IsNumber()
    total: number;

    @IsString()
    paymentMethod: string;

    @IsString()
    obtainingMethod: string;

    @IsPhoneNumber()
    phoneNumber: string;

    @IsString()
    @IsOptional()
    address: string;

    @IsString()
    @IsOptional()
    comment: string;
}
