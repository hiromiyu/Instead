import React, { useContext, useRef } from 'react'
import Topbar from '../../components/topbar/Topbar'
import TimeLine from '../../components/timeline/TimeLine'
import "./Profile.css"
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AuthContext } from '../../state/AuthContext'
import apiClient from '../../lib/apiClient'
import Linkify from 'linkify-react'
import { motion } from 'framer-motion'

export default function Profile() {

    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
    const PUBLIC_FOLDER_URL = process.env.REACT_APP_PUBLIC_FOLDER_URL;

    const [user, setUser] = useState({});
    const username = useParams().username;
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const [followed, setFollowed] = useState(currentUser.followings.includes(user?._id));
    const isProcessing = useRef(false);

    useEffect(() => {
        setFollowed(currentUser.followings.includes(user?._id));
    }, [currentUser, user._id]);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await apiClient.get(`/users?username=${username}`);
            setUser(response.data);
        };
        fetchUser();
    }, [username]);

    const handleClick = async () => {
        if (isProcessing.current) {
            return; // 連打防止
        }

        setFollowed(!followed);
        isProcessing.current = true;

        try {
            if (followed) {
                await apiClient.put(`/users/${user._id}/unfollow`, {
                    userId: currentUser._id
                });
                dispatch({ type: "UNFOLLOW", payload: user._id })

            } else {
                await apiClient.put(`/users/${user._id}/follow`, {
                    userId: currentUser._id
                });
                dispatch({ type: "FOLLOW", payload: user._id })
            }
        } catch (err) {

            // エラー時に状態を元に戻す
            setFollowed(followed);
        } finally {
            isProcessing.current = false; // 処理完了後に連打防止を解除
        }
    };

    return (
        <>
            <Topbar />
            <div className="profile">
                {/* <Sidebar /> */}
                <div className="profileRight">
                    <div className="profileRightTop">
                        <div className="profileCover">
                            <motion.img
                                src={user.coverPicture ? PUBLIC_FOLDER_URL + user.coverPicture : PUBLIC_FOLDER + "/person/loading02.mp4"}
                                alt=""
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className='profileCoverImg'
                            />
                            <motion.img
                                src={user.profilePicture ? PUBLIC_FOLDER_URL + user.profilePicture : PUBLIC_FOLDER + "/person/loading02.mp4"}
                                alt=""
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className='profileUserImg'
                            />
                        </div>
                        <div className='profileEdit'>
                            <div className="profileInfo">
                                <div className="profileInfoTop">
                                    <h4 className='profileInfoName'>{user.username}</h4>
                                    {user.username !== currentUser.username && (
                                        <button className="followingButton" onClick={handleClick}
                                            style={{
                                                color: followed ? "white" : "black",
                                                backgroundColor: followed ? "black" : "white",
                                                fontsize: 14,
                                                paddingInline: 16,
                                                // border: 1,
                                                // borderradius: 23,

                                            }}>
                                            {followed ? "Following" : "Follow"}
                                        </button>
                                    )}
                                    {currentUser.username === user.username &&
                                        <Link to={`/editprofile/${user.username}`}>
                                            <button className='editButton'>編集</button>
                                        </Link>
                                    }
                                </div>
                                <span className="profileInfoDesc">
                                    <Linkify>
                                        {user.desc}
                                    </Linkify>
                                </span>
                                {currentUser.username === user.username &&
                                    <Link to={"/following/" + user.username}>
                                        <span className="profileInfoFollowers">友達</span>
                                    </Link>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="profileRightBottom">
                        <TimeLine username={username} />
                    </div>
                </div>
            </div>
        </>
    )
}
