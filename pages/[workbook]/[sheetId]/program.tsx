import ProgramView from "components/ProgramView";
import React from "react";
import {serverProps} from "src/serverProps";
import {InferGetServerSidePropsType} from "next";
import ChartPage from "components/ChartPage";
import {ProcessedPeople} from "src/processData";

export const getServerSideProps = serverProps

export default function ProgramsView(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return <ChartPage initialData={props} currentUrl="program" makeChartData={makeChartData}/>
}

function makeChartData(people: ProcessedPeople) {
    return people.byProgram.map(program => {
        const filteredSubprograms = program.subprograms
            .filter(s => s.members.find(p => p.visible) !== undefined)
        const anyoneVisible = program.members.find(p => p.visible) !== undefined

        if (!(anyoneVisible || filteredSubprograms.length > 0)) {
            return null
        }

        const filteredProgram = {
            ...program,
            subprograms: filteredSubprograms
        }
        return <ProgramView key={program.name} program={filteredProgram}/>
    })
}
