import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "~/state/hooks"
import { fetchCoins } from "~/features/coins/coinsSlice"

export default function Home() {
	const dispatch = useAppDispatch()
	const coins = useAppSelector(s => s.coins.items)
	const status = useAppSelector(s => s.coins.status);
	
	useEffect(() => {
		dispatch(fetchCoins())
	}, [dispatch])

	if(!coins) return <>Error fetching</>

	console.log(coins)
	return <div>
		{/* {coins?.map(coin => (<div key={coin.id}>
			{coin.name}
		</div>))} */}
		this is Home
	</div>;
}