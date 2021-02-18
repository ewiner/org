import {GetStaticPaths, GetStaticProps} from 'next'
import {Hierarchy, Person} from "../../src/types";
import PersonView from "../../components/PersonView";
import fetchPeople from "../../src/api/fetchPeople";
import {useRouter} from "next/router";
import Chart from "../../components/chart/Chart";
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

export default function ManagementView(props: Props) {
    const router = useRouter()
    const sheetId = parseInt(router.query.sheetId as string, 10)
    const {people, version} = props

    const membersOf: { [person: string]: Person[] } = people.reduce((acc, person) => ({
        ...acc,
        [person.name || person.opening]: []
    }), {"": []})

    people.forEach(person => {
        if (membersOf[person.manager]) {
            membersOf[person.manager].push(person)
        }
    })

    function makeMembers(person: Person): Hierarchy<Person> {
        const members = membersOf[person.name || person.opening]
            .sort((a, b) => {
                function trySort(fn: ((p: Person) => any)): number {
                    const aResult = fn(a)
                    const bResult = fn(b)
                    if (aResult < bResult) return -1
                    if (aResult > bResult) return 1
                    return 0
                }

                return trySort(p => p.icrole) ||
                    trySort(p => p.program) ||
                    trySort(p => p.subprogram) ||
                    trySort(p => p.manager) ||
                    trySort(p => p.name || "zz") ||
                    trySort(p => p.opening)
            })
            .map(child => makeMembers(child))

        return {...person, members}
    }

    const data = membersOf[""].map(makeMembers)

    return (
        <>
            <Header currentUrl="management" sheetId={sheetId} version={version}/>
            <Chart>
                {data.map(person => (
                    <PersonView key={person.name} style="management" person={person} inline={false}/>
                ))}
            </Chart>
        </>
    )
}
