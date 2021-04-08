import {PeopleData} from "../src/api/fetchPeople";
import React from "react";
import {useRouter} from "next/router";
import parseParams from "../src/api/parseParams";
import {Person} from "../src/types";
import Header from "./Header";
import Chart from "./chart/Chart";
import useSWR from "swr";
import Head from "next/head";

type Props = {
    initialData: PeopleData,
    currentUrl: string,
    makeChartData: (people: Person[]) => React.ReactNode
}

const fetcher = (url) => fetch(url).then(res => res.json())

export default function ChartPage({initialData, currentUrl, makeChartData}: Props) {
    const router = useRouter()
    const {workbook, sheetId} = parseParams(router.query)

    const { data, isValidating, revalidate } = useSWR<PeopleData>(`/api/data/${encodeURIComponent(workbook)}/${encodeURIComponent(sheetId)}`, fetcher, {
        initialData: initialData,
    })
    const {people, version} = data

    return (
        <>
            <Head>
                <title>Org Chart - {version}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Header currentUrl={currentUrl} workbook={workbook} sheetId={sheetId} version={version}/>
            <Chart isRefreshing={isValidating} refresh={revalidate}>
                {makeChartData(people)}
            </Chart>
        </>
    )
}
