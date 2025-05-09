import React from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

const PostTable = ({ posts }) => {
    const safePosts = Array.isArray(posts) ? posts : [];
    
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full">
                <TableHeader />
                <TableBody posts={safePosts} />
            </table>
        </div>
    );
};

export default PostTable; 