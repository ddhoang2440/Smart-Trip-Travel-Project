import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// Redux = thư viện quản lý state (dữ liệu) của ứng dụng React.
/*Nó giúp bạn:
quản lý dữ liệu tập trung ở store
chia state theo từng module (menu, user, cart…)
cập nhật state bằng actions
xử lý logic cập nhật trong reducers 
*/
import axios from "axios";
import toast from "react-hot-toast";

export const createMenu = createAsyncThunk(
  "/menu/create",
  async (_data, thunkAPI) => {
    try {
      const { data } = await axios.post("/menu/create", _data, {
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

export const getMenu = createAsyncThunk(
  "/menu/get",
  async (_data, thunkAPI) => {
    try {
      const { data } = await axios.get("/menu/get");
      if (!data.success) {
        return thunkAPI.rejectWithValue(data.message);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getUserMenu = createAsyncThunk(
  "/menu/user",
  async (_data, thunkAPI) => {
    try {
      const { data } = await axios.get("/menu/user", {
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
export const getRestaurantMenu = createAsyncThunk(
  "/menu/restaurant",
  async (restaurantId, thunkAPI) => {
    try {
      const { data } = await axios.get(`/menu/restaurant/${restaurantId}`, {
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
// export const getRestaurantMenu = createAsyncThunk(
//   "menu/getByRestaurant",
//   async (restaurantId, thunkAPI) => {
//     try {
//       const { data } = await axios.get(`/menu/restaurants/${restaurantId}`);

//       if (!data.success) {
//         return thunkAPI.rejectWithValue(data.message);
//       }

//       return data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

/*initialState (state ban đầu)
reducers (hàm cập nhật state)
actions (lệnh để yêu cầu cập nhật)
export reducer để đưa vào global store */
const menuSlice = createSlice({
  name: "menu", // Tên slice → sẽ được gắn vào action type, ví dụ: menu/createMenu/pending
  initialState: {
    loading: false,
    error: "",
    menu: [],
    usermenu: [],
    restaurantmenu: [],
  },
  reducers: {}, // viet code truc tiep vo day la chay dong bo, nghĩa là nó chạy ngay lập tức — không gọi API, không await, không bất đồng bộ.
  // vì dùng async thunk, Async thunk = hàm bất đồng bộ dùng để gọi API trong Redux Toolkit, nhan dien Tạo bằng createAsyncThunk, Bên trong có await, gọi API
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
        console.log(state.restaurantmenu);
        toast.success(action.payload.message);
      })
      .addCase(getRestaurantMenu.rejected, (state, action) => {
        toast.error(action.payload);
      });
  },
});

export default menuSlice.reducer;
