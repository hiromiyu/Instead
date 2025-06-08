import React from 'react';
import axios from 'axios';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '../../firebase';
import './AppleSignInButton.css';

const AppleLogin = () => {
  const handleAppleLogin = async () => {
    try {
      window.AppleID.auth.init({
        clientId: process.env.REACT_APP_APPLE_SERVICES_ID,
        scope: 'name email',
        redirectURI: process.env.REACT_APP_APPLE_SERVICES_REDIRECT_URI,
        usePopup: true,
      });

      const response = await window.AppleID.auth.signIn();
      const idToken = response.authorization.id_token;

      const res = await axios.post(process.env.REACT_APP_API_URL, {
        idToken,
      });

      const { firebaseToken } = res.data;

      await signInWithCustomToken(auth, firebaseToken);

      alert('Signed in with Firebase!');
    } catch (err) {
      console.error(err);
      alert('Sign in failed');
    }
  };

  return (
    <button className="apple-signin-button" onClick={handleAppleLogin}>
      <svg
        // xmlns="http://www.w3.org/2000/svg"
        // xmlns="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
        viewBox="0 0 14 17"
        width="18"
        height="18"
        fill="currentColor"
      >
        <path d="M13.666 13.77c-.463 1.08-.678 1.555-1.27 2.507-.83 1.26-2 2.828-3.47 2.843-1.34.015-1.68-.867-3.465-.855-1.78.012-2.18.868-3.52.853-1.48-.015-2.61-1.57-3.44-2.828C-.005 15.306-.14 11.963 1.438 9.694 2.36 8.33 3.82 7.438 5.34 7.423c1.33-.015 2.58.907 3.465.92.88.012 2.45-.99 4.04-.843.69.03 2.63.273 3.88 2.063-0.097 0.06-2.32 1.35-2.06 4.207zM9.366.407c.57-.688 1.5-1.22 2.29-1.22.11 0 .22.008.33.02.09.013.18.03.27.048-.01.018-.02.035-.033.052-.575.737-1.27 1.747-2.223 1.777-.094 0-.188-.01-.283-.02-.09-.01-.18-.02-.27-.03z" />
      </svg>
      <span>Sign in with Apple</span>
    </button>
  );
};

export default AppleLogin;
