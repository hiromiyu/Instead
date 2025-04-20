import React, { useContext, useEffect, useRef, useState } from 'react'
import "./Share.css"
import { Image } from '@mui/icons-material'
import { AuthContext } from '../../state/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../lib/apiClient';
import { motion } from 'framer-motion';

export default function Share() {

    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
    const PUBLIC_FOLDER_URL = process.env.REACT_APP_PUBLIC_FOLDER_URL;
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const username = useParams().username;

    useEffect(() => {
        const fetchUser = async () => {
            const response = await apiClient.get(`/users?username=${username}`);
            setUser(response.data);
        };
        fetchUser();
    }, [username]);

    const { user: currentUser } = useContext(AuthContext);
    const desc = useRef(null);


    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const text = desc.current.value;
        if (text.trim() === '') {
            alert('投稿文を入力して下さい。')
        } else {
            const confirm = window.confirm('本当に投稿しますか？');
            if (confirm) {
                navigate("/loading");
                const newPost = {
                    userId: currentUser._id,
                    desc: desc.current.value,
                };

                if (file) {
                    const data = new FormData();
                    const fileName = Date.now() + file.name;
                    data.append("name", fileName);
                    data.append("file", file);
                    newPost.img = fileName;
                    try {
                        //画像APIを叩く
                        await apiClient.post("/upload", data);
                    } catch (err) {
                    }
                };

                try {
                    await apiClient.post("/posts", newPost);
                    // window.location.reload();
                    navigate(`/profile/${currentUser.username}`);
                } catch (err) {
                }
            }
        }
    };

    return (
        <>
            <div className='share'>
                <div className="shareWrapper">
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="shareTop">
                            <motion.img
                                src={user.profilePicture ? PUBLIC_FOLDER_URL + user.profilePicture : PUBLIC_FOLDER + "/person/loading02.mp4"}
                                alt=''
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className='shareProfileImg'
                            />
                            <textarea
                                // type='textarea'
                                id='description'
                                name='description'
                                className='shareInput'
                                placeholder='say something'
                                rows='4'
                                ref={desc}
                            />
                        </div>
                        <hr className='shareHr' />
                        {file && (
                            <div className="shareImgContainer">
                                <img src={URL.createObjectURL(file)} alt='' className='shareImg' />
                                {/* <Cancel className="shareCancelImg" onClick={() => setFile(null)} /> */}
                                <button className="shareCancelImg" onClick={() => setFile(null)}>キャンセル</button>
                            </div>
                        )}
                        {/* <div className='shareButtons'> */}
                        <div className="shareOptions">
                            <label className="shareOption" htmlFor='file'>
                                <Image className='shareIcon' htmlColor='gray' />
                                <span className="shareOptionText">写真</span>
                                <input type="file" id='file' name='file' accept='.png, .jpeg, .jpg'
                                    style={{ display: "none" }}
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </label>
                            <button className="shareButton" type='submit'>投稿</button>
                        </div>
                        {/* </div> */}
                    </form>
                </div>
            </div>
        </>
    )
}
