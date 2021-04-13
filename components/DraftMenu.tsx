import Link from "next/link";
import Icon from "@mdi/react";
import {mdiRefresh} from "@mdi/js";
import React from "react";
import useSWR from "swr";
import {VersionData} from "../src/api/fetchVersions";

type Props = {
    closeMenu: () => void,
    sheetId: number,
    workbook: string,
    currentUrl: string
}

const fetcher = (url) => fetch(url).then(res => res.json())

export default function DraftMenu({closeMenu, sheetId, workbook, currentUrl}: Props) {
    const {data, isValidating} = useSWR<VersionData>(`/api/versions/${encodeURIComponent(workbook)}`, fetcher)
    return (
        <div
            className="origin-top-right absolute right-0 mt-2 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
            role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
            <span className="block px-4 py-2 text-xs text-gray-700">
                Switch version:
                {isValidating ?
                    <Icon spin={true} path={mdiRefresh} title="Refreshing" className="float-right h-4"/> : null}
            </span>
            {data ?
                data.sheetNames.map((version, idx) => (
                    <Link key={idx} href={`/${workbook}/${idx + 1}/${currentUrl}`}>
                        <a onClick={closeMenu}
                           className={`${sheetId === idx + 1 ? "font-bold" : ""} block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                           role="menuitem">
                            {version}
                        </a>
                    </Link>
                )) :
                <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Loading...</div>
            }
        </div>
    )
}
