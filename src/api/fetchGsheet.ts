import {GoogleSpreadsheet} from 'google-spreadsheet'

export type WorkbookNotFound = { result: "workbook-not-found" }
export type WorkbookNotAccessible = { result: "workbook-not-accessible" }
type SheetNotFound = { result: "sheet-not-found" }
type SheetSuccess = { result: "success", sheetName: string, rows: any[] }
type DocSuccess = { result: "success", doc: any }

type DocResponse = WorkbookNotFound | WorkbookNotAccessible | DocSuccess
type GsheetResponse = WorkbookNotFound | WorkbookNotAccessible | SheetNotFound | SheetSuccess

export async function fetchDoc(workbook: string): Promise<DocResponse> {
    const doc = new GoogleSpreadsheet(workbook)
    await doc.useApiKey(process.env.GOOGLE_API_KEY)

    try {
        await doc.loadInfo()
        return {result: "success", doc}
    } catch (e) {
        if (e.response.status == 404) {
            console.log(`Spreadsheet ${workbook} does not exist.`)
            return {result: "workbook-not-found"}
        } else if (e.response.status == 403) {
            console.log(`Spreadsheet ${workbook} is not publicly viewable.`)
            return {result: "workbook-not-accessible"}
        } else {
            throw e
        }
    }

}

// Stripped down version of https://github.com/55sketch/gsx2json/blob/master/api.js
export default async function fetchGsheet(workbook: string, sheetid: number): Promise<GsheetResponse> {
    const docResult = await fetchDoc(workbook)
    if (docResult.result !== "success") {
        return docResult
    }
    const doc = docResult.doc

    if (sheetid < 1 || sheetid > doc.sheetsByIndex.length) {
        return {result: "sheet-not-found"}
    }

    const sheet = doc.sheetsByIndex[sheetid - 1]
    const rows = await sheet.getRows()

    // conform to the Google Sheets v3 API, in which field names were lowercased and had no whitespace
    const lowercaseRows = rows.map(row => {
        const lowercaseRow = {}
        for (const [field, value] of Object.entries(row)) {
            if (!field.startsWith("_")) {
                lowercaseRow[field.replace(/\s+/g, '').toLowerCase()] = value || ''
            }
        }
        return lowercaseRow
    })

    return {
        result: "success",
        sheetName: sheet.title,
        rows: lowercaseRows
    };
}
