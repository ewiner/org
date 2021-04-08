import {ParsedUrlQuery} from "querystring";

const parseParams = (params: ParsedUrlQuery) => ({
    workbook: params.workbook as string,
    sheetId: parseInt(params.sheetId as string, 10)
})

export default parseParams
