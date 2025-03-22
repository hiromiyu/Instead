import { useEffect } from "react";

const AppleSignIn = () => {
    useEffect(() => {
        // Metaタグ情報
        const metaTags = [
            { name: "appleid-signin-client-id", content: process.env.REACT_APP_APPLE_SERVICES_ID }, // ←ここを自分のクライアントIDに
            { name: "appleid-signin-scope", content: "name email" },              // 例: "name email"
            { name: "appleid-signin-redirect-uri", content: process.env.REACT_APP_APPLE_SERVICES_REDIRECT_URI }, // ←リダイレクトURI
            { name: "appleid-signin-state", content: "some-state" },
            { name: "appleid-signin-nonce", content: "random-nonce" },
            { name: "appleid-signin-use-popup", content: "true" },
        ];

        // Metaタグ追加
        metaTags.forEach(({ name, content }) => {
            const meta = document.createElement("meta");
            meta.name = name;
            meta.content = content;
            document.head.appendChild(meta);
        });

        // AppleのJSスクリプト追加
        const script = document.createElement("script");
        script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
        script.async = true;
        document.body.appendChild(script);

        // クリーンアップ
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
            {/* Apple Sign In Button */}
            <div
                id="appleid-signin"
                data-color="white"
                data-border="true"
                data-type="sign in"
                data-height="40"
            />
        </div>
    );
};

export default AppleSignIn;