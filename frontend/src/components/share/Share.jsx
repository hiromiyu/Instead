import React, { useContext, useEffect, useRef, useState } from 'react'
import "./Share.css"
import { Image } from '@mui/icons-material'
import { AuthContext } from '../../state/AuthContext';
import { useParams } from 'react-router-dom';
import apiClient from '../../lib/apiClient';


export default function Share() {

    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

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
    const desc = useRef();

    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newPost = {
            userId: currentUser._id,
            desc: desc.current.value,
        };

        if (file) {
            const data = new FormData();
            const fileName = Date.now() + file.name;
            // data.append("name", fileName);
            // data.append("file", file);
            data.set("name", fileName);
            data.set("file", file);
            newPost.img = fileName;
            try {
                //画像APIを叩く
                await apiClient.post("/upload", data);
            } catch (err) {
                console.log(err);
            }
        };

        try {
            await apiClient.post("/posts", newPost);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className='share'>
            <div className="shareWrapper">
                <div className="shareTop">
                    <img
                        src={
                            user.profilePicture ?
                                PUBLIC_FOLDER + user.profilePicture : PUBLIC_FOLDER + "/person/noAvatar.png"}
                        alt=''
                        className='shareProfileImg'
                    />
                    <textarea
                        type='textarea'
                        className='shareInput'
                        placeholder='say something'
                        rows='4'
                        ref={desc}
                    />
                </div>
                <hr className='shareHr' />
                <div>
                    <form className="shareButtons" onSubmit={(e) => handleSubmit(e)}>
                        {file && (
                            <div className="shareImgContainer">
                                <img src={URL.createObjectURL(file)} alt='' className='shareImg' />
                                {/* <Cancel className="shareCancelImg" onClick={() => setFile(null)} /> */}
                                <button className="shareCancelImg" onClick={() => setFile(null)}>キャンセル</button>
                            </div>
                        )}
                        <div className="shareOptions">
                            <label className="shareOption" htmlFor='file'>
                                <Image className='shareIcon' htmlColor='gray' />
                                <span className="shareOptionText">写真</span>
                                <input type="file" id='file' accept='.png, .jpeg, .jpg'
                                    style={{ display: "none" }}
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </label>
                        </div>
                        <label className="shareButton" type='submit'>投稿</label>
                    </form>
                </div>
            </div>
        </div>
    )
}
