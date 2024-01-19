import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { product1, product2, product3, product4 } from '../data/products';
import { NewProduct } from '../../types/NewProduct';
import { Product } from '../../types/Product';
import categories from '../data/categories';
import store from '../shared/store';
import { ProductUpdate } from '../../types/ProductUpdate';

const baseUrl = 'https://api.escuelajs.co/api/v1/products';

const productServer = setupServer(
  rest.get(baseUrl, (req, res, ctx) => {
    return res(ctx.json([product1, product2, product3, product4]));
  }),

  rest.post(baseUrl, async (req, res, ctx) => {
    const newProduct = (await req.json()) as NewProduct;
    const products = store.getState().productsReducer.products;
    const category = categories.find((c) => c.id === newProduct.categoryId);
    const error: string[] = [];
    let product: Product | null = null;
    if (!(newProduct.price > 0)) {
      error.push('price must be a positive number');
    }

    if (!category) {
      error.push('category does not exist');
    } else {
      product = {
       
        title: newProduct.title,
        price: newProduct.price,
        category: category,
        description: newProduct.description,
        imageUrl: newProduct.imageUrl,
      };
    }
    if (error.length > 0) {
      return res(
        ctx.status(400),
        ctx.json({
          statusCode: 400,
          message: error,
          error: 'Bad Request',
        })
      );
    }
    return res(ctx.status(201), ctx.json(product));
  }),

  rest.delete(baseUrl + '/:id', async (req, res, ctx) => {
    const id =req.params.id;
    let products = store.getState().productsReducer.products;
    products = products.filter((item) => item.id !== id);

    return res(ctx.status(200), ctx.json(products));
  }),

);

export default productServer;
