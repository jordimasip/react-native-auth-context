import React, { createContext, useReducer } from "react";
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

    const signUp = () => {};

    const signIn = async({email, password}: LoginData) => {
        try {
            const resp = await authApi.post<LoginResponse>('/login', {email, password})
            console.log(resp.data)
        } catch ( error ) {
            console.log({error})
        }
    };

    const logOut = () => {};
    const removeError = () => {};

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