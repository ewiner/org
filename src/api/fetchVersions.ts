import {fetchDoc, WorkbookNotAccessible, WorkbookNotFound} from "./fetchGsheet";

export type VersionData = { workbookName: string, sheetNames: string[] }
type Success = { result: "success" } & VersionData
type VersionsResponse = WorkbookNotFound | WorkbookNotAccessible | Success

export default async function fetchVersions(workbook: string): Promise<VersionsResponse> {
    const docResult = await fetchDoc(workbook)
    if (docResult.result !== "success") {
        return docResult
    }
    const doc = docResult.doc

    const workbookName = doc.title
    const sheetNames = doc.sheetsByIndex
        .map(s => s.title)
        .filter(s => s.length > 1 && s[0] !== '_')

    return {result: "success", workbookName, sheetNames}
}
