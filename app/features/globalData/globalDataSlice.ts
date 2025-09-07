import { type GlobalData } from "~/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { createAppAsyncThunk } from "~/state/typedAsyncThunk"

export interface GlobalDataState {
    data: GlobalData | null,
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error? :string,
    lastFetched: number | null
}

const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY as string
const URL = 'https://api.coingecko.com/api/v3/global'
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json', 
        'x-cg-demo-api-key': API_KEY}
  };
const STALE_TIME_MS = 60_000 // 1 min

const initialState: GlobalDataState = {
    data: null,
    status: 'idle',
    lastFetched: null
}

export const fetchGlobalData = createAppAsyncThunk<
    GlobalData,
    void
>(
    'global/fetchGlobalData',
    async () => {
        try {
            const res = await fetch(`${URL}`, options)

            if(!res.ok) throw new Error('res not ok, try again')

            const data = await res.json()

            // console.log(data)
            return data.data as GlobalData
        }
        catch(e: any) {
            const msg = e instanceof Error ? e.message : String(e)
            throw new Error(`fetch failed: ${msg}`)
        }
    }, {
        condition: (_, { getState }) => {
            const {lastFetched, status} = getState().globalData

            if(status === 'loading') return false
            if(lastFetched && Date.now() - lastFetched < STALE_TIME_MS) return false
            return true
        }
    }
)

// slice
const globalDataSlice = createSlice({
    name: 'globalData',
    initialState,
    reducers: {
        setGlobalData(state, action: PayloadAction<GlobalData>) {
            state.data = action.payload
        }
    },
    extraReducers: (b) => {
        b.addCase(fetchGlobalData.pending, (s) => {
            s.status = 'loading'
            s.error = undefined
        })
        .addCase(fetchGlobalData.fulfilled, (s, a) => {
            s.status = 'succeeded'
            s.data = a.payload
            s.lastFetched = Date.now()
        })
        .addCase(fetchGlobalData.rejected, (s, a) => { 
            s.status = 'failed'
            s.error = a.error.message
        })
    }
})

export const selectGlobalData = (state: {globalData: GlobalDataState}) => state.globalData.data
export const {setGlobalData} = globalDataSlice.actions
export default globalDataSlice.reducer