// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// export const SearchDish = createAsyncThunk(
//   "get/dish",
//   async (_data, thunkAPI) => {
//     try {
//       const { data } = await axios.get("/search/dish", {
//         params: _data,
//       });
//       return data;
//     } catch (error) {
//       thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );
// const SearchSlice = createSlice({
//   name: "search",
//   initialState: {
//     restaurants: [],
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addCase(SearchDish.fulfilled, (state, action) => {
//       state.restaurants = action.payload.restaurants;
//     });
//   },
// });
// export default SearchSlice.reducer;
