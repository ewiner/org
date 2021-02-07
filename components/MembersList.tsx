import React from "react"
import PersonView from "./PersonView"
import {Hierarchy, Person} from "../src/types"
import {partition} from 'lodash'

type Props = {
    members: Hierarchy<Person>[]
}

function Leafs({members}: Props) {
    return (
        <div className="inline-block grid grid-cols-2">
            <div className="border-r border-gray-400" />
            <ul className="pl-6 border-l border-gray-400">
                {members.map((leaf, idX) => (
                    <li key={leaf.name} className="relative">
                        <div className="-ml-6 mt-3 absolute border-gray-400 border-t-2 w-4 "/>
                        {idX == members.length - 1 ? <div className="-ml-8 mt-3-plus-border-2 h-full absolute w-0 border-white border-l-8 "/>: null}
                        {leaf.name}
                    </li>
                ))}
            </ul>
        </div>

    )
}

export default function MembersList({members}: Props) {
    const [leafMembers, nonLeafMembers]: [Hierarchy<Person>[], Hierarchy<Person>[]] = partition(
        members,
        person => person.members.length === 0
    )
    // append all the leaf members as a single array at the end of the non-leaf members, e.g. [NL1, NL2, [L1, L2, L3]]
    const branches = [...nonLeafMembers, ...(leafMembers.length > 0 ? [leafMembers] : [])]

    return (
        <ul className="flex flex-row mt-10 justify-center">
            <div className="-mt-10 border-l-2 absolute h-10 border-gray-400"/>
            {branches.map((branch, idX) => {
                const isFirst = idX === 0
                const isLast = idX === branches.length - 1
                return (
                    <li key={idX} className="relative p-6">
                        <div
                            style={{
                                left: isFirst ? "50%" : 0,
                                right: isLast ? "50%" : 0
                            }}
                            className="border-t-2 absolute h-8 border-gray-400 top-0"
                        />
                        <div className="relative flex justify-center">
                            <div className="-mt-6 border-l-2 absolute h-6 border-gray-400 top-0"/>
                            {Array.isArray(branch) ? <Leafs members={branch}/> : <PersonView {...branch} />}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

