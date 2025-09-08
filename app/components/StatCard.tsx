type StatCardProps = {
    title: string,
    value: number,
    change?: number,
    unit?: 'plain' | 'currency' | 'percent',
    currency?: 'USD' | 'EUR' | 'GBP' | 'SGD' | 'MYR' | string,
    compact?: boolean,
    classes?: string
}

export default function StatCard({
    title,
    value,
    change,
    unit = 'plain',
    currency = 'USD',
    compact = true,
    classes
}: StatCardProps) {
    const hasChange = change !== undefined
    const isPositive = change && change > 0
    const isZero = hasChange && change === 0

    const formattedValue =
    unit === 'currency'
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency,
          notation: compact ? 'compact' : 'standard',
          maximumFractionDigits: 2,
        }).format(value)
      : unit === 'percent'
      ? `${value.toFixed(2)}%`
      : new Intl.NumberFormat('en-US', {
          notation: compact ? 'compact' : 'standard',
          maximumFractionDigits: 2,
        }).format(value)

    return <div className={`stats-card rounded-2xl p-5 flex flex-col gap-2 w-full ${classes ?? ""}`}>
        <h3 className="text-xl w-full font-bold">{title}</h3>
        <p className="mt-auto text-2xl font-semibold">{formattedValue}</p>

        {hasChange && (
            <div className={
                isZero
                  ? 'text-zinc-400'
                  : isPositive
                  ? 'text-emerald-600'
                  : 'text-rose-600'
              }>
                {isPositive ? "▲" : "▼"} {Math.abs(change!).toFixed(2)}%
            </div>
        )}

    </div>
}