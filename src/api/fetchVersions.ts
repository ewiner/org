import fetchGsheet from "./fetchGsheet"

export default async function fetchVersions(workbook: string): Promise<string[]> {
    let sheetId = 1
    const results = []
    while (true) {
        const sheet = await fetchGsheet(workbook, sheetId)
        if (sheet.result !== "success") {
            return results
        }
        if (!sheet.sheetName.startsWith("_")) {
            results.push(sheet.sheetName)
        }
    }
}
