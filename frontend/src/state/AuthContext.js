import { createContext, useEffect, useReducer } from 'react';
import apiClient from '../lib/apiClient';
import AuthReducer from './AuthReducer';

//最初のユーザー状態を定義

// const initialState = {
//   user: null,
//   isFetching: false,
//   error: false,
// };

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isFetching: false,
  error: false,
};

//状態をグローバルに管理する
export const AuthContext = createContext(initialState);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  // ページを開いた時にサーバーへ問い合わせてログイン状態を復元
  useEffect(() => {
    const checkLogin = async () => {
      try {
        // dispatch({ type: 'LOGIN_START' });
        const response = await apiClient.post('auth/refresh');
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      } catch (err) {
        if (err.response?.status !== 401) {
          dispatch({ type: 'LOGIN_FAILURE' });
        }
      }
    };
    checkLogin();
  }, []);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
