import React from 'react';

const CommentItem = ({ comment, canDelete, onDelete }) => (
    <div className="border-b pb-4">
        <div className="flex justify-between items-start">
            <div>
                <span className="font-bold !text-black">{comment.username}</span>
                <span className="!text-black text-sm ml-2">
                    {new Date(comment.createdAt).toLocaleString()}
                </span>
            </div>
            {canDelete && (
                <button
                    onClick={() => onDelete(comment.id)}
                    className="text-red-500 hover:text-red-700"
                >
                    삭제
                </button>
            )}
        </div>
        <p className="mt-2 !text-black">{comment.content}</p>
    </div>
);

export default CommentItem; 