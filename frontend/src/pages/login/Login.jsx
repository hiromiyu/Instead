import React, { useContext, useRef } from 'react'
import "./Login.css"
import { loginCall } from '../../actionCalls';
import { AuthContext } from '../../state/AuthContext';

export default function Login() {
    const email = useRef();
    const password = useRef();
    const { user, dispatch } = useContext(AuthContext);

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

    console.log(user);

    return (
        <div className='login'>
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className='loginLogo'>DAYCE SNS</h3>
                    <span className="loginDesc">色んないいねを、みんなの手で。</span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={(e) => handleSubmit(e)}>
                        <p className="loginMsg">ログインはこちら</p>
                        <input
                            type="email"
                            className='loginInput'
                            placeholder='Eメール'
                            required
                            ref={email}
                        />
                        <input
                            type="password"
                            className='loginInput'
                            placeholder='パスワード'
                            required
                            minLength="6"
                            ref={password}
                        />
                        <button className="loginButton">ログイン</button>
                        <span className="loginForgot">パスワードを忘れた方へ</span>
                        <button className="loginRegisterButton">アカウント作成</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
