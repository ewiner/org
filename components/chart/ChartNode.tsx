import React from "react";
import Branch, {BranchProps} from "./Branch";

type Props = BranchProps & {
    inline: boolean,
    className?: string,
    children: React.ReactNode
}

export default function ChartNode({inline, children, leafChildren, nonLeafChildren, className = ""}: Props) {
    return (
        <div>
            <div className="flex flex-col w-full">
                <div className={`flex ${inline ? "mb-2" : "justify-center"}`}>
                    <div
                        className={`bg-white ${className} shadow border border-gray-400 rounded-md p-2`}
                        style={{minWidth: "12rem"}}>
                        {children}
                    </div>
                </div>
            </div>
            {(leafChildren.length > 0 || nonLeafChildren.length > 0) &&
            <Branch leafChildren={leafChildren} nonLeafChildren={nonLeafChildren}/>}
        </div>
    );
};

