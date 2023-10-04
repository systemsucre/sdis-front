import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCheck, faCheckCircle, faClose, faCog, faHandPointRight, faPlay, faStop, faUpDown, faWindowClose } from '@fortawesome/free-solid-svg-icons';

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
    const [year, setYear] = useState(null);
    const [estadoAño, setEstadoAño] = useState(null);
    const [id, setId] = useState({ campo: null, valido: null });

    const [modalInsertar, setModalInsertar] = useState(false);

    let today = new Date()
    let fecha_ = today.toLocaleDateString()
    let dia = fecha_.split('/')[0]
    if (dia.length === 1) dia = '0' + dia
    let mes_ = fecha_.split('/')[1]
    if (mes_.length === 1) mes_ = '0' + mes_
    let año = fecha_.split('/')[2]
    let fecha = año + '-' + mes_ + '-' + dia
    let hora = new Date().toLocaleTimeString().split(':')[0]
    let min = new Date().toLocaleTimeString().split(':')[1]
    let sec = new Date().toLocaleTimeString().split(':')[2]
    if (hora.length === 1) hora = '0' + hora
    let horafinal = hora + ':' + min + ':' + sec


    try {


        useEffect(() => {



            document.title = 'GESTION'
            listar()
            // return ()=>{
            //     document.body.style = initialValue
            // }
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
                if (json.data.hasOwnProperty("sesion")) {
                    auth.logout()
                    alert('LA SESION FUE CERRADO DESDE EL SERVIDOR, VUELVA A INTRODODUCIR SUS DATOS DE INICIO')
                }
                if (json.data.ok) {
                    setLista(json.data.data[0])
                    setCantidad(json.data.data[1])
                    setEstado(0)
                } else { alert2({ icono: 'warning', titulo: 'Error en el Servidor', boton: 'ok', texto: json.data.msg }); setEstado(0) }
            }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }


        const activar = async () => {

            let accion = await confirmarActualizar({ titulo: 'Iniciar gestión', boton: 'ok', texto: 'Ok para continuar.' })
            if (accion.isConfirmed && id.valido === 'true') {
                setEstado(1)
                setTexto('Activando Gestión...')
                axios.post(URL + '/gestion/activar', { id: id.campo, modificado: fecha + ' ' + horafinal }).then(json => {
                    if (json.data.ok) {
                        setLista(json.data.data[0])
                        setCantidad(json.data.data[1])
                        setModalInsertar(false)

                        setEstado(0)
                        alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: json.data.msg })
                    } else { alert2({ icono: 'warning', titulo: 'Error en el Servidor', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            }
        }

        const desactivar = async (a) => {
            let accion = await confirmarActualizar({ titulo: 'Detener gestión', boton: 'ok', texto: 'Ok para continuar.' })
            if (accion.isConfirmed && id.valido === 'true') {
                setEstado(1)
                setTexto('Desactivando Gestión...')
                axios.post(URL + '/gestion/desactivar', { id: id.campo, modificado: fecha + ' ' + horafinal }).then(json => {
                    if (json.data.ok) {
                        setLista(json.data.data[0])
                        setCantidad(json.data.data[1])
                        setModalInsertar(false)
                        setEstado(0)
                        alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: json.data.msg })
                    } else { alert2({ icono: 'warning', titulo: 'Error en el Servidor', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            }
        }


        return (
            <div style={{ background: '#e5e5e5', paddingTop: '0.4rem', paddingBottom: '0.4rem', height: '100vh' }}>
                <div className="container_">
                    {estado === 1 && <Load texto={texto} />}
                    <div className='contenedor-cabecera row'>

                        <div className='contenedor-cabecera row'>
                            <span className='titulo'>
                                GESTIONAR AÑOS
                            </span>
                        </div>
                    </div>
                    <div className='separador mb-3 mb-sm-0 mb-md-0 mb-lg-0'>
                        <span>
                        </span>
                    </div>
                    <div className='contenedor p-2'>

                        {/* <div className=' row elementos-contenedor botonModal'>
                            <p className='nota'><span style={{ fontWeight: 'bold' }}>nota ::</span> Gestionar años permitiendo el acceso o la denegacion de llenado de datos</p>

                            <p className='alertas' >{'Al desactivar un determinado año esta restringuiendo el llenado de datos en ese año. Se recomienda realizar las configuraciones de activar/desactivar año con absoluta responsabilidad'}</p>

                        </div> */}
                        <div className="table table-responsive custom mb-2" style={{ height: 'auto' }}>

                            <table className="table table-sm">
                                <thead>
                                    <tr >
                                        <th ></th>
                                        <th className="col-10 ">GESTION</th>
                                        <th className="col-2 text-center">ESTADO</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {lista.map((a) => (
                                        <tr className='item' key={a.id} >

                                            <th className='tooltip_' >
                                                <span class="tooltiptext_">Click para Habilitar/Deshabilitar gestion</span>
                                                <button type="button" class="adicionar" onClick={() => { setEstadoAño(a.estado); setYear(a.gestion); setModalInsertar(true); setId({ campo: a.id, valido: 'true' }) }} style={{ cursor: 'pointer' }}>
                                                    <FontAwesomeIcon icon={faCog} />
                                                </button>
                                            </th>
                                            <td >  {'GESTION' + a.gestion}</td>
                                            <td className='text-center'>


                                                <div className='row botonModal' style={{ justifyContent: 'center' }}>
                                                    <div className='col-auto'>
                                                        {a.estado === 1 ?
                                                            <FontAwesomeIcon className='play' icon={faPlay} />
                                                            :
                                                            <FontAwesomeIcon className='stop' icon={faStop} style={{ color: '#dc3545' }} />}
                                                    </div>
                                                    <div className='col-auto'>
                                                        {/* <div className='ver-form' > */}
                                                        {a.estado === 1 ? <span> Iniciado</span> : <span> Detenido </span>}
                                                        {/* </div> */}
                                                    </div>
                                                </div>

                                            </td>




                                            {/* 
                                            {a.estado === 1 ? <td className='text-center' >ACTIVO</td> :
                                                <td className='text-center'>NO ACTIVADO</td>} */}

                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                        <div className='cantidad-registros'>{cantidad + ' Registro(s)'}</div>
                    </div>
                    <div className='contenedor-foot botomModal'>
                        <div className='navegador-tabla'>
                            <div className='row  col-12 col-sm-7 col-md-6 col-lg-5'>
                                <div className='col-6'><FontAwesomeIcon className='play' icon={faPlay} /> {' Año habilitado'}</div>
                                <div className='col-6'><FontAwesomeIcon className='stop' icon={faStop} style={{ color: '#dc3545' }} />{' Año deshabilitado'}</div>
                            </div>
                        </div>
                    </div>
                </div >

                <Modal isOpen={modalInsertar}>

                    <ModalHeader toggle={() => setModalInsertar(false)}>
                        <h5> {'GESTIÓN ' + year}</h5> </ModalHeader>
                    <ModalBody>

                    </ModalBody>
                    <div className='botonModal'>
                        {estadoAño ? <button className="btn-eliminar col-auto" onClick={() => desactivar()} >
                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faClose} />Deshabilitar
                        </button> :
                            <button className="btn-editar col-auto" onClick={() => activar()} >
                                <FontAwesomeIcon className='btn-icon-nuevo' icon={faCheck} />Habilitar
                            </button>
                        }
                    </div>
                </Modal>
            </div >

        );

    } catch (error) {
        setEstado(0);// auth.logout()

    }

}
export default Gestion;
