/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

export const createOrder = createAsyncThunk(
  "/order/create",
  async (_data, thunkAPI) => {
    try {
      const { data } = await axios.post("/order/create", _data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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
export const getOrderByRestaurant = createAsyncThunk(
  "/order/getOrder",
  async (restaurantId, thunkAPI) => {
    try {
      const { data } = await axios.get(`/order/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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
const cartslice = createSlice({
  name: "cart",
  initialState: {
    usercart: [],
    restaurantId: null,
    orders: [],
  },
  reducers: {
    removeProduct: (state, action) => {
      state.usercart.splice(action.payload, 1);
      toast.success("Remove Product");
    },
    increaseQuantity: (state, action) => {
      state.usercart[action.payload].quantity += 1;
    },
    decreaseQuantity: (state, action) => {
      if (state.usercart[action.payload].quantity === 1) {
        state.usercart[action.payload].quantity = 1;
        return;
      }
      state.usercart[action.payload].quantity -= 1;
    },
    changeQuantity: (state, action) => {
      if (action.payload.value < 1) {
        state.usercart[action.payload.idx].quantity = 1;
        return;
      }
      state.usercart[action.payload.idx].quantity = action.payload.value;
    },
    addToCart: (state, action) => {
      const { isVegetarian, image_id, description, type, ...restitem } =
        action.payload;
      toast.success("Add Product");
      console.log(restitem);
      const isExist = state.usercart.find((item) => item._id === restitem._id);
      if (isExist) {
        isExist.quantity += 1;
        return;
      }
      state.usercart.push(restitem);
    },
    resetCart: (state) => {
      state.usercart = [];
      state.restaurantId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderByRestaurant.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getOrderByRestaurant.fulfilled, (state, action) => {
        state.status = "succeed";
        state.orders = action.payload.orders;
        console.log(action.payload.orders);
        toast.success(action.payload.message);
      })
      .addCase(getOrderByRestaurant.rejected, (state, action) => {
        toast.error(action.payload);
      });
  },
});

export const {
  addToCart,
  resetCart,
  removeProduct,
  decreaseQuantity,
  increaseQuantity,
  changeQuantity,
} = cartslice.actions;

export default cartslice.reducer;
