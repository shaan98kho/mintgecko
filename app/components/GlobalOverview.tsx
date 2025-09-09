import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "~/state/hooks"
import { fetchGlobalData } from "~/features/globalData/globalDataSlice"
import StatCard from "./StatCard"
import { type GlobalData } from "~/types"

type Fiat = "USD" | "EUR" | "GBP" | "SGD" | "MYR"


type GlobalOverviewProps = {
    fiat?: Fiat
}

const API_CODE: Record<Fiat, keyof GlobalData["total_market_cap"]> = {
    USD: "usd",
    EUR: "eur",
    GBP: "gbp",
    SGD: "sgd",
    MYR: "myr",
  }

type ScalarKey =
    | "active_cryptocurrencies"
    | "markets"
    | "upcoming_icos"
    | "ongoing_icos"
    | "ended_icos"

const LABELS: Record<ScalarKey, string> = {
    active_cryptocurrencies: "Active cryptos",
    markets: "Markets",
    upcoming_icos: "Upcoming ICOs",
    ongoing_icos: "Ongoing ICOs",
    ended_icos: "Ended ICOs",
}

export default function GlobalOverView({fiat = "USD"}: GlobalOverviewProps) {
    const [cur, setCur] = useState<Fiat>(fiat)
    const dispatch = useAppDispatch()
    const globalData = useAppSelector(s => s.globalData.data)
    const status = useAppSelector(s => s.globalData.status)

    useEffect(()=> {
        dispatch(fetchGlobalData())
    }, [dispatch])


    if(status == 'loading') return <div>Fetching coins...</div>
	if(!globalData || status==='failed') return <>Error fetching, please try again</>

    const code = API_CODE[cur]

    const scalarCards = (Object.keys(LABELS) as ScalarKey[]).map((k) => ({
        title: LABELS[k],
        value: globalData[k],
        unit: "plain" as const,
      }))

    const currencyCards = [
        {
            title: "Global Market Cap",
            value: globalData.total_market_cap[code],
            unit: "currency" as const,
            currency: cur.toUpperCase(),
            change: globalData.market_cap_change_percentage_24h_usd,
        },
        {
            title: "24h Volume",
            value: globalData.total_volume[code],
            unit: "currency" as const,
            currency: cur.toUpperCase(),
        },
    ]

    const dominanceCards = (["btc", "eth"] as const).map((sym) => ({
        title: `${sym.toUpperCase()} Dominance`,
        value: globalData.market_cap_percentage[sym],
        unit: "percent" as const,
    }))

    const cards = [...scalarCards, ...currencyCards, ...dominanceCards]

    return <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4">
        {cards.map((c) => {
            return <StatCard
                key={c.title}
                title={c.title}
                value={c.value}
                change={"change" in c ? c.change : undefined}
                unit={c.unit}
                currency={("currency" in c && c.currency) || undefined}
            />
        })}
    </div>
}