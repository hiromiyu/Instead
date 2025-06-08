import { Home, Person, Settings } from '@mui/icons-material';
import React, { useContext } from 'react';
import './Sidebar.css';
// import CloseFriend from '../closeFriend/CloseFriend';
// import { Users } from '../../dummyData'
import { Link } from 'react-router-dom';
import { AuthContext } from '../../state/AuthContext';

export default function Sidebar() {
  const { user } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Home className="sidebarIcon" />
              {/* <span className='sidebarListItemText'>ホーム</span> */}
            </Link>
          </li>
          <li className="sidebarListItem">
            <Link
              to={`/profile/${user.username}`}
              style={{ textDecoration: 'none' }}
            >
              <Person className="sidebarIcon" />
              {/* <span className='sidebarListItemText'>プロフ</span> */}
            </Link>
          </li>
          <li className="sidebarListItem">
            <Link to="/editpage" style={{ textDecoration: 'none' }}>
              <Settings className="sidebarIcon" />
            </Link>
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
  );
}
