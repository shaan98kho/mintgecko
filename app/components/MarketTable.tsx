import { useEffect, useMemo, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "~/state/hooks"
import { fetchCoins } from "~/features/coins/coinsSlice"
import TableRow from "./TableRow"

type SortKey =
                | 'market_cap_rank'
                | 'name'
                | 'current_price'
                | 'price_change_percentage_24h'
                | 'high_24h'
                | 'low_24h'
                | 'market_cap'

type SortDirection = 'asc' | 'desc'

type SortConfig = {
    key: SortKey
    direction: SortDirection
}

export default function MarketTable() {
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'market_cap_rank',
        direction: 'asc'
    })
    const dispatch = useAppDispatch()
    const {items, hasMore, status} = useAppSelector(s => s.coins)

    const perPage = 25
    const currentPage = Math.max(1, Math.ceil(items.length / perPage))
	useEffect(() => {
        if(status === 'idle' && items.length === 0) {
            dispatch(fetchCoins({page: 1}))
        }
	}, [status, items.length, dispatch])

    // infinite scroll to load coins
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

    const handleSort = (key:SortKey) => {
        setSortConfig(prev => {
            if (prev.key === key) {
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
            }

            //default
            return { key, direction: key === 'name' ? 'asc' : 'desc' }
        })
    }

    const sortedItems = useMemo(() => {
        if (!items.length) return items

        const { key, direction } = sortConfig
        const dir = direction === 'asc' ? 1 : -1

        const copy = [...items]

        copy.sort((a, b) => {
            const va = a[key]
            const vb = b[key]

            // Handle undefined/null safely
            if (va == null && vb == null) return 0
            if (va == null) return 1
            if (vb == null) return -1

            // String compare for `name`, numeric for others
            if (key === 'name') {
            return String(va).localeCompare(String(vb)) * dir
            }

            const na = Number(va)
            const nb = Number(vb)

            if (na < nb) return -1 * dir
            if (na > nb) return 1 * dir
            return 0
        })

        return copy
        
    }, [items, sortConfig])
    

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

    return <div className="market-table p-4">
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

        {/* sentinel */}
        <div ref={sentinelRef} style={{height:1}}></div>

    </div>
}