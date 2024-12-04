import { IsArray, IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDetailDto {
  @ApiProperty({
    description: 'Price of the order detail',
    example: 199.99,
  })
  @IsNotEmpty({ message: 'The price field cannot be empty.' })
  @IsNumber({}, { message: 'The price must be a valid number.' })
  price: number;

  @ApiProperty({
    description: 'The order associated with the order detail',
    example: { id: 'uuid-of-order' },
  })
  @IsNotEmpty({ message: 'The order field cannot be empty.' })
  order: object;

  @ApiProperty({
    description: 'List of products included in the order detail',
    example: [{ id: 'uuid-of-product' }],
  })
  @IsNotEmpty({ message: 'The products field cannot be empty.' })
  @IsArray({ message: 'The products field must be an array.' })
  products: Array<object>;
}