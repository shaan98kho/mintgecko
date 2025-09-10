import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "~/state/hooks"
import { fetchCoins } from "~/features/coins/coinsSlice"
import CoinCard from "~/components/CoinCard"

export default function FeaturedCoinsList() {
    const dispatch = useAppDispatch()
	const coins = useAppSelector(s => s.coins.items)
	const status = useAppSelector(s => s.coins.status)
	//
	useEffect(() => {
		dispatch(fetchCoins())
	}, [dispatch])

    if(status == 'loading') return <div>Fetching coins...</div>
	if(!coins || status==='failed') return <>Error fetching, please try again</>


    return <div className="featured flex gap-6 overflow-x-auto no-scrollbar">
            {coins?.slice(0, 5).map((coin, idx) => {
                if(idx === 1) console.log(coin.sparkline_in_7d)
                return <CoinCard 
                    key={`c${coin.id}`}
                    id={coin.id}
                    name={coin.name}
                    symbol={coin.symbol}
                    image={coin.image}
                    current_price={coin.current_price}
                    price_change_percentage_24h={coin.price_change_percentage_24h}
                    sparkline_in_7d={coin.sparkline_in_7d}
                    classes={`flex-shrink-0 mt-4 mb-6 ${idx === 0 ? "ml-8" : ""}`}
                />
            })}            
    </div>
}