import Topbar from '../../components/topbar/Topbar'
// import Sidebar from '../../components/sidebar/Sidebar'
import "./Editprofile.css"
import { useState, useRef, useContext, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Image } from '@mui/icons-material'
import { AuthContext } from '../../state/AuthContext'

export default function Editprofile() {

    const [user, setUser] = useState({});
    const username = useParams().username;

    useEffect(() => {
        const fetchUser = async () => {
            const response = await axios.get(`/users?username=${username}`);
            setUser(response.data);
        };
        fetchUser();
    }, [username]);

    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
    const navigate = useNavigate();
    const { user: currentUser } = useContext(AuthContext);
    const desc = useRef();
    const [file, setFile] = useState(null);
    const [backimgfile, backimgsetFile] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newUser = {
            userId: currentUser._id,
            desc: desc.current.value,
        };

        if (file) {
            const data = new FormData();
            const fileName = Date.now() + file.name;
            data.append("name", fileName);
            data.append("file", file);
            newUser.profilePicture = fileName;
            try {
                // 画像APIを叩く
                await axios.post("/upload", data);
            } catch (err) {
                console.log(err);
            }
        };
        try {
            await axios.put(`/users/${currentUser._id}`, newUser);
            navigate(`/profile/${currentUser.username}`);
        } catch (err) {
            console.log(err);
        }
    };

    const backImghandleSubmit = async (e) => {
        e.preventDefault();

        const newUser = {
            userId: currentUser._id,
            desc: desc.current.value,
        };

        if (backimgfile) {
            const data = new FormData();
            const fileName = Date.now() + backimgfile.name;
            data.append("name", fileName);
            data.append("file", backimgfile);
            newUser.coverPicture = fileName;
            try {
                //画像APIを叩く
                await axios.post("/upload", data);
            } catch (err) {
                console.log(err);
            }
        };

        try {
            await axios.put(`/users/${currentUser._id}`, newUser);
            navigate(`/profile/${currentUser.username}`);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <Topbar />
            <div className="profile">
                {/* <Sidebar /> */}
                <div className="profileRight">
                    <div className="profileRightTop">
                        <div className="profileCover">
                            <div className="coverImg">
                                {backimgfile ?
                                    <img src={URL.createObjectURL(backimgfile)} alt='' className='profileCoverImg' />
                                    :
                                    <img
                                        src={user.coverPicture ? PUBLIC_FOLDER + user.coverPicture : PUBLIC_FOLDER + "/person/noAvatar.png"}
                                        alt=""
                                        className='profileCoverImg'
                                    />
                                }
                                <form className="shareButtons" onSubmit={(e) => backImghandleSubmit(e)}>
                                    {/* {backimgfile &&
                                        <div className="shareImgContainer">
                                            <img src={URL.createObjectURL(backimgfile)} alt='' className='shareImg' />
                                            <Cancel className="shareCancelImg" onClick={() => backimgsetFile(null)} />
                                            <button className="shareCancelImg" onClick={() => backimgsetFile(null)}>キャンセル</button>
                                        </div>
                                    } */}
                                    <div className="shareOptions">
                                        <label className="shareOption" htmlFor='backfile'>
                                            <Image className='covershareIcon' htmlColor='gray' />
                                            <span className="shareOptionText">背景</span>
                                            <input type="file" id='backfile' accept='.png, .jpeg, .jpg'
                                                style={{ display: "none" }}
                                                onChange={(e) => backimgsetFile(e.target.files[0])}
                                            />
                                        </label>
                                        {backimgfile &&
                                            <button className="editCancelImg" onClick={() => backimgsetFile(null)}>キャンセル</button>
                                        }
                                        <button className="shareButton" type='submit'>保存</button>
                                    </div>
                                </form>
                            </div>
                            <form onSubmit={(e) => handleSubmit(e)}>
                                {/* {file &&
                                    <div className="shareImgContainer">
                                        <img src={URL.createObjectURL(file)} alt='' className='shareImg' />
                                        <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
                                        <button className="shareCancelImg" onClick={() => setFile(null)}>キャンセル</button>
                                    </div>
                                } */}
                                <div className="shareOptions">
                                    <label className="shareOption" htmlFor='file'>
                                        <Image className='shareIcon' htmlColor='gray' />
                                        <span className="shareOptionText">アイコン</span>
                                        <input type="file" id='file' accept='.png, .jpeg, .jpg'
                                            style={{ display: "none" }}
                                            onChange={(e) => setFile(e.target.files[0])}
                                        />
                                    </label>
                                    {file &&
                                        <button className="editCancelImg" onClick={() => setFile(null)}>キャンセル</button>
                                    }
                                    <button className="shareButton" type='submit'>保存</button>
                                </div>
                                <div className="userImg">
                                    {file ? <img src={URL.createObjectURL(file)} alt='' className='profileUserImg' />
                                        :
                                        <img
                                            src={user.profilePicture ? PUBLIC_FOLDER + user.profilePicture : PUBLIC_FOLDER + "/person/noAvatar.png"}
                                            alt=""
                                            className='profileUserImg'
                                        />
                                    }

                                </div>
                            </form>
                        </div>
                        <div className="profileEdit">
                            <div className="profileInfo">
                                <textarea
                                    type='textarea'
                                    className='shareInput'
                                    placeholder='プロフィール入力'
                                    ref={desc}
                                    defaultValue={user.desc}
                                />
                            </div>
                        </div>
                        <Link to={`/profile/${currentUser.username}`}>
                            <button className='editButton'>戻る</button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}