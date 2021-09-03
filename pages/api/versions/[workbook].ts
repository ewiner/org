import {NextApiHandler} from 'next'
import fetchVersions, {VersionData} from "../../../src/api/fetchVersions";

const handler: NextApiHandler<VersionData> = async (req, res) => {
    const workbook = req.query.workbook as string
    const data = await fetchVersions(workbook)
    if (data.result == "workbook-not-found") {
        res.status(404)
    } else if (data.result == "workbook-not-accessible") {
        res.status(403)
    } else {
        const {workbookName, sheetNames} = data
        res.status(200).json({workbookName, sheetNames})
    }
}

export default handler
