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

export type SkippedRow = {
    rowData: Record<string, any>,
    reason: string,
    rowNumber: number
}

export type PeopleData = {
    version: string,
    people: Person[],
    skippedRows: SkippedRow[]
}

export default async function fetchPeople(workbook: string, sheetId: number): Promise<PeopleData | null> {
    const sheet = await fetchGsheet(workbook, sheetId)
    if (sheet.result !== "success") {
        console.log(`Couldn't retrieve workbook ${workbook}:\n${JSON.stringify(sheet.result, undefined, 2)}`)
        return null
    }
    const version = sheet.sheetName
    const skippedRows: SkippedRow[] = []
    
    // Process rows and track skipped ones
    const people = sheet.rows.reduce((validPeople: any[], row: any, index: number) => {
        // Add 2 to index because spreadsheet rows are 1-indexed and we have a header row
        const rowNumber = index + 2;
        
        // Check if row should be hidden - don't track these in skippedRows
        if (row.hide) {
            return validPeople
        }
        
        // Check if row has valid structure
        if (!isRawPerson(row)) {
            skippedRows.push({
                rowData: row,
                reason: "Invalid data structure (missing required fields or wrong data types)",
                rowNumber
            })
            return validPeople
        }
        
        // Check if row has person or opening
        if (!row.person && !row.opening) {
            skippedRows.push({
                rowData: row,
                reason: "Missing required data (both person and opening fields are empty)",
                rowNumber
            })
            return validPeople
        }
        
        // Row is valid, rename the "person" column to "name"
        const {person, ...rest} = row
        validPeople.push({...rest, name: person})
        return validPeople
    }, [])

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

    return {version, people, skippedRows}
}
