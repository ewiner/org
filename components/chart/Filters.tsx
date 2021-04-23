import {Filter, Hierarchy, Person} from "../../src/types";
import {useRouter} from "next/router";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {ProcessedPeople} from "../../src/processData";
import FilterSettings, {FilterDropdown} from "./FilterSettings";
import Icon from "@mdi/react";
import {mdiFilter} from "@mdi/js";

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

type Props = {
    setGlobalFilter: Dispatch<SetStateAction<Filter>>,
    peopleData: ProcessedPeople,
    showFilterOptions: boolean,
    setShowFilterOptions: Dispatch<SetStateAction<boolean>>,
}

export default function Filters({setGlobalFilter, peopleData, showFilterOptions, setShowFilterOptions}: Props) {

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
        subfilterSettings.forEach((f, i) => setTimeout(() => f.setSetting(null), i * 128))
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
        </>
    )
}
