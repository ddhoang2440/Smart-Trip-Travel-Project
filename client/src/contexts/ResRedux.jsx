import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const createRestaurant = createAsyncThunk(
  "product/create",
  async (formData, thunkAPI) => {
    try {
      const { data } = await axios.post("/product/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!data.success) {
        return thunkAPI.rejectWithValue(data.message);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const getAllRestaurant = createAsyncThunk(
  "product/getall",
  async ({ page, limit }, thunkAPI) => {
    try {
      const { data } = await axios.get(`/product/?page=${page}&limit=${limit}`);

      if (!data.success) {
        return thunkAPI.rejectWithValue(data.message);
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const fetchRestaurants = createAsyncThunk(
  "restaurant/fetchRestaurants",
  async (
    // {
    //   search,
    //   sort_by,
    //   page,
    //   limit,
    //   lat = null,
    //   lng = null,
    //   type = null,
    //   min_price = null,
    //   max_price = null,
    // } = {},
    _data,
    { rejectWithValue }
  ) => {
    try {
      // const params = new URLSearchParams({
      //   keyword: search,
      //   sort_by,
      //   page: page.toString(),
      //   limit: limit.toString(),
      //   ...(lat && { lat: lat.toString() }),
      //   ...(lng && { lng: lng.toString() }),
      //   ...(type && { type }),
      //   ...(min_price !== null && { min_price: min_price.toString() }),
      //   ...(max_price !== null && { max_price: max_price.toString() }),
      // });

      // const response = await axios.get(`/product?${params}`);
      const response = await axios.get("/product", {
        params: _data,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Server error");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getUserRestaurant = createAsyncThunk(
  "/product/user",
  async (_data, thunkAPI) => {
    try {
      const { data } = await axios.get("/product/user", {
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
// export const searchDish = createAsyncThunk(
//   "get/dish",
//   async (_data, thunkAPI) => {
//     try {
//       const { data } = await axios.get("/product", {
//         params: _data,
//       });
//       if (!data.success) {
//         return thunkAPI.rejectWithValue(data.message);
//       }
//       return data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );
export const resSlice = createSlice({
  name: "restaurant",
  initialState: {
    userRestaurant: [],
    restaurants: [],
    searchResult: {},
    currentRestaurant: {},
    status: "idle",
    popularRestaurant: [],
    //pagination
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 1,
    },
    //
    total_dishes: 0,
    total_restaurants: 0,
    sort_by: "rating",
    currentSort: "rating",
    hasMore: true,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrent: (state, action) => {
      state.currentRestaurant = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    setSortBy: (state, action) => {
      state.sort_by = action.payload;
      state.currentSort = action.payload;
      state.page = 1;
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
        state.popularRestaurant = state.restaurants.slice(0, 4);
        state.pagination = action.payload.pagination;
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
        console.log(action.payload.restaurant);
        toast.success(action.payload.message);
      })
      .addCase(getUserRestaurant.rejected, (state, action) => {
        toast.error(action.payload);
      })
      // .addCase(searchDish.pending, (state) => {
      //   state.status = "loading";
      // })
      // .addCase(searchDish.fulfilled, (state, action) => {
      //   state.status = "succeed";
      //   state.searchResult = action.payload;
      //   // console.log(action.payload.restaurants);
      //   toast.success(action.payload.message);
      // })
      // .addCase(searchDish.rejected, (state, action) => {
      //   toast.error(action.payload);
      // })
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.pagination = action.payload.pagination;
        state.restaurants = action.payload.restaurants;
        state.currentSort = action.payload.sort_by;
        if (action.payload.total_dishes) {
          state.total_dishes = action.payload.total_dishes;
        }
        if (action.payload.total_restaurants) {
          state.total_restaurants = action.payload.total_restaurants;
        }
        toast.success(action.payload.message);
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrent, setFilters, setSortBy } = resSlice.actions;

export default resSlice.reducer;
