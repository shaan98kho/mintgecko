import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "~/state/hooks"
import { fetchGlobalData } from "~/features/globalData/globalDataSlice"
import StatCard from "./StatCard"
import { useDispatch } from "react-redux"

export default function GlobalOverView() {
    const dispatch = useAppDispatch()
    const globalData = useAppSelector(s => s.globalData.data)
    const status = useAppSelector(s => s.globalData.status)
    const CURRENCY = "usd" as const

    useEffect(()=> {
        dispatch(fetchGlobalData())
    }, [dispatch])

    type ScalarKey =
    | "active_cryptocurrencies"
    | "markets"
    | "upcoming_icos"
    | "ongoing_icos"
    | "ended_icos";

    const LABELS: Record<ScalarKey, string> = {
    active_cryptocurrencies: "Active cryptos",
    markets: "Markets",
    upcoming_icos: "Upcoming ICOs",
    ongoing_icos: "Ongoing ICOs",
    ended_icos: "Ended ICOs",
    }

    const SCALAR_KEYS: ScalarKey[] = Object.keys(LABELS) as ScalarKey[];


    if(status == 'loading') return <div>Fetching coins...</div>
	if(!globalData || status==='failed') return <>Error fetching, please try again</>

    
    const globalEl = SCALAR_KEYS.map((k) => (
        <StatCard key={k} title={LABELS[k]} value={globalData[k]} />))

    return <div className="flex gap-2 overflow-x-auto no-scrollbar p-4">
        <StatCard
            title="Market Cap (USD)"
            value={globalData.total_market_cap[CURRENCY]}
            change={globalData.market_cap_change_percentage_24h_usd}
        />
        {globalEl}
    </div>
}