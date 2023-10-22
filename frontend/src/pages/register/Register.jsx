import React, { useRef } from 'react'
import "./Register.css"
import { Link, useNavigate } from "react-router-dom";
import apiClient from '../../lib/apiClient'

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
        <div className='login'>
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className='loginLogo'>Instead</h3>
                    <h2>An alternative to SNS app.</h2>
                    <span className="loginDesc">新規登録</span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={(e) => handleSubmit(e)}>
                        <p className="loginMsg">新規登録はこちら</p>
                        <input type="text" id='text' name='text' className='loginInput' placeholder='ユーザー名' required ref={username} />
                        <input type="email" id='email' name='email' className='loginInput' placeholder='Eメール' required ref={email} />
                        <input type="password" name='password' className='loginInput' placeholder='パスワード' required minLength="6" ref={password} />
                        <input type="password" name='password' className='loginInput' placeholder='確認用パスワード' required minLength="6" ref={passwordConfirmation} />
                        <button className="loginButton" type='submit'>サインアップ</button>
                        <Link to="/login">
                            <button className="loginRegisterButton">ログイン</button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
