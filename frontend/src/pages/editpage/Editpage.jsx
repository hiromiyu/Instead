import { Link, useNavigate } from "react-router-dom";
// import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import "./EditPage.css";
import { useContext } from "react";
import { AuthContext } from "../../state/AuthContext";
import apiClient from "../../lib/apiClient";

export default function EditPage() {

    const navigate = useNavigate();

    const { user: currentUser } = useContext(AuthContext);

    const deleteUser = async () => {
        try {
            navigate("/");
            await apiClient.delete(`/posts/${currentUser.username}/deleteall`);
            await apiClient.delete(`/users/${currentUser._id}`, { data: { userId: currentUser._id } });
            localStorage.clear();
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    const logout = () => {
        try {
            navigate("/");
            localStorage.clear();
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    const logoutMenu = () => {
        const confirm = window.confirm('ログアウトしますか？');
        if (confirm) {
            logout();
        }
    };

    const deleteMenu = () => {
        const confirm = window.confirm('OKを押すと全てのデータが削除され元には戻せません!\n本当に退会しますか？');
        if (confirm) {
            deleteUser();
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
            <div className="logoutButton">
                <button onClick={() => logoutMenu()}>ログアウト</button>
            </div>
            <div className="withdrawalButton">
                <button onClick={() => deleteMenu()}>退会</button>
            </div>


        </>
    )
}