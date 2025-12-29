import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const signin = createAsyncThunk(
  "/auth/signin",
  async ({ email, password }, thunkAPI) => {
    try {
      const { data } = await axios.post("/auth/signin", { email, password });

      if (!data.success) {
        return thunkAPI.rejectWithValue(data.message);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const loginWithGoogle = createAsyncThunk(
  "/auth/google",
  async ({ accessToken }, thunkAPI) => {
    try {
      const { data } = await axios.post("/auth/google", { accessToken });

      if (!data.success) {
        return thunkAPI.rejectWithValue(data.message);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const signup = createAsyncThunk(
  "/auth/signup",
  async ({ email, password, username }, thunkAPI) => {
    try {
      const { data } = await axios.post("/auth/signup", {
        username,
        email,
        password,
      });

      if (!data.success) {
        return thunkAPI.rejectWithValue("Error! :", data.message);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Error! :", error.message);
    }
  }
);

export const profile = createAsyncThunk(
  "/auth/profile",
  async (profile, thunkAPI) => {
    try {
      if (profile.get("password").length < 8 && profile.get("password" !== 0)) {
        return thunkAPI.rejectWithValue("Password must have more than 8 word");
      }
      if (
        (profile.get("contact").length !== 10 ||
          isNaN(profile.get("contact"))) &&
        profile.get("contact").length !== 0
      ) {
        return thunkAPI.rejectWithValue(
          "Contact number must have 10 word and full of numbers !"
        );
      }
      const { data } = await axios.post("/auth/profile", profile, {
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

export const authCheck = createAsyncThunk("auth/check", async (thunkAPI) => {
  try {
    const { data } = await axios.get("/auth/check", {
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
});

export const deleteAccount = createAsyncThunk(
  "auth/delete",
  async (thunkAPI) => {
    try {
      const { data } = await axios.get("/auth/delete", {
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
export const getUserById = createAsyncThunk(
  "auth/get",
  async (userId, thunkAPI) => {
    try {
      const { data } = await axios.get(`/auth/get/${userId}`);
      if (!data.success) {
        return thunkAPI.rejectWithValue(data.message);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    users: {},
    islogin: false,
    username: "",
    email: "",
    allergy: [],
    status: "idle",
    error: null,
    image: "",
    contact: "",
    location: null,
  },
  reducers: {
    signout: (state) => {
      state.islogin = false;
      state.username = "";
      state.email = "";
      state.allergy = [];
      localStorage.removeItem("token");
      toast.success("SignOut successfully !");
    },
    setLocation: (state, action) => {
      state.location = action.payload;
      console.log(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signin.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.status = "succeed";
        state.islogin = true;
        state.username = action.payload.user.username;
        state.email = action.payload.user.email;
        state.contact = action.payload.contact;
        state.allergy = action.payload.user.allergy;
        state.image = action.payload.user.image;
        localStorage.setItem("token", action.payload.token);
        toast.success(action.payload.message);
      })
      .addCase(signin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(signup.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = "succeed";
        state.islogin = true;
        state.username = action.payload.user.username;
        state.email = action.payload.user.email;
        state.contact = action.payload.contact;
        state.allergy = action.payload.user.allergy;
        localStorage.setItem("token", action.payload.token);
        state.image = action.payload.user.image;
        toast.success(action.payload.message);
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(profile.pending, (state) => {
        (state.status = "loading"), (state.error = "");
      })
      .addCase(profile.fulfilled, (state, action) => {
        state.username = action.payload.user.username;
        state.allergy = action.payload.user.allergy;
        state.image = action.payload.user.image;
        state.status = "succeed";
        toast.success(action.payload.message);
      })
      .addCase(profile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(state.error);
      })
      .addCase(authCheck.pending, (state) => {
        (state.status = "loading"), (state.error = "");
      })
      .addCase(authCheck.fulfilled, (state, action) => {
        state.status = "succeed";
        state.islogin = true;
        state.email = action.payload.user.email;
        state.username = action.payload.user.username;
        state.image = action.payload.user.image;
        state.allergy = action.payload.user.allergy;
        toast.success(action.payload.message);
      })
      .addCase(authCheck.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(deleteAccount.pending, (state) => {
        (state.status = "loading"), (state.error = "");
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.status = "succeed";
        localStorage.removeItem("token");
        state.email = "";
        state.username = "";
        state.allergy = [];
        state.image = "";
        state.islogin = false;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.status = "succeed";
        state.islogin = true;
        state.username = action.payload.user.username;
        state.email = action.payload.user.email;
        state.contact = action.payload.contact;
        state.allergy = action.payload.user.allergy;
        state.image = action.payload.user.image;
        localStorage.setItem("token", action.payload.token);
        toast.success(action.payload.message);
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.status = "succeed";
        if (action.payload.user && action.payload.user._id) {
          state.users[action.payload.user._id] = action.payload.user;
        }
        toast.success(action.payload.message);
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { signout, setLocation } = AuthSlice.actions;

export default AuthSlice.reducer;
