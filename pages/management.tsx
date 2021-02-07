import {GetStaticProps} from 'next'
import fetchGsheet from "../src/api/fetchGsheet"
import {Hierarchy, LeadPosition, Person, Role} from "../src/types";
import PersonView from "../components/PersonView";
import Header from "../components/Header";

type RawPerson = {
    person: string,
    role: "" | Role,
    program: string,
    subprogram: string,
    manager: string,
    lead: "" | LeadPosition
}

type Props = {
    people: Person[]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
    const data = await fetchGsheet(1) as RawPerson[]
    const mungedData: Person[] = data.map(personData => {
        const {person, ...rest} = personData
        return {...rest, name: person}
    })
    return {
        props: {people: mungedData},
        revalidate: 1
    }
}

export default function ManagementView(props: Props) {
    const {people} = props

    const membersOf: { [person: string]: Person[] } = people.reduce((acc, person) => ({
        ...acc,
        [person.name]: []
    }), {"": []})

    people.forEach(person => {
        membersOf[person.manager].push(person)
    })

    function makeMembers(person: Person): Hierarchy<Person> {
        return {...person, members: membersOf[person.name].map(child => makeMembers(child))}
    }

    const data = membersOf[""].map(makeMembers)

    return (
        <>
            <Header currentUrl="management" />
            <div className="flex">
                {data.map(person => (
                    <PersonView key={person.name} {...person} />
                ))}
            </div>
        </>
    )
}
