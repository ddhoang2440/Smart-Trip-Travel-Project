import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const createRestaurant = createAsyncThunk(
  "/restaurant/create",
  async (_data, thunkAPI) => {
    try {
      const { data } = await axios.post("restaurant/create", _data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!data.success) {
        return thunkAPI.rejectWithValue(data.message);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getAllRestaurant = createAsyncThunk(
  "/restaurant/getall",
  async (_data, thunkAPI) => {
    try {
      const { data } = await axios.post("/restaurant/getall", _data);
      if (!data.success) {
        return thunkAPI.rejectWithValue(data.message);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getUserRestaurant = createAsyncThunk(
  "/restaurant/user",
  async (_data, thunkAPI) => {
    try {
      const { data } = await axios.get("/restaurant/user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!data.success) {
        return thunkAPI.rejectWithValue(data.message);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const resSlice = createSlice({
  name: "restaurant",
  initialState: {
    userRestaurant: [],
    restaurants: [],
    restaurantsById: [],
    currentRestaurant: {
      slot_id: [],
    },
    status: "idle",
    popularRestaurant: [],
  },
  reducers: {
    setCurrent: (state, action) => {
      state.currentRestaurant = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRestaurant.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createRestaurant.fulfilled, (state, action) => {
        toast.success(action.payload.message);
      })
      .addCase(createRestaurant.rejected, (state, action) => {
        toast.error(action.payload);
      })
      .addCase(getAllRestaurant.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllRestaurant.fulfilled, (state, action) => {
        state.status = "succeed";
        state.restaurants = action.payload.restaurants;
        state.popularRestaurant = state.restaurants.slice(0, 20);
        action.payload.restaurants.forEach((item) => {
          state.restaurantsById[item._id] = item;
        });
        console.log(action.payload.restaurants);
        toast.success(action.payload.message);
      })
      .addCase(getAllRestaurant.rejected, (state, action) => {
        state.status = "failed";
        toast.error(action.payload);
      })
      .addCase(getUserRestaurant.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserRestaurant.fulfilled, (state, action) => {
        state.status = "succeed";
        state.userRestaurant = action.payload.restaurant;
        toast.success(action.payload.message);
      })
      .addCase(getUserRestaurant.rejected, (state, action) => {
        toast.error(action.payload);
      });
  },
});

export const { setCurrent } = resSlice.actions;

export default resSlice.reducer;
