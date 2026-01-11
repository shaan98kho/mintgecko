import type { ReactNode } from "react"
import type { Coin } from "~/types"
import { FaSortDown, FaSortUp } from "react-icons/fa6"
import Sparkline from "./Sparkline"

type TableHeaderTitle = "name" | "price" | "24h change" | "24 high / 24h low" | "charts" | "market cap"

type SortableHeaderTitle = Exclude<TableHeaderTitle, "charts">

type SortDirection = 'asc' | 'desc' | 'default'

type TableHeaderBase = Record<TableHeaderTitle, string>

type TableHeaderProps = TableHeaderBase & {
    sortKey?: SortableHeaderTitle | null
    sortDirection?: SortDirection
    onSort?: (key: SortableHeaderTitle, activeDir: Exclude<SortDirection, 'default'>) => void
}


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

type TableContentProps = TableHeaderProps | TableBody

export default function TableRow(props: TableContentProps) {
    // body
    if ("id" in props) {
        const {
          id,
          name,
          symbol,
          image,
          current_price,
          price_change_percentage_24h,
          sparkline_in_7d, 
          high_24h, 
          low_24h,
          market_cap,
          chart, 
          classes,
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
    const { sortKey, sortDirection = "asc", onSort } = props

    const renderSortButton = (col: SortableHeaderTitle) => {
        if (!onSort) return (
            <div className="sort-wrap flex flex-col justify-center items-center">
                <FaSortUp className="opacity-30" />
                <FaSortDown className="opacity-30" />
            </div>
        )

        const isActive = sortKey === col

        return (
            <div className="sort-wrap flex flex-col justify-center items-center">
                <button
                    type="button"
                    onClick={() => onSort(col, 'asc')}
                >
                    <FaSortUp
                        className={
                        "transition-opacity " +
                        (isActive && sortDirection === "asc" 
                            ? "opacity-100 active" 
                            : "opacity-30")}
                    />
                </button>
                <button
                    type="button"
                    onClick={() => onSort(col, 'desc')}
                >
                    <FaSortDown
                        className={
                        "transition-opacity " +
                        (isActive && sortDirection === "desc"
                            ? "opacity-100 active"
                            : "opacity-30")}
                    />
                </button>
            </div>
        )
    }
    return (
    <div className="row header flex items-center gap-4 py-2 font-bold">
        {/* <div className="w-[5%] text-center">{props.market_cap_rank}</div> */}
        <div className="flex gap-2 items-center">
            <span>{props.name}</span>
            {/* <div className="sort-wrap flex flex-col justify-center items-center"><FaSortUp /><FaSortDown/></div> */}
            {renderSortButton("name")}

        </div>
        <div className="flex gap-2 items-center">
            <span>{props.price}</span>
            {/* <div className="sort-wrap flex flex-col justify-center items-center"><FaSortUp /><FaSortDown/></div> */}
            {renderSortButton("price")}
        </div>
        <div className="flex gap-2 items-center">
            <span>{props["24h change"]}</span>
            {/* <div className="sort-wrap flex flex-col justify-center items-center"><FaSortUp /><FaSortDown/></div> */}
            {renderSortButton("24h change")}
        </div>
        <div className="flex gap-2 items-center">
            <span>{props["24 high / 24h low"]}</span>
            {/* <div className="sort-wrap flex flex-col justify-center items-center"><FaSortUp /><FaSortDown/></div> */}
            {renderSortButton("24 high / 24h low")}
        </div>
        <div className="flex gap-2 items-center">
            <span>{props.charts}</span>
            {/* <div className="sort-wrap flex flex-col justify-center items-center"><FaSortUp /><FaSortDown/></div> */}
            {/* {renderSortButton("name")} */}
        </div>
        <div className="flex gap-2 items-center">
            <span>{props["market cap"]}</span>
            {/* <div className="sort-wrap flex flex-col justify-center items-center"><FaSortUp /><FaSortDown/></div> */}
            {renderSortButton("market cap")}
        </div>
    </div>
    )
}