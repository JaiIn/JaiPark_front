import React from 'react';

const FollowList = ({ title, users, visible }) => {
  if (!visible) return null;
  return (
    <div className="w-full mt-4">
      <h3 className="font-bold mb-2 text-black">{title}</h3>
      <ul className="divide-y">
        {users.length === 0 ? (
          <li className="text-gray-400">{title}이 없습니다.</li>
        ) : (
          users.map(f => (
            <li key={f.username} className="py-2 text-black">@{f.username} {f.name && `(${f.name})`}</li>
          ))
        )}
      </ul>
    </div>
  );
};

export default FollowList; 