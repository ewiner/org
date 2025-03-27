import {PeopleData, SkippedRow} from "../src/api/fetchPeople";
import React, {useState} from "react";
import {useRouter} from "next/router";
import parseParams from "../src/parseParams";
import {Filter} from "../src/types";
import Header from "./Header";
import Chart from "./chart/Chart";
import useSWR from "swr";
import Head from "next/head";
import processData, {ProcessedPeople} from "../src/processData";
import SkippedRowsDisplay from "./SkippedRowsDisplay";

// Define the return type for makeChartData
export type ChartDataResult = {
    nodes: React.ReactNode;
    skippedRows: SkippedRow[];
}

type Props = {
    initialData: PeopleData,
    currentUrl: string,
    makeChartData: (people: ProcessedPeople) => ChartDataResult
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ChartPage({initialData, currentUrl, makeChartData}: Props) {
    const router = useRouter()
    const {workbook, sheetId} = parseParams(router.query)

    const { data, isValidating, mutate } = useSWR<PeopleData>(`/api/data/${encodeURIComponent(workbook)}/${encodeURIComponent(sheetId)}`, fetcher, {
        fallbackData: initialData,
    })
    const {people, version, skippedRows = []} = data

    const [filter, setFilter] = useState<Filter>(() => () => true)
    const peopleData = processData(people, filter)

    // Get chart data and additional skipped rows from makeChartData
    const { nodes, skippedRows: additionalSkippedRows } = makeChartData(peopleData)
    
    // Combine all skipped rows
    const allSkippedRows = [...skippedRows, ...additionalSkippedRows]

    return (
        <>
            <Head>
                <title>{`Org Chart - ${version}`}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Header currentUrl={currentUrl} workbook={workbook} sheetId={sheetId} version={version}/>
            <Chart isRefreshing={isValidating} refresh={mutate} setGlobalFilter={setFilter} peopleData={peopleData}>
                {nodes}
            </Chart>
            <SkippedRowsDisplay skippedRows={allSkippedRows} />
        </>
    )
}
