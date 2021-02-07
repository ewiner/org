import fetchGsheet from "./fetchGsheet"

export default async function fetchVersions(): Promise<string[]> {
    let sheetId = 1
    const results = []
    while (true) {
        const sheet = await fetchGsheet(sheetId)
        if (sheet.result !== "success") {
            return results
        }
        if (!sheet.sheetName.startsWith("_")) {
            results.push(sheet.sheetName)
        }
    }
}
