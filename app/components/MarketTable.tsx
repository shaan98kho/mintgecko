import { useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "~/state/hooks"
import { fetchCoins } from "~/features/coins/coinsSlice"
import TableRow from "./TableRow"

export default function MarketTable() {
    const dispatch = useAppDispatch()
    const {items, hasMore, status} = useAppSelector(s => s.coins)
	
    const perPage = 100
    const currentPage = Math.max(1, Math.ceil(items.length / perPage))

	useEffect(() => {
        if(status === 'idle' && items.length === 0) {
            dispatch(fetchCoins({page: 1}))
        }
	}, [status, items.length, dispatch])

    const sentinelRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const el = sentinelRef.current
        if(!el) return
        
        const obs = new IntersectionObserver(entries => {
            const first = entries[0]
            if(first.isIntersecting && hasMore && status !== 'loading') {
                dispatch(fetchCoins({page: currentPage + 1}))
            }
        }, {rootMargin: '200px 0px'}) // pre-load before hitting the end

        obs.observe(el)
        return () => obs.disconnect()

    }, [dispatch, hasMore, status, currentPage])

    const tableBody = items.map((coin) => (
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
            market_cap={coin.market_cap}
            classes=""
            // chart={<Sparkline data={c.sparkline_in_7d.price} />}
        />
    ))

    return <div className="market-table p-4" ref={sentinelRef}>
        {/* header */}
        <TableRow
            {...{
                market_cap_rank: "Rank",
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