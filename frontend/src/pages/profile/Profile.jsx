import React from 'react'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import TimeLine from '../../components/timeline/TimeLine'
import "./Profile.css"
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'

export default function Profile() {
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

    const [user, setUser] = useState({});
    const username = useParams().username;

    useEffect(() => {
        const fetchUser = async () => {
            const response = await axios.get(`/users?username=${username}`);
            setUser(response.data);
        };
        fetchUser();
    }, [username]);

    return (
        <>
            <Topbar />
            <div className="profile">
                <Sidebar />
                <div className="profileRight">
                    <div className="profileRightTop">
                        <div className="profileCover">
                            <img
                                src={user.coverPicture ? PUBLIC_FOLDER + user.coverPicture : PUBLIC_FOLDER + "/person/noAvatar.png"}
                                alt=""
                                className='profileCoverImg'
                            />
                            <img
                                src={user.profilePicture ? PUBLIC_FOLDER + user.profilePicture : PUBLIC_FOLDER + "/person/noAvatar.png"}
                                alt=""
                                className='profileUserImg'
                            />
                        </div>
                        <div className='profileEdit'>
                            <div className="profileInfo">
                                <h4 className='profileInfoName'>{user.username}</h4>
                                <span className="profileInfoDesc">{user.desc}</span>
                            </div>
                            <Link to={`/editprofile/${user.username}`}>
                                <button className='editButton'>プロフィール編集</button>
                            </Link>
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
