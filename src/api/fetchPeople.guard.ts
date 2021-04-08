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
        typeof obj.hide === "string" &&
        typeof obj.person === "string" &&
        typeof obj.jobtitle === "string" &&
        typeof obj.manager === "string" &&
        typeof obj.opening === "string" &&
        typeof obj.program === "string" &&
        typeof obj.subprogram === "string" &&
        (obj.teamleadrole === "" ||
            obj.teamleadrole === "Program Role Lead" ||
            obj.teamleadrole === "Subprogram Role Lead" ||
            obj.teamleadrole === "Program Tech Lead" ||
            obj.teamleadrole === "Subprogram Tech Lead")
    )
}
