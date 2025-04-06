import Topbar from '../../components/topbar/Topbar'
// import Sidebar from '../../components/sidebar/Sidebar'
import "./Editprofile.css"
import { useState, useRef, useContext, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Image } from '@mui/icons-material'
import { AuthContext } from '../../state/AuthContext'
import apiClient from '../../lib/apiClient'
import { motion } from 'framer-motion'

export default function Editprofile() {

    const [user, setUser] = useState({});
    const username = useParams().username;

    useEffect(() => {
        const fetchUser = async () => {
            const response = await apiClient.get(`/users?username=${username}`);
            setUser(response.data);
        };
        fetchUser();
    }, [username]);

    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
    const PUBLIC_FOLDER_URL = process.env.REACT_APP_PUBLIC_FOLDER_URL;
    const navigate = useNavigate();
    const { user: currentUser } = useContext(AuthContext);
    const acountname = useRef();
    const desc = useRef();
    const [file, setFile] = useState(null);
    const [backimgfile, backimgsetFile] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();

        const text = acountname.current.value;
        if (text.trim() === '') {
            alert('名前を入力して下さい。')
        } else {
            const confirm = window.confirm('保存しますか？');
            if (confirm) {
                navigate("/loading");

                const newUser = {
                    username: acountname.current.value,
                    userId: currentUser._id,
                    desc: desc.current.value,
                };

                if (file) {
                    try {
                        //アイコン画像削除用APIを叩く
                        await apiClient.delete(`/imgdelete/${currentUser._id}/deleteIcon`);
                    } catch (err) {
                        console.log(err);
                    }

                    const data = new FormData();
                    const fileName = Date.now() + file.name;
                    data.append("name", fileName);
                    data.append("file", file);
                    newUser.profilePicture = fileName;
                    try {
                        // 画像APIを叩く
                        await apiClient.post("/upload", data);
                    } catch (err) {
                        console.log(err);
                    }
                };
                try {
                    const data = JSON.parse(localStorage.getItem("user")) || {};
                    data.username = newUser.username;
                    localStorage.setItem("user", JSON.stringify(data));
                    await apiClient.put(`/users/${currentUser._id}`, newUser);
                    navigate(`/profile/${newUser.username}`);
                    window.location.reload();
                } catch (err) {
                    console.log(err);
                }
            }
        }
    };

    const backImghandleSubmit = async (e) => {
        e.preventDefault();

        const text = acountname.current.value;
        if (text.trim() === '') {
            alert('名前を入力して下さい。')
        } else {
            const confirm = window.confirm('保存しますか？');
            if (confirm) {
                navigate("/loading");
                const newUser = {
                    username: acountname.current.value,
                    userId: currentUser._id,
                    desc: desc.current.value,
                };

                if (backimgfile) {
                    try {
                        //カバー画像削除用APIを叩く
                        await apiClient.delete(`/imgdelete/${currentUser._id}/deleteCover`);
                    } catch (err) {
                        console.log(err);
                    }

                    const data = new FormData();
                    const fileName = Date.now() + backimgfile.name;
                    data.append("name", fileName);
                    data.append("file", backimgfile);
                    newUser.coverPicture = fileName;
                    try {
                        //画像APIを叩く
                        await apiClient.post("/upload", data);
                    } catch (err) {
                        console.log(err);
                    }
                };

                try {
                    const data = JSON.parse(localStorage.getItem("user")) || {};
                    data.username = newUser.username;
                    localStorage.setItem("user", JSON.stringify(data));
                    await apiClient.put(`/users/${currentUser._id}`, newUser);
                    navigate(`/profile/${newUser.username}`);
                    window.location.reload();
                } catch (err) {
                    console.log(err);
                }
            }
        }
    };

    return (
        <>
            <Topbar />
            <div className="editProfile">
                {/* <Sidebar /> */}
                <div className="editProfileRight">
                    {currentUser.username === user.username &&
                        <div className="editProfileRightTop">
                            <div className="editProfileCover">
                                <div className="editCoverImg">
                                    {backimgfile ?
                                        <img src={URL.createObjectURL(backimgfile)} alt='' className='editProfileCoverImg' />
                                        :
                                        <motion.img
                                            src={user.coverPicture ? PUBLIC_FOLDER_URL + user.coverPicture : PUBLIC_FOLDER + "/person/loading02.mp4"}
                                            alt=""
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.1 }}
                                            className='editProfileCoverImg'
                                        />
                                    }
                                    <form className="editShareButtons" onSubmit={(e) => backImghandleSubmit(e)}>
                                        <div className="editShareOptions">
                                            <label className="editShareOption" htmlFor='backfile'>
                                                <Image className='editCoverShareIcon' htmlColor='gray' />
                                                <span className="editShareOptionText">背景</span>
                                                <input type="file" id='backfile' accept='.png, .jpeg, .jpg'
                                                    style={{ display: "none" }}
                                                    onChange={(e) => backimgsetFile(e.target.files[0])}
                                                />
                                            </label>
                                            {backimgfile &&
                                                <button className="editEditCancelImg" onClick={() => backimgsetFile(null)}>キャンセル</button>
                                            }
                                            <button className="editShareButton" type='submit'>保存</button>
                                        </div>
                                    </form>
                                </div>
                                <form onSubmit={(e) => handleSubmit(e)}>
                                    <div className="editShareOptions">
                                        <div>
                                            <label className="editShareOption" htmlFor='username'>
                                                <span className="editShareOptionText">名前</span>
                                            </label>
                                            <textarea
                                                id='username'
                                                name='username'
                                                placeholder='ユーザー名'
                                                ref={acountname}
                                                defaultValue={user.username}
                                            />
                                            <label className="editShareOption" htmlFor='file'>
                                                <Image className='editShareIcon' htmlColor='gray' />
                                                <span className="editShareOptionText">アイコン</span>
                                                <input type="file" id='file' name='file' accept='.png, .jpeg, .jpg'
                                                    style={{ display: "none" }}
                                                    onChange={(e) => setFile(e.target.files[0])}
                                                />
                                            </label>
                                            {file &&
                                                <button className="editEditCancelImg" onClick={() => setFile(null)}>キャンセル</button>
                                            }
                                            <button className="editShareButton" type='submit'>保存</button>
                                        </div>
                                    </div>
                                    <div className="editUserImg">
                                        {file ? <img src={URL.createObjectURL(file)} alt='' className='editProfileUserImg' />
                                            :
                                            <motion.img
                                                src={user.profilePicture ? PUBLIC_FOLDER_URL + user.profilePicture : PUBLIC_FOLDER + "/person/loading02.mp4"}
                                                alt=""
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.1 }}
                                                className='editProfileUserImg'
                                            />
                                        }
                                    </div>
                                </form>
                            </div>
                            <div className="editProfileEdit">
                                <div className="editProfileInfo">
                                    <textarea
                                        // type='textarea'
                                        id='description'
                                        name='description'
                                        className='editShareInput'
                                        placeholder='プロフィール入力'
                                        ref={desc}
                                        defaultValue={user.desc}
                                    />
                                </div>
                            </div>
                            <Link to={`/profile/${currentUser.username}`}>
                                <button className='editEditButton'>戻る</button>
                            </Link>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}