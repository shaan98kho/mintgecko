type StatCardProps = {
    title: string,
    value: number,
    change?: number
}

export default function StatCard({title, value, change}: StatCardProps) {
    const isPositive = change && change > 0;


    return <div>
        {title}
        {value.toLocaleString()}
        {isPositive ? "▲" : "▼"}{change?.toFixed(2)}
    </div>
}