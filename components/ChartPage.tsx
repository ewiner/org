import {PeopleData} from "../src/api/fetchPeople";
import React from "react";
import {useRouter} from "next/router";
import parseParams from "../src/api/parseParams";
import {Person} from "../src/types";
import Header from "./Header";
import Chart from "./chart/Chart";

type Props = {
    data: PeopleData,
    currentUrl: string,
    makeChartData: (people: Person[]) => React.ReactNode
}

export default function ChartPage({data, currentUrl, makeChartData}: Props) {
    const router = useRouter()
    const {workbook, sheetId} = parseParams(router.query)
    const {people, version} = data

    return (
        <>
            <Header currentUrl={currentUrl} workbook={workbook} sheetId={sheetId} version={version}/>
            <Chart>
                {makeChartData(people)}
            </Chart>
        </>
    )
}
