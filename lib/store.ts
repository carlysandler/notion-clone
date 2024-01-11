import { configureStore } from '@reduxjs/toolkit'
import SearchDialogReducer from "@/lib/features/dialog/searchDialogSlice"
import SettingsDialogReducer from "@/lib/features/dialog/settingsDialogSlice"

export const makeStore = () => {
  return configureStore({
    reducer: {
			search: SearchDialogReducer,
			settings: SettingsDialogReducer
		},
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']