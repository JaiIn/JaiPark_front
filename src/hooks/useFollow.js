import { useState, useCallback } from 'react';
import { userService } from '../services/userService';

export default function useFollow(username) {
  const [followStatus, setFollowStatus] = useState({ isFollowing: false, followingCount: 0, followerCount: 0 });
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const status = await userService.getFollowStatus(username);
      setFollowStatus(status);
    } finally {
      setLoading(false);
    }
  }, [username]);

  const fetchFollowers = useCallback(async () => {
    setFollowers(await userService.getFollowers(username));
  }, [username]);

  const fetchFollowing = useCallback(async () => {
    setFollowing(await userService.getFollowing(username));
  }, [username]);

  const follow = useCallback(async () => {
    await userService.follow(username);
    fetchStatus();
  }, [username, fetchStatus]);

  const unfollow = useCallback(async () => {
    await userService.unfollow(username);
    fetchStatus();
  }, [username, fetchStatus]);

  return {
    followStatus,
    followers,
    following,
    loading,
    fetchStatus,
    fetchFollowers,
    fetchFollowing,
    follow,
    unfollow,
  };
} 