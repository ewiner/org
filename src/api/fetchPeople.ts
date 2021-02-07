import fetchGsheet from "./fetchGsheet"
import {LeadPosition, Person, Role} from "../types";

type RawPerson = {
    person: string,
    role: "" | Role,
    program: string,
    subprogram: string,
    manager: string,
    lead: "" | LeadPosition
}

export default async function fetchPeople(sheetId: number) {
    const data = await fetchGsheet(sheetId) as RawPerson[]
    const mungedData: Person[] = data
        .map(personData => {
            const {person, ...rest} = personData
            return {...rest, name: person}
        })
        .filter(person => person.name.length > 0)
    return mungedData
}
