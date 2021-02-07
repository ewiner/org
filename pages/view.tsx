import {GetStaticProps} from 'next'
import fetchGsheet from "../src/api/fetchGsheet";

type Role = "Mobile" | "Backend" | "Frontend" | "QA" | "Product" | "TPM" | "UI" | "UX"
type LeadPosition = "Program Tech Lead" | "Subprogram Tech Lead" | "Subprogram/Role Tech Lead" | "Product Lead"
type Person = {
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

export const getStaticProps: GetStaticProps = async () => {
    const data = await fetchGsheet(1)
    return {
        props: {people: data},
        revalidate: 1
    }
}

export default function View(props: Props) {
    const {people} = props
    return (
        <ol>
            {people.map(person => (
                <li key={person.person}>{person.person}</li>
            ))}
        </ol>
    )
}
