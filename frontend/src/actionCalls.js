import apiClient from "./lib/apiClient";

export const loginCall = async (user, dispatch) => {

    dispatch({ type: "LOGIN_START" });
    try {
        const response = await apiClient.post("auth/login", user);
        dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
    } catch (err) {
        dispatch({ type: "LOGIN_ERROR", payload: err });
    }
};

export const appleLoginCall = async (user, dispatch) => {
    dispatch({ type: "LOGIN_START" });
    try {
        const response = await apiClient.post("auth/apple/login", user);
        dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
    } catch (err) {
        dispatch({ type: "LOGIN_ERROR", payload: err });
    }
};