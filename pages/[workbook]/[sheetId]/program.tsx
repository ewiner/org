import {Person, Program} from "src/types";
import {useRouter} from "next/router";
import {groupBy} from 'lodash'
import Chart from "components/chart/Chart";
import ProgramView from "components/ProgramView";
import Header from "components/Header";
import React from "react";
import {serverProps} from "src/api/serverProps";
import {InferGetServerSidePropsType} from "next";
import parseParams from "src/api/parseParams";

export const getServerSideProps = serverProps

export default function ProgramsView(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter()
    const {workbook, sheetId} = parseParams(router.query)
    const {people, version} = props

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

    return (
        <>
            <Header currentUrl="program" workbook={workbook} sheetId={sheetId} version={version}/>
            <Chart>
                {programs.map(program => (
                    <ProgramView key={program.name} program={program}/>
                ))}
            </Chart>
        </>
    )
}
