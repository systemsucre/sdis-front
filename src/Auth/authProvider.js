import { createContext, useEffect, useState } from 'react';
import axios from 'axios'
import { URL } from './config'
import React from 'react';



export const AuthContext = createContext();


const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null)

    useEffect(() => {
        try {

            localStorage.setItem("user", JSON.stringify(user))

        } catch (error) {
            console.log("error en useEffect")
            const token = localStorage.getItem("token")
            axios.post(URL + '/logout', { "token": token })
            setUser(null)
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            localStorage.removeItem("tiempo")
            axios.post(URL + '/logout', { "token": token })
            window.location.href = "/"
        }

    }, [user])


    let altura = window.innerHeight
    let cantidad = 7
    if (altura > 700)
        cantidad = 8
    if (altura > 850)
        cantidad = 10
    if (altura > 1100)
        cantidad = 16
    if (altura > 1250)
        cantidad = 23
    ///////////////////////////////////////////////////////////////
    const contextValue = {
        user,
        logout() {

            const token = localStorage.getItem("token")
            // axios.post(url.url + '/logout', { "token":token })
            setUser(null)
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            localStorage.removeItem("tiempo")
            axios.post(URL + '/logout', { token: token })
            // return <Redirect to = '/' />
            window.location.href = "/"

        },

        logoutUser() {

            const token = localStorage.getItem("token")
            // axios.post(url.url + '/logout', { "token":token })
            setUser(null)
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            localStorage.removeItem("tiempo")
            axios.post(URL + '/logoutUSer', { token: token })
            // return <Redirect to = '/' />
            window.location.href = "/"

        },


        login(ok) {
            setUser(ok)
        },

        isLogged() {
            return !!user;
        },
        cantidad
    }
    return <AuthContext.Provider value={contextValue}>
        {children}
    </AuthContext.Provider>
}
export default AuthProvider;