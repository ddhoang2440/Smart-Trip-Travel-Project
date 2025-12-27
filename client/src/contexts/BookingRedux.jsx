import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

export const createBooking = createAsyncThunk(
  "/booking/create",
  async (_data, thunkAPI) => {
    try {
      const { data } = await axios.post("/booking/create", _data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!data.success) {
        return thunkAPI.rejectWithValue(data.message);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const getBooking = createAsyncThunk(
  "/booking/get",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get("/booking/get", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!data.success) {
        return thunkAPI.rejectWithValue(data.message);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
export const getBookingById = createAsyncThunk(
  "/booking/getid",
  async (restaurantId, thunkAPI) => {
    try {
      const { data } = await axios.get(`/booking/get/${restaurantId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!data.success) {
        return thunkAPI.rejectWithValue(data.message);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
export const assignTableToBooking = createAsyncThunk(
  "booking/assignTableToBooking",
  async ({ bookingId, tableId }, thunkAPI) => {
    try {
      const { data } = await axios.put(
        `/bookingslots/${bookingId}/assign-table`,
        { tableId }
      );

      if (!data.success) {
        return thunkAPI.rejectWithValue(data.message);
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Có lỗi xảy ra khi sắp bàn"
      );
    }
  }
);
export const updateBookingStatus = createAsyncThunk(
  "booking/update",
  async ({ bookingId, status }, thunkAPI) => {
    try {
      const { data } = await axios.put(`/booking/update/${bookingId}`, {
        status,
      });

      if (!data.success) {
        return thunkAPI.rejectWithValue(data.message);
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Có lỗi xảy ra khi sắp bàn"
      );
    }
  }
);
const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookings: null,
    bookingById: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.fulfilled, (state, action) => {
        toast.success(action.payload.message);
      })
      .addCase(createBooking.rejected, (state, action) => {
        toast.error(action.payload);
      })
      .addCase(getBooking.fulfilled, (state, action) => {
        state.bookings = action.payload.bookings;
        toast.success(action.payload.message);
      })
      .addCase(getBooking.rejected, (state, action) => {
        toast.error(action.payload);
      })
      .addCase(getBookingById.fulfilled, (state, action) => {
        state.bookingById = action.payload.bookingById;
        toast.success(action.payload.message);
      })
      .addCase(getBookingById.rejected, (state, action) => {
        toast.error(action.payload);
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        toast.success(action.payload.message);
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        toast.error(action.payload);
      });
  },
});

export default bookingSlice.reducer;
