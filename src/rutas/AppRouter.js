import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Check from './check';
import PublicRoute from './publicRoute'
import { useEffect } from "react";
import React from 'react';
import Login from '../login/login'
import Menu from '../menu/menu'
import Establecimiento from '../general/establecimiento';
import Gestion from '../general/gestion';
import Mes from '../general/mes';
import Formulario from '../proyecto/formulario';



import E500 from './e500'

import useAuth from "../Auth/useAuth";
import { TIEMPO_INACTIVO } from "../Auth/config";
import Usuario from '../general/usuarios';
import Registro from '../general/registrarme';
import Variable from '../proyecto/variables';
import Reportes5 from '../proyecto/reportes/reprtes5';
import Reportes4 from '../proyecto/reportes/reprtes4';
import Reportes3 from '../proyecto/reportes/reprtes3';
import Reportes2 from '../proyecto/reportes/reprtes2';

export default function AppRouter() {

  const auth = useAuth()

  useEffect(() => {
    if (localStorage.getItem('token') != null) {
      const inter = setInterval(() => {
        const tiempo1 = localStorage.getItem('tiempo')
        if (!tiempo1 || localStorage.getItem('token') == null) { auth.logout() } // sino existe el cookie redireccionamos a la ventana login
        const tiempo2 = new Date().getMinutes()
        let dif = 0
        let aux1 = 0
        let aux2 = 0
        const maximo = 59
        const inicio = 0
        if (tiempo1 === tiempo2) {
          dif = 0
        }
        if (tiempo2 > tiempo1) {
          dif = tiempo2 - tiempo1
        } if (tiempo1 > tiempo2) {
          aux1 = maximo - tiempo1  //  59 - 50 = 10
          aux2 = tiempo2 - inicio  //  5 - 0  = 5
          dif = aux2 - aux1
        }
        if (dif >= TIEMPO_INACTIVO) {  // el tiempo de abandono tolerado, se define en el archivo config en unidades de tiempo MINUTOS
          auth.logout()
        }
      }, 5000);
      return inter;
    }

  }, [auth])
  try {
    const handleClick = () => {
      localStorage.setItem('tiempo', new Date().getMinutes())

    }

    const handleKeyPress = () => {
      localStorage.setItem('tiempo', new Date().getMinutes())
    }

    return (

      <BrowserRouter>
        <div onClick={handleClick} onKeyPress={handleKeyPress} >
          {auth.isLogged() && <Menu />}
          <Switch>
            <PublicRoute exact path="/" component={Login} />
            <PublicRoute exact path="/registrarme" component={Registro} />
            <Check exact path='/establecimiento' component={Establecimiento} />
            <Check exact path='/Gestion' component={Gestion} />
            <Check exact path='/meses' component={Mes} />
            <Check exact path='/usuarios' component={Usuario} />
            <Check exact path='/variables' component={Variable} />
            <Check exact path='/formulario' component={Formulario} />
            
            <Check exact path='/reportes5' component={Reportes5} />
            <Check exact path='/reportes4' component={Reportes4} />
            <Check exact path='/reportes3' component={Reportes3} />
            <Check exact path='/reportes2' component={Reportes2} />
            <Route exact path="*" component={E500} />
          </Switch>
        </div>
      </BrowserRouter>

    )
  } catch (error) {
    alert('arror')
  }
}

