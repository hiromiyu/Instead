import React, { useContext, useEffect, useState } from 'react'
import "./TimeLine.css"
import Share from '../share/Share'
import Post from '../post/Post'
import axios from "axios"
import { AuthContext } from '../../state/AuthContext'


export default function TimeLine({ username }) {
    const instance = axios.create({
        baseURL: process.env.REACT_PUBLIC_API_BASEURL
    });

    const [posts, setPosts] = useState([]);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchPosts = async () => {
            const response = username
                ? await instance.get(`/posts/profile/${username}`)//プロフィールの場合
                : await instance.get(`/posts/timeline/${user._id}`);//ホームの場合
            setPosts(response.data.sort((post1, post2) => {
                return new Date(post2.createdAt) - new Date(post1.createdAt);
            })
            );
        };
        fetchPosts();
    }, [username, user._id, instance]);

    return (
        <div className='timeline'>
            <div className="timelineWrapper">
                {username === user.username && <Share />}
                {posts.map((post) => (
                    <Post post={post} key={post._id} />
                ))}
            </div>
        </div>
    )
}
