import React, { useState } from 'react';
import { SkippedRow } from '../src/api/fetchPeople';

type Props = {
    skippedRows: SkippedRow[];
};

export default function SkippedRowsDisplay({ skippedRows }: Props) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (skippedRows.length === 0) {
        return null;
    }

    return (
        <div className="fixed bottom-0 right-0 z-50 p-3 w-full md:w-80 bg-white border border-gray-200 shadow-md rounded-tl-md">
            <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-medium text-gray-700">
                    {skippedRows.length} row{skippedRows.length !== 1 ? 's' : ''} skipped
                </h3>
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
                >
                    {isExpanded ? 'Hide details' : 'Show details'}
                </button>
            </div>
            
            <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[70vh] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="mt-2 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 40px)' }}>
                    <table className="w-full text-xs">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="p-2 text-left font-medium text-gray-600 w-16">Row #</th>
                                <th className="p-2 text-left font-medium text-gray-600">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {skippedRows.map((row, index) => (
                                <tr key={index} className="border-t border-gray-100">
                                    <td className="p-2 align-top text-gray-600 whitespace-nowrap">
                                        {row.rowNumber}
                                    </td>
                                    <td className="p-2 align-top">
                                        <div className="mb-2 text-gray-600 font-medium">{row.reason}</div>
                                        <pre className="text-xs overflow-x-auto whitespace-pre-wrap text-gray-600 bg-gray-50 p-2 rounded">
                                            {JSON.stringify(row.rowData, null, 2)}
                                        </pre>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
