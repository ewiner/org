import fetchGsheet from "./fetchGsheet"
import {LeadPosition, Person} from "../types";
import {isRawPerson} from "./fetchPeople.guard";

/** @see {isRawPerson} ts-auto-guard:type-guard */
export type RawPerson = {
    hide?: string,
    person: string,
    jobtitle: string,
    manager: string,
    opening: string,
    icrole: string,
    program: string,
    subprogram: string,
    teamleadrole: "" | LeadPosition
}

export type PeopleData = {
    version: string,
    people: Person[]
}

export default async function fetchPeople(workbook: string, sheetId: number): Promise<PeopleData | null> {
    const sheet = await fetchGsheet(workbook, sheetId)
    if (sheet.result !== "success") {
        return null
    }
    const version = sheet.sheetName
    const people = sheet.rows
        .filter(o => !o.hide)
        .filter(o => isRawPerson(o))
        .filter(o => o.person || o.opening)
        .map(personData => {
            // rename the "person" column to "name"
            const {person, ...rest} = personData
            return {...rest, name: person}
        })

    people.sort((a, b) => {
        function trySort(fn: ((p: Person) => any)): number {
            const aResult = fn(a)
            const bResult = fn(b)
            if (aResult < bResult) return -1
            if (aResult > bResult) return 1
            return 0
        }

        return trySort(p => p.program) ||
            trySort(p => p.subprogram) ||
            trySort(p => p.icrole) ||
            -trySort(p => p.teamleadrole) ||
            trySort(p => p.opening !== "") ||
            trySort(p => p.name || "zz") ||
            trySort(p => p.opening)
    })

    return {version, people}
}
