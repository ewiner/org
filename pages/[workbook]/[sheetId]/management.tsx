import {Hierarchy, Person} from "src/types";
import PersonView from "components/PersonView";
import React from "react";
import {InferGetServerSidePropsType} from "next";
import {serverProps} from "src/api/serverProps";
import ChartPage from "../../../components/ChartPage";

export const getServerSideProps = serverProps

export default function ManagementView(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return <ChartPage data={props} currentUrl="management" makeChartData={makeChartData}/>
}

function makeChartData(people: Person[]) {

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

    return data.map(person => (
        <PersonView key={person.name} style="management" person={person} inline={false}/>
    ))
}
