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
        (obj.role === "" ||
            obj.role === "Mobile" ||
            obj.role === "Backend" ||
            obj.role === "Frontend" ||
            obj.role === "QA" ||
            obj.role === "Product" ||
            obj.role === "TPM" ||
            obj.role === "UI" ||
            obj.role === "UX") &&
        typeof obj.program === "string" &&
        typeof obj.subprogram === "string" &&
        typeof obj.manager === "string" &&
        (obj.teamleadrole === "" ||
            obj.teamleadrole === "Program Tech Lead" ||
            obj.teamleadrole === "Subprogram Tech Lead" ||
            obj.teamleadrole === "Subprogram/Role Tech Lead" ||
            obj.teamleadrole === "Product Lead")
    )
}
