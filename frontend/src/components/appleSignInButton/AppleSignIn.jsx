import { auth } from "../../firebase";
import { OAuthProvider, signInWithCredential, getAdditionalUserInfo } from "firebase/auth";
import { useCallback, useContext, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { appleLoginCall } from "../../actionCalls";
import { AuthContext } from "../../state/AuthContext";
import apiClient from "../../lib/apiClient";
import "./AppleSignIn.css";
import useAppleAuthParams from "./useAppleAuthParams";

const AppleSignIn = () => {
    const { dispatch } = useContext(AuthContext);

    const { state, rawNonce, hashedNonce } = useAppleAuthParams();

    const initializedRef = useRef(false);

    const handleSuccess = useCallback(async (event) => {

        const { authorization, user } = event.detail;
        const code = authorization.code;
        const idToken = authorization.id_token;
        const returnedState = authorization.state;

        let fullName = "";
        if (user && user.name) {
            fullName = `${user.name.firstName} ${user.name.lastName}`;
        }

        if (returnedState !== state) {
            console.error("Invalid state");
            return;
        }

        const decoded = jwtDecode(idToken);
        const returnedNonce = decoded.nonce;

        if (returnedNonce !== hashedNonce) {
            console.error("Invalid nonce");
            return;
        }

        const provider = new OAuthProvider("apple.com");
        const credential = provider.credential({
            idToken,
            code,
            rawNonce: rawNonce,
        });

        try {
            const result = await signInWithCredential(auth, credential);
            console.log("✅ Firebase SignIn Success!");

            if (getAdditionalUserInfo(result)?.isNewUser) {
                try {
                    const user = {
                        username: fullName || `User_${result.user.uid.substring(0, 6)}`,
                        email: result.user.email,
                    };
                    await apiClient.post("/auth/apple/register", user);
                } catch (error) {
                    console.error("❌ API Call Failed:", error);
                }
            }

            localStorage.removeItem("appleSignInState");
            localStorage.removeItem("appleSignInNonce");
            localStorage.removeItem("appleSignInHashedNonce");

            appleLoginCall(
                {
                    email: result.user.email,
                },
                dispatch
            );

        } catch (error) {
            localStorage.removeItem("appleSignInState");
            localStorage.removeItem("appleSignInNonce");
            localStorage.removeItem("appleSignInHashedNonce");

            console.error("❌ Firebase SignIn Failed:", error);
        }
    }, [dispatch, state, hashedNonce, rawNonce]);

    useEffect(() => {

        const onSuccess = (event) => handleSuccess(event);

        if (initializedRef.current) return;
        initializedRef.current = true;

        const script = document.createElement("script");
        script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
        script.async = true;

        script.onload = () => {
            if (window.AppleID && !window.AppleID.__initialized) {


                window.AppleID.auth.init({
                    clientId: process.env.REACT_APP_APPLE_SERVICES_ID,
                    scope: "name email",
                    redirectURI: process.env.REACT_APP_APPLE_SERVICES_REDIRECT_URI,
                    state: state,
                    nonce: hashedNonce,
                    usePopup: true,
                });

                window.AppleID.__initialized = true;

                document.addEventListener('AppleIDSignInOnSuccess', onSuccess);
            }
        };

        document.body.appendChild(script);

        return () => {

            document.removeEventListener('AppleIDSignInOnSuccess', onSuccess);
        };

    }, [dispatch, handleSuccess, state, hashedNonce, rawNonce]);

    return (
        <div
            id="appleid-signin"
            data-color="white"
            data-border="true"
            data-type="sign in"
            data-height="40"
            className="appleButton"
        >
        </div>
    );
};

export default AppleSignIn;