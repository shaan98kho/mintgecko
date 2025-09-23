import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "~/state/hooks"
import { fetchCoins } from "~/features/coins/coinsSlice"
import TableRow from "./TableRow"

export default function MarketTable() {
    const dispatch = useAppDispatch()
	const coins = useAppSelector(s => s.coins.items)
	const status = useAppSelector(s => s.coins.status)

	useEffect(() => {
		dispatch(fetchCoins())
	}, [dispatch])

    console.log(coins)
    const tableBody = coins.map((coin) => (
        <TableRow
            key={`mk${coin.id}`}
            id={coin.id}
            name={coin.name}
            symbol={coin.symbol}
            image={coin.image}
            current_price={coin.current_price}
            price_change_percentage_24h={coin.price_change_percentage_24h}
            sparkline_in_7d={coin.sparkline_in_7d}
            high_24h={coin.high_24h}
            low_24h={coin.low_24h}
            classes=""
            // chart={<Sparkline data={c.sparkline_in_7d.price} />}
        />
    ))

    return <div className="market-table p-4">
        {/* header */}
        <TableRow
            {...{
                name: "Name",
                price: "Price",
                "24h change": "24h",
                "24 high / 24h low": "24h High / Low",
                charts: "7d",
                "market cap": "Mkt Cap",
            }}
        />

        {/* body */}
        {tableBody}

    </div>
}