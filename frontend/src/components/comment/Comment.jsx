import { useContext, useRef, useState } from 'react'
import apiClient from '../../lib/apiClient';
import { AuthContext } from '../../state/AuthContext';
import CommentTimeLine from '../commenttimeline/CommentTimeLine'
import { useNavigate } from 'react-router-dom';

export default function Comment({ post }) {
    const [newComment, setNewComment] = useState(null)
    const { user: currentUser } = useContext(AuthContext);
    const desc = useRef();
    const navigate = useNavigate();

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        const text = desc.current.value;
        if (text.trim() === '') {
            alert('コメントを入力して下さい。')
        } else {
            const confirm = window.confirm('本当にコメントしますか？');
            if (confirm) {
                navigate("/loading");
                const newComment = {
                    userId: currentUser._id,
                    desc: desc.current.value,
                    postId: post._id,
                };

                try {
                    await apiClient.post("/comment", newComment);
                    // window.location.reload();
                } catch (err) {
                }

                try {
                    await apiClient.put(`/posts/${post._id}/comment`, { userId: currentUser._id })
                    // window.location.reload();
                    navigate(`/profile/${currentUser.username}`);
                } catch (err) {
                }
            }
        }
    };

    return (
        <>
            <div className='comment'>
                <form className='commentForm' onSubmit={(e) => handleCommentSubmit(e)}>
                    <textarea
                        type='text'
                        id='text'
                        name='text'
                        value={newComment || ""}
                        ref={desc}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button className="shareButton" type='submit'>コメントする</button>
                </form>
                <CommentTimeLine post={post} key={post._id} />
            </div>
        </>
    )
}