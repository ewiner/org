export type Role = "Mobile" | "Backend" | "Frontend" | "QA" | "Product" | "TPM" | "UI" | "UX"
export type LeadPosition = "Program Tech Lead" | "Subprogram Tech Lead" | "Subprogram/Role Tech Lead" | "Product Lead"

export type Person = {
    name: string,
    managertitle: string,
    role: "" | Role,
    program: string,
    subprogram: string,
    manager: string,
    teamleadrole: "" | LeadPosition
}

export type Hierarchy<P> = P & {
    members: Hierarchy<P>[]
}
