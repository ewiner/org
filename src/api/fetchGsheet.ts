import got from 'got'

type SheetNotFound = { result: "sheet-not-found" }
type Success = { result: "success", sheetName: string, rows: any[] }

type GsheetResponse = SheetNotFound | Success

// Stripped down version of https://github.com/55sketch/gsx2json/blob/master/api.js
export default async function fetchGsheet(workbook: string, sheetid: number): Promise<GsheetResponse> {
    const url = `https://spreadsheets.google.com/feeds/list/${encodeURIComponent(workbook)}/${encodeURIComponent(sheetid)}/public/values?alt=json`

    const response = await got(url, {throwHttpErrors: false})
    if (response.statusCode == 400) {
        return {result: "sheet-not-found"}
    }

    const data = JSON.parse(response.body)

    const rows = [];
    if (!(data && data.feed && data.feed.entry)) {
        throw new Error(`Couldn't parse response data: ${data}`)
    } else {
        const sheetName = data.feed.title.$t
        for (let i = 0; i < data.feed.entry.length; i++) {
            const entry = data.feed.entry[i];
            const keys = Object.keys(entry);
            const newRow = {};
            for (let j = 0; j < keys.length; j++) {
                const gsxCheck = keys[j].indexOf('gsx$');
                if (gsxCheck > -1) {
                    const key = keys[j];
                    const name = key.substring(4);
                    const content = entry[key];
                    newRow[name] = content.$t;
                }
            }
            rows.push(newRow);
        }
        return {result: "success", sheetName, rows};
    }
}
