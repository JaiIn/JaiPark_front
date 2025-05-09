import React, { useState } from 'react';

const MyPageEdit = () => {
    const [formData, setFormData] = useState({
        nickname: '',
        email: '',
        password: '',
        newPassword: '',
        confirmPassword: '',
        profileImage: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                    닉네임
                </label>
                <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
        </div>
    );
};

export default MyPageEdit; 