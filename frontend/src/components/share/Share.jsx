import React, { useContext, useRef, useState } from 'react'
import "./Share.css"
import { Cancel, Image } from '@mui/icons-material'
import { AuthContext } from '../../state/AuthContext';
import axios from "axios"


export default function Share() {
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user } = useContext(AuthContext);
    const desc = useRef();

    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newPost = {
            userId: user._id,
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
                await axios.post("/upload", data);
            } catch (err) {
                console.log(err);
            }
        };

        try {
            await axios.post("/posts", newPost);
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
                    <input
                        type='text'
                        className='shareInput'
                        placeholder='今何してるの？'
                        ref={desc}
                    />
                </div>
                <hr className='shareHr' />
                <form className="shareButtons" onSubmit={(e) => handleSubmit(e)}>
                    {file && (
                        <div className="shareImgContainer">
                            <img src={URL.createObjectURL(file)} alt='' className='shareImg' />
                            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
                        </div>
                    )}
                    <div className="shareOptions">
                        <label className="shareOption" htmlFor='file'>
                            <Image className='shareIcon' htmlColor='blue' />
                            <span className="shareOptionText">写真</span>
                            <input type="file" id='file' accept='.png, .jpeg, .jpg'
                                style={{ display: "none" }}
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </label>
                    </div>
                    <button className="shareButton" type='submit'>投稿</button>
                </form>
            </div>
        </div>
    )
}
