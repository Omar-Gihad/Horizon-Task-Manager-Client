import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; // Assuming you're using axios for API calls
import Cookies from "js-cookie";

const initialState = {
  user: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  isSidebarOpen: false,
  isLoading: false,
  error: null,
};

// Async thunk for login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://server-horizon.vercel.app/api/user/login",
        credentials
      ); // Replace with your login API endpoint
      const data = response?.data;

      if (!data) {
        throw new Error("No data returned from API");
      }

      return data; // Return the response data (e.g., user info, token)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk for logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Make the logout API request
      await axios.post("https://server-horizon.vercel.app/api/user/logout");

      // Clear the token cookie
      Cookies.remove("token");

      // Return a success message or null
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk for changing password
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwords, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token"); // Get the token from cookies
      const response = await axios.put(
        "https://server-horizon.vercel.app/api/user/change-password",
        passwords,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the headers
          },
        }
      );
      return response.data; // Return the success response from the server
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logoutSuccess: (state) => {
      state.user = null;
      localStorage.removeItem("userInfo");
      Cookies.remove("token");
    },
    setOpenSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handling login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        localStorage.setItem("userInfo", JSON.stringify(action.payload));

        const token = action.payload.data.token;
        Cookies.set("token", token); // Store the token in a cookie
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed. Please try again.";
      })
      
      // Handling logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        localStorage.removeItem("userInfo");
        Cookies.remove("token");
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Logout failed. Please try again.";
      })

      // Handling password change
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        // Optionally, handle the response from the server when password is changed successfully
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Password change failed. Please try again.";
      });
  },
});

export const { setCredentials, logoutSuccess, setOpenSidebar } = authSlice.actions;

export default authSlice.reducer;