import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

import { Category } from "../../types/Category";
import { CategoryUpdate } from "../../types/CategoryUpdate";

const baseUrl = `${process.env.REACT_APP_PROXY}/api/v1/categories`;

const initialState: {
  categories: Category[];
  selectedCategoryId: string;
  loading: boolean;
  error: string;
  isCreateCategoryVisible: boolean;
} = {
  categories: [],
  selectedCategoryId: "0",
  loading: false,
  error: "",
  isCreateCategoryVisible: false,
};

export const fetchAllCategories = createAsyncThunk(
  "fetchAllCategories",
  async () => {
    try {
      const result = await axios.get<Category[]>(baseUrl);
      return result.data;
    } catch (e) {
      const error = e as AxiosError;
      return error;
    }
  }
);

export const createNewCategory = createAsyncThunk(
  "createNewCategory",
  async (category: Omit<Category, "id">) => {
    try {
      const token = localStorage.getItem('token');
      const createCategoryResponse = await axios.post(baseUrl, category, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return createCategoryResponse.data;
    } catch (e) {
      const error = e as AxiosError;
      return error;
    }
  }
);

export const updateSingleCategory = createAsyncThunk(
  "updateSingleCategory",
  async (updatedCategory: CategoryUpdate) => {
    try {
      const token = localStorage.getItem('token');
      const result = await axios.put(
        `${baseUrl}/${updatedCategory.id}`,
        updatedCategory.update, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      return result.data;
    } catch (e) {
      const error = e as AxiosError;
      return error;
    }
  }
);

export const deleteSingleCategory = createAsyncThunk(
  "deleteSingleCategory",
  async (categoryId: string) => {
    try {
      const token = localStorage.getItem('token');
      const result = await axios.delete(`${baseUrl}/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return { response: result.data, id: categoryId };
    } catch (e) {
      const error = e as AxiosError;
      return error;
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategoryId = action.payload;
    },
    emptyCategoriesReducer: (state) => {
      state.categories = [];
    },
  },
  extraReducers: (build) => {
    build
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        if (action.payload instanceof AxiosError) {
          state.error = action.payload.message;
        } else {
          state.categories = [
            {
              id: "0",
              name: "All",
              imageUrl: "",
            },
            ...action.payload,
          ];
        }
        state.loading = false;
      })
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCategories.rejected, (state) => {
        state.error = "Cannot fetch data";
      })
      .addCase(createNewCategory.fulfilled, (state, action) => {
        if (action.payload instanceof AxiosError) {
          state.error = action.payload.message;
        } else {
          state.categories.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(createNewCategory.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createNewCategory.rejected, (state, action) => {
        state.error = "Cannot create new category";
      })
      .addCase(updateSingleCategory.fulfilled, (state, action) => {
        if (action.payload instanceof AxiosError) {
          state.error = action.payload.message;
        } else {
          const products = state.categories.map((category) => {
            if (category.id === action.payload.id) {
              return { ...category, ...action.payload };
            }
            return category;
          });
          state.categories = products;
        }
        state.loading = false;
      })
      .addCase(updateSingleCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSingleCategory.rejected, (state) => {
        state.error = "Cannot update product";
      })
      .addCase(deleteSingleCategory.fulfilled, (state, action) => {
        if (action.payload instanceof AxiosError) {
          state.error = action.payload.message;
        } else {
          const deletedCategoryId = action.payload.id;

          state.categories = state.categories.filter(
            (category) => category.id !== deletedCategoryId
          );
        }
        state.loading = false;
      })
      .addCase(deleteSingleCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSingleCategory.rejected, (state) => {
        state.error = "Cannot update product";
      });
  },
});

export const { setCategory, emptyCategoriesReducer } = categoriesSlice.actions;

const categoriesReducer = categoriesSlice.reducer;

export default categoriesReducer;
