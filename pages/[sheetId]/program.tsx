import {GetStaticPaths, GetStaticProps} from 'next'
import {Hierarchy, Person} from "../../src/types";
import PersonView from "../../components/PersonView";
import Header from "../../components/Header";
import fetchPeople from "../../src/api/fetchPeople";
import {useRouter} from "next/router";
import {groupBy} from 'lodash'

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

export default function ProgramView(props: Props) {
    const router = useRouter()
    const sheetId = parseInt(router.query.sheetId as string, 10)
    const {people, version} = props

    const byProgram = groupBy<Person>(people, p => p.program);
    const toHierarchy = (p: Person) => ({...p, members: []})

    const data: Hierarchy<Person>[] = []
    for (const program of Object.keys(byProgram)) {
        const programPeople: Person[] = byProgram[program]
        const bySubprogram = groupBy<Person>(programPeople, p => p.subprogram)
        const members: Hierarchy<Person>[] = (bySubprogram[""] || []).map(toHierarchy)
        for (const subprogram of Object.keys(bySubprogram)) {
            if (subprogram !== "") {
                members.push({
                    name: subprogram,
                    managertitle: "",
                    icrole: "",
                    program: program,
                    subprogram: subprogram,
                    manager: "",
                    teamleadrole: "",
                    members: bySubprogram[subprogram].map(toHierarchy)
                })
            }
        }
        data.push({
            name: program || "No Program",
            managertitle: "",
            icrole: "",
            program: program,
            subprogram: "",
            manager: "",
            teamleadrole: "",
            members: members
        })
    }

    return (
        <>
            <Header currentUrl="program" sheetId={sheetId} version={version}/>
            <div className="flex container p-4 text-gray-800">
                {data.length === 0 ?
                    <p>No data found. Please double-check that the Google sheet has all the correct columns.</p> :
                    data.map(person => (
                        <PersonView key={person.name} person={person} inline={false}/>
                    ))
                }
            </div>
        </>
    )
}
