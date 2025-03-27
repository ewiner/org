import {Filter, FilterPerson, Hierarchy, Person, Program} from "./types";
import {SkippedRow} from "./api/fetchPeople";
import {groupBy} from "lodash";

function makeOrgHierarchy(people: Person[]): Hierarchy<Person>[] {
    const membersOf = people.reduce<{ [person: string]: Person[] }>((acc, person) => ({
        ...acc,
        [person.name || person.opening]: []
    }), {"": []})

    people.forEach(person => {
        if (membersOf[person.manager]) {
            membersOf[person.manager].push(person)
        }
    })

    function makeMembers(person: Person): Hierarchy<Person> {
        const members = membersOf[person.name || person.opening]
            .map(child => makeMembers(child))

        return {...person, members}
    }

    return membersOf[""].map(makeMembers)
}

function applyFilter(roots: Hierarchy<Person>[], filter: Filter): Hierarchy<FilterPerson>[] {
    function filterOrg(person: Hierarchy<Person>, managers: string[]): Hierarchy<FilterPerson> {
        const nextLevelManagers = [person.name || person.opening, ...managers]
        return {
            ...person,
            visible: filter(person, managers),
            members: person.members.map(p => filterOrg(p, nextLevelManagers))
        }
    }

    return roots.map(p => filterOrg(p, []))
}

function groupByPrograms(people: FilterPerson[]) {
    const byProgram = groupBy<FilterPerson>(people, p => p.program);

    const programs: Program[] = []
    for (const program of Object.keys(byProgram)) {
        const programPeople: FilterPerson[] = byProgram[program]

        const bySubprogram = groupBy<FilterPerson>(programPeople, p => p.subprogram)
        const subprograms: Program[] = []
        for (const subprogram of Object.keys(bySubprogram)) {
            if (subprogram !== "") {
                subprograms.push({
                    name: subprogram,
                    subprograms: [],
                    members: bySubprogram[subprogram]
                })
            }
        }

        programs.push({
            name: program || "No Program Assigned",
            subprograms: subprograms,
            members: bySubprogram[""] || []
        })
    }
    return programs
}

export type ProcessedPeople = {
    byManager: Hierarchy<FilterPerson>[],
    allPeople: Hierarchy<FilterPerson>[],
    byProgram: Program[],
    skippedRows: SkippedRow[]
}

export default function processData(people: Person[], filter: Filter): ProcessedPeople {
    // Find people whose managers don't match any name or opening
    const skippedRows: SkippedRow[] = [];
    
    // First, collect all names and openings from the dataset
    const allNamesAndOpenings = new Set<string>();
    people.forEach(person => {
        if (person.name) allNamesAndOpenings.add(person.name);
        if (person.opening) allNamesAndOpenings.add(person.opening);
    });
    
    // Now check each person's manager against the collected names and openings
    people.forEach(person => {
        // Skip if person has no manager
        if (!person.manager) {
            return;
        }
        
        // Check if the manager exists in the dataset
        if (!allNamesAndOpenings.has(person.manager)) {
            const {rowNumber, ...rowData} = person;
            skippedRows.push({
                rowData,
                reason: `Manager "${person.manager}" does not match any Name or Opening in the dataset`,
                rowNumber
            });
        }
    });
    
    const byManagerWithoutFilter = makeOrgHierarchy(people)
    const byManager = applyFilter(byManagerWithoutFilter, filter)

    function flatten(person: Hierarchy<FilterPerson>): Hierarchy<FilterPerson>[] {
        return [person, ...person.members.flatMap(flatten)]
    }
    const allPeople = byManager.flatMap(flatten)
    const byProgram = groupByPrograms(allPeople)
    return {
        allPeople,
        byManager,
        byProgram,
        skippedRows
    }
}
