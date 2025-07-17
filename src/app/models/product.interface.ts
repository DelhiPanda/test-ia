export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CreateProductDto {
  name: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  isActive?: boolean;
}
