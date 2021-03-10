export type Role = "Mobile" | "Backend" | "Frontend" | "QA" | "Product" | "TPM" | "UI" | "UX" | "Data" | "SRE"
export type LeadPosition = "Program Role Lead" | "Subprogram Role Lead" | "Program Tech Lead" | "Subprogram Tech Lead"

export type Person = {
    name: string,
    jobtitle: string,
    opening: string,
    icrole: "" | Role,
    program: string,
    subprogram: string,
    manager: string,
    teamleadrole: "" | LeadPosition
}

export type Hierarchy<P> = P & {
    members: Hierarchy<P>[]
}

export type Program = {
    name: string,
    subprograms: Program[],
    members: Person[],
}
