import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import toast from "react-hot-toast";


export const createMenu = createAsyncThunk("/menu/create", async (_data, thunkAPI) => {
    try {
        const { data } = await axios.post("/menu/create", _data, {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
        if(!data.success) {
            return thunkAPI.rejectWithValue(data.message);
        }
        return data;
        
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
})

export const getMenu = createAsyncThunk ("/menu/get", async ( thunkAPI) => {
     try {
        const { data } = await axios.get("/menu/get");
        if(!data.success) {
            return thunkAPI.rejectWithValue(data.message);
        }
        return data;
        
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
})
export const getUserMenu = createAsyncThunk(
  "/menu/user",
  async ( thunkAPI) => {
    try {
      const { data } = await axios.get("/menu/user", {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
      if (!data.success) {
        return thunkAPI.rejectWithValue(data.message);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getRestaurantMenu = createAsyncThunk("/menu/restaurant", async (_data, thunkAPI) => {
  try {
    const { data } = await axios.post("/menu/restaurant", _data);
    if (!data.success) {
      return thunkAPI.rejectWithValue(data.message);
    }
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});


const menuSlice = createSlice({
    name: "menu",
    initialState: {
        loading: false,
        error: "",
        menu: [],
        usermenu: [],
        restaurantmenu: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
          .addCase(createMenu.pending, (state) => {
            state.loading = true;
          })
          .addCase(createMenu.fulfilled, (state, action) => {
            state.loading = false;
            toast.success(action.payload.message);
          })
          .addCase(createMenu.rejected, (state, action) => {
            toast.error(action.payload);
          })
          .addCase(getMenu.pending, (state) => {
            state.loading = true;
          })
          .addCase(getMenu.fulfilled, (state, action) => {
            state.loading = false;
            state.menu = action.payload.menu;
            console.log(action.payload.menu);
            toast.success(action.payload.message);
          })
          .addCase(getMenu.rejected, (state, action) => {
            toast.error(action.payload);
          })
          .addCase(getUserMenu.pending, (state) => {
            state.loading = true;
          })
          .addCase(getUserMenu.fulfilled, (state, action) => {
            state.loading = false;
            state.usermenu = action.payload.usermenu;
            toast.success(action.payload.message);
          })
          .addCase(getUserMenu.rejected, (state, action) => {
            toast.error(action.payload);
          })
           .addCase(getRestaurantMenu.pending, (state) => {
            state.loading = true;
          })
          .addCase(getRestaurantMenu.fulfilled, (state, action) => {
            state.loading = false;
            state.restaurantmenu = action.payload.restaurantmenu;
            toast.success(action.payload.message);
          })
          .addCase(getRestaurantMenu.rejected, (state, action) => {
            toast.error(action.payload);
          });
}})



export default menuSlice.reducer;