import React, {useEffect, useState} from "react";
import Icon from "@mdi/react";
import {mdiRefresh} from "@mdi/js";

type Props = {
    isRefreshing: boolean,
    refresh: () => void,
    children: React.ReactNode
}

export default function Chart(props: Props) {
    const {children, refresh, isRefreshing} = props

    // The nonstandard CSS zoom property works better (adjusts the DOM size, better scroll performance),
    // but `transform: scale()` can animate. So we animate first with scale, then replace with CSS zoom.
    const [zoom, setZoom] = useState(1)
    const [smoothZoom, setSmoothZoom] = useState(1)
    const zoomIn = () => setSmoothZoom(1.25)
    const zoomOut = () => setSmoothZoom(1 / 1.25)
    const resetTransform = () => setSmoothZoom(1 / zoom)

    useEffect(() => {
        const timer = setTimeout(() => {
            setZoom(zoom * smoothZoom)
            setSmoothZoom(1)
        }, 150);
        return () => clearTimeout(timer);
    }, [smoothZoom]);

    return (
        <>
            {React.Children.count(children) === 0 ?
                (
                    <div className="flex container p-4 text-gray-800">
                        <p>No data found. Please double-check that the Google sheet has all the correct columns.</p>
                    </div>
                ) :
                (<>
                        <div className="fixed z-40 m-4 grid grid-cols-1">
                            <button type="button"
                                    className="text-center mb-4 px-4 py-2 border border-t-0 border-gray-300 rounded-md shadow-sm text-xl font-bold bg-white hover:bg-gray-50 focus:outline-none outline-none"
                                    onClick={refresh}>
                                <Icon spin={isRefreshing} path={mdiRefresh} title="Refresh" className="h-4 inline-block"/>{" "}
                            </button>
                            <button type="button"
                                    className="text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-xl font-bold bg-white hover:bg-gray-50 focus:outline-none outline-none"
                                    onClick={zoomIn}>+
                            </button>
                            <button type="button"
                                    className="text-center px-4 py-2 border border-t-0 border-gray-300 rounded-md shadow-sm text-md  bg-white hover:bg-gray-50 focus:outline-none outline-none"
                                    onClick={resetTransform}>1x
                            </button>
                            <button type="button"
                                    className="text-center px-4 py-2 border border-t-0 border-gray-300 rounded-md shadow-sm text-xl font-bold bg-white hover:bg-gray-50 focus:outline-none outline-none"
                                    onClick={zoomOut}>-
                            </button>

                        </div>
                        <div className="flex p-4 pl-24 text-gray-800 transform-gpu origin-top-left transition-transform"
                             style={{
                                 zoom: zoom,
                                 transform: `scale(${smoothZoom})`,
                                 transitionProperty: smoothZoom == 1 ? "none" : "transform"
                             }}>
                            {children}
                        </div>
                    </>

                )
            }
        </>
    )
}
