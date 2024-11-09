import { ArrayNotEmpty, IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { Product } from 'src/modules/products/entities/product.entity';
export class CreateOrderDto {
    @IsUUID('4', { message: 'El userId debe tener un formato UUID válido' })
    @IsNotEmpty({ message: 'El userId no puede estar vacío' })
    userId: string;

    @IsArray()
    @ArrayNotEmpty({ message: 'Products debe contener al menos un elemento' })
    @ValidateNested({ each: true }) 
    @Type(() => PartialProducts) 
    products: PartialProducts[];
}

export class PartialProducts extends PartialType(Product) {}