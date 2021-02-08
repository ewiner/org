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
        typeof obj.managertitle === "string" &&
        (obj.icrole === "" ||
            obj.icrole === "Mobile" ||
            obj.icrole === "Backend" ||
            obj.icrole === "Frontend" ||
            obj.icrole === "QA" ||
            obj.icrole === "Product" ||
            obj.icrole === "TPM" ||
            obj.icrole === "UI" ||
            obj.icrole === "UX") &&
        typeof obj.program === "string" &&
        typeof obj.subprogram === "string" &&
        typeof obj.manager === "string" &&
        (obj.teamleadrole === "" ||
            obj.teamleadrole === "Program Tech Lead" ||
            obj.teamleadrole === "Subprogram Tech Lead" ||
            obj.teamleadrole === "Subprogram/Role Tech Lead" ||
            obj.teamleadrole === "Program Product Lead" ||
            obj.teamleadrole === "Subprogram Product Lead")
    )
}
