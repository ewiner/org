import fetchGsheet from "./fetchGsheet"
import {LeadPosition, Person, Role} from "../types";
import {isRawPerson} from "./fetchPeople.guard";

/** @see {isRawPerson} ts-auto-guard:type-guard */
export type RawPerson = {
    person: string,
    jobtitle: string,
    manager: string,
    managertitle: string,
    opening: string,
    icrole: "" | Role,
    program: string,
    subprogram: string,
    teamleadrole: "" | LeadPosition
}

type PeopleData = {
    version: string,
    people: Person[]
}

export default async function fetchPeople(sheetId: number): Promise<PeopleData | null> {
    const sheet = await fetchGsheet(sheetId)
    if (sheet.result !== "success") {
        return null
    }
    const version = sheet.sheetName
    const people = sheet.rows
        .filter(o => isRawPerson(o))
        .map(personData => {
            // rename the "person" column to "name"
            const {person, ...rest} = personData
            return {...rest, name: person}
        })
    return {version, people}
}
