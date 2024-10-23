import { Injectable } from "@nestjs/common";
import { Product } from "./products.interface";

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
  async getProducts(pageNumber: number, limitNumber: number) {
    return await this.products
  };

  async getById(id: number): Promise<Product | undefined> {
    return this.products.find(product => product.id === id);
  };

  async addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    const id = this.products.length + 1;
    const newProduct = { id, ...productData };
    this.products.push(newProduct);
    return newProduct;
  };

  async updateProduct(id: number, productData: Omit<Product, "id">): Promise<Product | null> {
    const productId = Number(id);
    const product = await this.getById(productId);

  return product 
    ? (this.products[this.products.indexOf(product)] = { ...product, ...productData },
       console.log('Updated product:', this.products[this.products.indexOf(product)]),
       this.products[this.products.indexOf(product)])
    : (console.log(`Product with id ${productId} not found`), null);
}

  async deleteProduct(id: number): Promise<Product | null> {
    const productId = Number(id);
    const product = await this.products.find(p => p.id === productId);
    
    return product
    ? (this.products.splice(this.products.indexOf(product), 1), 
    console.log('Product deleted:', product), product)
    : (console.log(`Product with id ${id} not found`), null);
  }

};