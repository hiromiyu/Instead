import "./Following.css";
import Topbar from "../../components/topbar/Topbar";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../state/AuthContext";

export default function Following() {
    const instance = axios.create({
        baseURL: process.env.REACT_PUBLIC_API_BASEURL
    });

    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
    const [friends, setFriends] = useState([]);
    const { user: currentUser } = useContext(AuthContext);

    useEffect(() => {
        // document.title = "Following";
        // window.scrollTo(0, 0);
        const getFriends = async () => {
            try {
                const friendList = await instance.get(`/users/friends/${currentUser._id}`);
                setFriends(friendList.data);
            } catch (err) {
                console.log(err);
            }
        };
        getFriends();
    }, [currentUser, instance]);

    return (
        <>
            <Topbar />
            {friends.map((friend) => (
                <Link to={"/profile/" + friend.username} key={friend._id}
                    style={{ textDecoration: "none", color: "black" }}>
                    <div className="homeFollowing">
                        <div className="followSidebar">
                            <div>
                                <img
                                    src={friend.profilePicture ?
                                        PUBLIC_FOLDER + friend.profilePicture :
                                        PUBLIC_FOLDER + "person/noAvatar.png"}
                                    alt=""
                                    className="homeFollowingImg"
                                />
                            </div>
                        </div>
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
                    </div>
                </Link>
            ))
            }
        </>
    )
}