import {
    createSlice,
    type PayloadAction
} from "@reduxjs/toolkit"
import { createAppAsyncThunk } from "~/state/typedAsyncThunk"
import type { CoinDetail } from "~/types"

export interface CoinDetailState {
    coin: CoinDetail | null,
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error?: string,
}

// headers, api key and urls
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY as string
const BASE_URL = 'https://api.coingecko.com/api/v3'
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': API_KEY
    }
}
const STALE_TIME_MS = 60_000 // 1 min


// initial state
const initialState: CoinDetailState = { 
    coin: null,
    status: 'idle',
}

// thunk
export const fetchCoinById = createAppAsyncThunk<
    CoinDetail,
    string
>(
    'coins/fetchCoinById',
    async (coinid, {signal}) => {
        try {
            const res = await fetch(`${BASE_URL}/coins/${coinid}`, {signal})

            if(!res.ok) throw new Error('res not okay, fetch coin id failed, try again')
            const data = await res.json()
            return data as CoinDetail
        }
        catch(e: any) {
            const msg = e instanceof Error ? e.message : String(e)
            throw new Error(`fetch failed: ${msg}`)
        }
    }
)

// slice
const coinDetailSlice = createSlice({
    name: 'coinDetail',
    initialState,
    reducers: {
        setCoin(state, action: PayloadAction<CoinDetail>) {
            state.coin = action.payload
        },
    },
    extraReducers: (b) => {
        // state, action
        b.addCase(fetchCoinById.pending, (s, a) => {
            s.status = 'loading'
            s.error = undefined
        })
        .addCase(fetchCoinById.fulfilled, (s, a) => {
            s.status = 'succeeded'
            s.coin = a.payload
        })
        .addCase(fetchCoinById.rejected, (s, a) => {
            s.status = 'failed'
            s.error = a.error.message
        })
    },
})

export const selectCoins = (state: { coin: CoinDetailState }) => state.coin
export const { setCoin } = coinDetailSlice.actions
export default coinDetailSlice.reducer