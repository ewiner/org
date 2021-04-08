import {NextApiHandler} from 'next'
import fetchPeople from "src/api/fetchPeople";
import parseParams from "src/api/parseParams";

const handler: NextApiHandler = async (req, res) => {
    const {workbook, sheetId} = parseParams(req.query)
    const data = await fetchPeople(workbook, sheetId)
    if (data === null) {
        res.status(404)
    } else {
        res.status(200).json(data)
    }
}

export default handler
