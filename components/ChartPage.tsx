import {PeopleData} from "../src/api/fetchPeople";
import React, {useState} from "react";
import {useRouter} from "next/router";
import parseParams from "../src/parseParams";
import {Filter} from "../src/types";
import Header from "./Header";
import Chart from "./chart/Chart";
import useSWR from "swr";
import Head from "next/head";
import processData, {ProcessedPeople} from "../src/processData";

type Props = {
    initialData: PeopleData,
    currentUrl: string,
    makeChartData: (people: ProcessedPeople) => React.ReactNode
}

const fetcher = (url) => fetch(url).then(res => res.json())

export default function ChartPage({initialData, currentUrl, makeChartData}: Props) {
    const router = useRouter()
    const {workbook, sheetId} = parseParams(router.query)

    const { data, isValidating, revalidate } = useSWR<PeopleData>(`/api/data/${encodeURIComponent(workbook)}/${encodeURIComponent(sheetId)}`, fetcher, {
        initialData: initialData,
    })
    const {people, version} = data

    const [filter, setFilter] = useState<Filter>(() => () => true)
    const peopleData = processData(people, filter)

    return (
        <>
            <Head>
                <title>Org Chart - {version}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Header currentUrl={currentUrl} workbook={workbook} sheetId={sheetId} version={version}/>
            <Chart isRefreshing={isValidating} refresh={revalidate} setGlobalFilter={setFilter} peopleData={peopleData}>
                {makeChartData(peopleData)}
            </Chart>
        </>
    )
}
