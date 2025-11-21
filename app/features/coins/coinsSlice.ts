import {
    createSlice,
    type PayloadAction
} from "@reduxjs/toolkit"
import { createAppAsyncThunk } from "~/state/typedAsyncThunk"
import type { Coin } from "~/types"

type Order = 'market_cap_desc'|'market_cap_asc'|'volume_desc'|'volume_asc'|'id_asc'|'id_desc'
export interface CoinsState {
    items: Coin[],
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error?: string,
    lastFetched: number | null,
    hasMore: boolean,
    order: Order,
    loadingPageMap: Record<number, true>
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
const initialState: CoinsState = { 
    items: [],
    status: 'idle',
    lastFetched: null,
    hasMore: true,
    loadingPageMap: {},
    order: 'market_cap_desc',
}

// thunk
export const fetchCoins = createAppAsyncThunk<
    Coin[],
    {order?: Order; page?: number; per_page?: number} | void
>(
    'coins/fetchCoins',
    async (args, {signal}) => {
        const params = { order: 'market_cap_desc' as Order, page: 1, per_page: 25, ...(args ?? {}) }

        const queries = new URLSearchParams({
            vs_currency: 'usd',
            order: params.order,
            per_page: String(params.per_page),
            page: String(params.page),
            sparkline: 'true',
            price_change_percentage: '24h',
            x_cg_demo_api_key: import.meta.env.VITE_COINGECKO_API_KEY!,
        })
        try {
            const res = await fetch(`${BASE_URL}/coins/markets?${queries}`, {signal})

            if(!res.ok) throw new Error('res not ok, try again')

            const data = await res.json()
            return data as Coin[]
        }
        catch(e: any) {
            const msg = e instanceof Error ? e.message : String(e)
            throw new Error(`fetch failed: ${msg}`)
        }
    }, {
        condition: (args, { getState }) => {
            const p = { order: 'market_cap_desc' as Order, page: 1, per_page: 25, ...(args ?? {}) };
            const {lastFetched, status} = getState().coins

            if(status === 'loading') return false
            if(lastFetched && Date.now() - lastFetched < STALE_TIME_MS) {
                if (p.page === 1) return false;
            }
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
            state.items = action.payload
        },
        //optional
        sortOrders(state, action: PayloadAction<Order>) {
            state.order = action.payload
            state.items = []
            state.hasMore = true
            state.lastFetched = null
        },
    },
    extraReducers: (b) => {
        b.addCase(fetchCoins.pending, (s, a) => {
            s.status = 'loading'
            s.error = undefined
            const { page = 1 } = (a.meta.arg ?? {}) as { page?: number };
            s.loadingPageMap[page] = true;            // add
        })
        .addCase(fetchCoins.fulfilled, (s, a) => { 
            s.status = 'succeeded'
            // s.items = a.payload
            // s.lastFetched = Date.now()
            // const { page = 1, per_page = 100 } =
            // (a.meta.arg ?? {}) as { page?: number; per_page?: number }
            //         s.hasMore = a.payload.length === per_page

            //         delete s.loadingPageMap[page]
            const { page = 1, per_page = 25 } = (a.meta.arg ?? {}) as { page?: number; per_page?: number }

            if (page === 1) {
                // Initial load or refresh
                s.items = a.payload
            } else {
                // Infinite scrolling - append
                s.items = [...s.items, ...a.payload]
            }

            s.lastFetched = Date.now()

            s.hasMore = a.payload.length === per_page

            delete s.loadingPageMap[page]
        })
        .addCase(fetchCoins.rejected, (s, a) => { 
            const { page = 1 } = (a.meta.arg ?? {}) as { page?: number }

            // If the thunk was canceled by `condition`, don't mark as failed
            // @ts-ignore meta.condition exists at runtime
            if (a.meta?.condition) {
                delete s.loadingPageMap[page]
                return
            }

            s.status = 'failed'
            s.error = a.error.message
            delete s.loadingPageMap[page]
        })
    },
})

export const selectCoins = (state: { coins: CoinsState }) => state.coins.items
export const { setCoins } = coinsSlice.actions
export default coinsSlice.reducer