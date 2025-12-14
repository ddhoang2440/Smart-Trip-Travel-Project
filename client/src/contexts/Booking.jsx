import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";



export const createBooking = createAsyncThunk("/booking/create", async (_data, thunkAPI) => {
   try {
      const { data } = await axios.post("/booking/create", _data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      if (!data.success) {
         return thunkAPI.rejectWithValue(data.message)
      }
      return data
   } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message)
   }
})


   export const getBooking = createAsyncThunk(
   "/booking/get",
   async (_ ,thunkAPI) => {
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


const bookingSlice = createSlice({
   name: "bookingslot",
   initialState: {
      bookings: []
   },
   reducers: {

   },
   extraReducers: (builder) => {
      builder
         .addCase(createBooking.fulfilled, (state, action) => {
         toast.success(action.payload.message)
         })
         .addCase(createBooking.rejected, (state, action) => {
            toast.error(action.payload)
         })
         .addCase(getBooking.fulfilled, (state, action) => {
            state.bookings = action.payload.bookings
            toast.success(action.payload.message)
         })
         .addCase(getBooking.rejected, (state, action) => {
         toast.error(action.payload)
      })
   }
})


export default bookingSlice.reducer