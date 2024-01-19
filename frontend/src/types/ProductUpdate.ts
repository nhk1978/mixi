export interface ProductUpdate {
  id: string,
  update: {
    title: string;
    price: number;
    description: string;
    imageUrl: string;
    categoryId: string | undefined;
    inventory: number
  }
}
