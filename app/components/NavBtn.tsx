import type { ReactNode } from "react"
import { NavLink } from "react-router"

type NavBtnProps = {
    caption: string | ReactNode,
    href: string,
    classes?: string | ""
}

export default function NavBtn({caption, href, classes}: NavBtnProps) {
    return <NavLink to={href} 
    className={
        ({ isActive }) =>
        `py-2 px-4 text-lg capitalize nav-btn rounded-2xl flex items-center gap-2 ${classes} ${
          isActive
            ? "active p-2"
            : ""
        }`}>{caption}</NavLink>
}