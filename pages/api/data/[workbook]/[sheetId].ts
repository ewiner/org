import {GetServerSideProps, NextApiHandler} from 'next'
import fetchPeople, {PeopleData} from "src/api/fetchPeople";

export const serverProps: GetServerSideProps<PeopleData> = async (context) => {
    const workbook = context.params.workbook as string
    const sheetId = parseInt(context.params.sheetId as string, 10)
    const data = await fetchPeople(workbook, sheetId)
    if (data === null) {
        return {notFound: true}
    } else {
        return {props: data}
    }
}

const handler: NextApiHandler = async (req, res) => {
    const workbook = req.query.workbook as string
    const sheetId = parseInt(req.query.sheetId as string, 10)
    const data = await fetchPeople(workbook, sheetId)
    if (data === null) {
        res.status(404)
    } else {
        res.status(200).json(data)
    }
}

export default handler
