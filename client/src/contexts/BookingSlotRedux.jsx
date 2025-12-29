import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
export const getBookingSlot = createAsyncThunk(
  "/bookingslots/get",
  async (restaurantId, thunkAPI) => {
    try {
      const { data } = await axios.get(
        "/bookingslots/get",
        {
          params: { restaurantId },
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (!data.success) {
        return thunkAPI.rejectWithValue({ message: data.message });
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error });
    }
  }
);
export const getBookingSlotById = createAsyncThunk(
  "/bookingslots/getid",
  async (id, thunkAPI) => {
    try {
      const { data } = await axios.get(`/bookingslots/getall`);
      if (!data.success) {
        return thunkAPI.rejectWithValue({ message: data.message });
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error });
    }
  }
);
export const createBookingSlot = createAsyncThunk(
  "/bookingslots/create",
  async (_data, thunkAPI) => {
    try {
      const { data } = await axios.post("/bookingslots/create", _data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!data.success) {
        return thunkAPI.rejectWithValue({ message: data.message });
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error });
    }
  }
);
export const updateBookingSlot = createAsyncThunk(
  "/bookingslots/update",
  async ({ id, updateData }, thunkAPI) => {
    try {
      const { data } = await axios.put(
        `/bookingslots/update/${id}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (!data.success) {
        return thunkAPI.rejectWithValue({ message: data.message });
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error });
    }
  }
);
export const deleteBookingSlot = createAsyncThunk(
  "/bookingslots/delete",
  async (id, thunkAPI) => {
    try {
      const { data } = await axios.delete(`/bookingslots/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!data.success) {
        return thunkAPI.rejectWithValue({ message: data.message });
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error });
    }
  }
);

const BookingSlotSlice = createSlice({
  name: "bookingslots",
  initialState: {
    loading: null,
    error: null,
    bookingslots: [],
    bookingslotsById: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBookingSlot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingSlot.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingslots = action.payload.bookingslots;
        toast.success(action.payload.message);
      })
      .addCase(getBookingSlot.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload.message);
      })
      .addCase(getBookingSlotById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingSlotById.fulfilled, (state, action) => {
        state.loading = false;
        // if (action.payload.bookingslot && action.payload.bookingslot._id) {
        //   state.bookingslotsById[action.payload.bookingslot._id] =
        //     action.payload.bookingslot;
        // }
        action.payload.bookingslot.forEach((item) => {
          state.bookingslotsById[item._id] = item;
        });
        toast.success(action.payload.message);
      })
      .addCase(getBookingSlotById.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload.message);
      })
      .addCase(createBookingSlot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookingSlot.fulfilled, (state, action) => {
        state.loading = false;
        toast.success(action.payload.message);
      })
      .addCase(createBookingSlot.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload.message);
      })
      .addCase(updateBookingSlot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingSlot.fulfilled, (state, action) => {
        state.loading = false;
        toast.success(action.payload.message);
      })
      .addCase(updateBookingSlot.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload.message);
      })
      .addCase(deleteBookingSlot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBookingSlot.fulfilled, (state, action) => {
        state.loading = false;
        toast.success(action.payload.message);
      })
      .addCase(deleteBookingSlot.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload.message);
      });
  },
});
export default BookingSlotSlice.reducer;
