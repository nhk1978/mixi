export interface Review {
  id: string;
  feedback: string;
  productId: string | undefined;
}

export interface NewReview {
  feedback: string;
  productId: string | undefined;
}