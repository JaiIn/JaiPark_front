import React from 'react';
import ProfileInfoRow from './ProfileInfoRow';
import profileDefault from '../../assets/profile-default.png';

const ProfileCard = ({ user }) => {
    return (
        <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-10 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-200 shadow-lg mb-6">
                <img
                    src={user.profileImage || profileDefault}
                    alt="프로필"
                    className="w-full h-full object-cover"
                />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">내 정보</h1>
            <div className="w-full flex flex-col items-center text-lg space-y-2 mb-4">
                <ProfileInfoRow label="닉네임" value={user.nickname} />
                <ProfileInfoRow label="아이디" value={user.username} />
                <ProfileInfoRow label="이메일" value={user.email} />
            </div>
        </div>
    );
};

export default ProfileCard; 