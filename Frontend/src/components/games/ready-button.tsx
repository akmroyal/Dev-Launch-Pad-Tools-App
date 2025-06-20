type ReadyButtonProps = {
    isReady: boolean
    onReady: () => void
    disabled?: boolean
}

export default function ReadyButton({ isReady, onReady, disabled = false }: ReadyButtonProps) {
    return (
        <button
            className={`px-4 py-2 rounded-md font-bold transition-all duration-300 ${isReady
                    ? "bg-green-600 text-white cursor-not-allowed opacity-80"
                    : disabled
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed opacity-70"
                        : "bg-yellow-500 hover:bg-yellow-400 text-blue-950 hover:scale-105"
                }`}
            onClick={onReady}
            disabled={isReady || disabled}
        >
            {isReady ? "Ready ✓" : "Ready to Battle"}
        </button>
    )
}
