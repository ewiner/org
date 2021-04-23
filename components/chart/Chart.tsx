import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import Icon from "@mdi/react";
import {
    mdiClipboardCheckMultipleOutline,
    mdiClipboardTextMultipleOutline,
    mdiDownloadBoxOutline,
    mdiRefresh
} from "@mdi/js";
import {Filter} from "src/types";
import {ProcessedPeople} from "../../src/processData";
import Filters from "./Filters";
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import ActionButton from "./ActionButton";

type Props = {
    isRefreshing: boolean,
    refresh: () => void,
    setGlobalFilter: Dispatch<SetStateAction<Filter>>,
    peopleData: ProcessedPeople,
    children: React.ReactNode
}

function useZoom(extraProperty: string) {
    // The nonstandard CSS zoom property works better (adjusts the DOM size, better scroll performance),
    // but `transform: scale()` can animate. So we animate first with scale, then replace with CSS zoom.
    const [zoom, setZoom] = useState(1)
    const [smoothZoom, setSmoothZoom] = useState(1)
    const zoomIn = () => setSmoothZoom(1.25)
    const zoomOut = () => setSmoothZoom(1 / 1.25)
    const resetZoom = () => setSmoothZoom(1 / zoom)

    useEffect(() => {
        const timer = setTimeout(() => {
            setZoom(zoom * smoothZoom)
            setSmoothZoom(1)
        }, 150);
        return () => clearTimeout(timer);
    }, [smoothZoom]);

    const zoomClass = "transition transform-gpu origin-top-left"
    const zoomCss = {
        zoom: zoom,
        transform: `scale(${smoothZoom})`,
        transitionProperty: smoothZoom == 1 ? extraProperty : `transform, ${extraProperty}`
    }

    return [{zoomCss, zoomClass}, {zoomIn, zoomOut, resetZoom}] as const
}

export default function Chart(props: Props) {
    const {children, refresh, isRefreshing, setGlobalFilter, peopleData} = props

    const [{zoomCss, zoomClass}, {zoomIn, zoomOut, resetZoom}] = useZoom("margin-left")
    const [showFilterOptions, setShowFilterOptions] = useState(false)

    const mainArea = useRef()

    const [isDownloading, setDownloading] = useState(false)
    const [isCopying, setCopying] = useState(false)
    const [finishedCopying, setFinishedCopying] = useState(false)

    useEffect(() => {
        if (isDownloading) {
            (async () => {
                try {
                    const dataUrl = await htmlToImage.toPng(mainArea.current)
                    download(dataUrl, `Org Chart - ${new Date().toISOString().slice(0, 10)}.png`)
                } finally {
                    setDownloading(false)
                }
            })()
        }
    }, [isDownloading])

    useEffect(() => {
        if (isCopying) {
            (async () => {
                try {
                    const dataUrl = await htmlToImage.toPng(mainArea.current)
                    const fetchResponse = await fetch(dataUrl)
                    const pngBlob = await fetchResponse.blob()
                    // @ts-ignore doesn't know about ClipboardItem yet
                    await navigator.clipboard.write([new ClipboardItem({'image/png': pngBlob})])
                    setFinishedCopying(true)
                    setTimeout(() => setFinishedCopying(false), 2000)
                } finally {
                    setCopying(false)
                }
            })()
        }
    }, [isCopying])

    return (
        <>
            {React.Children.count(children) === 0 ?
                (
                    <div className="flex container p-4 text-gray-800">
                        <p>No data found. Please double-check that the Google sheet has all the correct columns.</p>
                    </div>
                ) :
                (<>
                        <div className={`fixed z-40 ml-4 grid grid-cols-1 ${showFilterOptions ? "" : "group"}`}>
                            <Filters
                                setGlobalFilter={setGlobalFilter}
                                peopleData={peopleData}
                                showFilterOptions={showFilterOptions}
                                setShowFilterOptions={setShowFilterOptions}
                            />
                            <ActionButton
                                icon={<Icon spin={isRefreshing} path={mdiRefresh} title="Refresh"
                                            className="h-4 w-4 inline-block"/>}
                                onClick={refresh}
                            >
                                Refresh
                            </ActionButton>

                            <ActionButton
                                topOfGroup={true}
                                icon={<Icon spin={isDownloading} path={mdiDownloadBoxOutline} title="Download Image"
                                            className="h-5 inline-block"/>}
                                onClick={() => setDownloading(true)}
                            >
                                Download PNG
                            </ActionButton>
                            <ActionButton
                                icon={<Icon
                                    spin={isCopying}
                                    path={finishedCopying ? mdiClipboardCheckMultipleOutline : mdiClipboardTextMultipleOutline}
                                    title="Export Image to Clipboard"
                                    className={`h-5 inline-block transition-colors ${finishedCopying ? "text-green-700" : "text-black"}`}
                                />}
                                onClick={() => setCopying(true)}
                            >
                                Copy Image
                            </ActionButton>

                            <ActionButton icon="+" onClick={zoomIn} topOfGroup={true}>Zoom In</ActionButton>
                            <ActionButton icon={<div className="text-base">1x</div>} onClick={resetZoom}>Reset
                                Zoom</ActionButton>
                            <ActionButton icon="-" onClick={zoomOut}>Zoom Out</ActionButton>
                        </div>
                        <div
                            ref={mainArea}
                            className={`flex p-4 pl-24 text-gray-800 ${showFilterOptions ? "ml-48" : "ml-0"} ${zoomClass}`}
                            style={zoomCss}>
                            {children}
                        </div>
                    </>
                )
            }
        </>
    )
}
