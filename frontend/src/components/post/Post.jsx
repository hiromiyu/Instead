import React, { useState, useEffect, useContext, useRef } from 'react'
import "./Post.css"
import { MoreVert } from '@mui/icons-material'
import axios from 'axios'
import { format } from "timeago.js"
import { Link } from 'react-router-dom'
import { AuthContext } from '../../state/AuthContext';

export default function Post({ post }) {

    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
    const [like, setLike] = useState(post.likes.length);
    const [user, setUser] = useState({});

    const { user: currentUser } = useContext(AuthContext);
    const [isLiked, setIsLiked] = useState(post.isLiked);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await axios.get(`/users?userId=${post.userId}`
            );
            setUser(response.data);
        };
        fetchUser();
    }, [post.userId]);

    const handleLike = async () => {
        try {
            //いいねのAPIを叩いていく
            await axios.put(`/posts/${post._id}/like`, { userId: currentUser._id });
        } catch (err) {
            console.log(err);
        }
        setLike((like) => isLiked ? like - 1 : like + 1);
        setIsLiked(!isLiked);
    };

    const deletePost = async () => {
        try {
            await axios.delete(`/posts/${post._id}`, { data: { userId: currentUser._id } });
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    const deleteMenu = () => {
        const confirm = window.confirm('本当に削除しますか？');
        if (confirm) {
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
                                    PUBLIC_FOLDER + user.profilePicture : PUBLIC_FOLDER + "/person/noAvatar.png"}
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
                            {/* <span className="postDate">{post.createdAt}</span> */}
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
                        <img src={PUBLIC_FOLDER + post.img} alt='' className='postImg' />
                    </div>
                    <div className="postBottom">
                        <div className="postBottomLeft">
                            <img
                                src={isLiked ? PUBLIC_FOLDER + 'heart.png' : PUBLIC_FOLDER + 'IMG_0625.PNG'}
                                alt='' className='likeIcon'
                                onClick={() => handleLike()}
                            />
                            <span className="postLikeCounter"
                                style={{ color: isLiked ? "red" : "" }}
                            >
                                {like}
                            </span>
                        </div>
                        {/* <div className="postBottomRight">
                        <span className="postCommentText">{post.comment}:コメント</span>
                    </div> */}
                    </div>
                </div>
            </div>
        </div >
    )
}
