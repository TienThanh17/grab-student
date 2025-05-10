import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    page: 1,
};

export const paginationSlice = createSlice({
    name: "pagination",
    initialState,
    reducers: {
        handleChangePage: (state, action) => {
            state.page = action.payload;
        },
    },
});

export const { handleChangePage } = paginationSlice.actions;

export default paginationSlice.reducer;
