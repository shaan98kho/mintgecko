import { useEffect, useMemo, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "~/state/hooks"
import { fetchCoins } from "~/features/coins/coinsSlice"
import TableRow from "./TableRow"

type SortKey =
  | 'name'
  | 'price'
  | '24h change'
  | '24 high / 24h low'
  | 'market cap'

type SortDirection = 'asc' | 'desc' | 'default'

type SortConfig = {
    key: SortKey
    direction: SortDirection
}

export default function MarketTable() {
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'market cap',
        direction: 'default'
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

    const nextDir = (prev: SortDirection): SortDirection => {
      if (prev === "default") return "desc";
      if (prev === "desc") return "asc";
      return "default";
    }

    const handleSort = (key:SortKey) => {
        setSortConfig(prev => {
            // if (prev.key === key && prev.direction === direction) {
            //     return { key, direction: 'default' }
            // }
            if(prev.key === key) {
              return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } 
            }

            //default
            return { key, direction: key === 'name' ? 'asc' : 'desc' }
        })

        // setSortConfig(prev => {
        //   if (prev.key !== key) return { key, direction: "desc" }; // new key starts at desc
        //   return { key, direction: nextDir(prev.direction) }
        // })
    }

    const sortedItems = useMemo(() => {
        if (!items.length) return items
      
        const { key, direction } = sortConfig
        const dir = direction === 'asc' ? 1 : -1
      
        const copy = [...items]

        if(direction === 'default') return copy
      
        copy.sort((a, b) => {
          // Map header key -> actual coin field value
          const getValue = (coin: (typeof items)[number]) => {
            switch (key) {
              case 'name':
                return coin.name
              case 'price':
                return coin.current_price
              case '24h change':
                return coin.price_change_percentage_24h ?? 0
              case '24 high / 24h low':
                return coin.high_24h ?? 0
              case 'market cap':
                return coin.market_cap ?? 0
              default:
                return 0
            }
          }
      
          const va = getValue(a)
          const vb = getValue(b)
      
          // Name: string compare
          if (key === 'name') {
            return String(va).localeCompare(String(vb)) * dir
          }
      
          // Others: numeric compare
          const na = Number(va)
          const nb = Number(vb)
      
          if (na < nb) return -1 * dir
          if (na > nb) return 1 * dir
          return 0
        })
      
        return copy
      }, [items, sortConfig])
      
    

    const tableBody = sortedItems.map((coin) => (
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
        <TableRow
        name="Name"
        price="Price"
        {...{
            "24h change": "24h",
            "24 high / 24h low": "24h High / Low",
            charts: "7d",
            "market cap": "Mkt Cap",
        }}
        sortKey={sortConfig.key}
        sortDirection={sortConfig.direction}
        onSort={handleSort}
        />

        {/* body */}
        {tableBody}

        {/* sentinel */}
        <div ref={sentinelRef} style={{height:1}}></div>

    </div>
}