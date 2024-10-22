import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
  name: "search",
  initialState: {
    value: "",
  },
  reducers: {
    setSearchValue: (state, action) => {
      state.value = action.payload; // Update the search value in the state
    },
  },
});

export const { setSearchValue } = searchSlice.actions;

export default searchSlice.reducer;
