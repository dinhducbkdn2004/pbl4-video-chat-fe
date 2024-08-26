import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        accessToken: localStorage.getItem("ACCESS_TOKEN") || null,
        refreshToken: localStorage.getItem("REFRESH_TOKEN") || null,
        isAuthenticated: !!localStorage.getItem("ACCESS_TOKEN"),
        user: null,
    },
    reducers: {
        setCredentials: (state, action) => {
            localStorage.setItem("ACCESS_TOKEN", action.payload.accessToken);
            localStorage.setItem("REFRESH_TOKEN", action.payload.refreshToken);
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            localStorage.removeItem("ACCESS_TOKEN");
            localStorage.removeItem("REFRESH_TOKEN");
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.user = null;
        },
        setProfile: (state, action) => {
            state.user = action.payload;
        },
    },
});
export const authActions = authSlice.actions;
export const authReducers = authSlice.reducer;
