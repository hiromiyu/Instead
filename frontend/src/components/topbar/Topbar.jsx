// import { Chat, Notifications } from '@mui/icons-material'
import React, { useContext, useEffect, useState } from 'react'
import "./Topbar.css"
import { NavLink } from 'react-router-dom'
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
                <NavLink to="/" style={{ textDecoration: "none" }}
                    className={({ isActive }) => isActive ? "nav-link.active" : "nav-link"}>
                    <span className='logo'>HOME</span>
                    <Home className='homeIcon' />
                </NavLink>
            </div>
            <NavLink to={`/profile/${user.username}`} style={{ textDecoration: "none" }}
                className={({ isActive }) => isActive ? "nav-link.active" : "nav-link"}>
                <Person className='topbarIcon' />
            </NavLink>
            <div className="topbarRight">
                <div className="topbarIconItems">
                    <NavLink to="/editpage" style={{ textDecoration: "none" }}
                        className={({ isActive }) => isActive ? "nav-link.active" : "nav-link"}>
                        <Settings className='topbarIcon' />
                    </NavLink>
                </div>
            </div>
        </div>
    )
}
