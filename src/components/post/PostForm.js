import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PostForm = ({ initialData = { title: '', content: '' }, onSubmit, submitLabel = '작성' }) => {
    const [formData, setFormData] = useState(initialData);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="bg-white shadow-xl rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-black mb-8">
                {initialData.id ? '게시글 수정' : '새 게시글 작성'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                    <label htmlFor="title" className="block text-base font-bold mb-2 text-black">
                        제목
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg text-black bg-neutral-50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="제목을 입력하세요"
                    />
                </div>
                <div>
                    <label htmlFor="content" className="block text-base font-bold mb-2 text-black">
                        내용
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        rows="10"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg text-black bg-neutral-50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="내용을 입력하세요"
                    />
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-5 py-2 rounded-lg bg-neutral-200 text-black font-bold hover:bg-neutral-300 transition"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-primary-700 text-white font-bold hover:bg-primary-800 transition"
                    >
                        {submitLabel}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostForm; 