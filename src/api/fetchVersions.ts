import got from "got";

export type VersionData = {workbookName: string, sheetNames: string[]}
type WorkbookNotFound = { result: "workbook-not-found" }
type Success = { result: "success"} & VersionData
type VersionsResponse = WorkbookNotFound | Success

export default async function fetchVersions(workbook: string): Promise<VersionsResponse> {
    const url = `https://spreadsheets.google.com/feeds/worksheets/${encodeURIComponent(workbook)}/public/basic?alt=json`

    const response = await got(url, {throwHttpErrors: false})
    if (response.statusCode == 400) {
        return {result: "workbook-not-found"}
    }

    const data = JSON.parse(response.body)

    if (!(data && data.feed)) {
        throw new Error(`Couldn't parse response data: ${data}`)
    }
    const workbookName = data.feed.title.$t
    const sheetNames = data.feed.entry
        .map(e => e.title.$t)
        .filter(s => s.length > 1 && s[0] !== '_')

    return {result: "success", workbookName, sheetNames}
}
