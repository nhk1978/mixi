import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
<<<<<<< HEAD
import { Order, OrderUpdate } from "../../types/Order";

const baseUrl = `${process.env.REACT_APP_PROXY}/api/v1/orders`;

const initialState: {
  orders: Order[];
  loading: boolean;
  error: string;
} = {
=======
import { Order, OrderStatus, OrderUpdate } from "../../types/Order";

const baseUrl = `${process.env.REACT_APP_PROXY}/api/v1/orders`;


interface OrderReducer {
  orders: Order[];
  currentOrder?: Order;
  currentStatus?: OrderStatus;
  loading: boolean;
  error: string;
}

const initialState: OrderReducer= {
>>>>>>> 16fe228 (re-strcuture)
  orders: [],
  loading: false,
  error: ""
};

export const fetchAllOrders = createAsyncThunk(
  "fetchAllOrders",
  async () => {
    try {
      const token = localStorage.getItem('token');
      const result = await axios.get<Order[]>(baseUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return result.data;
    } catch (e) {
      const error = e as AxiosError;
      return error;
    }
  }
);

export const createNewOrder = createAsyncThunk(
  "createNewOrder",
  async (Order: Omit<Order, "id" | "userId">) => {
    try {
      const token = localStorage.getItem('token');
      const createOrderResponse = await axios.post(baseUrl, Order, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
<<<<<<< HEAD
=======
      
      localStorage.setItem('orderId', createOrderResponse.data.id);

      console.log("createor orderId: " + createOrderResponse.data.id);
>>>>>>> 16fe228 (re-strcuture)
      return createOrderResponse.data;
    } catch (e) {
      const error = e as AxiosError;
      return error;
    }
  }
);

export const updateConfirmOrder = createAsyncThunk(
  "updateConfirmOrder",
  async (updatedOrder: OrderUpdate) => {
    try {
<<<<<<< HEAD
      const result = await axios.patch(
        `${baseUrl}/${updatedOrder.id}/confirm`,
        updatedOrder.update
=======
      const token = localStorage.getItem('token');
      const result = await axios.patch(
        `${baseUrl}/${updatedOrder.id}/order-confirmation`,
        updatedOrder.update,{headers: {
          Authorization: `Bearer ${token}`,
        }}
      );
      return result.data;
    } catch (e) {
      const error = e as AxiosError;
      return error;
    }
  }
);

export const updatePaymentOrder = createAsyncThunk(
  "updatePaymentOrder",
  async (updatedOrder: OrderUpdate) => {
    try {
      const token = localStorage.getItem('token');
      const result = await axios.patch(
        `${baseUrl}/${updatedOrder.id}/payment-process`,
        updatedOrder.update,{headers: {
          Authorization: `Bearer ${token}`,
        }}
>>>>>>> 16fe228 (re-strcuture)
      );
      return result.data;
    } catch (e) {
      const error = e as AxiosError;
      return error;
    }
  }
);

export const deleteSingleOrder = createAsyncThunk(
  "deleteSingleOrder",
  async (OrderId: string) => {
    try {
      const result = await axios.delete(`${baseUrl}/${OrderId}`);
      return { response: result.data, id: OrderId };
    } catch (e) {
      const error = e as AxiosError;
      return error;
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    emptyOrdersReducer: (state) => {
      state.orders = [];
    },
  },
  extraReducers: (build) => {
    build
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        if (action.payload instanceof AxiosError) {
          state.error = action.payload.message;
        } else {
          state.orders = action.payload;
        }
        state.loading = false;
      })
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.rejected, (state) => {
        state.error = "Cannot fetch data";
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        if (action.payload instanceof AxiosError) {
          state.error = action.payload.message;
        } else {
          state.orders.push(action.payload);
<<<<<<< HEAD
=======
          state.currentOrder = action.payload;
          state.currentStatus = OrderStatus.Pending;
>>>>>>> 16fe228 (re-strcuture)
        }
        state.loading = false;
      })
      .addCase(createNewOrder.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.error = "Cannot create new Order";
      })
      .addCase(updateConfirmOrder.fulfilled, (state, action) => {
        if (action.payload instanceof AxiosError) {
          state.error = action.payload.message;
        } else {
<<<<<<< HEAD
          const products = state.orders.map((Order) => {
            if (Order.id === action.payload.id) {
              return { ...Order, ...action.payload };
            }
            return Order;
          });
          state.orders = products;
=======
          // const orders = state.orders.map((Order) => {
          //   if (Order.id === action.payload.id) {
          //     return { ...Order, ...action.payload };
          //   }
          //   return Order;
          // });
          // state.orders = orders;
          state.currentStatus = OrderStatus.AwaitingPayment;
>>>>>>> 16fe228 (re-strcuture)
        }
        state.loading = false;
      })
      .addCase(updateConfirmOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateConfirmOrder.rejected, (state) => {
<<<<<<< HEAD
        state.error = "Cannot update product";
=======
        state.error = "Cannot update order";
      })
      .addCase(updatePaymentOrder.fulfilled, (state, action) => {
        if (action.payload instanceof AxiosError) {
          state.error = action.payload.message;
        } else {
          // const orders = state.orders.map((Order) => {
          //   if (Order.id === action.payload.id) {
          //     return { ...Order, ...action.payload };
          //   }
          //   return Order;
          // });
          // state.orders = orders;
          // state.currentOrder = action.payload;

          state.currentStatus = OrderStatus.AwaitingFulfillment;
        }
        state.loading = false;
      })
      .addCase(updatePaymentOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePaymentOrder.rejected, (state) => {
        state.error = "Cannot update order";
>>>>>>> 16fe228 (re-strcuture)
      })
      .addCase(deleteSingleOrder.fulfilled, (state, action) => {
        if (action.payload instanceof AxiosError) {
          state.error = action.payload.message;
        } else {
          const deletedOrderId = action.payload.id;

          state.orders = state.orders.filter(
            (Order) => Order.id !== deletedOrderId
          );
        }
<<<<<<< HEAD
=======

        state.currentOrder = undefined;
>>>>>>> 16fe228 (re-strcuture)
        state.loading = false;
      })
      .addCase(deleteSingleOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSingleOrder.rejected, (state) => {
        state.error = "Cannot update product";
      });
  },
});

export const { emptyOrdersReducer } = ordersSlice.actions;

const ordersReducer = ordersSlice.reducer;

export default ordersReducer;
