import {
    createSlice,
    type PayloadAction
} from "@reduxjs/toolkit"
import { createAppAsyncThunk } from "~/state/typedAsyncThunk"
import type { CoinDetail } from "~/types"

export type ChartRange = '1' | '7' | '30' | '365'
// type currentId = string | null

export interface CoinDetailState {
    coin: CoinDetail | null,
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error?: string,
    currentId: string | null,

    chartPrices: number[],
    chartStatus: 'idle' | 'loading' | 'succeeded' | 'failed',
    chartError?: string,
    chartRange: ChartRange,
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
    chartPrices: [],
    chartStatus: 'idle',
    chartRange: '7',
    currentId: null
}

// thunk
export const fetchCoinById = createAppAsyncThunk<
    CoinDetail,
    string
>(
    'coinDetail/fetchCoinById',
    async (coinid, {signal}) => {
        try {
            const res = await fetch(`${BASE_URL}/coins/${coinid}`, {signal})

            if(!res.ok) throw new Error('fetch coin by id res not okay, fetch coin id failed, try again')
            const data = await res.json()
            return data as CoinDetail
        }
        catch(e: any) {
            const msg = e instanceof Error ? e.message : String(e)
            throw new Error(`fetch coin by id failed: ${msg}`)
        }
    }
)

export const fetchCoinChart = createAppAsyncThunk<
    number[],
    {coinid: string, days: ChartRange}
>(
    'coinDetail/fetchCoinChart',
    async ({coinid, days}, {signal}) => {
        try {
            const res = await fetch(`${BASE_URL}/coins/${coinid}/market_chart?vs_currency=usd&days=${days}`, { signal })
    
            if(!res.ok) throw new Error('fetch coin chart range not ok, try again')
            
            const data = await res.json()

            return data.prices.map((point: [number, number]) => point[1])
        }
        catch(e: any) {
            const msg = e instanceof Error ? e.message : String(e)
            throw new Error(`fetch coin chart range failed: ${msg}`)
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
        setChartRange(state, action: PayloadAction<ChartRange>) {
            state.chartRange = action.payload
        }
    },
    extraReducers: (b) => {
        // state, action
        b.addCase(fetchCoinById.pending, (s, a) => {
            s.status = 'loading'
            s.error = undefined
            s.currentId = a.meta.arg
        })
        .addCase(fetchCoinById.fulfilled, (s, a) => {
            s.status = 'succeeded'
            s.coin = a.payload
        })
        .addCase(fetchCoinById.rejected, (s, a) => {
            s.status = 'failed'
            s.error = a.error.message
        })
        .addCase(fetchCoinChart.pending, (s,a) => {
            s.chartStatus = 'loading'
            s.chartError = undefined
            s.chartRange = a.meta.arg.days
        })
        .addCase(fetchCoinChart.fulfilled, (s,a) => {
            s.chartStatus = 'succeeded'
            s.chartPrices = a.payload
        })
        .addCase(fetchCoinChart.rejected, (s,a) => {
            s.chartStatus = 'failed'
            s.chartError = a.error.message
        })
    },
})

export const selectCoins = (state: { coin: CoinDetailState }) => state.coin
export const { setCoin } = coinDetailSlice.actions
export default coinDetailSlice.reducer