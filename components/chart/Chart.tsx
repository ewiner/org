import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import Icon from "@mdi/react";
import {mdiFilter, mdiRefresh} from "@mdi/js";
import FilterSettings, {FilterDropdown} from "./FilterSettings";
import {Filter, Hierarchy, Person} from "src/types";
import {useRouter} from "next/router";
import {ProcessedPeople} from "../../src/processData";


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

    const zoomClass = "transform-gpu origin-top-left transition-transform"
    const zoomCss = {
        zoom: zoom,
        transform: `scale(${smoothZoom})`,
        transitionProperty: smoothZoom == 1 ? extraProperty : `transform, ${extraProperty}`
    }

    return [{zoomCss, zoomClass}, {zoomIn, zoomOut, resetZoom}] as const
}

function useFilter(queryPath: string, makeFilter: (setting: string | null) => Filter) {
    const router = useRouter()
    const [setting, setSetting] = useState<string | null>(router.query[queryPath] as string)
    const [filter, setFilter] = useState<Filter>(() => makeFilter(setting))
    useEffect(() => {
        setFilter(() => makeFilter(setting))
        const newQuery = {...router.query}
        delete newQuery[queryPath]
        if (setting) newQuery[queryPath] = setting
        router.push({
            pathname: router.pathname,
            query: newQuery
        }, null, {
            shallow: true,
            scroll: false
        })
    }, [setting])
    return {setting, filter, setSetting} as const
}

export default function Chart(props: Props) {
    const {children, refresh, isRefreshing, setGlobalFilter, peopleData} = props

    const [{zoomCss, zoomClass}, {zoomIn, zoomOut, resetZoom}] = useZoom("margin-left")

    const managerFilter = useFilter(
        "manager",
        setting => ((person, managers) =>
                !setting || person.name === setting || person.opening === setting || managers.indexOf(setting) !== -1
        )
    )
    const programFilter = useFilter(
        "program",
        setting => ((person) =>
                !setting || person.program === setting || person.subprogram === setting
        )
    )
    const statusFilter = useFilter(
        "status",
        setting => (person) => {
            switch (setting) {
                case null:
                    return true
                case "Current Employees Only":
                    return person.opening === ""
                case "Openings & Consultants Only":
                    return person.opening !== ""
                default:
                    return true
            }
        }
    )

    const subfilterSettings = [managerFilter, programFilter, statusFilter]
    const subfilters = subfilterSettings.map(f => f.filter)
    const numFilters = subfilterSettings.filter(f => !!f.setting).length

    const resetFilters = () => {
        setShowFilterOptions(false)
        // hack: if you do this too quick, the router.push() calls interfere with each other
        // so we use setTimeout() to space out the setSetting() calls
        subfilterSettings.forEach((f, i) => setTimeout(() => f.setSetting(null), i * 16))
    }

    useEffect(() => {
        setGlobalFilter(() => (person, managers) => {
            for (const filter of subfilters) {
                if (!filter(person, managers)) {
                    return false
                }
            }
            return true
        })
    }, subfilters)

    const [showFilterOptions, setShowFilterOptions] = useState(false)
    const toggleShowFilterOptions = () => setShowFilterOptions(!showFilterOptions)

    const programChoices = peopleData.byProgram.flatMap(program => {
        const subChoices = program.subprograms.map(s => `\t${s.name}`)
        return [program.name, ...subChoices]
    })

    const makeManagerChoice = (person: Hierarchy<Person>, level: number = 0) => {
        const spacer = '\t'.repeat(level)
        if (person.members.length === 0) return []
        return [spacer + (person.name || person.opening), ...person.members.flatMap(m => makeManagerChoice(m, level + 1))];
    }
    const managerChoices = peopleData.byManager.flatMap(p => makeManagerChoice(p, 0))

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
                            <FilterSettings visible={showFilterOptions} resetFilters={resetFilters}>
                                <FilterDropdown
                                    label="By manager:"
                                    emptyChoice="All"
                                    choices={managerChoices}
                                    setting={managerFilter.setting} setSetting={managerFilter.setSetting}
                                />
                                <FilterDropdown
                                    label="By program:"
                                    emptyChoice="All"
                                    choices={programChoices}
                                    setting={programFilter.setting} setSetting={programFilter.setSetting}
                                />
                                <FilterDropdown
                                    label="By employment:"
                                    emptyChoice="All Statuses"
                                    choices={["Current Employees Only", "Openings & Consultants Only"]}
                                    setting={statusFilter.setting} setSetting={statusFilter.setSetting}
                                />
                            </FilterSettings>
                            <button type="button"
                                    className={`${showFilterOptions ? "bg-gray-100 hover:bg-gray-200" : "bg-white hover:bg-gray-50"} text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-xl font-bold focus:outline-none outline-none`}
                                    onClick={toggleShowFilterOptions}>
                                <Icon path={mdiFilter} title="Filters" className="h-4 inline-block"/>
                                {numFilters > 0 ? <span className="absolute text-xs">{numFilters}</span> : null}
                            </button>
                            <button type="button"
                                    className="text-center mb-4 px-4 py-2 border border-t-0 border-gray-300 rounded-md shadow-sm text-xl font-bold bg-white hover:bg-gray-50 focus:outline-none outline-none"
                                    onClick={refresh}>
                                <Icon spin={isRefreshing} path={mdiRefresh} title="Refresh"
                                      className="h-4 inline-block"/>{" "}
                            </button>
                            <button type="button"
                                    className="text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-xl font-bold bg-white hover:bg-gray-50 focus:outline-none outline-none"
                                    onClick={zoomIn}>+
                            </button>
                            <button type="button"
                                    className="text-center px-4 py-2 border border-t-0 border-gray-300 rounded-md shadow-sm text-md  bg-white hover:bg-gray-50 focus:outline-none outline-none"
                                    onClick={resetZoom}>1x
                            </button>
                            <button type="button"
                                    className="text-center px-4 py-2 border border-t-0 border-gray-300 rounded-md shadow-sm text-xl font-bold bg-white hover:bg-gray-50 focus:outline-none outline-none"
                                    onClick={zoomOut}>-
                            </button>

                        </div>
                        <div className={`flex p-4 pl-24 text-gray-800 ml-${showFilterOptions ? 48 : 0} ${zoomClass}`}
                             style={zoomCss}>
                            {children}
                        </div>
                    </>

                )
            }
        </>
    )
}
