import { Order } from "src/modules/orders/entities/order.entity";

export class AuthResponseDto {
    id: string;
    name: string;
    email: string;
    address: string;
    phone: string;
    country: string;
    city: string;
    orders: Order[];
 

    constructor(partial: Partial<AuthResponseDto>) {
        const { id, name, email, address, phone, country, city, orders } = partial;
        this.id = id;
        this.name = name;
        this.email = email;
        this.address = address;
        this.phone = phone;
        this.country = country;
        this.city = city;
        this.orders = orders;
    }
}