import { Link, useNavigate } from "react-router-dom";
// import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import "./EditPage.css";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../state/AuthContext";

export default function EditPage() {
    const navigate = useNavigate();

    const { user: currentUser } = useContext(AuthContext);

    const deleteUser = async () => {
        try {
            navigate("/");
            await axios.delete(`/posts/${currentUser.username}/deleteall`);
            await axios.delete(`/users/${currentUser._id}`, { data: { userId: currentUser._id } });
            localStorage.clear();
            window.location.reload();
        } catch (err) {
            console.log(err);
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
                        <h2>プライバシーポリシー</h2>
                    </Link>
                    <Link to="/termsofservice">
                        <h2>利用規約</h2>
                    </Link>
                </div>
                <div className="editButtom">
                    <button onClick={() => deleteMenu()}>退会</button>
                </div>
            </div>
        </>
    )
}