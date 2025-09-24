import type { ReactNode } from "react"
import type { Coin } from "~/types"
import { FaSortDown, FaSortUp } from "react-icons/fa6"
import Sparkline from "./Sparkline"

type TableHeaderTitle = "name" | "price" | "24h change" | "24 high / 24h low" | "charts" | "market cap"

type TableHeader = Record<TableHeaderTitle, string>

type TableBody = Pick<Coin,
                    "id" |
                    "name" |
                    "symbol" |
                    "image" |
                    "current_price" |
                    "price_change_percentage_24h" |
                    "sparkline_in_7d" |
                    "high_24h" |
                    "low_24h" |
                    "market_cap"
                >
                & {
                    market_cap_rank?: number,
                    chart?: ReactNode,
                    classes?: string
                }

type TableContentProps = TableHeader | TableBody

export default function TableRow(props: TableContentProps) {
    // body
    if ("id" in props) {
        const {
          id, name, symbol, image,
          current_price, price_change_percentage_24h,
          sparkline_in_7d, high_24h, low_24h, market_cap,
          chart, classes
        } = props

        const compact = new Intl.NumberFormat('en-US', {
            notation: 'compact',
            maximumFractionDigits: 2,
          }).format(market_cap)

        const prices = sparkline_in_7d?.price ?? []
        const up = (price_change_percentage_24h ?? 0) >= 0
    
        return (
            <div className={`row flex items-center gap-4 py-2 ${classes}`}>
                {/* <div className="w-[5%] text-center">{market_cap_rank}</div> */}
                <div>{name}</div>
                <div>{current_price}</div>
                <div>{price_change_percentage_24h}</div>
                <div>{high_24h} / {low_24h}</div>
                <div>
                    <Sparkline 
                        values={prices}
                        gradientTop={up ? '#059669' : '#D81B60'}
                    />
                </div>
                <div>{compact}</div>
            

            </div>
        )
    }
    
    // header
    return (
    <div className="row header flex items-center gap-4 py-2 font-bold">
        {/* <div className="w-[5%] text-center">{props.market_cap_rank}</div> */}
        <div>{props.name}</div>
        <div>{props.price}</div>
        <div>{props["24h change"]}</div>
        <div>{props["24 high / 24h low"]}</div>
        <div>{props.charts}</div>
        <div>{props["market cap"]}</div>
    </div>
    )
}