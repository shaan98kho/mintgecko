import { useEffect } from "react"

interface OnClickOutsideProps<T extends HTMLElement> {
    ref: React.RefObject<T | null>,
    handler: (e: MouseEvent | TouchEvent) => void
}

export default function useOnClickOutside<T extends HTMLElement>({ref, handler}: OnClickOutsideProps<T>) {
    useEffect(() => {
        const listener = (e: MouseEvent | TouchEvent) => {
            if(!ref.current || ref.current.contains(e.target as Node)) {
                return
            }
            handler(e)
        }

        document.addEventListener("mousedown", listener)
        document.addEventListener("touchstart", listener)

        return () => {
            document.removeEventListener("mousedown", listener)
            document.removeEventListener("touchstart", listener)
        }

    }, [ref, handler])
}