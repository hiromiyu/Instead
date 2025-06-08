import React, { useEffect, useState } from 'react';
import './CommentTimeLine.css';
import apiClient from '../../lib/apiClient';
import Postcomment from '../../pages/postcomment/Postcomment';

export default function CommentTimeLine({ post }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await apiClient.get(`/comment/timeline/${post._id}`);
      setComments(
        response.data.sort((post1, post2) => {
          return new Date(post2.createdAt) - new Date(post1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [post._id]);

  return (
    <div className="commenttimeline">
      <div className="commenttimelineWrapper">
        {comments.map(comment => (
          <Postcomment comment={comment} post={post} key={comment._id} />
        ))}
      </div>
    </div>
  );
}
