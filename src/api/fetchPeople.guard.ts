/*
 * Generated type guards for "fetchPeople.ts".
 * WARNING: Do not manually change this file.
 */
import { RawPerson } from "./fetchPeople";

export function isRawPerson(obj: any, _argumentName?: string): obj is RawPerson {
    return (
        (obj !== null &&
            typeof obj === "object" ||
            typeof obj === "function") &&
        typeof obj.person === "string" &&
        typeof obj.jobtitle === "string" &&
        typeof obj.manager === "string" &&
        typeof obj.opening === "string" &&
        (obj.icrole === "" ||
            obj.icrole === "Mobile" ||
            obj.icrole === "Backend" ||
            obj.icrole === "Frontend" ||
            obj.icrole === "QA" ||
            obj.icrole === "Product" ||
            obj.icrole === "TPM" ||
            obj.icrole === "UI" ||
            obj.icrole === "UX" ||
            obj.icrole === "Data" ||
            obj.icrole === "SRE") &&
        typeof obj.program === "string" &&
        typeof obj.subprogram === "string" &&
        (obj.teamleadrole === "" ||
            obj.teamleadrole === "Program Role Lead" ||
            obj.teamleadrole === "Subprogram Role Lead" ||
            obj.teamleadrole === "Program Tech Lead" ||
            obj.teamleadrole === "Subprogram Tech Lead")
    )
}
