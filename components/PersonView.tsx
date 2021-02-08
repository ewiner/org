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
                        className={`bg-white w-48 shadow border border-gray-400 rounded-md p-2`}>
                        <div className="mb-2">
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
                              <SubprogramBadge value={subprogram} collapse={true}/> {subprogram}
                            </p>}
                            {teamRole &&
                            <p title={teamRole}
                               className="text-xs t-4 overflow-ellipsis overflow-hidden whitespace-nowrap">
                              <div
                                className="border-t-0 inline-block h-6 w-6 py-1 font-bold text-center text-xs border border-gray-600 rounded-sm">
                                <Icon path={mdiFlash} title="Team Lead" className="h-4 inline-block"/>
                              </div>
                                {" "}{teamRole}
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

type RoleIconProps = {
    role: "" | Role,
    [key: string]: unknown
}

function RoleIcon({role, ...others}: RoleIconProps) {
    const render = (svgPath) => <Icon title={role} path={svgPath} {...others} />
    switch (role) {
        case "Mobile":
            return render(mdiCellphone)
        case "Backend":
            return render(mdiIframeBracesOutline)
        case "Frontend":
            return render(mdiXml)
        case "QA":
            return render(mdiTestTube)
        case "Product":
            return render(mdiPackageVariant)
        case "TPM":
            return render(mdiCalendarArrowRight)
        case "UI":
            return render(mdiPencilRuler)
        case "UX":
            return render(mdiFormatTextWrappingOverflow)
        default:
            return null
    }
}

// from https://colorbrewer2.org/#type=qualitative&scheme=Paired&n=12
const PROGRAM_COLORS = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928']
const SUBPROGRAM_COLORS = ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f']
const PROGRAM_INITIALS_OVERRIDE = {
    "Compliance": "CMP"
}
const SUBPROGRAM_INITIALS_OVERRIDE = {}

function badgeMaker(colors: string[], overrides: { [key: string]: string }) {
    const known = {}

    return ({value, collapse = false}: { value: string, collapse?: boolean }) => {
        let initials = overrides[value]
        if (initials === undefined) {
            initials = value.split(' ').map(word => word[0]).join('').toUpperCase();
        }

        let color = known[value]
        if (color === undefined) {
            color = colors[Object.keys(known).length]
            known[value] = color
        }
        const darker = tinycolor(color).darken(70).toHexString();
        const lighter = tinycolor(color).lighten(70).toHexString();
        const textcolor = tinycolor.mostReadable(color, [lighter, darker]).toHexString()
        return (
            <div title={value} style={{
                backgroundColor: color,
                color: textcolor,
                borderColor: darker
            }}
                 className={`${collapse ? "border-t-0" : ""} inline-block h-6 w-6 py-1 font-bold text-center text-xs border rounded-sm`}>
                {initials}
            </div>
        );
    }
}

const ProgramBadge = badgeMaker(PROGRAM_COLORS, PROGRAM_INITIALS_OVERRIDE)
const SubprogramBadge = badgeMaker(SUBPROGRAM_COLORS, SUBPROGRAM_INITIALS_OVERRIDE)
