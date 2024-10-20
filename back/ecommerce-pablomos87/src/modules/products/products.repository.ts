import { Injectable } from "@nestjs/common";


@Injectable()
export class ProductsRepository {
    private products = [
        {
            id: 1,
            name: 'Wireless Headphones',
            description: 'Auriculares inalámbricos de alta calidad con cancelación de ruido y hasta 20 horas de duración de batería.',
            price: 199.99,
            stock: true,
            imgUrl: 'https://example.com/images/auriculares-inalambricos.jpg'
          },
          {
            id: 2,
            name: 'Smartphone',
            description: 'Último modelo de teléfono inteligente con 128GB de almacenamiento, doble cámara y tecnología de carga rápida.',
            price: 799.99,
            stock: true,
            imgUrl: 'https://example.com/images/telefono-inteligente.jpg'
          },
          {
            id: 3,
            name: 'Gaming Laptop',
            description: 'Laptop potente para juegos con GPU RTX 3070, 16GB de RAM y 1TB de SSD para una experiencia de juego definitiva.',
            price: 1499.99,
            stock: false,
            imgUrl: 'https://example.com/images/laptop-juegos.jpg'
          },
          {
            id: 4,
            name: 'Smartwatch',
            description: 'Reloj inteligente resistente al agua con monitor de frecuencia cardíaca, GPS y 7 días de duración de batería.',
            price: 249.99,
            stock: true,
            imgUrl: 'https://example.com/images/reloj-inteligente.jpg'
          },
          {
            id: 5,
            name: 'Bluetooth Speaker',
            description: 'Altavoz Bluetooth portátil con excelente calidad de sonido y hasta 12 horas de reproducción.',
            price: 89.99,
            stock: true,
            imgUrl: 'https://example.com/images/altavoz-bluetooth.jpg'
          }
    ];
    async getProducts() {
        return this.products
    }
}