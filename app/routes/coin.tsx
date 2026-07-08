import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "~/state/hooks"
import { useParams } from "react-router-dom"
import { fetchCoinById, fetchCoinChart, type ChartRange } from "~/features/coins/coinDetailSlice"
import { FaSortDown, FaSortUp } from "react-icons/fa6"
import Sparkline from "~/components/Sparkline"

const chartRanges: ChartRange[] = ["1", "7", "30", "365"]

export default function Coin() {
    const { coinid } = useParams()
    const dispatch = useAppDispatch()
    const [days, setDays] = useState<ChartRange>("7") // default to 7
    
    const {coin, error, currentId, chartPrices} = useAppSelector(s => s.coin)

    useEffect(() => {
        if(!coinid) return
        if (currentId !== coinid) {
            dispatch(fetchCoinById(coinid))
        }
    }, [dispatch, coinid, currentId])

    useEffect(() => {
        if(!coinid) return
        dispatch(fetchCoinChart({coinid, days}))
    }, [dispatch, coinid, days])

    const selectDays = (day: ChartRange) => {
        setDays(day)
    }
    const change24h = coin?.market_data.price_change_percentage_24h;
    const isUp = (change24h ?? 0) >= 0;

    if(error || !coinid) return <>Here by mistake? Go back</>

    const chartNav = chartRanges.map(range => <button key={range} className="px-2 rounded" onClick={() => selectDays(range)}>{range} D</button>)

    return <div className="p-8">
        <div className="flex items-center gap-2 flex-wrap">
            <img src={coin?.image.thumb} alt="" className="w-6 h-6" /><h1 className="font-bold text-xl">{coin?.name}</h1>
            <span className="">{coin?.symbol}</span>
            <div className="cap-rank px-2 py-[1px] rounded text-xs">#{coin?.market_cap_rank}</div>
        </div>
        <div className="flex items-center pt-4 gap-3">
            <h2 className="text-2xl font-bold">{coin?.market_data.current_price.usd.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
            })}</h2>
            <div className={`${isUp ? "text-emerald-600" : "text-red-600"} flex items-center gap-1`}>
            {isUp ?<FaSortUp className="relative top-1"/> : <FaSortDown className="relative bottom-1"/>}
            <span className={`font-bold`}>
                {change24h?.toFixed(2)}%
            </span>
            </div>
        </div>
        <div className="chart-wrap pt-12 pr-4 pb-4 relative">
            <div className="flex items-center absolute chart-nav rounded px-2 py-1 gap-2 left-0 top-4 text-sm">
                {chartNav}
            </div>
            <Sparkline 
                values={chartPrices}
                height={220}
                stroke={isUp ? "#059669" : "#dc2626"}
                gradientTop={isUp ? "#059669" : "#dc2626"}
            />
        </div>
        
        
    </div>
}
