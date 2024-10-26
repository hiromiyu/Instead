import React, { useState, useEffect, useContext, useRef } from 'react'
import "./Post.css"
import { MoreVert } from '@mui/icons-material'
import { format } from "timeago.js"
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../state/AuthContext';
import apiClient from '../../lib/apiClient'
import Comment from '../comment/Comment'

export default function Post({ post }) {

    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
    const PUBLIC_FOLDER_URL = process.env.REACT_APP_PUBLIC_FOLDER_URL;
    const [like, setLike] = useState(post.likes.length);
    const [comment, setComment] = useState();
    const [user, setUser] = useState({});
    const { user: currentUser } = useContext(AuthContext);
    const [isLiked, setIsLiked] = useState(post.likes.includes(currentUser._id));
    const isProcessing = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const response = await apiClient.get(`/users?userId=${post.userId}`
            );
            setUser(response.data);
        };
        fetchUser();
    }, [post.userId]);

    const handleCommentSubmit = () => {
        setComment(!comment);
    }

    const handleLike = async () => {
        if (isProcessing.current) {
            return;
        }
        try {
            isProcessing.current = true;
            //いいねのAPIを叩いていく
            await apiClient.put(`/posts/${post._id}/like`, { userId: currentUser._id });
        } catch (err) {
            console.log(err);
        } finally {
            isProcessing.current = false;
        }
        setLike((like) => isLiked ? like - 1 : like + 1);
        setIsLiked(!isLiked);
    };

    const deletePost = async () => {
        try {
            await apiClient.delete(`/posts/${post._id}`, { data: { userId: currentUser._id } });
            // window.location.reload();
            navigate(`/profile/${currentUser.username}`);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteMenu = () => {
        const confirm = window.confirm('本当に削除しますか？');
        if (confirm) {
            navigate("/loading");
            deletePost();
        }
    };

    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef();

    useEffect(() => {
        showMenu &&
            menuRef.current.focus()
    }, [showMenu])

    return (
        <div className='post'>
            <div className='postSidebar'>
                <div>
                    <Link to={`/profile/${user.username}`}>
                        <img
                            src={
                                user.profilePicture ?
                                    PUBLIC_FOLDER_URL + user.profilePicture : PUBLIC_FOLDER + "/person/loading02.mp4"}
                            alt=''
                            className='postProfileImg'
                        />
                    </Link>
                </div>
                <div className="postWrapper">
                    <div className="postTop">
                        <div className="postTopLeft">
                            <span className="postUsername">
                                {user.username}
                            </span>
                            <span className="postDate">{format(post.createdAt)}</span>
                        </div>
                        <div className="postTopRight">
                            {currentUser._id === user._id &&
                                <MoreVert onClick={() =>
                                    setShowMenu(!showMenu)
                                } />}
                            {showMenu &&
                                <div>
                                    <span
                                        onBlur={() => setTimeout(() => setShowMenu(false), 100)}
                                        ref={menuRef}
                                        tabIndex={1}
                                    >
                                        <button className='deleteButton' onClick={() => deleteMenu()}>Delete!?</button>
                                    </span>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="postCenter">
                        <p className="postText">{post.desc}</p>
                        <img style={{ border: post.img ? "1px solid #555" : "" }} src={PUBLIC_FOLDER_URL + post.img} alt='' className='postImg' />
                    </div>
                    <div className="postBottom">
                        <div className="postBottomLeft">
                            <img
                                src={PUBLIC_FOLDER + 'message.png'}
                                alt='' className='postCommentIcon'
                                onClick={() => handleCommentSubmit()}
                            />
                            <span className="postCommentCounter">{post.comments.length}</span>
                            <img
                                src={isLiked ? PUBLIC_FOLDER + 'heart.png' : PUBLIC_FOLDER + 'IMG_0625.PNG'}
                                alt='' className='likeIcon'
                                style={{ color: isLiked ? "red" : "gray" }}
                                onClick={() => handleLike()}
                            />
                            <span className="postLikeCounter"
                                style={{ color: isLiked ? "red" : "gray" }}
                                onClick={() => handleLike()}
                            >
                                {like}
                            </span>
                        </div>
                    </div>
                    {comment &&
                        <Comment post={post} key={post._id} />
                    }
                </div>
            </div>
        </div >
    )
}
