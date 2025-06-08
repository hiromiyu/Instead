import { Link, useNavigate } from 'react-router-dom';
// import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from '../../components/topbar/Topbar';
import './EditPage.css';
import { useContext } from 'react';
import { AuthContext } from '../../state/AuthContext';
import apiClient from '../../lib/apiClient';
import { signOut, deleteUser } from 'firebase/auth';
import { auth } from '../../firebase';

export default function EditPage() {
  const navigate = useNavigate();

  const { user: currentUser } = useContext(AuthContext);

  const deleteAccount = async () => {
    const user = auth.currentUser;
    if (user) {
      deleteUser(user)
        .then(() => {
          console.log('User deleted successfully');
        })
        .catch(error => {
          console.error('Error deleting user:', error);
        });
    }
    try {
      navigate('/');
      await apiClient.delete(`/posts/${currentUser.username}/deleteall`);
      await apiClient.delete(`/users/${currentUser._id}`, {
        data: { userId: currentUser._id },
      });
      localStorage.clear();
      window.location.reload();
    } catch (err) {}
  };

  const logout = () => {
    try {
      navigate('/');
      localStorage.clear();
      signOut(auth);
      window.location.reload();
    } catch (err) {}
  };

  const logoutMenu = () => {
    const confirm = window.confirm('ログアウトしますか？');
    if (confirm) {
      logout();
    }
  };

  const deleteMenu = () => {
    const confirm = window.confirm(
      'OKを押すと全てのデータが削除され元には戻せません!\n本当に退会しますか？'
    );
    if (confirm) {
      deleteAccount();
    }
  };

  return (
    <>
      <Topbar />
      <div className="editContainer">
        {/* <Sidebar /> */}
        <div className="editLeft">
          <Link to="/privacy">
            <h2 className="privacyButton">プライバシーポリシー</h2>
          </Link>
          <Link to="/termsofservice">
            <h2 className="privacyButton">利用規約</h2>
          </Link>
        </div>
      </div>
      <div>
        <button className="logoutButton" onClick={() => logoutMenu()}>
          ログアウト
        </button>
      </div>
      <div>
        <button className="withdrawalButton" onClick={() => deleteMenu()}>
          退会
        </button>
      </div>
    </>
  );
}
