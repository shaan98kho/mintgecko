import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "~/state/hooks"
import { useParams } from "react-router-dom"
import { fetchCoinById, fetchCoinChart, type ChartRange } from "~/features/coins/coinDetailSlice"
import { FaSortDown, FaSortUp } from "react-icons/fa6"
import { IoCaretBackOutline } from "react-icons/io5"
import Sparkline from "~/components/Sparkline"
import StatCard from "~/components/StatCard"
import { Link } from "react-router"

const chartRanges: ChartRange[] = ["1", "7", "30", "365"]
type StatCardData = {
  title: string,
  value: number,
  unit: "plain" | "currency",
  currency?: string,
}

type MaybeStatCardData = Omit<StatCardData, "value"> & {
  value: number | null | undefined
}

const hasValue = (card: MaybeStatCardData): card is StatCardData => {
  return card.value !== null && card.value !== undefined
}

export default function Coin() {
    const [days, setDays] = useState<ChartRange>("7") // default to 7
    const [showFullDesc, setShowFullDesc] = useState<boolean>(false)
    const { coinid } = useParams()
    const dispatch = useAppDispatch()
    
    // const {coin, error, currentId, chartPrices} = useAppSelector(s => s.coin)
    const {coin, error, currentId, chartPricesByKey} = useAppSelector(s => s.coin)
    const marketData = coin?.market_data
    const chartKey = coinid ? `${coinid}-${days}` : ""
    const chartPrices = chartPricesByKey[chartKey] ?? []

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
    const change24h = coin?.market_data.price_change_percentage_24h
    const isUp = (change24h ?? 0) >= 0
    const maybeStatCards: MaybeStatCardData[] = marketData
    ? [
        {
            title: "Circulating Supply",
            value: marketData.circulating_supply,
            unit: "plain",
        },
        {
            title: "Total Supply",
            value: marketData.total_supply,
            unit: "plain",
        },
        {
            title: "Max Supply",
            value: marketData.max_supply,
            unit: "plain",
        },
        {
            title: "24h High",
            value: marketData.high_24h.usd,
            unit: "currency",
            currency: "USD",
        },
        ]
    : []

    const statCards: StatCardData[] = maybeStatCards.filter(hasValue)

    const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "")
    const description = stripHtml(coin?.description.en ?? "")

    if(error || !coinid) return <>Here by mistake? Go back</>

    const chartNav = chartRanges.map(range => <button key={range} className={`px-2 rounded cursor-pointer ${days === range ? 'active' : ''}`} onClick={() => selectDays(range)}>{range} D</button>)

    return <div className="p-8">
        <Link
            to={`/market`}
            className="mb-6 flex items-center text-sm back-btn"><IoCaretBackOutline />Back to Market</Link>
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
                className="h-[220px]"
                preserveAspectRatio="none"
                stroke={isUp ? "#059669" : "#dc2626"}
                gradientTop={isUp ? "#059669" : "#dc2626"}
            />
        </div>
        <h2 className="text-xl font-bold pt-6">Market Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-4">
        {statCards.map((card) => (
            <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            unit={card.unit}
            currency={"currency" in card ? card.currency : undefined}
            compact={false}
            />
        ))}
        </div>

        {description && 

            <div className="pt-4">
                <h2 className="text-xl font-bold">Description</h2>
                <p className={`text-sm pt-4 ${showFullDesc ? '': 'line-clamp-4' }`}>{description}</p>
                <button type="button" className="pt-2 cursor-pointer font-semibold text-sm show-more" onClick={() => setShowFullDesc(prev => !prev)}>{showFullDesc ? "Show less" : "Show more"}</button>
            </div>
        }
        
        
    </div>
}
