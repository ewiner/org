import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import Icon from "@mdi/react";
import {
    mdiClipboardCheckMultipleOutline,
    mdiClipboardTextMultipleOutline,
    mdiDownloadBoxOutline,
    mdiFitToScreenOutline,
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
    // State for zoom and pan
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [animating, setAnimating] = useState(false);
    const [animationDuration, setAnimationDuration] = useState(150);
    
    // Refs for tracking interactions and boundaries
    const lastPosition = useRef({ x: 0, y: 0 });
    const isPanning = useRef(false);
    const startPanPosition = useRef({ x: 0, y: 0 });
    const contentBounds = useRef({ width: 0, height: 0 });
    const containerBounds = useRef({ width: 0, height: 0 });
    
    // Update content and container bounds
    const updateBounds = (containerEl: HTMLElement | null, contentEl: HTMLElement | null) => {
        if (!containerEl || !contentEl) return;
        
        containerBounds.current = {
            width: containerEl.clientWidth,
            height: containerEl.clientHeight
        };
        
        contentBounds.current = {
            width: contentEl.scrollWidth,
            height: contentEl.scrollHeight
        };
    };
    
    // Calculate bounds for panning to keep content within view
    const getBoundedPosition = (x: number, y: number, currentScale: number) => {
        const containerWidth = containerBounds.current.width;
        const containerHeight = containerBounds.current.height;
        const contentWidth = contentBounds.current.width * currentScale;
        const contentHeight = contentBounds.current.height * currentScale;
        
        // For horizontal panning - allow full content viewing with slight padding
        // Add 100px to account for the reported right side cut-off
        let minX = Math.min(0, containerWidth - contentWidth);
        if (contentWidth > containerWidth) {
            minX -= 100; // Add extra space on the right side
        }
        
        // For vertical panning - add substantial padding to ensure visibility at all zoom levels
        // Apply a multiplier to the content height to ensure we can scroll further down
        // This helps especially at 1x zoom where scrolling might be limited
        const extraVerticalPadding = Math.max(500, contentHeight * 0.3); // At least 500px or 30% of content height
        let minY = Math.min(0, containerHeight - (contentHeight + extraVerticalPadding));
        
        // Set maxX and maxY to allow some overflow for better UX
        // This prevents content from getting stuck at edges
        const maxX = 50;
        const maxY = 50;
        
        // Apply a more aggressive constraint relaxation for 1x zoom level
        if (currentScale <= 1.1) {
            // At or near 1x zoom, provide even more scrolling space
            minY = Math.min(minY, -contentHeight); // Allow scrolling beyond the theoretical bottom
        }
        
        return {
            x: Math.max(minX, Math.min(maxX, x)),
            y: Math.max(minY, Math.min(maxY, y))
        };
    };
    
    // Zoom functions with position awareness
    const zoomAtPoint = (delta: number, center: { x: number, y: number }, isAnimated: boolean = true) => {
        if (animating && isAnimated) return;
        
        // Convert center point from screen coordinates to content coordinates
        const contentX = (center.x - position.x) / scale;
        const contentY = (center.y - position.y) / scale;
        
        // Calculate new scale with limits
        const newScale = Math.max(0.1, Math.min(5, scale * (1 + delta)));
        
        // Calculate new position to keep the content point under the cursor
        // Important: Do NOT apply bounds here - that's what causes the positioning issues
        const newX = center.x - contentX * newScale;
        const newY = center.y - contentY * newScale;
        
        if (isAnimated) {
            setAnimating(true);
            setTimeout(() => setAnimating(false), animationDuration);
        }
        
        setScale(newScale);
        setPosition({ x: newX, y: newY });
    };
    
    const zoomIn = (center?: { x: number, y: number }, intensity: number = 0.25) => {
        const zoomCenter = center || { 
            x: containerBounds.current.width / 2, 
            y: containerBounds.current.height / 2 
        };
        zoomAtPoint(intensity, zoomCenter);
    };
    
    const zoomOut = (center?: { x: number, y: number }, intensity: number = 0.2) => {
        const zoomCenter = center || { 
            x: containerBounds.current.width / 2, 
            y: containerBounds.current.height / 2 
        };
        zoomAtPoint(-intensity, zoomCenter);
    };
    
    const resetZoom = () => {
        setAnimating(true);
        setTimeout(() => setAnimating(false), animationDuration);
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };
    
    // Function to set a specific zoom level
    const setSpecificZoom = (newZoom: number, isInitialZoom: boolean = false, centerX?: number, centerY?: number) => {
        setAnimationDuration(isInitialZoom ? 500 : 150);
        
        if (centerX !== undefined && centerY !== undefined) {
            const center = { x: centerX, y: centerY };
            const delta = (newZoom / scale) - 1;
            zoomAtPoint(delta, center, true);
        } else {
            setAnimating(true);
            setTimeout(() => setAnimating(false), animationDuration);
            setScale(newZoom);
            
            // For center zooming, we can still apply bounds
            // This is only for the case where no specific center point is provided
            const boundedPosition = getBoundedPosition(position.x, position.y, newZoom);
            setPosition(boundedPosition);
        }
    };
    
    // Pan to a specific position
    const panTo = (x: number, y: number, isAnimated: boolean = true) => {
        // Only apply bounds during explicit panning operations
        const boundedPosition = getBoundedPosition(x, y, scale);
        
        if (isAnimated) {
            setAnimating(true);
            setTimeout(() => setAnimating(false), animationDuration);
        }
        
        setPosition(boundedPosition);
    };
    
    // Calculate transform style
    const transformStyle = {
        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        transformOrigin: 'top left',
        transition: animating ? `transform ${animationDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1), ${extraProperty} ${animationDuration}ms` : extraProperty,
    };
    
    // Event handlers for the container
    const setupEventHandlers = (element: HTMLElement | null, contentEl: HTMLElement | null) => {
        if (!element || !contentEl) return () => {};
        
        // Update bounds initially
        updateBounds(element, contentEl);
        
        // Wheel event handler for pan and zoom
        const handleWheel = (e: WheelEvent) => {
            // Prevent default to avoid browser scroll
            e.preventDefault();
            
            // Get the pointer position relative to the element
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Alt/Option + wheel for zoom
            if (e.altKey) {
                // Normalize deltaY for consistent zoom speed
                const delta = -e.deltaY * 0.003; // Increased sensitivity
                zoomAtPoint(delta, { x, y }, false);
            }
            // Pinch gesture (detected via ctrlKey on many trackpads)
            else if (e.ctrlKey) {
                // Normalize deltaY for consistent zoom speed - much more sensitive for pinch
                const delta = -e.deltaY * 0.01; // Significantly increased sensitivity for pinch
                zoomAtPoint(delta, { x, y }, false);
            }
            // Regular wheel for pan
            else {
                const newX = position.x - e.deltaX;
                const newY = position.y - e.deltaY;
                panTo(newX, newY, false);
            }
        };
        
        // Double click handler for zoom
        const handleDoubleClick = (e: MouseEvent) => {
            // Get the pointer position relative to the element
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Shift + double-click to zoom out
            if (e.shiftKey) {
                zoomOut({ x, y }, 0.5); // Increased zoom intensity for double-click
            }
            // Regular double-click to zoom in
            else {
                zoomIn({ x, y }, 0.5); // Increased zoom intensity for double-click
            }
        };
        
        // Window resize handler to update bounds
        const handleResize = () => {
            updateBounds(element, contentEl);
            
            // Re-apply bounded position after resize
            const boundedPosition = getBoundedPosition(position.x, position.y, scale);
            setPosition(boundedPosition);
        };
        
        // Add event listeners
        element.addEventListener('wheel', handleWheel, { passive: false });
        element.addEventListener('dblclick', handleDoubleClick);
        window.addEventListener('resize', handleResize);
        
        // Return cleanup function
        return () => {
            element.removeEventListener('wheel', handleWheel);
            element.removeEventListener('dblclick', handleDoubleClick);
            window.removeEventListener('resize', handleResize);
        };
    };
    
    // Fit content to view
    const fitToView = (containerEl: HTMLElement | null, contentEl: HTMLElement | null, isInitialZoom: boolean = false) => {
        if (!containerEl || !contentEl) return;
        
        // Update bounds
        updateBounds(containerEl, contentEl);
        
        // Get the viewport dimensions
        const viewportWidth = containerBounds.current.width;
        const viewportHeight = containerBounds.current.height;
        
        // Get the content dimensions
        const contentWidth = contentBounds.current.width;
        const contentHeight = contentBounds.current.height;
        
        // Calculate the scale needed to fit the content
        const widthRatio = viewportWidth / contentWidth;
        const heightRatio = viewportHeight / contentHeight;
        const newScale = Math.min(widthRatio, heightRatio, 1);
        
        // Calculate the position to center the content
        const newX = (viewportWidth - contentWidth * newScale) / 2;
        const newY = Math.min((viewportHeight - contentHeight * newScale) / 2, 0);
        
        // Apply the new scale and position with animation
        setAnimationDuration(isInitialZoom ? 500 : 150);
        setAnimating(true);
        setTimeout(() => setAnimating(false), animationDuration);
        setScale(newScale);
        setPosition({ x: newX, y: newY });
    };
    
    return {
        transformStyle,
        zoomIn,
        zoomOut,
        resetZoom,
        setSpecificZoom,
        panTo,
        setupEventHandlers,
        fitToView,
        scale,
        updateBounds
    };
}

export default function Chart(props: Props) {
    const {children, refresh, isRefreshing, setGlobalFilter, peopleData} = props

    const { 
        transformStyle, 
        zoomIn, 
        zoomOut, 
        resetZoom, 
        setSpecificZoom,
        setupEventHandlers,
        fitToView,
        scale,
        updateBounds
    } = useZoom("margin-left");
    
    const [showFilterOptions, setShowFilterOptions] = useState(false)

    const mainAreaRef = useRef<HTMLDivElement>(null)
    const chartContentRef = useRef<HTMLDivElement>(null)
    const outerContainerRef = useRef<HTMLDivElement>(null)
    const isFirstLoad = useRef(true)

    const [isDownloading, setDownloading] = useState(false)
    const [isCopying, setCopying] = useState(false)
    const [finishedCopying, setFinishedCopying] = useState(false)
    
    // Set up event handlers for zoom and pan on the outer container
    useEffect(() => {
        if (!outerContainerRef.current || !chartContentRef.current) return;
        
        const cleanup = setupEventHandlers(outerContainerRef.current, chartContentRef.current);
        return cleanup;
    }, [setupEventHandlers]);
    
    // Update bounds when filter options visibility changes
    useEffect(() => {
        if (outerContainerRef.current && chartContentRef.current) {
            updateBounds(outerContainerRef.current, chartContentRef.current);
        }
    }, [showFilterOptions, updateBounds]);
    
    // Function to calculate and set the appropriate zoom level
    const fitChartToView = (isInitialZoom: boolean = false) => {
        fitToView(outerContainerRef.current, chartContentRef.current, isInitialZoom);
    };

    // Fit chart to view only on initial load, not when content changes
    useEffect(() => {
        if (isFirstLoad.current && outerContainerRef.current && chartContentRef.current) {
            // Wait for the chart to render completely
            const timer = setTimeout(() => {
                // Pass true to indicate this is the initial zoom
                fitChartToView(true);
                // Mark that we've done the initial zoom
                isFirstLoad.current = false;
            }, 500); // Increased timeout to ensure content is fully rendered
            
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        if (isDownloading) {
            (async () => {
                try {
                    const dataUrl = await htmlToImage.toPng(mainAreaRef.current)
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
                    const dataUrl = await htmlToImage.toPng(mainAreaRef.current)
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
                (
                    // This outer div captures all zoom/pan events for the entire viewport
                    <div 
                        ref={outerContainerRef} 
                        className="relative w-full h-full overflow-hidden"
                    >
                        <div className={`fixed z-40 ml-4 pb-4 grid grid-cols-1 ${showFilterOptions ? "" : "group"}`}>
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

                            <ActionButton icon="+" onClick={() => zoomIn()} topOfGroup={true}>Zoom In</ActionButton>
                            <ActionButton 
                                icon={<Icon path={mdiFitToScreenOutline} title="Fit to View"
                                            className="h-5 inline-block"/>}
                                onClick={() => fitChartToView()}
                            >
                                Fit to View
                            </ActionButton>
                            <ActionButton icon={<div className="text-base">1x</div>} onClick={resetZoom}>Reset
                                Zoom</ActionButton>
                            <ActionButton icon="-" onClick={() => zoomOut()}>Zoom Out</ActionButton>
                        </div>
                        
                        {/* This is the transformable content container */}
                        <div
                            ref={mainAreaRef}
                            className={`flex p-4 pl-24 text-gray-800 ${showFilterOptions ? "ml-48" : "ml-0"}`}
                            style={{...transformStyle, marginLeft: showFilterOptions ? "12rem" : "0"}}>
                            <div ref={chartContentRef} className="flex">
                                {children}
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}
