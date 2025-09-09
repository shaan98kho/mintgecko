import NavBtn from "./NavBtn"
import { href, Link } from "react-router"
import Logo from "./Logo"
import { BiSolidDashboard } from "react-icons/bi";
import { LuChartLine } from "react-icons/lu";
import { FaWallet } from "react-icons/fa6";
import { IoNewspaper } from "react-icons/io5";
import { RiExchangeFill } from "react-icons/ri";
import { IoIosSettings } from "react-icons/io";


export default function Drawer() {

    return <div className="drawer fixed inset-y-0 left-0 w-[240px] flex flex-col items-start justify-start min-h-screen pl-4 pr-8">
        <Link to={"/"}><Logo classes={"text-5xl pb-4 pt-6 px-2 cursor-pointer"} /></Link>
        <div className="pl-4 pt-2 pb-4 text-sm cursor-default">Overview</div>
        <div className="flex flex-col gap-4 font-medium w-full">
            <NavBtn caption={<><BiSolidDashboard />Dashboard</>} href="/"/>
            <NavBtn caption={<><LuChartLine />Market</>} href="/market"/>
            <NavBtn caption={<><FaWallet />Portfolio</>} href="/portfolio"/>
            <NavBtn caption={<><IoNewspaper />News</>} href="/news"/>
            <NavBtn caption={<><RiExchangeFill />Exchange</>} href="/exchange"/>
        </div>
        <div className="flex flex-col gap-4 mt-auto mb-8 w-full">
            <NavBtn caption={<><IoIosSettings/>Settings</>} href="/settings"/>
        </div>
    </div>
}
