import {GetStaticPaths, GetStaticProps} from 'next'
import {Hierarchy, Person} from "../../src/types";
import PersonView from "../../components/PersonView";
import Header from "../../components/Header";
import fetchPeople from "../../src/api/fetchPeople";
import {useRouter} from "next/router";

type Props = {
    people: Person[]
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
    const sheetId = parseInt(context.params.sheetId as string, 10)
    const data = await fetchPeople(sheetId)
    return {
        props: {people: data},
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
            <Header currentUrl="management" sheetId={sheetId}/>
            <div className="flex">
                {data.map(person => (
                    <PersonView key={person.name} {...person} />
                ))}
            </div>
        </>
    )
}
