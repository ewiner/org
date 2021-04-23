import React from "react";
import {Listbox, Transition} from "@headlessui/react";


type DropdownProps = {
    label: string
    emptyChoice: string,
    choices: string[],
    setting: string | null,
    setSetting: (setting: string | null) => void
}

function leftPad(choice: string | null) {
    if (!choice) return 0
    return /[^\t]/.exec(choice).index * 2
}

export function FilterDropdown(props: DropdownProps) {
    const {label, emptyChoice, choices, setting, setSetting} = props

    // tricks PurgeCSS into including all these necessary padding styles, so they'll exist when leftPad() calcs them
    const plOptions = <span className="pl-0 pl-2 pl-4 pl-6 pl-8 pl-10 pl-12 pl-14 pl-16 hidden h-0 w-0"/>

    const selectIcon = (
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </span>
    )

    const checkIcon = (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
             fill="currentColor">
            <path fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"/>
        </svg>
    )

    return (
        <div className="w-full max-w-xs mx-auto pb-6">
            <Listbox
                as="div"
                className="space-y-1"
                value={setting}
                onChange={setSetting}
            >
                {({open}) => (
                    <>
                        {plOptions}
                        <Listbox.Label className="block text-sm leading-5 font-medium text-gray-700">
                            {label}
                        </Listbox.Label>
                        <div className="relative">
                            <span className="inline-block w-full rounded-md shadow-sm">
                              <Listbox.Button
                                  className="cursor-default relative w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                                <span className="block truncate">
                                    {setting || emptyChoice}
                                </span>
                                  {selectIcon}
                              </Listbox.Button>
                            </span>

                            <Transition
                                show={open}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-20"
                            >
                                <Listbox.Options
                                    static
                                    className="max-h-96 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
                                >
                                    {[null, ...choices].map((choice) => (
                                        <Listbox.Option key={(choice || "").trim()} value={(choice || "").trim()}>
                                            {({selected, active}) => (
                                                <div
                                                    className={`${
                                                        active
                                                            ? "text-white bg-blue-600"
                                                            : "text-gray-900"
                                                    } cursor-default select-none relative py-2 pl-8 pr-4`}
                                                >
                                                    <span
                                                        className={`${selected ? "font-bold" : "font-normal"} pl-${leftPad(choice)} truncate block`}>
                                                      {choice || emptyChoice}
                                                    </span>
                                                    {selected && (
                                                        <span
                                                            className={`${active ? "text-white" : "text-blue-600"} absolute inset-y-0 left-0 flex items-center pl-1.5`}>
                                                            {checkIcon}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </>
                )}
            </Listbox>
        </div>
    );
}


type Props = {
    visible: boolean,
    resetFilters: () => void,
    children: React.ReactNode
}
export default function FilterSettings({visible, children, resetFilters}: Props) {
    const panel = (
        <div className="absolute mt-4 ml-16 p-4 w-64 border border-gray-300 rounded-md shadow-sm text-md bg-white">
            <button className="text-indigo-600 hover:text-indigo-900 pb-6 block text-sm" onClick={resetFilters}>Reset
                filters
            </button>
            {children}
        </div>
    )

    return (
        <Transition
            show={visible}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            {visible ? panel : null}
        </Transition>
    )
}
