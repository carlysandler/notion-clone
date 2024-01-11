import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface SearchSlice {
	isOpen: boolean;
}

const initialState: SearchSlice =  {
	isOpen: false
}

export const searchSlice = createSlice({
	name: "searchDialog",
	initialState,
	reducers: {
		toggle: (state, action: PayloadAction<boolean>) => {
			state.isOpen = action.payload 
		}
	}
})

export const { toggle } = searchSlice.actions
export default searchSlice.reducer