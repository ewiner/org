import {Person, Program} from "src/types";
import {groupBy} from 'lodash'
import ProgramView from "components/ProgramView";
import React from "react";
import {serverProps} from "src/api/serverProps";
import {InferGetServerSidePropsType} from "next";
import ChartPage from "../../../components/ChartPage";

export const getServerSideProps = serverProps

export default function ProgramsView(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return <ChartPage initialData={props} currentUrl="program" makeChartData={makeChartData}/>
}

function makeChartData(people: Person[]) {
    const byProgram = groupBy<Person>(people, p => p.program);

    const programs: Program[] = []
    for (const program of Object.keys(byProgram)) {
        const programPeople: Person[] = byProgram[program]

        const bySubprogram = groupBy<Person>(programPeople, p => p.subprogram)
        const subprograms: Program[] = []
        for (const subprogram of Object.keys(bySubprogram)) {
            if (subprogram !== "") {
                subprograms.push({
                    name: subprogram,
                    subprograms: [],
                    members: bySubprogram[subprogram]
                })
            }
        }

        programs.push({
            name: program || "No Program Assigned",
            subprograms: subprograms,
            members: bySubprogram[""] || []
        })
    }

    return programs.map(program => (
        <ProgramView key={program.name} program={program}/>
    ))
}
