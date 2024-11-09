import { IsString, IsNumber, IsUrl, IsOptional, Min, IsPositive, Length } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @Length(2, 150)
    name: string;

    @IsString()
    @Length(10, 255)
    description: string;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsNumber()
    @Min(0)
    stock: number;

    @IsUrl()
    @IsOptional()
    imgUrl: string;
}