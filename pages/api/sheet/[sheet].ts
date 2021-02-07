import gsx2json from 'gsx2json/api'

export const config = {
    api: {
        externalResolver: true,
    },
}

export default function handler(req, res) {
    if (req.params === undefined) req.params = {}
    req.query.columns = "false"
    req.query.id = process.env.DATA_GSHEET
    gsx2json(req, res)
};
