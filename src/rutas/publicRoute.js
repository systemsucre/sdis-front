import { Route } from "react-router-dom"
import React from 'react';
import useAuth from "../Auth/useAuth"



export default function PublicRoute({ component: Component, ...rest }) {
    try {
        const auth = useAuth();
        let url = null
        if (parseInt(localStorage.getItem('numRol')) === 1) {
            // console.log('la ruta que corresponde a este usuario')
            url = "/variables"
        }

        if (parseInt(localStorage.getItem('numRol')) === 2) {
            url = "/reportes-por-formulario-sedes" 
        }
        if (parseInt(localStorage.getItem('numRol')) === 3) {
            url = "/reportes-por-formulario-red"
        }
        if (parseInt(localStorage.getItem('numRol')) === 4) {
            url = "/reportes-por-municipio"
        }
        
        if (parseInt(localStorage.getItem('numRol')) === 5) {
            url = "/formulario5"
        }
        if (parseInt(localStorage.getItem('numRol')) === 6) {
            url = "/reportes-por-formulario-area"
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