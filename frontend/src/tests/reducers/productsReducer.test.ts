import {
  createNewProduct,
  deleteSingleProduct,
  fetchAllProducts,
} from "../../redux/reducers/productsReducer";
import { NewProduct } from "../../types/NewProduct";
import productServer from "../servers/productServer";
import store from "../shared/store";

const deletedProductId = "1";

beforeAll(() => {
  productServer.listen();
});

afterAll(() => {
  productServer.close();
});

describe("Test productsReducer", () => {
  test("Check initial state", () => {
    expect(store.getState().productsReducer).toEqual({
      loading: false,
      filteredProducts: [],
      error: "",
      products: [],
    });
  });

  test("Check fetchAllProducts", async () => {
    await store.dispatch(fetchAllProducts());
    expect(store.getState().productsReducer.products.length).toBe(4);
  });

  test("Check createNewProduct", async () => {
    const product2: NewProduct = {
      title: "new product",
      price: 300,
      description: "new pro",
      imageUrl: "image.jpg",
      categoryId: "2",
      inventory: 100
    };

    await store.dispatch(fetchAllProducts());
    await store.dispatch(createNewProduct(product2));
    
    expect(store.getState().productsReducer.products.length).toBe(5);
  });

  test("Check deleteSingleProduct", async () => {
    await store.dispatch(fetchAllProducts());
    await store.dispatch(deleteSingleProduct(deletedProductId));

    const products = store.getState().productsReducer.products;

  expect(products.length).toBe(3);
  expect(products.map((product) => product.id)).not.toContain(deletedProductId);
  })
});
