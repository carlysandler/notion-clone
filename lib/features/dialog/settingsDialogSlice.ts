import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface SettingsSlice {
	isOpen: boolean;
}

const initialState: SettingsSlice =  {
	isOpen: false
}

export const settingsSlice = createSlice({
	name: "settingsDialog",
	initialState,
	reducers: {
		toggle: (state, action: PayloadAction<boolean>) => {
			state.isOpen = action.payload 
		}
	}
})

export const { toggle } = settingsSlice.actions
export default settingsSlice.reducer