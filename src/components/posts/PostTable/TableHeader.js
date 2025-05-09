import React from 'react';

const TableHeader = () => (
    <thead className="bg-gray-100">
        <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">제목</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">작성자</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">작성일</th>
        </tr>
    </thead>
);

export default TableHeader; 