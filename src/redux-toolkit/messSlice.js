import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    conversations: null
};

export const messSlice = createSlice({
    name: "mess",
    initialState,
    reducers: {
        setConversations: (state, action) => {
            state.conversations = action.payload;
        },
    },
});

export const { setConversations } = messSlice.actions;

export default messSlice.reducer;
