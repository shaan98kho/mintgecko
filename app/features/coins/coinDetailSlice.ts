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
    coinById: Record<string, CoinDetail>,
    coinFetchedAtById: Record<string, number>,
    loadingCoinMap: Record<string, true>,

    // for bug #4: start
    chartPrices: number[],
    chartPricesByKey: Record<string, number[]>, // caching
    chartFetchedAtByKey: Record<string, number>, // caching
    loadingChartMap: Record<string, true>, // caching
    // for bug #4: end
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

// const COIN_STALE_TIME_MS = 60_000 // 1 min
const STALE_TIME_MS = 5 * 60_000 // 5 minutes
const getChartKey = (coinid: string, days: ChartRange) => `${coinid}-${days}`


// initial state
const initialState: CoinDetailState = { 
    coin: null,
    status: 'idle',
    chartPrices: [],
    coinById: {},
    coinFetchedAtById: {},
    loadingCoinMap: {},
    // for bug #4: start 
    chartPricesByKey: {}, // caching
    chartFetchedAtByKey: {}, // caching
    loadingChartMap: {}, // caching
    // for bug #4: end
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
        const queries = new URLSearchParams({
            x_cg_demo_api_key: API_KEY,
        })

        try {
            const res = await fetch(`${BASE_URL}/coins/${coinid}?${queries}`, {signal})

            if(!res.ok) throw new Error('fetch coin by id res not okay, fetch coin id failed, try again')
            const data = await res.json()
            return data as CoinDetail
        }
        catch(e: any) {
            const msg = e instanceof Error ? e.message : String(e)
            throw new Error(`fetch coin by id failed: ${msg}`)
        }
    },
    {
        condition:(coinid, {getState}) => {

            const state = getState().coin

            if(state.loadingCoinMap[coinid]) return false
            const lastFetched = state.coinFetchedAtById[coinid]

            if(lastFetched && Date.now() - lastFetched < STALE_TIME_MS) return false

            return true
        },
    }
)

export const fetchCoinChart = createAppAsyncThunk<
    number[],
    {coinid: string, days: ChartRange}
>(
    'coinDetail/fetchCoinChart',
    async ({coinid, days}, {signal}) => {
        const queries = new URLSearchParams({
            vs_currency: "usd",
            days,
            x_cg_demo_api_key: API_KEY,
        })

        try {
            const res = await fetch(`${BASE_URL}/coins/${coinid}/market_chart?${queries}`, { signal })
    
            if(!res.ok) throw new Error('fetch coin chart range not ok, try again')
            
            const data = await res.json()

            return data.prices.map((point: [number, number]) => point[1])
        }
        catch(e: any) {
            const msg = e instanceof Error ? e.message : String(e)
            throw new Error(`fetch coin chart range failed: ${msg}`)
        }
        
    },
    {
        condition: ({coinid, days}, {getState}) => {
            const key = getChartKey(coinid, days)
            const state = getState().coin

            if(state.loadingChartMap[key]) return false
            
            const lastFetched = state.chartFetchedAtByKey[key]
            if(lastFetched && Date.now() - lastFetched < STALE_TIME_MS) return false

            return true
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
            const coinid = a.meta.arg

            s.status = 'loading'
            s.error = undefined
            s.currentId = coinid
            s.loadingCoinMap[coinid] = true
        })
        .addCase(fetchCoinById.fulfilled, (s, a) => {
            const coinid = a.meta.arg

            s.status = 'succeeded'
            s.coin = a.payload
            s.coinById[coinid] = a.payload
            s.coinFetchedAtById[coinid] = Date.now()

            delete s.loadingCoinMap[coinid]
        })
        .addCase(fetchCoinById.rejected, (s, a) => {
            const coinid = a.meta.arg

            s.status = 'failed'
            s.error = a.error.message

            delete s.loadingCoinMap[coinid]
        })
        .addCase(fetchCoinChart.pending, (s,a) => {
            const { coinid, days } = a.meta.arg
            const key = getChartKey(coinid, days)

            s.chartStatus = 'loading'
            s.chartError = undefined
            s.chartRange = days
            s.loadingChartMap[key] = true
        })
        .addCase(fetchCoinChart.fulfilled, (s,a) => {
            const { coinid, days } = a.meta.arg
            const key = getChartKey(coinid, days)

            s.chartStatus = 'succeeded'
            s.chartPrices = a.payload
            s.chartPricesByKey[key] = a.payload
            s.chartFetchedAtByKey[key] = Date.now()

            delete s.loadingChartMap[key]
        })
        .addCase(fetchCoinChart.rejected, (s,a) => {
            const { coinid, days } = a.meta.arg
            const key = getChartKey(coinid, days)

            s.chartStatus = 'failed'
            s.chartError = a.error.message

            delete s.loadingChartMap[key]
        })
    },
})

export const selectCoins = (state: { coin: CoinDetailState }) => state.coin
export const { setCoin } = coinDetailSlice.actions
export default coinDetailSlice.reducer