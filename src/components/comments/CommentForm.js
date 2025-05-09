import React from 'react';

const CommentForm = ({ value, onChange, onSubmit, isLoading }) => (
    <form onSubmit={onSubmit} className="mb-6">
        <textarea
            value={value}
            onChange={onChange}
            className="w-full p-2 border rounded-lg mb-2"
            rows="3"
            placeholder="댓글을 작성하세요..."
            disabled={isLoading}
        />
        <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={isLoading}
        >
            {isLoading ? '작성 중...' : '댓글 작성'}
        </button>
    </form>
);

export default CommentForm; 