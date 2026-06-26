import { useEffect, useMemo, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "~/state/hooks"
import { useParams, useLocation } from "react-router-dom"

export default function Coin() {
    const { coinid } = useParams()
    return <>
        {coinid}
    </>
}