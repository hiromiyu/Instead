import { useState } from "react";
import CryptoJS from "crypto-js";

const generateRandomString = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const generateSHA256Hash = (input) => {
    return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
};

const useAppleAuthParams = () => {
    const [state] = useState(() => {
        const saved = localStorage.getItem("appleSignInState");
        const value = saved || generateRandomString();
        localStorage.setItem("appleSignInState", value);
        return value;
    });

    const [rawNonce] = useState(() => {
        const saved = localStorage.getItem("appleSignInNonce");
        const value = saved || generateRandomString();
        localStorage.setItem("appleSignInNonce", value);
        return value;
    });

    const [hashedNonce] = useState(() => {
        const saved = localStorage.getItem("appleSignInHashedNonce");
        const value = saved || generateSHA256Hash(rawNonce);
        localStorage.setItem("appleSignInHashedNonce", value);
        return value;
    });

    return { state, rawNonce, hashedNonce };
};

export default useAppleAuthParams;
