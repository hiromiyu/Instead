import { Home, Person, Settings } from '@mui/icons-material'
import React from 'react'
import "./Sidebar.css";
// import CloseFriend from '../closeFriend/CloseFriend';
// import { Users } from '../../dummyData'
import { Link } from 'react-router-dom';

export default function Sidebar() {
    return (
        <div className='sidebar'>
            <div className="sidebarWrapper">
                <ul className='sidebarList'>
                    <li className='sidebarListItem'>
                        <Link to="/" style={{ textDecoration: "none", color: "black" }} >
                            <Home className='sidebarIcon' />
                            {/* <span className='sidebarListItemText'>ホーム</span> */}
                        </Link>
                    </li>
                    <li className='sidebarListItem'>
                        <Link to="/profile/Hiro/" style={{ textDecoration: "none", color: "black" }}>
                            <Person className='sidebarIcon' />
                            {/* <span className='sidebarListItemText'>プロフ</span> */}
                        </Link>
                    </li>
                    <li className='sidebarListItem'>
                        <Settings className='sidebarIcon' />
                        {/* <span className='sidebarListItemText'>設定</span> */}
                    </li>
                </ul>
                {/* <hr className='sidebarHr' />
                <ul className='sidebarFriendList'>
                    {Users.map((user) => (
                        <CloseFriend user={user} key={user.id} />
                    ))}
                </ul> */}
            </div>
        </div>
    )
}
