import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [form, setForm] = useState({ name: '', email: '', profileImage: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    userService.getMe().then(data => {
      setForm({ name: data.name || '', email: data.email || '', profileImage: data.profileImage || '' });
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
          <label className="block text-black font-semibold mb-1">이름</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-black font-semibold mb-1">이메일</label>
          <input name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-black font-semibold mb-1">프로필 이미지 URL</label>
          <input name="profileImage" value={form.profileImage} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded font-bold" disabled={loading}>정보 저장</button>
      </form>
      <hr className="my-6" />
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div>
          <label className="block text-black font-semibold mb-1">현재 비밀번호</label>
          <input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-black font-semibold mb-1">새 비밀번호</label>
          <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} className="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded font-bold" disabled={loading}>비밀번호 변경</button>
      </form>
      {error && <div className="mt-4 text-red-500">{error}</div>}
      {success && <div className="mt-4 text-green-600">{success}</div>}
      <button className="mt-6 text-blue-500 hover:underline" onClick={() => navigate(-1)}>돌아가기</button>
    </div>
  );
};

export default EditProfile; 