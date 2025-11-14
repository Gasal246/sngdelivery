import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData: null,
    userToken: null
}

const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        loadUserData: (state, action) => {
            state.userData = action.payload;
        },  
        loadUserToken: (state, action) => {
            state.userToken = action.payload;
        },
    },
})

export const { loadUserData, loadUserToken } = applicationSlice.actions;
export default applicationSlice.reducer;