type StatCardProps = {
    title: string,
    value: number,
    change?: number,
    classes?: string
}

export default function StatCard({title, value, change, classes}: StatCardProps) {
    const hasChange = change !== undefined
    const isPositive = change && change > 0

    return <div className={`stats-card rounded-2xl p-5 flex flex-col gap-2 min-w-[180px] ${classes ?? ""}`}>
        <h3 className="text-xl w-full font-bold">{title}</h3>
        <p className="mt-auto">{value.toLocaleString()}</p>

        {hasChange && (
            <div className={isPositive ? "text-emerald-600" : "text-rose-600"}>
                {isPositive ? "▲" : "▼"}{Math.abs(change!).toFixed(2)}
            </div>
        )}

    </div>
}