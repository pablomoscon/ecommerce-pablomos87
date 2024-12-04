import { IsString, IsNumber, IsUrl, IsOptional, Min, IsPositive, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Wireless Headphones',
  })
  @IsString({ message: 'The name must be a string.' })
  @Length(2, 150, { message: 'The name must be between 2 and 150 characters long.' })
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'High-quality wireless headphones with noise cancellation.',
  })
  @IsString({ message: 'The description must be a string.' })
  @Length(10, 255, { message: 'The description must be between 10 and 255 characters long.' })
  description: string;

  @ApiProperty({
    description: 'Price of the product in USD',
    example: 199.99,
  })
  @IsNumber({}, { message: 'The price must be a valid number.' })
  @IsPositive({ message: 'The price must be a positive number.' })
  price: number;

  @ApiProperty({
    description: 'Stock quantity of the product',
    example: 50,
  })
  @IsNumber({}, { message: 'The stock must be a valid number.' })
  @Min(0, { message: 'The stock cannot be negative.' })
  stock: number;

  @ApiProperty({
    description: 'Image URL for the product',
    example: 'https://example.com/product-image.jpg',
    default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWz9tftw9qculFH1gxieWkxL6rbRk_hrXTSg&s',
    required: false,
  })
  @IsUrl({}, { message: 'The image URL must be a valid URL.' })
  @IsOptional({ message: 'Image URL is optional.' })
  imgUrl: string;
}