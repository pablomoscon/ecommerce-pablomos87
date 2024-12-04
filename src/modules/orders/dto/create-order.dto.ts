import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID of the user placing the order',
    example: 'uuid-of-user',
  })
  @IsUUID('4', { message: 'The userId must be a valid UUID.' })
  @IsNotEmpty({ message: 'The userId field cannot be empty.' })
  userId: string;

  @ApiProperty({
    description: 'List of products included in the order',
    example: [{ id: 'uuid-of-product' }],
  })
  @IsArray({ message: 'The products field must be an array.' })
  @ArrayNotEmpty({ message: 'The products field must contain at least one product.' })
  @ValidateNested({ each: true })
  @Type(() => PartialProducts)
  products: PartialProducts[];
}

export class PartialProducts {
  @ApiProperty({
    description: 'ID of the product',
    example: 'uuid-of-product',
  })
  @IsUUID('4', { message: 'The product ID must be a valid UUID.' })
  @IsNotEmpty({ message: 'The product ID field cannot be empty.' })
  id: string;
}