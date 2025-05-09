import React from 'react';

const TableHeader = () => {
    return (
        <thead className="bg-neutral-50">
            <tr>
                <th className="w-16 px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">번호</th>
                <th className="w-1/2 px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">제목</th>
                <th className="w-32 px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">작성자</th>
                <th className="w-32 px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">작성일</th>
                <th className="w-32 px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">조회수</th>
                <th className="w-32 px-4 py-3 text-center text-xs font-bold text-black uppercase tracking-wider">좋아요</th>
                <th className="w-32 px-4 py-3 text-center text-xs font-bold text-black uppercase tracking-wider">북마크</th>
                <th className="w-32 px-4 py-3 text-center text-xs font-bold text-black uppercase tracking-wider">관리</th>
            </tr>
        </thead>
    );
};

export default TableHeader; 