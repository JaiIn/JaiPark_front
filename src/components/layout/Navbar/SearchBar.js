import React from 'react';

const SearchBar = ({ searchKeyword, onSearchChange, onSearchSubmit }) => {
    return (
        <form onSubmit={onSearchSubmit} className="flex-1 max-w-2xl mx-4">
            <div className="relative">
                <input
                    type="text"
                    value={searchKeyword}
                    onChange={onSearchChange}
                    placeholder="검색어를 입력하세요"
                    className="w-full pl-10 pr-4 py-2 rounded-full border border-neutral-300 bg-neutral-50 text-neutral-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>
        </form>
    );
};

export default SearchBar; 