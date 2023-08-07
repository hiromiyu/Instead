import axios from "axios";

export const loginCall = async (user, dispatch) => {
    const instance = axios.create({
        baseURL: process.env.REACT_PUBLIC_API_BASEURL
    });

    dispatch({ type: "LOGIN_START" });
    try {
        const response = await instance.post("auth/login", user);
        dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
    } catch (err) {
        dispatch({ type: "LOGIN_ERROR", payload: err });
    }
};