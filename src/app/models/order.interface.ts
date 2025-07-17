export interface OrderItemDto {
  itemId: string;
  quantity: number;
}

export interface CreateOrderDto {
  items: OrderItemDto[];
  customerName?: string;
  customerEmail?: string;
  shippingAddress?: string;
}

export interface OrderItem {
  itemId: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
} 