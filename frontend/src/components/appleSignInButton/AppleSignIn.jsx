import { OAuthProvider, signInWithCredential } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../../firebase";

const AppleSignIn = () => {
    useEffect(() => {
        const metaTags = [
            { name: "appleid-signin-client-id", content: process.env.REACT_APP_APPLE_SERVICES_ID },
            { name: "appleid-signin-scope", content: "name email" },
            { name: "appleid-signin-redirect-uri", content: process.env.REACT_APP_APPLE_SERVICES_REDIRECT_URI },
            { name: "appleid-signin-state", content: "some-state" },
            { name: "appleid-signin-nonce", content: "random-nonce" },
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
                    state: "state",
                    nonce: "nonce",
                    usePopup: true,
                });

                document
                    .getElementById("appleid-signin")
                    .addEventListener("click", () => {
                        window.AppleID.auth
                            .signIn()
                            .then(async (response) => {
                                console.log("Apple Sign In Success:", response);
                                const { authorization } = response;
                                const idToken = authorization.id_token;
                                const provider = new OAuthProvider("apple.com");
                                const credential = provider.credential({
                                    idToken,
                                });

                                try {
                                    const result = await signInWithCredential(auth, credential);
                                    console.log("✅ Firebase SignIn Success!", result.user);
                                } catch (error) {
                                    console.error("❌ Firebase SignIn Failed:", error);
                                }
                            })
                            .catch((err) => {
                                console.error("Apple Sign In Error:", err);
                            });
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
        };
    }, []);

    return (
        <div className="flex justify-center items-center mt-4">
            <div
                id="appleid-signin"
                data-color="white"
                data-border="true"
                data-type="sign in"
                data-height="40"
                style={{ transition: 'all 0.2s ease-in-out' }}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#333';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#000';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                }}
                onMouseDown={(e) => {
                    e.currentTarget.style.backgroundColor = '#000';
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateY(1px)';
                }}
                onMouseUp={(e) => {
                    e.currentTarget.style.backgroundColor = '#333';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                }}>
            </div>
        </div>
    );
};

export default AppleSignIn;