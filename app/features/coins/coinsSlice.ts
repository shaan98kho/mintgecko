import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { CoinsState, Coin } from "~/types";

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

// initial state
const initialState: CoinsState = { items: [], status: 'idle' };

// thunk
// not yet tested
export const fetchCoins = createAsyncThunk<Coin[]>(
    'coins/fetchCoins',
    async () => {
        try {
            const res = await fetch(`${BASE_URL}/coins/markets`, options)
            if(!res.ok) throw new Error('res not ok, try again')
            const data = await res.json()
            return data as Coin[]
        }
        catch(e: any) {
            console.log(e)
            throw new Error('fetch failed:', e)
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
        b.addCase(fetchCoins.pending,   (s) => { s.status = 'loading'; s.error = undefined; })
            .addCase(fetchCoins.fulfilled, (s, a) => { s.status = 'succeeded'; s.items = a.payload; })
            .addCase(fetchCoins.rejected,  (s, a) => { s.status = 'failed'; s.error = a.error.message; });
    },
})

export const { setCoins } = coinsSlice.actions;
export default coinsSlice.reducer