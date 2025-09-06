import {
    createSlice,
    type PayloadAction
} from "@reduxjs/toolkit"
import { createAppAsyncThunk } from "~/state/typedAsyncThunk"
import type { Coin } from "~/types"

export interface CoinsState {
    items: Coin[],
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error?: string,
    lastFetched: number | null
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
const STALE_TIME_MS = 60_000


// initial state
const initialState: CoinsState = { 
    items: [],
    status: 'idle',
    lastFetched: null
}

// thunk
export const fetchCoins = createAppAsyncThunk<
    Coin[],
    void
>(
    'coins/fetchCoins',
    async (_, {signal}) => {
        const params = new URLSearchParams({
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: '100',
            page: '1',
            sparkline: 'true',
            price_change_percentage: '24h',
            x_cg_demo_api_key: import.meta.env.VITE_COINGECKO_API_KEY!,
        })
        try {
            const res = await fetch(`${BASE_URL}/coins/markets?${params}`, {signal})
            if(!res.ok) throw new Error('res not ok, try again')
            const data = await res.json()
            return data as Coin[]
        }
        catch(e: any) {
            const msg = e instanceof Error ? e.message : String(e)
            throw new Error('fetch failed:', e)
        }
    }, {
        condition: (_, { getState }) => {
            const {lastFetched, status} = getState().coins

            if(status === 'loading') return false
            if(lastFetched && Date.now() - lastFetched < STALE_TIME_MS) return false
            return true
        }
    }
)

// slice
const coinsSlice = createSlice({
    name: 'coins',
    initialState,
    reducers: {
        setCoins(state, action: PayloadAction<Coin[]>) {
            state.items = action.payload;
          },
    },
    extraReducers: (b) => {
        b.addCase(fetchCoins.pending, (s) => {
            s.status = 'loading'
            s.error = undefined 
        })
        .addCase(fetchCoins.fulfilled, (s, a) => { 
            s.status = 'succeeded'
            s.items = a.payload
            s.lastFetched = Date.now()
        })
        .addCase(fetchCoins.rejected, (s, a) => { 
            s.status = 'failed'
            s.error = a.error.message
        })
    },
})

export const selectCoins = (state: { coins: CoinsState }) => state.coins.items
export const { setCoins } = coinsSlice.actions
export default coinsSlice.reducer