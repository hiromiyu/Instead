import { useRef } from "react";
import CryptoJS from "crypto-js";

let appleAuthParams = null;

const generateRandomString = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const generateSHA256Hash = (input) => {
    return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
};

const createParams = () => {
    const state = generateRandomString();
    const rawNonce = generateRandomString();
    const hashedNonce = generateSHA256Hash(rawNonce);
    return { state, rawNonce, hashedNonce };
};

export default function useAppleAuthParams() {
    const paramsRef = useRef();

    if (!paramsRef.current) {
        if (!appleAuthParams) {
            appleAuthParams = createParams(); // 一度だけ生成
        }
        paramsRef.current = appleAuthParams;
    }

    return paramsRef.current;
}
