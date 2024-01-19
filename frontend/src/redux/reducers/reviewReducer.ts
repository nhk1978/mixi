import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { NewReview, Review } from "../../types/Review";
import axios, { AxiosError } from "axios";

const baseUrl = `${process.env.REACT_APP_PROXY}/api/v1/reviews`;

const initialState: {
  reviews: Review[],
  loading: boolean;
  error: string;
} = {
  reviews: [],
  loading: false,
  error: ""
};

export const fetchAllReviews = createAsyncThunk(
  "fetchAllReviews",
  async () => {
    try {
      const result = await axios.get<Review[]>(baseUrl);
      return result.data;
    } catch (e) {
      const error = e as AxiosError;
      return error;
    }
  }
);

export const createNewReview = createAsyncThunk(
  "createNewReview",
  async (review: NewReview) => {
    try {
      const token = localStorage.getItem('token');
      const createReviewResponse = await axios.post(baseUrl, review, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return createReviewResponse.data;
    } catch (e) {
      const error = e as AxiosError;
      return error;
    }  
  }
)

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    
  },
  extraReducers: (build) => {
    build.addCase(fetchAllReviews.fulfilled, (state, action) => {
      if (action.payload instanceof AxiosError) {
        state.error = action.payload.message;
      } else {
        state.reviews = action.payload;
      }
      state.loading = false;  
    })
    .addCase(fetchAllReviews.pending, (state, action) => {
      state.loading = true;
    })
    .addCase(fetchAllReviews.rejected, (state, action) => {
      state.error = "Cannot fetch data";
    })
    .addCase(createNewReview.fulfilled, (state, action) => {
      if (action.payload instanceof AxiosError) {
        state.error = action.payload.message;
      } else {
        state.reviews.push(action.payload);
      }
      state.loading = false;
    })
    .addCase(createNewReview.pending, (state, action) => {
      state.loading = true;
    })
    .addCase(createNewReview.rejected, (state, action) => {
      state.error = "Cannot create new category";
    })
  }
});

const reviewReducer = reviewSlice.reducer;

// export const { appendReview } = reviewSlice.actions;
export default reviewReducer;
