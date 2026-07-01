import { useEffect, useMemo, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "~/state/hooks"
import { useParams, useLocation } from "react-router-dom"
import { fetchCoinById } from "~/features/coins/coinsSlice"
import { FaSortDown, FaSortUp } from "react-icons/fa6"

export default function Coin() {
    const { coinid } = useParams()
    const dispatch = useAppDispatch()
    const {coin, status, error} = useAppSelector(s => s.coin)

    useEffect(() => {
        if(!coinid) return
        if(status==='idle') {
            dispatch(fetchCoinById(coinid))
        }
    }, [dispatch, coinid, status])

    const change24h = coin?.market_data.price_change_percentage_24h;
    const isUp = (change24h ?? 0) >= 0;


    if(error) return <>Here by mistake? Go back</>
    return <div className="p-8">
        <div className="flex items-center gap-2 flex-wrap">
            <img src={coin?.image.thumb} alt="" className="w-6 h-6" /><h1 className="font-bold text-xl">{coin?.name}</h1>
            <span className="">{coin?.symbol}</span>
        </div>
        <div className="flex items-center pt-4 gap-3">
            <h2 className="text-2xl font-bold">{coin?.market_data.current_price.usd.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
            })}</h2>
            <div className={`${isUp ? "text-emerald-600" : "text-red-600"} flex items-center gap-1`}>
            {isUp ?<FaSortUp className="relative top-1"/> : <FaSortDown className="relative bottom-1"/>}
            <span className={`font-bold`}>
                {change24h?.toFixed(2)}%
            </span>
            </div>
        </div>
        
        
    </div>
}
