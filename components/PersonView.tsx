import React from "react";
import MembersList from "./MembersList";
import {Hierarchy, Person, Role} from "../src/types";
import {mdiAccountMultiple, mdiFlash, mdiWizardHat} from '@mdi/js';
import Icon from '@mdi/react'

type Props = {
    person: Hierarchy<Person>,
    inline: boolean
}

export default function PersonView({person, inline}: Props) {
    let team = ""
    if (person.program) team += person.program
    if (person.subprogram) team += ` / ${person.subprogram}`
    let teamRole = parseTeamRole(person)
    return (
        <div>
            <div className="flex flex-col w-full">
                <div className={`flex ${inline ? "mb-2" : "justify-center"}`}>
                    <div className="bg-white w-48 shadow border border-gray-400 rounded-md p-2">
                        <div className="mb-2">
                            <p>{person.name}</p>
                            {person.managertitle &&
                            <p title={person.managertitle}
                               className="text-xs overflow-ellipsis overflow-hidden whitespace-nowrap">
                                {person.managertitle}
                            </p>}
                        </div>
                        {teamRole &&
                        <p title={teamRole} className="text-xs t-4 overflow-ellipsis overflow-hidden whitespace-nowrap">
                          <Icon path={mdiFlash} title="Team Lead" className="h-4 inline-block"/>{" "}
                            {teamRole}
                        </p>}
                        {team &&
                        <p title={team} className="text-xs overflow-ellipsis overflow-hidden whitespace-nowrap">
                          <Icon path={mdiAccountMultiple} title="Team" className="h-4 inline-block"/>{" "}
                            {team}
                        </p>}
                    </div>

                </div>
            </div>
            {person.members.length > 0 && <MembersList members={person.members}/>}
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
