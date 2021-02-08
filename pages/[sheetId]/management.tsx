import {GetStaticPaths, GetStaticProps} from 'next'
import {Hierarchy, Person} from "../../src/types";
import PersonView from "../../components/PersonView";
import Header from "../../components/Header";
import fetchPeople from "../../src/api/fetchPeople";
import {useRouter} from "next/router";

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
            <Header currentUrl="management" sheetId={sheetId} version={version}/>
            <div className="flex container p-4 text-gray-800">
                {data.length === 0 ?
                    <p>No data found. Please double-check that the Google sheet has all the correct columns.</p> :
                    data.map(person => (
                        <PersonView key={person.name} person={person} inline={false} />
                    ))
                }
            </div>
        </>
    )
}
