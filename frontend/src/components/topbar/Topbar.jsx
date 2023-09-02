// import { Chat, Notifications } from '@mui/icons-material'
import React, { useContext, useEffect, useState } from 'react'
import "./Topbar.css"
import { Link } from 'react-router-dom'
import { AuthContext } from "../../state/AuthContext";
import { Home, Person, Settings } from '@mui/icons-material';
import apiClient from '../../lib/apiClient';

export default function Topbar() {

    const [user, setUser] = useState({});
    const { user: currentUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await apiClient.get(`/users?username=${currentUser.username}`);
            setUser(response.data);
        };
        fetchUser();
    }, [currentUser.username]);


    // const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

    return (
        <div className='topbarContainer'>
            <div className="topbarLeft">
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span className='logo'>HOME</span>
                    <Home className='homeIcon' />
                </Link>

            </div>
            <Link to={`/profile/${user.username}`} style={{ textDecoration: "none" }}>
                <Person className='sidebarIcon' />
                {/* <span className='sidebarListItemText'>プロフ</span> */}
            </Link>
            <div className="topbarRight">
                <div className="topbarIconItems">
                    {/* <div className="topbarIconItem">
                        <Chat />
                        <span className="topbarIconBadge">1</span>
                    </div>
                    <div className="topbarIconItem">
                        <Notifications />
                        <span className="topbarIconBadge">2</span>
                    </div> */}
                    {/* <Link to={`/profile/${user.username}`}>
                        <img src={user.profilePicture ? PUBLIC_FOLDER + user.profilePicture : PUBLIC_FOLDER + "/person/noAvatar.png"} alt="" className='topbarimg' />
                    </Link> */}
                    <Link to="/editpage" style={{ textDecoration: "none" }}>
                        <Settings className='sidebarIcon' />
                    </Link>
                </div>
            </div>
        </div>
    )
}
