import React from 'react';

const ProfileInfoRow = ({ label, value }) => (
    <div className="flex items-center space-x-2">
        <span className="font-semibold text-indigo-700">{label}:</span>
        <span>{value}</span>
    </div>
);

export default ProfileInfoRow; 