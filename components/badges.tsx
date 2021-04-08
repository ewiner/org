import tinycolor from 'tinycolor2'
import React from "react";
import {LeadPosition} from "../src/types";
import Icon from "@mdi/react";
import CSS from 'csstype';

type BadgeProps = {
    title?: string,
    hasBadgeAbove?: boolean,
    hasBadgeLeft?: boolean,
    className?: string,
    style?: CSS.Properties
}

const Badge: React.FunctionComponent<BadgeProps> = (
    {
        title,
        style,
        children,
        hasBadgeAbove = false,
        hasBadgeLeft = false,
        className = ""
    }) => (
    <div title={title} style={style}
         className={`
            ${className}
            ${hasBadgeAbove ? "border-t-0" : ""} 
            ${hasBadgeLeft ? "border-l-0" : ""} 
             h-6 w-6 py-1 font-bold text-center text-xs border border-gray-600 rounded-sm font-mono
        `}>
        {children}
    </div>
)

type IconBadgeProps = BadgeProps & {
    icon: string,
}

export function IconBadge({icon, ...badgeProps}: IconBadgeProps) {
    return <Badge {...badgeProps}>
        <Icon path={icon} className="h-4 inline-block"/>
    </Badge>
}

// from https://colorbrewer2.org/#type=qualitative&scheme=Paired&n=12
const PROGRAM_COLORS = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928']
const SUBPROGRAM_COLORS = ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f', ...PROGRAM_COLORS]
const MANAGER_COLORS = SUBPROGRAM_COLORS
const PROGRAM_INITIALS_OVERRIDE = {
    "Compliance / Trust & Safety": "CMP"
}
const SUBPROGRAM_INITIALS_OVERRIDE = {}
const MANAGER_INITIALS_OVERRIDE = {
    "Brian KimJohnson": "BKJ"
}
const SKIPPED_FOR_ACRONYM = ["/", "and", "&"]

function acronymize(value: string) {
    return value
        .split(/\s+/)
        .filter(word => !SKIPPED_FOR_ACRONYM.includes(word.toLowerCase()))
        .map(word => word[0])
        .join('')
        .toUpperCase()
}

function badgeMaker(colors: string[], overrides: { [key: string]: string }) {
    const known: { [key: string]: string } = {}

    return (props: BadgeProps & { value: string }) => {
        const {value, ...badgeProps} = props
        let initials = overrides[value]
        if (initials === undefined) {
            initials = acronymize(value);
        }

        let color = known[value]
        if (color === undefined) {
            color = colors[Object.keys(known).length % colors.length]
            known[value] = color
        }
        return (
            <Badge title={value} style={stylesForColor(color)} {...badgeProps} >
                {initials}
            </Badge>
        );
    }
}

function stylesForColor(color: string) {
    const darker = tinycolor(color).darken(70).toHexString();
    const lighter = tinycolor(color).lighten(70).toHexString();
    const textcolor = tinycolor.mostReadable(color, [lighter, darker]).toHexString()
    return {
        backgroundColor: color,
        color: textcolor,
        borderColor: darker
    }
}

export const ProgramBadge = badgeMaker(PROGRAM_COLORS, PROGRAM_INITIALS_OVERRIDE)
export const SubprogramBadge = badgeMaker(SUBPROGRAM_COLORS, SUBPROGRAM_INITIALS_OVERRIDE)
export const ManagerBadge = badgeMaker(MANAGER_COLORS, MANAGER_INITIALS_OVERRIDE)

type RoleIconProps = BadgeProps & {
    role: string,
    colored: boolean
    [key: string]: unknown
}

export function RoleBadge({role, colored, ...others}: RoleIconProps) {
    // colors from https://colorbrewer2.org/#type=qualitative&scheme=Pastel1&n=8
    const render = (txt, color) => {
        const style = colored ? stylesForColor(color) : {}
        return <Badge title={role} style={style} {...others}>{txt}</Badge>
    }
    switch (role) {
        case "Mobile":
            return render("M", '#fbb4ae')
        case "Backend":
            return render("BE", '#b3cde3')
        case "Frontend":
            return render("FE", '#ccebc5')
        case "QA":
            return render("QA", '#decbe4')
        case "Product":
            return render("PM", '#fed9a6')
        case "TPM":
            return render("TPM", '#ffffcc')
        case "UI":
            return render("UI", '#e5d8bd')
        case "UX":
            return render("UX", '#fddaec')
        case "":
            return null
        default:
            return render(acronymize(role), '#ffffff')
    }
}


export function TeamLeadRoleBadge({
                                      teamleadrole,
                                      icrole,
                                      ...badgeProps
                                  }: { teamleadrole: "" | LeadPosition, icrole: string } & BadgeProps) {
    switch (teamleadrole) {
        case "Program Tech Lead":
        case "Subprogram Tech Lead":
            return <Badge title={teamleadrole} {...badgeProps}>TL</Badge>
        default:
            return <RoleBadge role={icrole} colored={false} {...badgeProps}/>
    }
}

export function NumberBadge({idx, className = "", ...badgeProps}: { idx: number } & BadgeProps) {
    return (
        <Badge title={idx.toString()} className={`${className}`} {...badgeProps} >
            {idx}
        </Badge>
    );
}

export function EmptyBadge(props: BadgeProps) {
    return (
        <Badge {...props}>&nbsp;</Badge>
    )
}
