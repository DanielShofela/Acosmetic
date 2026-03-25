export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string[];
  benefits: string[];
  image: string;
  stock: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  shippingAddress: string;
  phoneNumber: string;
}
