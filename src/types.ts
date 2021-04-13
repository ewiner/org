export type LeadPosition = "Program Role Lead" | "Subprogram Role Lead" | "Program Tech Lead" | "Subprogram Tech Lead"

export type Person = {
    name: string,
    jobtitle: string,
    opening: string,
    icrole: "" | string,
    program: string,
    subprogram: string,
    manager: string,
    teamleadrole: "" | LeadPosition
}

export type FilterPerson = Person & {
    visible: boolean
}

export type Hierarchy<P> = P & {
    members: Hierarchy<P>[]
}

export type Filter = (person: Person, managers: string[]) => boolean

export type Program = {
    name: string,
    subprograms: Program[],
    members: FilterPerson[],
}
