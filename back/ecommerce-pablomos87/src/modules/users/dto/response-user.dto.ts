import { Order } from 'src/modules/orders/entities/order.entity';

export class UserResponseDto {
    id: string;
    name: string;
    email: string;
    address: string;
    phone: string;
    country: string;
    city: string;
    orders: Order[];
    administrator: string;

    constructor(
        partial: Partial<UserResponseDto>,
        includeAdmin: boolean = false,
    ) {
        const {
            id,
            name,
            email,
            address,
            phone,
            country,
            city,
            orders,
            administrator,
        } = partial;
        this.id = id;
        this.name = name;
        this.email = email;
        this.address = address;
        this.phone = phone;
        this.country = country;
        this.city = city;
        this.orders = orders;

        if (includeAdmin) {
            this.administrator = administrator;
        }
    }
}
