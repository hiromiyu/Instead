import React, { useContext } from 'react'
import Topbar from '../../components/topbar/Topbar'
import TimeLine from '../../components/timeline/TimeLine'
import "./Profile.css"
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AuthContext } from '../../state/AuthContext'
import apiClient from '../../lib/apiClient'
import Linkify from 'linkify-react'

export default function Profile() {

    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
    const PUBLIC_FOLDER_URL = process.env.REACT_APP_PUBLIC_FOLDER_URL;

    const [user, setUser] = useState({});
    const username = useParams().username;
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const [followed, setFollowed] = useState(currentUser.followings.includes(user?._id));

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
            console.log(err);
        }
        setFollowed(!followed);
    };

    return (
        <>
            <Topbar />
            <div className="profile">
                {/* <Sidebar /> */}
                <div className="profileRight">
                    <div className="profileRightTop">
                        <div className="profileCover">
                            <img
                                src={user.coverPicture ? PUBLIC_FOLDER_URL + user.coverPicture : PUBLIC_FOLDER + "/person/loading02.mp4"}
                                alt=""
                                className='profileCoverImg'
                            />
                            <img
                                src={user.profilePicture ? PUBLIC_FOLDER_URL + user.profilePicture : PUBLIC_FOLDER + "/person/loading02.mp4"}
                                alt=""
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
                                                color: followed ? "" : "black",
                                                backgroundColor: followed ? "" : "white",

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
