import { useEffect, useMemo, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "~/state/hooks"
import { useParams, useLocation } from "react-router-dom"
import { fetchCoinById } from "~/features/coins/coinsSlice"

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

    if(error) return <>Here by mistake? Go back</>
    return <>
        {coinid}
        
        <img src={coin?.image.thumb} alt="" className="w-8 h-8" />
    </>
}
