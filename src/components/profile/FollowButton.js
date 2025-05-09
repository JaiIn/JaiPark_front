import React from 'react';

const FollowButton = ({ isFollowing, onFollow, onUnfollow, disabled }) => {
  return isFollowing ? (
    <button className="mt-4 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 font-bold" onClick={onUnfollow} disabled={disabled}>
      언팔로우
    </button>
  ) : (
    <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-bold" onClick={onFollow} disabled={disabled}>
      팔로우
    </button>
  );
};

export default FollowButton; 