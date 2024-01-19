import { configureStore } from "@reduxjs/toolkit";

import productsReducer from "../redux/reducers/productsReducer";
import reviewReducer from "./reducers/reviewReducer";
import cartReducer from "./reducers/cartReducer";
import usersReducer from "./reducers/usersReducer";
import categoriesReducer from "./reducers/categoriesReducer";
import ordersReducer from "./reducers/orderReducer";

const store = configureStore({
  reducer: {
    products: productsReducer,
    reviews: reviewReducer,
    categories: categoriesReducer,
    cart: cartReducer,
    users: usersReducer,
    orders: ordersReducer
  },
});

export type GlobalState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
