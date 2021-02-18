import React from "react";
import MembersList from "./MembersList";
import {Hierarchy, Person} from "../src/types";
import {mdiFlash} from '@mdi/js';
import {EmptyBadge, IconBadge, NumberBadge, ProgramBadge, RoleIcon, SubprogramBadge} from "./badges";

type Props = {
    person: Hierarchy<Person>,
    inline: boolean
}

function bgColor(person: Person) {
    return person.opening ? (person.name ? "bg-gray-100" : "bg-gray-200") : "bg-white"
}

function MembersBadges(props: { members: Hierarchy<Person>[] }) {
    const {members} = props
    const showPrograms = members.some(p => p.program)
    const showSubprograms = members.some(p => p.subprogram)
    const showRoles = false //members.some(p => p.icrole)
    return (
        <div className="mt-4">
            <ol className="whitespace-nowrap">
                {members.map((person, idx) => {
                    const {members, icrole, managertitle, name, program, opening, subprogram} = person
                    return (
                        <li key={person.name || person.opening} className="inline-block">
                            <NumberBadge idx={idx + 1} className={`${bgColor(person)}`}/>
                            {showPrograms && (program ?
                                    <ProgramBadge value={program} hasBadgeAbove={true}/> :
                                    <EmptyBadge hasBadgeAbove={true}/>
                            )}
                            {showSubprograms && (subprogram ?
                                    <SubprogramBadge value={subprogram} hasBadgeAbove={true}/> :
                                    <EmptyBadge hasBadgeAbove={true}/>
                            )}
                            {showRoles && (icrole ?
                                    <RoleIcon role={icrole} hasBadgeAbove={true}/> :
                                    <EmptyBadge hasBadgeAbove={true}/>
                            )}
                        </li>
                    );
                })}
            </ol>
        </div>

    )
}

export default function PersonView({person, inline}: Props) {
    const {members, icrole, managertitle, name, program, opening, subprogram} = person;
    const teamRole = parseTeamRole(person)
    return (
        <div>
            <div className="flex flex-col w-full">
                <div className={`flex ${inline ? "mb-2" : "justify-center"}`}>
                    <div
                        className={`${bgColor(person)} shadow border border-gray-400 rounded-md p-2`}
                        style={{minWidth: "12rem"}}>
                        <div className="mb-2">
                            <div className="float-right">
                                <RoleIcon role={icrole} className="h-6"/>
                            </div>
                            <p>{name}</p>
                            {opening &&
                            <p title={opening}
                               className="text-xs overflow-ellipsis overflow-hidden whitespace-nowrap">
                                {opening}
                            </p>}
                            {managertitle &&
                            <p title={managertitle}
                               className="text-xs overflow-ellipsis overflow-hidden whitespace-nowrap">
                                {managertitle}
                            </p>}
                        </div>
                        <div className="">
                            {program &&
                            <div title={program}
                                 className="text-xs overflow-ellipsis overflow-hidden whitespace-nowrap">
                              <ProgramBadge value={program} className="inline-block"/> {program}
                            </div>}
                            {subprogram &&
                            <div title={subprogram}
                                 className="text-xs overflow-ellipsis overflow-hidden whitespace-nowrap">
                              <SubprogramBadge value={subprogram} hasBadgeAbove={true}
                                               className="inline-block"/> {subprogram}
                            </div>}
                            {teamRole &&
                            <div title={teamRole}
                                 className="text-xs t-4 overflow-ellipsis overflow-hidden whitespace-nowrap">
                              <IconBadge hasBadgeAbove={true} icon={mdiFlash} title="Team Lead"
                                         className="inline-block"/> {teamRole}
                            </div>}
                        </div>
                        {members.length > 0 && <MembersBadges members={members}/>}
                    </div>
                </div>
            </div>
            {members.length > 0 && <MembersList members={members}/>}
        </div>
    );
};

function parseTeamRole(person: Person) {
    let teamRole = null
    switch (person.teamleadrole) {
        case "Program Tech Lead":
            teamRole = `Tech Lead`
            break;
        case "Subprogram Tech Lead":
            teamRole = `Tech Lead`
            break;
        case "Subprogram/Role Tech Lead":
            teamRole = `${person.icrole} Lead`
            break;
        case "Program Product Lead":
            teamRole = `Product Lead`
            break;
        case "Subprogram Product Lead":
            teamRole = `Product Lead`
            break;
        default:
            break;
    }
    return teamRole;
}
