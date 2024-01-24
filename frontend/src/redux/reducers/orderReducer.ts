import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
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
      
      localStorage.setItem('orderId', createOrderResponse.data.id);

      console.log("createor orderId: " + createOrderResponse.data.id);
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
          state.currentOrder = action.payload;
          state.currentStatus = OrderStatus.Pending;
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
          // const orders = state.orders.map((Order) => {
          //   if (Order.id === action.payload.id) {
          //     return { ...Order, ...action.payload };
          //   }
          //   return Order;
          // });
          // state.orders = orders;
          state.currentStatus = OrderStatus.AwaitingPayment;
        }
        state.loading = false;
      })
      .addCase(updateConfirmOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateConfirmOrder.rejected, (state) => {
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

        state.currentOrder = undefined;
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
