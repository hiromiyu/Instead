import { useEffect, useState } from "react";
import "./Postcomment.css"
import { format } from "timeago.js"
import apiClient from "../../lib/apiClient";
import { motion } from "framer-motion";
// import { AuthContext } from "../../state/AuthContext";
// import { MoreVert } from '@mui/icons-material'
// import { useNavigate } from "react-router-dom";


export default function Postcomment({ comment, post }) {

    const [user, setUser] = useState({});
    // const { user: currentUser } = useContext(AuthContext);
    // const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const response = await apiClient.get(`/users?userId=${comment.userId}`
            );
            setUser(response.data);
        };
        fetchUser();
    }, [comment.userId]);

    // const deleteComment = async () => {
    //     try {
    //         await apiClient.delete(`/comment/${comment._id}`, { data: { userId: currentUser._id } });
    //         await apiClient.put(`/posts/${post._id}/commentpull`, { userId: currentUser._id });
    //         // window.location.reload();
    //         navigate(`/profile/${currentUser.username}`);
    //     } catch (err) {
    //         console.log(err);
    //     }

    // try {
    //     await apiClient.put(`/posts/${post._id}/commentpull`, { data: { userId: currentUser._id } })
    //     window.location.reload();
    // } catch (err) {
    //     console.log(err);
    // }
    // };

    // const deleteMenu = () => {
    //     const confirm = window.confirm('本当に削除しますか？');
    //     if (confirm) {
    //         navigate("/loading");
    //         deleteComment();
    //     }
    // };

    // const [showMenu, setShowMenu] = useState(false);
    // const menuRef = useRef();

    // useEffect(() => {
    //     showMenu &&
    //         menuRef.current.focus()
    // }, [showMenu])


    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
    const PUBLIC_FOLDER_URL = process.env.REACT_APP_PUBLIC_FOLDER_URL;

    return (
        <div className='postComment'>
            <div className='postCommentSidebar'>
                <div>
                    <motion.img
                        src={user.profilePicture ? PUBLIC_FOLDER_URL + user.profilePicture : PUBLIC_FOLDER + "/person/loading02.mp4"}
                        alt=''
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
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
                        {/* <div className="postCommentTopRight">
                            {currentUser._id === user._id &&
                                <MoreVert onClick={() =>
                                    setShowMenu(!showMenu)
                                } />}
                        </div> */}
                        {/* {showMenu &&
                            <div>
                                <span
                                    onBlur={() => setTimeout(() => setShowMenu(false), 100)}
                                    ref={menuRef}
                                    tabIndex={1}
                                >
                                    <button className='deleteButton' onClick={() => deleteMenu()}>Delete!?</button>
                                </span>
                            </div>
                        } */}

                    </div>
                    <div className="postCommentCenter">
                        <p className="postCommentText">{comment.desc}</p>
                        <motion.img
                            src={comment.img ? PUBLIC_FOLDER_URL + comment.img : ""}
                            // src={PUBLIC_FOLDER_URL + comment.img}
                            alt=''
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className='postCommentImg' />
                    </div>
                </div>
            </div>
        </div >
    )
}