import React from 'react';

const Pagination = ({ totalPages, currentPage, onPageChange }) => (
    <div className="mt-4 flex justify-center">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                >
                    {i + 1}
                </button>
            ))}
        </nav>
    </div>
);

export default Pagination; 