import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';


export class CreateOrderDto {
    @IsUUID('4', { message: 'El userId debe tener un formato UUID válido' })
    @IsNotEmpty({ message: 'El userId no puede estar vacío' })
    userId: string;

    @IsArray()
    @ArrayNotEmpty({ message: 'Products debe contener al menos un elemento' })
    @ValidateNested({ each: true }) 
    @Type(() => PartialProducts) 
    products: PartialProducts[];
};

export class PartialProducts {
    @IsUUID('4', { message: 'El id del producto debe tener un formato UUID válido' })
    @IsNotEmpty({ message: 'El id del producto no puede estar vacío' })
    id: string;
};