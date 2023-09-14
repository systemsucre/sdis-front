import { Route, Redirect } from "react-router-dom"
import React from 'react';
import useAuth from "../Auth/useAuth"



export default function PublicRoute({ component: Component, ...rest }) {
    try {
        const auth = useAuth();
        let url = null
        if (parseInt(localStorage.getItem('numRol')) === 1) {
            url = "/formulario"
        }

        if (parseInt(localStorage.getItem('numRol')) === 2) {
            url = "/formulario"
        }
        if (parseInt(localStorage.getItem('numRol')) === 3) {
            url = "/formulario"
        }
        if (parseInt(localStorage.getItem('numRol')) === 4) {
            url = "/formulario"
        }
        
        if (parseInt(localStorage.getItem('numRol')) === 5) {
            url = "/formulario"
        }

        return (
            <Route {...rest}>
                {auth.isLogged() ? (
                    window.location.href = url
                    // <Redirect to = {url} />
                ) : (
                    <Component />
                )}
            </Route>
        );

    } catch (error) {
        console.log('error en public route')
    }
} 