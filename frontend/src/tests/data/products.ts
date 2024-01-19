import { NewProduct } from "../../types/NewProduct";
import { Product } from "../../types/Product";
import { category1, category2, category3 } from "./categories";

const product1: Product = {
  id: "1",
  title: "A  product",
  price: 100,
  description: "product 1",
  imageUrl: "",
  category: category1,
};

const product2: Product = {
  id: "2",
  title: "B  product",
  price: 300,
  description: "product 2",
  imageUrl: "",
  category: category2,
};

const product3: Product = {
  id: "3",
  title: "C  product",
  price: 200,
  description: "product 3",
  imageUrl: "",
  category: category3,
};

const product4: Product = {
  id: "4",
  title: "D  product",
  price: 50,
  description: "product 4",
  imageUrl: "",
  category: category1,
};

const newProduct: NewProduct = {
  title: "E product",
  price: 500,
  description: "new product",
  imageUrl: "",
  categoryId: "3",
  inventory: 100
};

const invalidProduct: NewProduct = {
  title: "E product",
  price: 0,
  description: "new product",
  imageUrl: "",
  categoryId: "5",
  inventory: 100
};

export { product1, product2, product3, product4, newProduct, invalidProduct };
