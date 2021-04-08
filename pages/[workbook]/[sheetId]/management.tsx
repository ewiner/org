import {Hierarchy, Person} from "src/types";
import PersonView from "components/PersonView";
import {useRouter} from "next/router";
import Chart from "components/chart/Chart";
import Header from "components/Header";
import React from "react";
import {serverProps} from "../../api/data/[workbook]/[sheetId]";
import {InferGetServerSidePropsType} from "next";

export const getServerSideProps = serverProps

export default function ManagementView(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
