import { configureStore } from "@reduxjs/toolkit"
import coinsReducer from "~/features/coins/coinsSlice"
import globalDataReducer from "~/features/globalData/globalDataSlice"

export const store = configureStore({
    reducer: {
        coins: coinsReducer,
        globalData: globalDataReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch