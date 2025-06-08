import React, { useContext, useEffect, useState } from 'react';
import './TimeLine.css';
import Share from '../share/Share';
import Post from '../post/Post';
import { AuthContext } from '../../state/AuthContext';
import apiClient from '../../lib/apiClient';

export default function TimeLine({ username }) {
  const [posts, setPosts] = useState([]);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = username
        ? await apiClient.get(`/posts/profile/${username}`) //プロフィールの場合
        : await apiClient.get(`/posts/timeline/${user._id}`); //ホームの場合
      setPosts(
        response.data.sort((post1, post2) => {
          return new Date(post2.createdAt) - new Date(post1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [username, user._id]);

  return (
    <div className="timeline">
      <div className="timelineWrapper">
        {username === user.username && <Share />}
        {posts.map(post => (
          <Post post={post} key={post._id} />
        ))}
      </div>
    </div>
  );
}
