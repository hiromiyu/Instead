import React, { useContext, useRef } from 'react'
import "./Login.css"
import { loginCall } from '../../actionCalls';
import { AuthContext } from '../../state/AuthContext';
import { Link } from 'react-router-dom';

export default function Login() {
    const email = useRef();
    const password = useRef();
    const { dispatch } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        loginCall(
            {
                email: email.current.value,
                password: password.current.value,
            },
            dispatch
        );
    };

    return (
        <div className='login'>
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className='loginLogo'>Instead</h3>
                    <h2>An alternative to SNS app.</h2>
                    <h2 className="loginDesc">ログイン画面</h2>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={(e) => handleSubmit(e)}>
                        {/* <p className="loginMsg">ログインはこちら</p> */}
                        <input
                            type="email"
                            id='email'
                            name='email'
                            className='emailInput'
                            placeholder='Eメール'
                            required
                            ref={email}
                        />
                        <input
                            type="password"
                            id='password'
                            name='password'
                            className='passInput'
                            placeholder='パスワード'
                            required
                            minLength="6"
                            ref={password}
                        />
                        <button className="loginButton">ログイン</button>
                        {/* <span className="loginForgot">パスワードを忘れた方へ</span> */}
                        <Link to="/">
                            <button className="registerLoginButton">新規登録画面へ</button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
