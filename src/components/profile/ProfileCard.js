import React from 'react';
import ProfileInfoRow from './ProfileInfoRow';
import profileDefault from '../../assets/profile-default.png';

const ProfileCard = ({ user }) => {
    return (
        <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-10 flex flex-col items-center">
            <img
                src={profileDefault}
                alt="기본 프로필"
                className="w-32 h-32 rounded-full border-4 border-indigo-200 shadow mb-6 object-cover"
            />
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">내 정보</h1>
            <div className="w-full flex flex-col items-center text-lg space-y-2 mb-4">
                <ProfileInfoRow label="아이디" value={user.username} />
                <ProfileInfoRow label="이메일" value={user.email} />
            </div>
            <div className="text-gray-500 text-sm">기본 프로필 이미지는 변경할 수 없습니다.</div>
        </div>
    );
};

export default ProfileCard; 