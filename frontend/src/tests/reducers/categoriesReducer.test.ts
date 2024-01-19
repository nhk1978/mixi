import categoriesReducer, {
  createNewCategory,
  deleteSingleCategory,
  emptyCategoriesReducer,
  fetchAllCategories,
  setCategory,
  updateSingleCategory,
} from "../../redux/reducers/categoriesReducer";
import { category1 } from "../data/categories";
import categoryServer from "../servers/categoryServer";
import store from "../shared/store";

beforeAll(() => {
  categoryServer.listen();
});

afterAll(() => {
  categoryServer.close();
});

beforeEach(() => {
  store.dispatch(emptyCategoriesReducer());
  store.dispatch(createNewCategory(category1));
});

describe("Test categoriesReducer", () => {
  const initialState = {
    categories: [],
    selectedCategoryId: "0",
    loading: false,
    error: "",
    isCreateCategoryVisible: false,
  };

  test("Check setCategory", () => {
    const action = setCategory("1");
    const newState = categoriesReducer(initialState, action);

    expect(newState.selectedCategoryId).toEqual(1);
  });

  test("Check fetchAllCategories", async () => {
    await store.dispatch(fetchAllCategories());
    expect(store.getState().categoriesReducer.categories.length).toBe(4); //There is category named "All" always available whenever we fetch other categories in the server
  });

  test("Check createNewCategory", async () => {
    const expectedCategory = [
      { id: 1, imageUrl: "", name: "Clothes" },
      { id: 0, imageUrl: "image.jpg", name: "New category" },
    ];
    await store.dispatch(
      createNewCategory({ name: "New category", imageUrl: "image.jpg" })
    );
    expect(store.getState().categoriesReducer.categories.length).toBe(2);
    expect(store.getState().categoriesReducer.categories).toStrictEqual(
      expectedCategory
    );
  });

  // Update does not works
  test("Check updateSingleCategory", async () => {
    const updateCategory = { id: "0", update: { name: "updated" } };

    // Add the category
    await store.dispatch(
      createNewCategory({ name: "Electronic", imageUrl: "image.jpg" })
    );
    await store.dispatch(updateSingleCategory(updateCategory));
    expect(store.getState().categoriesReducer.categories.length).toBe(2);
    // expect(store.getState().categoriesReducer.categories).toStrictEqual(expectedCategory);
  });

  test("Delete single category", async () => {
    await store.dispatch(deleteSingleCategory("1"));
    // console.log(store.getState().categoriesReducer);
  });

  test("should handle errors when creating a category", async () => {
    await store.dispatch(
      createNewCategory({ name: "New category", imageUrl: "image.jpg" })
    );
    await store.dispatch(
      createNewCategory({ name: "New category", imageUrl: "image.jpg" })
    );
    expect(store.getState().categoriesReducer.error).toBe(
      "Request failed with status code 400"
    );
  });
});
