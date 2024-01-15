import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

interface CoverImageSlice {
  isOpen: boolean
  url?: string
}

const initialState: CoverImageSlice = {
  isOpen: false,
  url: undefined,
}

export const CoverImageSlice = createSlice({
  name: "coverImage",
  initialState,
  reducers: {
    toggle: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload
      state.url = undefined
    },
    replace: (state, action: PayloadAction<string>) => {
      state.isOpen = true
      state.url = action.payload
    },
  },
})

export const { toggle, replace } = CoverImageSlice.actions
export default CoverImageSlice.reducer
