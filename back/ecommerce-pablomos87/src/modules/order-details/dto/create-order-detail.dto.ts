import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class CreateOrderDetailDto {

  @IsNotEmpty()
  @IsNumber()

  price: number;

  @IsNotEmpty()
  order: object;

  @IsNotEmpty()
  @IsArray()
  products: Array<object>;
}