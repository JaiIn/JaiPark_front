import React from 'react';
import CommentItem from './CommentItem';

const CommentList = ({ comments, user, onDelete }) => (
    <div className="space-y-4">
        {comments.map((comment) => (
            <CommentItem
                key={comment.id}
                comment={comment}
                canDelete={user?.username === comment.username}
                onDelete={onDelete}
            />
        ))}
    </div>
);

export default CommentList; 