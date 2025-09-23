import { useId, useMemo } from "react";

type SparklineProps = {
    /** y-values to plot*/
    values: number[],
    /** viewBox width/height in px (SVG scales to 100% width by default) */
    width?: number,
    height?: number,
    /** inner padding in px for all sides */
    pad?: number,
    /** line appearance */
    stroke?: string,
    strokeWidth?: number,
    /** show translucent area under the line */
    showArea?: boolean,
    /** top color for the area gradient (fades to 0 at bottom) */
    gradientTop?: string,
    /** attach extra classes to the <svg/> */
    className?: string,
    /** turn off the soft blur if want line crisp */
    softShadow?: boolean,
    /** override the auto-generated id*/
    idOverride?: string,
}

const DEFAULTS = {
    width: 260,
    height: 90,
    pad: 0,
    stroke: "#d3fbd85a",
    strokeWidth: 0.5,
    gradientTop: "#3492fa",
    softShadow: true,
}

function toPath(values: number[], w: number, h: number, pad: number) {
    if (!values?.length) return ""

    const min = Math.min(...values)
    const max = Math.max(...values)
    const dx = (w - pad * 2) / Math.max(1, values.length - 1)
    const norm = (v: number) =>
    h - pad - (max === min ? 0.5 : (v - min) / (max - min)) * (h - pad * 2)

    let d = `M ${pad} ${norm(values[0])}`

    for (let i = 1; i < values.length; i++) {
        const x = pad + i * dx
        const y = norm(values[i])
        d += ` L ${x} ${y}`
    }

    return d
}

export default function Sparkline({
    values,
    width = DEFAULTS.width,
    height = DEFAULTS.height,
    pad = DEFAULTS.pad,
    stroke = DEFAULTS.stroke,
    strokeWidth = DEFAULTS.strokeWidth,
    showArea = true,
    gradientTop = DEFAULTS.gradientTop,
    className,
    softShadow = DEFAULTS.softShadow,
    idOverride,
}: SparklineProps) {
    const autoId = useId().replace(/:/g, "-") // keep it CSS/SVG-safe
    const uid = idOverride ?? autoId

    const { line, area } = useMemo(() => {
        const lineD = toPath(values, width, height, pad)
        const areaD = lineD ? `${lineD} L ${width} ${height} L 0 ${height} Z` : ""

        return { line: lineD, area: areaD }

    }, [values, width, height, pad])

    if (!values?.length) {
        return <div className="text-xs text-gray-400">Not enough data</div>
    }

    return (
    <svg
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
        className={className}
        role="img"
        aria-label="7-day price sparkline"
    >
        <defs>
            <linearGradient id={`grad-${uid}`} x1="0" y1="0" x2="0" y2="1">
            {/* light at top, fade to transparent */}
            <stop offset="0%" stopColor={gradientTop} stopOpacity="0.55" />
            <stop offset="100%" stopColor="#030712" stopOpacity="0" />
            </linearGradient>

            {softShadow && (
                <filter id={`soft-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                    <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            )}
        </defs>

        {showArea && area && <path d={area} fill={`url(#grad-${uid})`} />}
        
        {line && (
            <path
            d={line}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            filter={softShadow ? `url(#soft-${uid})` : undefined}
            />
        )}
    </svg>
    )
}
