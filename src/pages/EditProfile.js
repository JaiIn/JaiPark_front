import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [form, setForm] = useState({ nickname: '', email: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    userService.getMe().then(data => {
      setForm({ nickname: data.nickname || '', email: data.email || '' });
    });
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = e => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await userService.updateMe(form);
      setSuccess('정보가 수정되었습니다.');
    } catch (err) {
      setError('정보 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await userService.changePassword(passwords);
      setSuccess('비밀번호가 변경되었습니다.');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError('비밀번호 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-black">내 정보 수정</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-black font-semibold mb-1">닉네임</label>
          <input
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-black font-semibold mb-1">이메일</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded font-bold hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          {loading ? '저장 중...' : '정보 저장'}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 text-black">비밀번호 변경</h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-black font-semibold mb-1">현재 비밀번호</label>
            <input
              name="currentPassword"
              type="password"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">새 비밀번호</label>
            <input
              name="newPassword"
              type="password"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded font-bold hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            {loading ? '변경 중...' : '비밀번호 변경'}
          </button>
        </form>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}
    </div>
  );
};

export default EditProfile; 