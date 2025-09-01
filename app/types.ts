export interface Coin {
    id: string,
    symbol: string,
    name: string,
    platforms: {},
}

export interface CoinsState {
    items: Coin[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error?: string;
}