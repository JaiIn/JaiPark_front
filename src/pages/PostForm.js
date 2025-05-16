import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postService } from '../services/postService';

const PostForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            fetchPost();
        }
    }, [id]);

    const fetchPost = async () => {
        try {
            setIsLoading(true);
            const post = await postService.getPost(id);
            setFormData({
                title: post.title,
                content: post.content
            });
        } catch (error) {
            setError('게시글을 불러오는데 실패했습니다.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.content.trim()) {
            setError('제목과 내용을 모두 입력해주세요.');
            return;
        }

        try {
            setIsLoading(true);
            if (isEdit) {
                await postService.updatePost(id, formData); // 객체 전체 전달
            } else {
                await postService.createPost(formData); // 객체 전체 전달
            }
            navigate('/posts');
        } catch (error) {
            setError(isEdit ? '게시글 수정에 실패했습니다.' : '게시글 작성에 실패했습니다.');
            console.error('게시글 저장 오류:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && isEdit) {
        return <div className="text-center py-4">로딩 중...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">
                    {isEdit ? '게시글 수정' : '게시글 작성'}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            제목
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            내용
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows="10"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-100 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/posts')}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {isLoading ? '처리 중...' : (isEdit ? '수정하기' : '작성하기')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostForm; 