import React, {useState} from "react";
import {Transition} from '@headlessui/react'
import Link from 'next/link'
import DraftMenu from "./DraftMenu";
import {useRouter} from "next/router";
import Icon from "@mdi/react";
import {mdiOpenInNew} from "@mdi/js";
import { formatDistanceToNow } from "date-fns";

export type HeaderProps = {
    currentUrl: string,
    workbook: string,
    updated?: string,
    sheetId: number,
    version: string
}

const links = [
    {url: "management", text: "Management View"},
    {url: "program", text: "Program View"}
]

export default function Header({currentUrl, workbook, updated, sheetId, version}: HeaderProps) {
    const router = useRouter();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [draftMenuOpen, setDraftMenuOpen] = useState(false);

    const href = link => ({
        pathname: `/[workbook]/[sheetId]/${link.url}`,
        query: router.query
    })

    const sourceLink = (
        <a href={`https://docs.google.com/spreadsheets/d/${encodeURIComponent(workbook)}`} target="_blank">
            Source Data <Icon path={mdiOpenInNew} title="External" className="h-4 inline-block"/><br/>
            {updated && formatDistanceToNow(Date.parse(updated))}
        </a>
    )

    return (
        <>
            <div className="h-16 mb-4"/>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800">
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                    <div className="relative flex items-center justify-between h-16">
                        <div className="inset-y-0 left-0 flex items-center sm:hidden">
                            <button onClick={() => setMobileNavOpen(!mobileNavOpen)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                    aria-expanded="false">
                                <span className="sr-only">Open main menu</span>
                                <svg className={`${mobileNavOpen ? "hidden" : "block"} h-6 w-6`}
                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M4 6h16M4 12h16M4 18h16"/>
                                </svg>
                                <svg className={`${mobileNavOpen ? "block" : "hidden"} h-6 w-6`}
                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 flex items-center sm:items-stretch sm:justify-start">
                            <div className="flex-shrink-0 flex items-center">
                                <span
                                    className="text-gray-800 bg-gray-200 font-bold antialiased py-2 px-3 w-auto ">
                                    Org Charts
                                </span>
                            </div>
                            <div className="hidden sm:block sm:ml-6">
                                <div className="flex space-x-4">
                                    {links.map(link => (
                                        <Link key={link.url} href={href(link)}>
                                            <a className={`${link.url === currentUrl ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"} px-3 py-2 rounded-md text-sm font-medium`}>
                                                {link.text}
                                            </a>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div
                            className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <div
                                className="ml-3 mr-3 hidden sm:block text-gray-300 hover:border-gray-300 border-transparent border-b text-sm font-medium">
                                {sourceLink}
                            </div>
                            <div className="ml-3 relative">
                                <div>
                                    <button onClick={() => setDraftMenuOpen(!draftMenuOpen)}
                                            className="bg-gray-800 flex text-sm rounded-full focus:outline-none"
                                            id="user-menu" aria-haspopup="true">
                                        <span className="sr-only">Open drafts menu</span>
                                        <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-1 ring-2 ring-offset-2 ring-offset-gray-800 ring-white rounded-full text-sm font-medium">Version: <span
                                            className="font-bold">
                                            {version}
                                        </span></a>
                                    </button>
                                </div>
                                <Transition
                                    show={draftMenuOpen}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    {draftMenuOpen ?
                                        <DraftMenu
                                            workbook={workbook}
                                            sheetId={sheetId}
                                            currentUrl={currentUrl}
                                            closeMenu={() => setDraftMenuOpen(false)}
                                        /> :
                                        null
                                    }
                                </Transition>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`${mobileNavOpen ? "block" : "hidden"} sm:hidden`}>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {links.map(link => (
                            <Link key={link.url} href={href(link)}>
                                <a className={`${link.url === currentUrl ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"} block px-3 py-2 rounded-md text-base font-medium`}>
                                    {link.text}
                                </a>
                            </Link>
                        ))}
                        <div
                            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                            {sourceLink}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}
