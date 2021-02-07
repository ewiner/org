import {useState} from "react";
import {Transition} from '@headlessui/react'
import Link from 'next/link'

type Props = {
    currentUrl: string,
    sheetId: number,
    version: string
}

const links = [
    {url: "management", text: "Management View"},
    {url: "program", text: "Program View"}
]

export default function Header({currentUrl, sheetId, version}: Props) {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [draftMenuOpen, setDraftMenuOpen] = useState(false);

    const versions = ["Eric's Testbed", "Marcus 2020-02-04", "Active 2020-01-30"]
    versions[sheetId - 1] = version

    const onRefreshClick = () => {
        setDraftMenuOpen(false)
        alert("Not implemented!")
    }

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
                                    className="text-gray-800 bg-gray-200 font-bold antialiased py-2 px-3 w-auto rounded-md">
                                    Org Charts
                                </span>
                            </div>
                            <div className="hidden sm:block sm:ml-6">
                                <div className="flex space-x-4">
                                    {links.map(link => (
                                        <Link key={link.url} href={`/${sheetId}/${link.url}`}>
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
                            <div className="ml-3 relative">
                                <div>
                                    <button onClick={() => setDraftMenuOpen(!draftMenuOpen)}
                                            className="bg-gray-800 flex text-sm rounded-full focus:outline-none"
                                            id="user-menu" aria-haspopup="true">
                                        <span className="sr-only">Open drafts menu</span>
                                        <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-1 ring-2 ring-offset-2 ring-offset-gray-800 ring-white rounded-full text-sm font-medium">Version: <span
                                            className="font-bold">
                                            {versions[sheetId - 1]}
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
                                    <div
                                        className="origin-top-right absolute right-0 mt-2 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                                        role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                                        <span className="block px-4 py-2 text-xs text-gray-700">
                                            Switch version:
                                        </span>
                                        {versions.map((version, idx) => (
                                            <Link key={idx} href={`/${idx + 1}/${currentUrl}`}>
                                                <a onClick={() => setDraftMenuOpen(false)}
                                                   className={`${sheetId === idx + 1 ? "font-bold" : ""} block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                                                   role="menuitem">
                                                    {version}
                                                </a>
                                            </Link>
                                        ))}
                                        <a onClick={onRefreshClick}
                                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t-2"
                                           role="menuitem">
                                            <svg className="w-3 h-3 inline mr-2" xmlns="http://www.w3.org/2000/svg"
                                                 viewBox="0 0 24 24">
                                                <path
                                                    d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z"/>
                                            </svg>
                                            Refresh list...
                                        </a>
                                    </div>
                                </Transition>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`${mobileNavOpen ? "block" : "hidden"} sm:hidden`}>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {links.map(link => (
                            <Link key={link.url} href={`/${sheetId}/${link.url}`}>
                                <a className={`${link.url === currentUrl ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"} block px-3 py-2 rounded-md text-base font-medium`}>
                                    {link.text}
                                </a>
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>
        </>
    )
}
