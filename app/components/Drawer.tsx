import NavBtn from "./NavBtn"
import { href, Link } from "react-router"
import Logo from "./Logo"
import { BiSolidDashboard } from "react-icons/bi"
import { LuChartLine } from "react-icons/lu"
import { FaWallet } from "react-icons/fa6"
import { IoNewspaper } from "react-icons/io5"
import { RiExchangeFill } from "react-icons/ri"
import { IoIosSettings } from "react-icons/io"
import { IoClose } from "react-icons/io5"

type DrawerProps = {
    isOn: boolean,
    toggle: () => void,
    onNavigate: () => void,
}

export default function Drawer({isOn, toggle, onNavigate}: DrawerProps) {

    return <div className={`drawer fixed  flex flex-col justify-start min-h-screen overflow-y-auto no-scrollbar pl-4 pr-8 z-2 ${isOn ? "" : "slideOut"}`}>
        <Link to={"/"} onClick={onNavigate}><Logo classes={"text-5xl pb-4 pt-6 px-2 cursor-pointer"} /></Link>
        <div className="pl-4 pt-2 pb-4 text-sm cursor-default">Overview</div>
        <div className="flex flex-col gap-4 font-medium w-full">
            <NavBtn caption={<><BiSolidDashboard />Dashboard</>} href="/" onClick={onNavigate}/>
            <NavBtn caption={<><LuChartLine />Market</>} href="/market" onClick={onNavigate}/>
            <NavBtn caption={<><FaWallet />Portfolio</>} href="/portfolio" onClick={onNavigate}/>
            <NavBtn caption={<><IoNewspaper />News</>} href="/news" onClick={onNavigate}/>
            <NavBtn caption={<><RiExchangeFill />Exchange</>} href="/exchange" onClick={onNavigate}/>
        </div>
        <div className="flex flex-col gap-4 pt-8 mt-auto mb-8 w-full">
            <NavBtn caption={<><IoIosSettings/>Settings</>} href="/settings" onClick={onNavigate}/>
        </div>
        <button onClick={toggle} className=" absolute size-8 right-8 top-8 cursor-pointer"><IoClose className="nav-close size-full"/></button>
        <span className="text-center text-xs">This is just an independant personal project intended for portfolio, <a
            href="https://www.coingecko.com/en/api"
            target="_blank"
            rel="noreferrer"
            className="drawer-attribution underline"
        >
        all data provided by CoinGecko
        </a></span>
    </div>
}
