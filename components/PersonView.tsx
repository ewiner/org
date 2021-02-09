import React from "react";
import MembersList from "./MembersList";
import {Hierarchy, Person, Role} from "../src/types";
import {
    mdiCalendarArrowRight,
    mdiCellphone,
    mdiFlash,
    mdiFormatTextWrappingOverflow,
    mdiIframeBracesOutline,
    mdiPackageVariant,
    mdiPencilRuler,
    mdiTestTube,
    mdiXml
} from '@mdi/js';
import Icon from '@mdi/react'
import tinycolor from 'tinycolor2'
import {IconBadge, ProgramBadge, RoleIcon, SubprogramBadge} from "./badges";

type Props = {
    person: Hierarchy<Person>,
    inline: boolean
}

export default function PersonView({person, inline}: Props) {
    const {members, icrole, managertitle, name, program, subprogram} = person;
    const teamRole = parseTeamRole(person)
    return (
        <div>
            <div className="flex flex-col w-full">
                <div className={`flex ${inline ? "mb-2" : "justify-center"}`}>
                    <div
                        className="bg-white w-48 shadow border border-gray-400 rounded-md p-2">
                        <div className="mb-2 w-44">
                            <div className="float-right">
                                <RoleIcon role={icrole} className="h-6"/>
                            </div>
                            <p>{name}</p>
                            {managertitle &&
                            <p title={managertitle}
                               className="text-xs overflow-ellipsis overflow-hidden whitespace-nowrap">
                                {managertitle}
                            </p>}
                        </div>
                        <div className="">
                            {program &&
                            <p title={program} className="text-xs overflow-ellipsis overflow-hidden whitespace-nowrap">
                              <ProgramBadge value={program}/> {program}
                            </p>}
                            {subprogram &&
                            <p title={subprogram}
                               className="text-xs overflow-ellipsis overflow-hidden whitespace-nowrap">
                              <SubprogramBadge value={subprogram} hasBadgeAbove={true}/> {subprogram}
                            </p>}
                            {teamRole &&
                            <p title={teamRole}
                               className="text-xs t-4 overflow-ellipsis overflow-hidden whitespace-nowrap">
                              <IconBadge hasBadgeAbove={true} icon={mdiFlash} title="Team Load"/> {teamRole}
                            </p>}
                        </div>
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
