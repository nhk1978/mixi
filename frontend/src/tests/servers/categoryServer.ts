import { rest } from "msw";
import { setupServer } from "msw/node";

import { category1, category2, category3 } from "../data/categories";
import { Category } from "../../types/Category";
import store from "../shared/store";

const baseUrl = "https://api.escuelajs.co/api/v1/categories";

const categoryServer = setupServer(
  rest.get(baseUrl, (req, res, ctx) => {
    return res(ctx.json([category1, category2, category3]));
  }),

  rest.post(baseUrl, async (req, res, ctx) => {
    const newCategory = (await req.json()) as Omit<Category, "id">;
    const error: string[] = [];
    let category: Category | null = null;

    const categories = store.getState().categoriesReducer.categories;

    if (
      categories.filter(
        (category) =>
          category.name.toLowerCase() === newCategory.name.toLowerCase()
      ).length > 0
    ) {
      error.push("category must be unique");
    } else if (typeof newCategory.imageUrl !== "string") {
      error.push("category's image url must be a string");
    } else {
      category = newCategory;
    }

    if (error.length > 0) {
      return res(
        ctx.status(400),
        ctx.json({
          statusCode: 400,
          message: error,
          error: "Bad Request",
        })
      );
    }
    return res(ctx.status(201), ctx.json(category));
  })
);

export default categoryServer;
