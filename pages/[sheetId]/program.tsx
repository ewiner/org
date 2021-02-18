import {GetStaticPaths, GetStaticProps} from 'next'
import {Person, Program} from "../../src/types";
import fetchPeople from "../../src/api/fetchPeople";
import {useRouter} from "next/router";
import {groupBy} from 'lodash'
import Chart from "../../components/chart/Chart";
import ProgramView from "../../components/ProgramView";
import Header from "../../components/Header";
import React from "react";

type Props = {
    people: Person[],
    version: string
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
    const sheetId = parseInt(context.params.sheetId as string, 10)
    const data = await fetchPeople(sheetId)
    if (data === null) {
        return {
            notFound: true
        }
    }
    return {
        props: data,
        revalidate: 1
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [
            {params: {sheetId: '1'}},
        ],
        fallback: 'blocking'
    }
}

export default function ProgramsView(props: Props) {
    const router = useRouter()
    const sheetId = parseInt(router.query.sheetId as string, 10)
    const {people, version} = props

    const byProgram = groupBy<Person>(people, p => p.program);

    const sortPeople = (people: Person[]) => people.sort((a, b) => {
        function trySort(fn: ((p: Person) => any)): number {
            const aResult = fn(a)
            const bResult = fn(b)
            if (aResult < bResult) return -1
            if (aResult > bResult) return 1
            return 0
        }

        return trySort(p => p.icrole) ||
            -trySort(p => p.teamleadrole) ||
            trySort(p => p.name || "zz") ||
            trySort(p => p.opening)
    })

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
                    members: sortPeople(bySubprogram[subprogram])
                })
            }
        }

        programs.push({
            name: program || "No Program",
            subprograms: subprograms,
            members: sortPeople(bySubprogram[""] || [])
        })
    }

    return (
        <>
            <Header currentUrl="management" sheetId={sheetId} version={version}/>
            <Chart>
                {programs.map(program => (
                    <ProgramView key={program.name} program={program}/>
                ))}
            </Chart>
        </>
    )
}
