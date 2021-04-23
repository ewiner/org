import React from "react";

type Props = {
    icon: React.ReactNode,
    onClick: () => void,
    pressed?: boolean,
    topOfGroup?: boolean,
    children?: React.ReactNode
}

export default function ActionButton(props: Props) {
    const {
        icon,
        onClick,
        pressed = false,
        topOfGroup = false,
        children = null
    } = props

    return (
        <button type="button"
                className={` 
                    ${topOfGroup ? "mt-4" : "border-t-0"} 
                    ${pressed ? "bg-gray-100 hover:bg-gray-200" : "bg-white hover:bg-gray-50"}
                    transition-all w-12 group-hover:w-40 delay-150 group-hover:delay-0
                    text-left whitespace-nowrap py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none outline-none
                `}
                onClick={onClick}>
            <div className="inline-block w-12 pr-1 mx-auto text-center text-xl font-bold">
                {icon}
            </div>
            <div
                className="mr-4 inline-block text-xs align-middle transition-all delay-150 group-hover:delay-0 invisible group-hover:visible">
                <div className="transition-opacity group-hover:delay-150 opacity-0 group-hover:opacity-100">
                    {children}
                </div>
            </div>
        </button>
    )
}
