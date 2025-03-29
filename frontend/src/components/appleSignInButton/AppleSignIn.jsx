import { auth } from "../../firebase";
import { OAuthProvider, signInWithCredential } from "firebase/auth";
import { useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { appleLoginCall } from "../../actionCalls";
import { AuthContext } from "../../state/AuthContext";
import apiClient from "../../lib/apiClient";

const AppleSignIn = () => {
    const { dispatch } = useContext(AuthContext);
    useEffect(() => {

        const generateRandomString = () => {
            return Math.random().toString(36).substring(2) + Date.now().toString(36);
        };

        const state = generateRandomString();
        const nonce = generateRandomString();

        localStorage.setItem("appleSignInState", state);
        localStorage.setItem("appleSignInNonce", nonce);

        const metaTags = [
            { name: "appleid-signin-client-id", content: process.env.REACT_APP_APPLE_SERVICES_ID },
            { name: "appleid-signin-scope", content: "name email" },
            { name: "appleid-signin-redirect-uri", content: process.env.REACT_APP_APPLE_SERVICES_REDIRECT_URI },
            { name: "appleid-signin-state", content: state },
            { name: "appleid-signin-nonce", content: nonce },
            { name: "appleid-signin-use-popup", content: "true" },
        ];

        metaTags.forEach(({ name, content }) => {
            const meta = document.createElement("meta");
            meta.name = name;
            meta.content = content;
            document.head.appendChild(meta);
        });

        const script = document.createElement("script");
        script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
        script.async = true;

        script.onload = () => {
            if (window.AppleID) {
                window.AppleID.auth.init({
                    clientId: process.env.REACT_APP_APPLE_SERVICES_ID,
                    scope: "name email",
                    redirectURI: process.env.REACT_APP_APPLE_SERVICES_REDIRECT_URI,
                    state: state,
                    nonce: nonce,
                    usePopup: true,
                });

                document.addEventListener('AppleIDSignInOnSuccess', async (event) => {
                    console.log("Apple Sign In Success:", event.detail);

                    // Appleから返された認証データを取得
                    const params = new URLSearchParams(event.detail);
                    const { authorization } = event.detail;
                    const code = authorization.code;
                    const idToken = authorization.id_token;
                    const returnedState = params.get("state");
                    console.log("Returned state:", returnedState);

                    // stateの検証
                    const savedState = localStorage.getItem("appleSignInState");
                    if (returnedState !== savedState) {
                        console.error("Invalid state");
                        return;
                    }

                    // nonceの検証
                    const decoded = jwtDecode(idToken);
                    const returnedNonce = decoded.nonce;
                    const savedNonce = localStorage.getItem("appleSignInNonce");
                    if (returnedNonce !== savedNonce) {
                        console.error("Invalid nonce");
                        return;
                    }

                    // Firebase認証プロバイダーを設定
                    const provider = new OAuthProvider("apple.com");
                    const credential = provider.credential({
                        idToken,
                        code,
                        rawNonce: savedNonce,
                    });

                    try {
                        // Firebase認証を実行
                        const result = await signInWithCredential(auth, credential);
                        console.log("✅ Firebase SignIn Success!", result.user);

                        // 成功時の処理（例：ユーザー情報の保存、リダイレクトなど）
                        // userContext.setUser(result.user);
                        // navigate('/dashboard');

                        // ここでユーザー情報を取得して、必要に応じてサーバーに送信することができます
                        await apiClient.post("/auth/apple/register", { username: result.user.displayName, email: result.user.email });
                        await apiClient.post("/auth/apple/login", { username: result.user.displayName, email: result.user.email });

                        appleLoginCall(
                            {
                                email: result.user.email,
                            },
                            dispatch
                        );

                        // localStorageからstateとnonceを削除
                        localStorage.removeItem("appleSignInState");
                        localStorage.removeItem("appleSignInNonce");



                    } catch (error) {
                        console.error("❌ Firebase SignIn Failed:", error);
                        // エラー処理
                    }
                });

                // 認証エラーイベントリスナーを設定
                document.addEventListener('AppleIDSignInOnFailure', (event) => {
                    console.error("Apple Sign In Error:", event.detail);
                    // エラー処理
                });
            }
        };

        document.body.appendChild(script);
        return () => {
            script.remove();
            metaTags.forEach(({ name }) => {
                const el = document.querySelector(`meta[name="${name}"]`);
                if (el) el.remove();
            });
            // イベントリスナーも削除
            document.removeEventListener('AppleIDSignInOnSuccess', () => { });
            document.removeEventListener('AppleIDSignInOnFailure', () => { });
        };
    }, [dispatch]);

    return (
        <div className="flex justify-center items-center mt-4">
            <div
                id="appleid-signin"
                data-color="white"
                data-border="true"
                data-type="sign in"
                data-height="40"
            >
            </div>
        </div>
    );
};

export default AppleSignIn;