import fetchGsheet from "./fetchGsheet"
import {LeadPosition, Person, Role} from "../types";
import {isRawPerson} from "./fetchPeople.guard";

/** @see {isRawPerson} ts-auto-guard:type-guard */
export type RawPerson = {
    person: string,
    managertitle: string,
    role: "" | Role,
    program: string,
    subprogram: string,
    manager: string,
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
        .filter(person => person.name.length > 0)
    return {version, people}
}
