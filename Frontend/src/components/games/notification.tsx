import { useEffect, useState } from "react"

type NotificationProps = {
    message: string
}

export default function Notification({ message }: NotificationProps) {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 3000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div
            className={`fixed top-4 right-4 bg-gray-900 border border-gray-700 text-white px-6 py-4 rounded-lg shadow-lg transition-opacity duration-300 z-50 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
        >
            <p>{message}</p>
        </div>
    )
}
