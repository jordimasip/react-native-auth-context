import React, { createContext, useEffect, useReducer } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import authApi from "../api/authApi";
import { LoginData, LoginResponse, Usuario } from "../interfaces/appInterfaces";
import { authReducer, AuthState } from "./authReducer";

type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    user: Usuario | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
    signUp: () => void;
    signIn: (loginData: LoginData) => void;
    logOut: () => void;
    removeError: () => void;
}

const authInitialState: AuthState = {
    status: 'checking',
    token: null,
    user: null,
    errorMessage: ''
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({children}: any) => {

    const [ state, dispatch ] = useReducer(authReducer, authInitialState);

    useEffect(() => {
        checkToken();
    }, [])

    const checkToken = async() => {
        const token = await AsyncStorage.getItem('token')
        if (!token) return dispatch({type: 'notAuthenticated'});
        
        // validartoken?
        const resp = await authApi.get('/me');
        
        if (resp.status !== 200) {
            return dispatch({type: 'notAuthenticated'});
        }
        
        dispatch({
            type: 'signUp',
            payload: {
                token: resp.data.token,
                user: resp.data.usuario
            }
        });
    }

    const signUp = () => {};

    const signIn = async({email, password}: LoginData) => {
        try {
            const {data} = await authApi.post<LoginResponse>('/login', {email, password})
            dispatch({
                type: 'signUp',
                payload: {
                    token: data.token,
                    user: data.usuario
                }
            });
            await AsyncStorage.setItem('token', data.token);
        } catch ( error: any ) {
            console.log(error.response.data)
            dispatch({
                type: 'addError',
                payload: error.response.data || 'Error',
            })
        }
    };

    const logOut = () => {};

    const removeError = () => {
        dispatch({
            type: 'removeError'
        })
    };

    return (
        <AuthContext.Provider value={{
            ...state,
            signUp,
            signIn,
            logOut,
            removeError
        }}>
            {children}
        </AuthContext.Provider>
    )
}