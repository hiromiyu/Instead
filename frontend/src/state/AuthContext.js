import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

//最初のユーザー状態を定義
const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    // user: {
    //     _id: "6472f960e74a8e08a26670c4",
    //     username: "Hiro",
    //     email: "shincode@gmail.com",
    //     password: "abcdef",
    //     profilePicture: "/person/anya31.jpg",
    //     coverPicture: "",
    //     followers: [],
    //     followings: [],
    //     isAdmin: false,
    // },
    isFetching: false,
    error: false,
    isLiked: false,
};

//状態をグローバルに管理する
export const AuthContext = createContext(initialState);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, initialState);

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.user));
    }, [state.user]);

    return <AuthContext.Provider value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        isLiked: state.isLiked,
        dispatch,
    }}>
        {children}
    </AuthContext.Provider>;
};