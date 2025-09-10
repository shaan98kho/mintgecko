import { useEffect, useState } from "react"
import { type Coin } from "~/types"

type CoinCardProps = Pick<Coin, 
                            "id" |
                            "name" |
                            "symbol" |
                            "image" |
                            "current_price" |
                            "price_change_percentage_24h" |
                            "sparkline_in_7d"
                        > & {
                            classes?: string;
                          }

const W = 260
const H = 90
const PAD = 0

function toPath(values: number[], w=W, h=H) {
    if(!values?.length) return ""
    const min = Math.min(...values)
    const max = Math.max(...values)
    const dx = (w - PAD * 2) / (values.length - 1 || 1)
    const norm = (v: number) =>
      h - PAD - (max === min ? 0.5 : (v - min) / (max - min)) * (h - PAD * 2)
  
    let d = `M ${PAD} ${norm(values[0])}`
    values.forEach((v, i) => {
      const x = PAD + i * dx
      const y = norm(v)
      d += ` L ${x} ${y}`
    })

    return d
}

export default function CoinCard({
    id,
    name,
    symbol,
    image,
    current_price,
    price_change_percentage_24h,
    sparkline_in_7d,
    classes
}: CoinCardProps) {
    const up = (price_change_percentage_24h ?? 0) >= 0
    const prices = sparkline_in_7d?.price ?? []

    const line = toPath(prices)
    const area =
    line +
    ` L ${W} ${H} L 0 ${H} Z`;

    return <div className={`coin-card rounded-2xl p-5 ${classes}`}>
    <div className="flex items-center gap-3 mb-3">
      <img src={image} alt="" className="w-8 h-8" />
      <div>
        <div className="font-semibold text-gray-100">{name}</div>
        <div className="text-xs uppercase text-gray-500">
          {symbol}
        </div>
      </div>
    </div>

    {prices.length === 0 
      ? <div className=""><span>Not enough data</span></div> 
      : <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="mb-4">
        <defs>
          <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
            {/* light at top, fade to transparent */}
            <stop offset="0%" stopColor="#3492fa" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#030712" stopOpacity="0" />
          </linearGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* area fill */}
        <path d={area} fill={`url(#grad-${id})`} />
        {/* line */}
        <path
          d={line}
          fill="none"
          stroke="#d3fbd85a"
          strokeWidth="0.5"
          filter="url(#soft)"
        />
      </svg>
    }

    <div className="flex items-center justify-between">
      <div className="text-2xl font-semibold text-[#f6f9ff]">
        ${current_price.toLocaleString()} USD
      </div>
      <div
        className={`text-sm font-medium ${
          up ? "text-emerald-600" : "text-rose-600"
        }`}
      >
        {up ? "▲" : "▼"} {Math.abs(price_change_percentage_24h).toFixed(2)}%
      </div>
    </div>
  </div>
}