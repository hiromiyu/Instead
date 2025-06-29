// import { Chat, Notifications } from '@mui/icons-material'
import { Home, Person, Settings } from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import apiClient from '../../lib/apiClient';
import { AuthContext } from '../../state/AuthContext';
import './Topbar.css';

export default function Topbar() {
  const [user, setUser] = useState({});
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await apiClient.get(
        `/users?username=${currentUser.username}`
      );
      setUser(response.data);
    };
    fetchUser();
  }, [currentUser.username]);

  // const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
                  {/* <p className="logo">タイムライン</p> */}
        <NavLink
          to="/"
          style={{ textDecoration: 'none' }}
          className={({ isActive }) =>
            isActive ? 'nav-link.active' : 'nav-link'
          }
        >
          <Home className="topbarIcon" />
        </NavLink>
      </div>
      <NavLink
        to={`/profile/${user.username}`}
        style={{ textDecoration: 'none' }}
        className={({ isActive }) =>
          isActive ? 'nav-link.active' : 'nav-link'
        }
      >
        <Person className="topbarIcon" />
      </NavLink>
      <div className="topbarRight">
        <div className="topbarIconItems">
          <NavLink
            to="/editpage"
            style={{ textDecoration: 'none' }}
            className={({ isActive }) =>
              isActive ? 'nav-link.active' : 'nav-link'
            }
          >
            <Settings className="topbarIcon" />
          </NavLink>
        </div>
      </div>
    </div>
  );
}
