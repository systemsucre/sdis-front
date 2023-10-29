import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Check from './check';
import PublicRoute from './publicRoute'
import { useEffect } from "react";
import React from 'react';
import Login from '../login/login'
import Menu from '../menu/menu'
import E500 from './e500'
import useAuth from "../Auth/useAuth";
import { TIEMPO_INACTIVO } from "../Auth/config";


// ADMIN
import Variable from '../proyecto/variables';
import Establecimiento from '../general/establecimiento';
import Gestion from '../general/gestion';
import Mes from '../general/mes';
import Usuario from '../general/usuarios';
import Registro from '../general/registrarme';


// ESTABLECIMIENTO
import Formulario5 from '../proyecto/formulario5';
import Reportes5 from '../proyecto/reportes/reprtes5';

// MUNICIPIO
import Formulario4 from '../proyecto/formulario4';
import ReportesMunicipio from '../proyecto/reportes/4rptmunicipio';
import ReportesFormulario from '../proyecto/reportes/4rptformulario';
import Mireportes4 from '../proyecto/reportes/4mireprtes';
import Opeinf4 from '../proyecto/opeinf/opeinf4';

// RED
import Formulario3 from '../proyecto/formulario3';
import ReportesRed from '../proyecto/reportes/3rptred';
import ReportesFormularioRed from '../proyecto/reportes/3rptformulario';
import Mireportes3 from '../proyecto/reportes/3mireprtes';
import Opeinf3 from '../proyecto/opeinf/opeinf3';


//AREA 
import Formulario6 from '../proyecto/formulario6';
import Mireportes6 from '../proyecto/reportes/6mireprtes';
import ReportesFormularioArea from '../proyecto/reportes/6rptformulario';
import Opeinf6 from '../proyecto/opeinf/opeinf6';



// SEDES
import Formulario2 from '../proyecto/formulario2';
import Mireportes2 from '../proyecto/reportes/2mireprtes';
import ReportesFormularioSedes from '../proyecto/reportes/2rptformulario';
import ReportesSedes from '../proyecto/reportes/2rptsedes';


import Opeinf2 from '../proyecto/opeinf/opeinf2';








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

            {/* ADMIN */}
            <Check exact path='/establecimiento' component={Establecimiento} />
            <Check exact path='/Gestion' component={Gestion} />
            <Check exact path='/meses' component={Mes} />
            <Check exact path='/usuarios' component={Usuario} />
            <Check exact path='/variables' component={Variable} />

            {/* ESTABLECIMIENTO */}
            <Check exact path='/formulario5' component={Formulario5} />
            <Check exact path='/reportes5' component={Reportes5} />


            {/* MUNICIPIO */}
            <Check exact path='/formulario4' component={Formulario4} />
            <Check exact path='/mireportes4' component={Mireportes4} />
            <Check exact path='/reportes-por-municipio' component={ReportesMunicipio} />
            <Check exact path='/reportes-por-formulario' component={ReportesFormulario} />
            <Check exact path='/oportunidad-de-informacion-municipios' component={Opeinf4} />

            {/* RED */}
            <Check exact path='/formulario3' component={Formulario3} />
            <Check exact path='/mireportes3' component={Mireportes3} />
            <Check exact path='/reportes-por-red' component={ReportesRed} />
            <Check exact path='/reportes-por-formulario-red' component={ReportesFormularioRed} />
            <Check exact path='/oportunidad-de-informacion-redes' component={Opeinf3} />


            {/* AREA */}
            <Check exact path='/formulario6' component={Formulario6} />
            <Check exact path='/mireportes6' component={Mireportes6} />
            <Check exact path='/reportes-por-formulario-area' component={ReportesFormularioArea} />
            <Check exact path='/oportunidad-de-informacion-area' component={Opeinf6} />



            {/* SEDES */}
            <Check exact path='/formulario2' component={Formulario2} />
            <Check exact path='/mireportes2' component={Mireportes2} />
            <Check exact path='/reportes-por-sedes' component={ReportesSedes} />
            <Check exact path='/reportes-por-formulario-sedes' component={ReportesFormularioSedes} />
            <Check exact path='/oportunidad-de-informacion-sedes' component={Opeinf2} />

            <Route exact path="/*" component={E500} />
          </Switch>
        </div>
      </BrowserRouter>

    )
  } catch (error) {
    alert('error')
  }
}

