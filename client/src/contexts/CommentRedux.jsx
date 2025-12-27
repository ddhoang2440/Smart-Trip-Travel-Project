import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const createComment = createAsyncThunk(
  "/comment/create",
  async (_data, thunkAPI) => {
    try {
      const { data } = await axios.post("/comment/create", _data, {
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

export const getComment = createAsyncThunk(
  "/comment/get",
  async (restaurantId, thunkAPI) => {
    try {
      const { data } = await axios.get(
        "/comment/get",
        { params:  restaurantId ,
        
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        
      }
      );
      if (!data.success) {
        return thunkAPI.rejectWithValue(data.message);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const commentSlice = createSlice({
  name: "comment",
  initialState: {
    comment: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (build) => {
    build
      .addCase(createComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        toast.success(action.payload.message);
      })
      .addCase(createComment.rejected, (state, action) => {
        toast.error(action.payload);
      })
      .addCase(getComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(getComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comment = action.payload.comment;
        toast.success(action.payload.message);
      })
      .addCase(getComment.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      });
  },
});

export default commentSlice.reducer;
