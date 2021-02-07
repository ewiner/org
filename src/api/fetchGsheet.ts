import got from 'got'

// Stripped down version of https://github.com/55sketch/gsx2json/blob/master/api.js
export default async function fetchGsheet(sheetid) {
    const gsheetId = process.env.DATA_GSHEET;
    const url = `https://spreadsheets.google.com/feeds/list/${gsheetId}/${sheetid}/public/values?alt=json`;

    const data = await got(url).json() as any

    const rows = [];
    if (!(data && data.feed && data.feed.entry)) {
        throw new Error(`Couldn't parse response data: ${data}`)
    } else {
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
        return rows;
    }
}
