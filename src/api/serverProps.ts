import {GetServerSideProps} from 'next'
import fetchPeople, {PeopleData} from "src/api/fetchPeople";
import parseParams from "./parseParams";

export const serverProps: GetServerSideProps<PeopleData> = async (context) => {
    const {workbook, sheetId} = parseParams(context.params)
    const data = await fetchPeople(workbook, sheetId)
    if (data === null) {
        return {notFound: true}
    } else {
        return {props: data}
    }
}
