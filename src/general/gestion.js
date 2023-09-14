import React from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCheck, faWindowClose } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../Auth/useAuth"
import { useState, useEffect } from "react";
import { URL, } from '../Auth/config';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast'
import '../elementos/estilos.css'
import { alert2, confirmarActualizar } from '../elementos/alert2'
import Load from '../elementos/load'


function Gestion() {
    const auth = useAuth()

    const [lista, setLista] = useState([]);
    const [cantidad, setCantidad] = useState(0);
    const [estado, setEstado] = useState(null);
    const [texto, setTexto] = useState(null);


    let today = new Date()
    let fecha = today.toISOString().split('T')[0]
    let hora = new Date().toLocaleTimeString().split(':')[0]
    let min = new Date().toLocaleTimeString().split(':')[1]
    let sec = new Date().toLocaleTimeString().split(':')[2]
    if (hora.length === 1) hora = '0' + hora
    let horafinal = hora + ':' + min + ':' + sec

    try {


        useEffect(() => {
            document.title = 'GESTION'
            listar()
        }, [])



        const token = localStorage.getItem("token")
        axios.interceptors.request.use(
            config => {
                config.headers.authorization = `Bearer ${token}`
                return config
            },
            error => {
                auth.logout()
                return Promise.reject(error)
            }
        )

        const listar = async () => {
            setEstado(1)
            setTexto('cargando...')
            axios.post(URL + '/gestion/listar').then(json => {
                if (json.data.ok) {
                    setLista(json.data.data[0])
                    setCantidad(json.data.data[1])
                    setEstado(0)
                } else { alert2({ icono: 'warning', titulo: 'Error en el Servidor', boton: 'ok', texto: json.data.msg }); setEstado(0) }
            }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }


        const activar = async (a) => {

            let accion = await confirmarActualizar({ titulo: 'Activar gestión', boton: 'ok', texto: 'Ok para continuar.' })
            if (accion.isConfirmed) {
                setEstado(1)
                setTexto('Activando Gestión...')
                axios.post(URL + '/gestion/activar', { id: a, modificado: fecha + ' ' + horafinal }).then(json => {
                    if (json.data.ok) {
                        setLista(json.data.data[0])
                        setCantidad(json.data.data[1])
                        setEstado(0)
                        alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: json.data.msg })
                    } else { alert2({ icono: 'warning', titulo: 'Error en el Servidor', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            }
        }

        const desactivar = async (a) => {
            let accion = await confirmarActualizar({ titulo: 'Desartivar gestión', boton: 'ok', texto: 'Ok para continuar.' })
            if (accion.isConfirmed) {
                setEstado(1)
                setTexto('Desactivando Gestión...')
                axios.post(URL + '/gestion/desactivar', { id: a, modificado: fecha + ' ' + horafinal }).then(json => {
                    if (json.data.ok) {
                        setLista(json.data.data[0])
                        setCantidad(json.data.data[1])
                        setEstado(0)
                        alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: json.data.msg })
                    } else { alert2({ icono: 'warning', titulo: 'Error en el Servidor', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            }
        }


        return (
            <div>
                <div className="container_1">
                    {estado === 1 && <Load texto={texto} />}
                    <div className='contenedor-cabecera' >
                        
                        <div className='contenedor-titulo col-6'>
                            <div className='titulo-pagina' >
                                <p>GESTION</p>
                            </div>
                        </div>
                    </div>
                    <div className='contenedor'>

                        {/* <div className="table table-responsive"> */}
                        <table className="table table-sm" >
                            <thead>
                                <tr >
                                    <th className="col-4 ">GESTION</th>
                                    <th className="col-3 ">ESTADO</th>
                                    <th className="col-1  "></th>
                                </tr>
                            </thead>
                        </table>
                        {/* </div> */}
                        <div className="table table-responsive custom mb-2" >

                            <table className="table table-sm">

                                <tbody >
                                    {lista.map((a) => (
                                        <tr key={a.nombre} >
                                            <td className="col-4 ">{a.gestion + '   [' + a.meses + ' MESES]'}</td>
                                            {a.estado === 1 ? <td className="col-3 " >ACTIVO</td> :
                                                <td className="col-3 " >NO ACTIVO</td>}
                                            <td className="col-1 largTable">
                                                {a.estado === 1 ?
                                                    <FontAwesomeIcon icon={faWindowClose} onClick={() => desactivar(a.id)} className='botonEliminar' />
                                                    :
                                                    <FontAwesomeIcon icon={faCheck} onClick={() => activar(a.id)} className='botonEditar' />
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                        <div className='cantidad-registros'>{cantidad + ' Registro(s)'}</div>
                    </div>
                    <div className='contenedor-foot'>
                        <div className='navegador-tabla'>
                            <div className='row'>

                            </div>
                        </div>
                    </div>
                </div >



                <Toaster position='top-right' />
            </div >

        );

    } catch (error) {
        setEstado(0);// auth.logout()

    }

}
export default Gestion;
