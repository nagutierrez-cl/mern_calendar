import Swal from "sweetalert2";
import { fetchWithoutToken, fetchWithToken } from "../helpers/fetch";
import { types } from "../types/types";
import { eventLogout } from "./events";

export const startLogin = ( email, password ) => {
    return async ( dispatch ) => {

        const resp = await fetchWithoutToken( 'auth', { email, password }, 'POST' );
        const body = await resp.json();

        if( body.ok ) {
            localStorage.setItem('token', body.token);
            localStorage.setItem('token-init-date', new Date().getTime() );
        
            dispatch( login({
                uid: body.uid,
                name: body.name
            }) );
        } else {
            Swal.fire('Error', body.errors[0], 'error');
        }
    }
}

export const startRegister = ( email, password, name ) => {
    return async ( dispatch ) => {

        const resp = await fetchWithoutToken( 'auth/new', { email, password, name }, 'POST' );
        const body = await resp.json();

        if( body.ok ) {
            localStorage.setItem('token', body.token);
            localStorage.setItem('token-init-date', new Date().getTime() );
        
            dispatch( login({
                uid: body.uid,
                name: body.name
            }) );
        } else {
            Swal.fire('Error', body.errors[0].msg, 'error');
        }

    }
}

export const startChecking = () => {
    return async ( dispatch ) => {

        // no hay token
        if(!localStorage.getItem('token')){
            dispatch( checkingFinish() );
            return
        }

        const expDate = new Date( localStorage.getItem('token-init-date') );
        expDate.setHours(expDate.getHours()+2); 

        const now = new Date();

        // token expirado
        if( now > expDate ){
            dispatch( checkingFinish() );
            return 
        }

        const resp = await fetchWithToken( 'auth/renew' );
        const body = await resp.json();

        if( body.ok ) {
            localStorage.setItem('token', body.token);
            localStorage.setItem('token-init-date', new Date().getTime() );
        
            dispatch( login({
                uid: body.uid,
                name: body.name
            }) );
        } else {
            dispatch( checkingFinish() );
        }
    }
}



const checkingFinish = () => ({
    type: types.authCheckingFinish
})

const login = (user) => ({
    type: types.authLogin,
    payload: user
})

export const startLogout = () => {
    return ( dispatch ) => {

        localStorage.clear();
        dispatch( eventLogout() );
        dispatch( logout() );

    }
}

const logout = () => ({ type: types.authLogout })