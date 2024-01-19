export interface Product {
  id?: string;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  category?: {
    id?: string;
    name: string;
    imageUrl: string;
  };
  inventory?: number
}
