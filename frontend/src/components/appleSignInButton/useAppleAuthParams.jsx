// useAppleAuthParams.ts
import { useMemo } from "react";
import CryptoJS from "crypto-js";

const generateRandomString = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const generateSHA256Hash = (input) => {
    return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
};

const useAppleAuthParams = () => {
    const state = useMemo(() => {
        const saved = sessionStorage.getItem("appleSignInState");
        const generated = saved || generateRandomString();
        sessionStorage.setItem("appleSignInState", generated);
        return generated;
    }, []);

    const rawNonce = useMemo(() => {
        const saved = sessionStorage.getItem("appleSignInNonce");
        const generated = saved || generateRandomString();
        sessionStorage.setItem("appleSignInNonce", generated);
        return generated;
    }, []);

    const hashedNonce = useMemo(() => {
        const saved = sessionStorage.getItem("appleSignInHashedNonce");
        const generated = saved || generateSHA256Hash(rawNonce);
        sessionStorage.setItem("appleSignInHashedNonce", generated);
        return generated;
    }, [rawNonce]);

    return { state, rawNonce, hashedNonce };
};

export default useAppleAuthParams;
