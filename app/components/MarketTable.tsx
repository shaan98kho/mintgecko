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


    return <div className="p-4">
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


    </div>
}