import Sparkline from "./Sparkline";
import { type Coin } from "~/types";

type CoinCardProps = Pick<
  Coin,
  | "id"
  | "name"
  | "symbol"
  | "image"
  | "current_price"
  | "price_change_percentage_24h"
  | "sparkline_in_7d"
> & {
  classes?: string;
};

export default function CoinCard({
  id,
  name,
  symbol,
  image,
  current_price,
  price_change_percentage_24h,
  sparkline_in_7d,
  classes,
}: CoinCardProps) {
  const up = (price_change_percentage_24h ?? 0) >= 0;
  const prices = sparkline_in_7d?.price ?? [];

  return (
    <div className={`coin-card rounded-2xl p-5 ${classes ?? ""}`}>
      <div className="flex items-center gap-3 mb-3">
        <img src={image} alt="" className="w-8 h-8" />
        <div>
          <div className="font-semibold text-gray-100">{name}</div>
          <div className="text-xs uppercase text-gray-500">{symbol}</div>
        </div>
      </div>

      <Sparkline
        values={prices}
        width={260}
        height={90}
        pad={0}
        stroke="#d3fbd85a"
        strokeWidth={0.5}
        gradientTop="#3492fa"
        className="mb-4"
        // isolate filters/gradients per coin
        idOverride={id}
      />

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
  )
}
