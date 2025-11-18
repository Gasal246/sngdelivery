import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../constants/endpoints";

const initialState = {
    userData: null,
    userToken: null,
    orders: null,
};

const applicationSlice = createSlice({
    name: "application",
    initialState,
    reducers: {
        loadUserData: (state, action) => {
            state.userData = action.payload;
        },  
        loadUserToken: (state, action) => {
            state.userToken = action.payload;
        },
    },
    extraReducers: (builder) => { 
        builder.addCase(fetchDeliveryOrders.fulfilled, (state, action) => {
            state.orders = action.payload;
        });
    }
});

export const fetchDeliveryOrders = createAsyncThunk(
    'application/fetchDeliveryOrders', 
    async (payload) => {
        const res = await axios.get(`${baseUrl}/delivery-staff/orders?period=${payload.period}`, {
            headers: {
                Authorization: `Bearer ${payload.token}`
            }
        });
        return res?.data?.data;
    }
);

export const { loadUserData, loadUserToken } = applicationSlice.actions;
export default applicationSlice.reducer;
