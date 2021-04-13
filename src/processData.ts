import {Filter, FilterPerson, Hierarchy, Person, Program} from "./types";
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
    allPeople: FilterPerson[],
    byProgram: Program[]
}

export default function processData(people: Person[], filter: Filter): ProcessedPeople {
    const byManagerWithoutFilter = makeOrgHierarchy(people)
    const byManager = applyFilter(byManagerWithoutFilter, filter)

    function flatten(person: Hierarchy<FilterPerson>): FilterPerson[] {
        return [person, ...person.members.flatMap(flatten)]
    }
    const allPeople = byManager.flatMap(flatten)
    const byProgram = groupByPrograms(allPeople)
    return {
        allPeople,
        byManager,
        byProgram
    }
}
