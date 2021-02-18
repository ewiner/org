import React from "react";
import {Person, Program} from "../src/types";
import {mdiFlash} from '@mdi/js';
import {EmptyBadge, IconBadge, NumberBadge, RoleBadge, TeamLeadRoleBadge} from "./badges";
import ChartNode from "./chart/ChartNode";
import PersonView from "./PersonView";

type Props = {
    program: Program
}

function bgColor(person: Person) {
    return person.opening ? (person.name ? "bg-gray-100" : "bg-gray-200") : "bg-white"
}

function MembersBadges({members}: { members: Person[] }) {
    return (
        <div className="mt-4">
            <ol className="whitespace-nowrap">
                {members.map((person, idx) => {
                    const {icrole, teamleadrole} = person
                    return (
                        <li key={person.name || person.opening} className="inline-block">
                            <NumberBadge idx={idx + 1} className={`${bgColor(person)}`}/>
                            {icrole ?
                                <RoleBadge role={icrole} hasBadgeAbove={true} colored={true}/> :
                                <EmptyBadge hasBadgeAbove={true}/>
                            }
                            {teamleadrole ?
                                <IconBadge hasBadgeAbove={true} icon={mdiFlash} title="Team Lead"/> :
                                <EmptyBadge hasBadgeAbove={true}/>
                            }
                        </li>
                    );
                })}
            </ol>
        </div>

    )
}

export default function ProgramView({program}: Props) {
    const {name, subprograms, members} = program
    const showMembersBadges = subprograms.length === 0 && members.length > 0 && program.name !== "No Program"

    return (
        <ChartNode
            nonLeafChildren={subprograms.map(p =>
                <ProgramView key={p.name} program={p}/>
            )}
            leafChildren={members.map(p =>
                <PersonView style="program" key={p.name || p.opening} person={{...p, members: []}} inline={true}/>
            )}
            inline={false}
        >
            <p className="mb-2">{name}</p>
            {members
                .filter(p => p.teamleadrole)
                .map((p, idx) => (
                    <div key={p.name || p.opening} title={p.name || p.opening}
                         className="text-xs t-4 overflow-ellipsis overflow-hidden whitespace-nowrap">
                        <TeamLeadRoleBadge hasBadgeAbove={idx !== 0} teamleadrole={p.teamleadrole} icrole={p.icrole}
                                           className="inline-block"/> {p.name}
                    </div>
                ))}
            {showMembersBadges && <MembersBadges members={members}/>}
        </ChartNode>
    );
};
