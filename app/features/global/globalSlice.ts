import { type GlobalData } from "~/types"
import { createSlice } from "@reduxjs/toolkit"
import { createAppAsyncThunk } from "~/state/typedAsyncThunk"

export interface GlobalDataState {
    data: GlobalData | null,
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error? :string,
    lastFetched: number | null
}

const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY as string
const URL = 'https://api.coingecko.com/api/v3/global'
const options = {method: 'GET', headers: {accept: 'application/json'}}

const initialState: GlobalDataState = {
    data: null,
    status: 'idle',
    lastFetched: null
}