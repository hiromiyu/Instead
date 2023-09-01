import { useContext, useRef, useState } from 'react'
import apiClient from '../../lib/apiClient';
import { AuthContext } from '../../state/AuthContext';
import CommentTimeLine from '../commenttimeline/CommentTimeLine'

export default function Comment({ post }) {
    const [newComment, setNewComment] = useState(null)
    const { user: currentUser } = useContext(AuthContext);
    const desc = useRef();

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        const newComment = {
            userId: currentUser._id,
            desc: desc.current.value,
            postId: post._id,
        };

        try {
            await apiClient.post("/comment", newComment);
            // window.location.reload();
        } catch (err) {
            console.log(err);
        }

        try {
            await apiClient.put(`/posts/${post._id}/comment`, { userId: currentUser._id })
            window.location.reload();
        } catch (err) {
            console.log(err);
        }

    };

    return (
        <>
            <div className='comment'>
                <form className='commentForm' onSubmit={(e) => handleCommentSubmit(e)}>
                    <textarea
                        type='text'
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