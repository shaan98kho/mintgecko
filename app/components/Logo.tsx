type LogoProps = {
    classes?: string | ""
}

export default function Logo({classes}: LogoProps) {
    return <h1 className={`logo ${classes}`}>mintgecko</h1>
}