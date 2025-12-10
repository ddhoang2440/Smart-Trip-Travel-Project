import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const getAuthToken = () => {
  return localStorage.getItem("accessToken") || "";
};

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
});

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const sendMessageToAI = createAsyncThunk(
  "chat/sendMessage",
  async (message, thunkAPI) => {
    try {
      const { data } = await api.post(
        "/chatbot/analyze",
        {
          message,
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("AI Response:", data);

      if (data.success) {
        if (data.type === "restaurant-list" && data.restaurants) {
          return {
            type: "restaurant-list",
            data: data.restaurants,
            text:
              data.message ||
              `Tìm thấy ${data.restaurants.length} nhà hàng phù hợp`,
          };
        }
        if (data.type === "food-list") {
          console.log("Food list data received:", data);
          return {
            type: "food-list",
            data: data.data || [], // Mảng các món ăn
            groupedData: data.groupedData || [], // Dữ liệu nhóm theo nhà hàng
            stats: data.stats || {}, // Thống kê
            metadata: data.metadata || {}, // Metadata
            text:
              data.text ||
              data.message ||
              `Tìm thấy ${data.data?.length || 0} món ăn phù hợp`,
          };
        }
        return {
          type: "text",
          text: data.reply || data.message || "Đã xử lý yêu cầu của bạn",
        };
      }

      throw new Error(data.message || "Lỗi xử lý yêu cầu");
    } catch (error) {
      console.error("Chat error:", error);

      if (error.response?.status === 401) {
        thunkAPI.dispatch({ type: "auth/logout" });
        return thunkAPI.rejectWithValue("Vui lòng đăng nhập lại");
      }

      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Đã có lỗi xảy ra, vui lòng thử lại"
      );
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [
      {
        sender: "ai",
        type: "text",
        text: "Xin chào! Tôi là trợ lý ẩm thực. Tôi có thể giúp bạn tìm nhà hàng, đặt bàn, so sánh món ăn và nhiều hơn thế!",
      },
    ],
    loading: false,
    error: null,
    sessionId: null,
    context: {
      lastIntent: null,
      entities: {},
      conversationHistory: [],
    },
  },
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({
        sender: "user",
        type: "text",
        text: action.payload,
        timestamp: new Date().toISOString(),
      });
      state.context.conversationHistory.push({
        role: "user",
        content: action.payload,
        timestamp: new Date().toISOString(),
      });
    },

    addRestaurantList: (state, action) => {
      state.messages.push({
        sender: "ai",
        type: "restaurant-list",
        data: action.payload.restaurants,
        text: action.payload.message || "Danh sách nhà hàng",
        timestamp: new Date().toISOString(),
      });
    },
    addFoodList: (state, action) => {
      state.messages.push({
        sender: "ai",
        type: "food-list",
        data: action.payload.data || [],
        groupedData: action.payload.groupedData || [],
        stats: action.payload.stats || {},
        metadata: action.payload.metadata || {},
        text:
          action.payload.message || action.payload.text || "Danh sách món ăn",
        timestamp: new Date().toISOString(),
      });
    },

    clearChat: (state) => {
      state.messages = [
        {
          sender: "ai",
          type: "text",
          text: "Xin chào! Tôi là trợ lý ẩm thực. Tôi có thể giúp bạn tìm nhà hàng, đặt bàn, so sánh món ăn và nhiều hơn thế!",
        },
      ];
      state.context = {
        lastIntent: null,
        entities: {},
        conversationHistory: [],
      };
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    updateContext: (state, action) => {
      state.context = {
        ...state.context,
        ...action.payload,
      };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(sendMessageToAI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(sendMessageToAI.fulfilled, (state, action) => {
        state.loading = false;

        const newMessage = {
          sender: "ai",
          timestamp: new Date().toISOString(),
          ...action.payload,
        };

        state.messages.push(newMessage);

        state.context.conversationHistory.push({
          role: "assistant",
          content: action.payload.text || "",
          data: action.payload.data,
          timestamp: new Date().toISOString(),
        });

        if (action.meta?.arg?.intent) {
          state.context.lastIntent = action.meta.arg.intent;
        }
      })

      .addCase(sendMessageToAI.rejected, (state, action) => {
        state.loading = false;

        state.messages.push({
          sender: "ai",
          type: "error",
          text:
            action.payload ||
            "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.",
          timestamp: new Date().toISOString(),
        });

        state.error = action.payload;
      });
  },
});

export const {
  addUserMessage,
  addRestaurantList,
  addFoodList,
  clearChat,
  setError,
  updateContext,
} = chatSlice.actions;

export default chatSlice.reducer;
