import React from "react";
import {Hierarchy, Person} from "../src/types";
import {mdiFlash} from '@mdi/js';
import {EmptyBadge, IconBadge, ManagerBadge, NumberBadge, ProgramBadge, RoleBadge, SubprogramBadge} from "./badges";
import ChartNode from "./chart/ChartNode";
import {partition} from "lodash";

type Props = {
    person: Hierarchy<Person>,
    inline: boolean,
    style: "management" | "program"
}

function bgColor(person: Person) {
    return person.opening ? (person.name ? "bg-gray-100" : "bg-gray-200") : "bg-white"
}

function MembersBadges({members}: { members: Person[] }) {
    const showPrograms = members.some(p => p.program)
    const showSubprograms = members.some(p => p.subprogram)
    return (
        <div className="mt-4">
            <ol className="whitespace-nowrap">
                {members.map((person, idx) => {
                    const {program, subprogram} = person
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
                        </li>
                    );
                })}
            </ol>
        </div>

    )
}

export default function PersonView({person, inline, style}: Props) {
    const {members, icrole, manager, managertitle, name, program, opening, subprogram} = person;
    const teamRole = parseTeamRole(person)

    const [leafMembers, nonLeafMembers]: [Hierarchy<Person>[], Hierarchy<Person>[]] = partition(
        members,
        person => person.members.length === 0
    )

    const badgesSection = style === "management" ? (
        <>
            {program &&
            <div title={program}
                 className="text-xs overflow-ellipsis overflow-hidden whitespace-nowrap">
              <ProgramBadge value={program} className="inline-block"/> {program}
            </div>}
            {subprogram &&
            <div title={subprogram}
                 className="text-xs overflow-ellipsis overflow-hidden whitespace-nowrap">
              <SubprogramBadge value={subprogram} hasBadgeAbove={true} className="inline-block"/> {subprogram}
            </div>}
            {teamRole &&
            <div title={teamRole}
                 className="text-xs t-4 overflow-ellipsis overflow-hidden whitespace-nowrap">
              <IconBadge hasBadgeAbove={true} icon={mdiFlash} title="Team Lead"
                         className="inline-block"/> {teamRole}
            </div>}
        </>
    ) : (
        <>
            {teamRole &&
            <div title={teamRole}
                 className="text-xs t-4 overflow-ellipsis overflow-hidden whitespace-nowrap">
              <IconBadge icon={mdiFlash} title="Team Lead"
                         className="inline-block"/> {teamRole}
            </div>}
            {manager &&
            <div title={manager}
                 className="text-xs t-4 overflow-ellipsis overflow-hidden whitespace-nowrap">
              <ManagerBadge hasBadgeAbove={!!teamRole} title={manager} value={manager}
                            className="inline-block"/> ↗ {manager}
            </div>}
        </>
    )
    return (
        <ChartNode
            nonLeafChildren={nonLeafMembers.map(p =>
                <PersonView style={style} key={p.name || p.opening} person={p} inline={false}/>
            )}
            leafChildren={leafMembers.map(p =>
                <PersonView style={style} key={p.name || p.opening} person={p} inline={true}/>
            )}
            inline={inline}
            className={bgColor(person)}
        >
            <div className="mb-2">
                <div className="float-right">
                    <RoleBadge role={icrole} colored={style === "program"}/>
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
            <div>
                {badgesSection}
            </div>
            {members.length > 0 && <MembersBadges members={members}/>}
        </ChartNode>
    );
}
;

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
