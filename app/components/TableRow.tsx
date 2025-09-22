import type { ReactNode } from "react"
import type { Coin } from "~/types"
import { FaSortDown, FaSortUp } from "react-icons/fa6"

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
                    "low_24h"
                >
                & {
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
          sparkline_in_7d, high_24h, low_24h,
          chart, classes
        } = props
    
        return (
            <div className={`row flex items-center gap-4 py-2 ${classes}`}>
                <div>{name}</div>
                <div>{current_price}</div>
                <div>{price_change_percentage_24h}</div>
                <div>{high_24h} / {low_24h}</div>
                <div>sparkline to be added</div>
                <div>cap</div>
            

            </div>
        )
    }
    
    // header
    return (
    <div className="row header flex items-center gap-4 py-2 font-bold">
        <div>{props.name}</div>
        <div>{props.price}</div>
        <div>{props["24h change"]}</div>
        <div>{props["24 high / 24h low"]}</div>
        <div>{props.charts}</div>
        <div>{props["market cap"]}</div>
    </div>
    )
}