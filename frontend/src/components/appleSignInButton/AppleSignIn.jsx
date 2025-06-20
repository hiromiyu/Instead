import { auth } from '../../firebase';
import {
  OAuthProvider,
  signInWithCredential,
  getAdditionalUserInfo,
} from 'firebase/auth';
import { useCallback, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { appleLoginCall } from '../../actionCalls';
import { AuthContext } from '../../state/AuthContext';
import apiClient from '../../lib/apiClient';
import CryptoJS from 'crypto-js';
import './AppleSignIn.css';

const AppleSignIn = () => {
  const { dispatch } = useContext(AuthContext);

  useEffect(() => {
    localStorage.removeItem('appleSignInState');
    localStorage.removeItem('appleSignInNonce');
    localStorage.removeItem('appleSignInHashedNonce');
  }, []);

  const generateRandomString = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  const generateSHA256Hash = input => {
    return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
  };

  const [state] = useState(() => generateRandomString());
  const [rawNonce] = useState(() => generateRandomString());

  const [hashedNonce] = useState(() => generateSHA256Hash(rawNonce));

  const handleSuccess = useCallback(
    async event => {
      localStorage.setItem('appleSignInState', state);
      localStorage.setItem('appleSignInNonce', rawNonce);
      localStorage.setItem('appleSignInHashedNonce', hashedNonce);

      const { authorization, user } = event.detail;
      const code = authorization.code;
      const idToken = authorization.id_token;
      const returnedState = authorization.state;

      let fullName = '';
      if (user && user.name) {
        fullName = `${user.name.firstName} ${user.name.lastName}`;
      }

      const savedState = localStorage.getItem('appleSignInState');
      if (returnedState !== savedState) {
        // console.error("Invalid state");
        return;
      }

      const decoded = jwtDecode(idToken);
      const returnedNonce = decoded.nonce;
      const savedNonce = localStorage.getItem('appleSignInHashedNonce');
      if (returnedNonce !== savedNonce) {
        // console.error("Invalid nonce");
        return;
      }

      const provider = new OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken,
        code,
        rawNonce: rawNonce,
      });

      try {
        const result = await signInWithCredential(auth, credential);
        // console.log("✅ Firebase SignIn Success!");

        if (getAdditionalUserInfo(result)?.isNewUser) {
          try {
            const user = {
              username: fullName || `User_${result.user.uid.substring(0, 6)}`,
              email: result.user.email,
            };
            await apiClient.post('/auth/apple/register', user);
          } catch (error) {}
        }

        localStorage.removeItem('appleSignInState');
        localStorage.removeItem('appleSignInNonce');
        localStorage.removeItem('appleSignInHashedNonce');

        appleLoginCall(
          {
            email: result.user.email,
          },
          dispatch
        );
      } catch (error) {
        localStorage.removeItem('appleSignInState');
        localStorage.removeItem('appleSignInNonce');
        localStorage.removeItem('appleSignInHashedNonce');

        // console.error("❌ Firebase SignIn Failed:", error);
      }
    },
    [dispatch, state, hashedNonce, rawNonce]
  );

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.AppleID) {
        window.AppleID.auth.init({
          clientId: process.env.REACT_APP_APPLE_SERVICES_ID,
          scope: 'name email',
          redirectURI: process.env.REACT_APP_APPLE_SERVICES_REDIRECT_URI,
          state: state,
          nonce: hashedNonce,
          usePopup: true,
        });

        document.addEventListener('AppleIDSignInOnSuccess', handleSuccess);

        return () => {
          document.removeEventListener('AppleIDSignInOnSuccess', handleSuccess);
        };
      }
    };
  }, [dispatch, handleSuccess, state, hashedNonce, rawNonce]);

  return (
    <div
      id="appleid-signin"
      // data-color="white"
      data-border="true"
      data-type="sign in"
      data-height="40"
      className="appleButton"
    ></div>
  );
};

export default AppleSignIn;
