import "./Following.css";
import Topbar from "../../components/topbar/Topbar";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../state/AuthContext";
import apiClient from "../../lib/apiClient";
import { motion } from "framer-motion";

export default function Following() {

    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
    const PUBLIC_FOLDER_URL = process.env.REACT_APP_PUBLIC_FOLDER_URL;
    const [friends, setFriends] = useState([]);
    const { user: currentUser } = useContext(AuthContext);

    useEffect(() => {
        const getFriends = async () => {
            try {
                const friendList = await apiClient.get(`/users/friends/${currentUser._id}`);
                setFriends(friendList.data);
            } catch (err) {

            }
        };
        getFriends();
    }, [currentUser]);

    return (
        <>
            <Topbar />
            {friends.map((friend) => (
                <div className="homeFollowing" key={friend._id}>
                    <Link to={"/profile/" + friend.username}
                        style={{ textDecoration: "none" }}>
                        <div className="followSidebar">
                            <div>
                                <motion.img
                                    src={friend.profilePicture ? PUBLIC_FOLDER_URL + friend.profilePicture : PUBLIC_FOLDER + "/person/loading02.mp4"}
                                    alt=""
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="homeFollowingImg"
                                />
                            </div>
                        </div>
                    </Link>
                    <Link to={"/profile/" + friend.username}
                        style={{ textDecoration: "none" }}>
                        <div className="followWrapper">
                            <div className="followTop">
                                <div className="followTopLeft">
                                    <span className="homeFollowingName">{friend.username}</span>
                                </div>
                                <div className="followTopRight">
                                </div>
                            </div>
                            <span className="homeFollowingStatus">{friend.desc}</span>
                        </div>
                    </Link>
                </div>

            ))
            }
        </>
    )
}