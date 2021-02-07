import {GetStaticProps} from 'next'
import fetchGsheet from "../src/api/fetchGsheet";

type Role = "Mobile" | "Backend" | "Frontend" | "QA" | "Product" | "TPM" | "UI" | "UX"
type LeadPosition = "Program Tech Lead" | "Subprogram Tech Lead" | "Subprogram/Role Tech Lead" | "Product Lead"
type RawPerson = {
    person: string,
    role: "" | Role,
    program: string,
    subprogram: string,
    manager: string,
    lead: "" | LeadPosition
}

type Person = {
    name: string,
    role: "" | Role,
    program: string,
    subprogram: string,
    manager: string,
    lead: "" | LeadPosition
}

type Props = {
    people: Person[]
}

type Hierarchy<P> = P & {
    members: Hierarchy<P>[]
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

function Card(person: Hierarchy<Person>) {
    return (
        <li>
            {person.name}
            <ul>
                {person.members.map(child => <Card key={child.name} {...child}/>)}
            </ul>
        </li>
    )
}

export default function Management(props: Props) {
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

    const data: Hierarchy<Person>[] = membersOf[""].map(makeMembers)

    return (
        <ul>
            {data.map(person => (
                <Card key={person.name} {...person} />
            ))}
        </ul>
    )
}
