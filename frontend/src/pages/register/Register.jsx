import React, { useRef } from 'react'
import "./Register.css"
import { Link, useNavigate } from "react-router-dom";
import apiClient from '../../lib/apiClient'
import AppleSignIn from '../../components/appleSignInButton/AppleSignIn';

export default function Register() {

    const username = useRef();
    const email = useRef();
    const password = useRef();
    const passwordConfirmation = useRef();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        //パスワードと確認用のパスワードが合っているかどうかを確認
        if (password.current.value !== passwordConfirmation.current.value) {
            passwordConfirmation.current.setCustomValidity("パスワードが違います。")
        } else {
            try {

                const user = {
                    username: username.current.value,
                    email: email.current.value,
                    password: password.current.value,
                };
                //registerApiを叩く
                await apiClient.post("/auth/register", user)
                navigate("/login");
            } catch (err) {
                console.log(err);
            }
        }
    };
    return (
        <div className='register'>
            <div className="registerWrapper">
                <div className="registerLeft">
                    <h3 className='registerLogo'>Instead</h3>
                    <h2>An alternative to SNS app.</h2>
                    <h2 className="registerDesc">新規登録画面</h2>
                </div>
                <AppleSignIn />
                <div className="registerRight">
                    <form className="registerBox" onSubmit={(e) => handleSubmit(e)}>
                        {/* <p className="registerMsg">新規登録はこちら</p> */}
                        <input type="text" id='text' name='text' className='registerInput' placeholder='ユーザー名' required ref={username} />
                        <input type="email" id='email' name='email' className='registerInput' placeholder='Eメール' required ref={email} />
                        <input type="password" name='password' className='registerInput' placeholder='パスワード' required minLength="6" ref={password} />
                        <input type="password" name='password' className='registerInput' placeholder='確認用パスワード' required minLength="6" ref={passwordConfirmation} />
                        <button className="registerButton" type='submit'>新規登録</button>
                        <Link to="/login">
                            <button className="loginRegisterButton">ログイン画面へ</button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
