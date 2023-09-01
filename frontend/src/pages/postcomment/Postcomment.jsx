import { useEffect, useState } from "react";
import "./Postcomment.css"
import { format } from "timeago.js"
import apiClient from "../../lib/apiClient";

export default function Postcomment({ comment }) {

    const [user, setUser] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            const response = await apiClient.get(`/users?userId=${comment.userId}`
            );
            setUser(response.data);
        };
        fetchUser();
    }, [comment.userId]);


    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
    const PUBLIC_FOLDER_URL = process.env.REACT_APP_PUBLIC_FOLDER_URL;

    return (
        <div className='postComment'>
            <div className='postCommentSidebar'>
                <div>
                    <img
                        src={
                            user.profilePicture ?
                                PUBLIC_FOLDER_URL + user.profilePicture : PUBLIC_FOLDER + "/person/noAvatar.png"}
                        alt=''
                        className='postCommentProfileImg'
                    />
                </div>
                <div className="postCommentWrapper">
                    <div className="postCommentTop">
                        <div className="postCommentTopLeft">
                            <span className="postCommentUsername">
                                {user.username}
                            </span>
                            <span className="postCommentDate">{format(comment.createdAt)}</span>
                        </div>
                    </div>
                    <div className="postCommentCenter">
                        <p className="postCommentText">{comment.desc}</p>
                        <img src={PUBLIC_FOLDER_URL + comment.img} alt='' className='postCommentImg' />
                    </div>
                </div>
            </div>
        </div >
    )
}