import PersonView, {anyoneVisible} from "components/PersonView";
import React from "react";
import {InferGetServerSidePropsType} from "next";
import {serverProps} from "src/serverProps";
import ChartPage from "../../../components/ChartPage";
import {ProcessedPeople} from "../../../src/processData";

export const getServerSideProps = serverProps

export default function ManagementView(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return <ChartPage initialData={props} currentUrl="management" makeChartData={makeChartData}/>
}

function makeChartData(people: ProcessedPeople) {
    return people.byManager.flatMap(person => {
        if (!anyoneVisible(person)) {
            return null
        }
        return (<PersonView key={person.name} style="management" person={person} inline={false}/>);
    })
}
