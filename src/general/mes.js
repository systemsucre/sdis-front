import React from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faWindowClose } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../Auth/useAuth"
import { InputUsuario, Select1, Select1XL, } from '../elementos/elementos';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados
import { useState, useEffect } from "react";
import { URL, INPUT } from '../Auth/config';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast'
import '../elementos/estilos.css'
import { alert2, confirmarActualizar } from '../elementos/alert2'
import Load from '../elementos/load'


function Mes() {
    const auth = useAuth()

    const [lista, setLista] = useState([]);
    const [listaGestion, setListaGestion] = useState([]);
    const [fin, setFin] = useState({ campo: null, valido: null });
    const [finH, setFinH] = useState({ campo: null, valido: null });
    const [ini, setIni] = useState({ campo: null, valido: null });
    const [iniH, setIniH] = useState({ campo: null, valido: null });
    const [id, setId] = useState({ campo: null, valido: null })
    const [gestion, setGestion] = useState({ campo: null, valido: null })
    const [cantidad, setCantidad] = useState(0);
    const [año, setAño] = useState(0);
    const [mes, setMes] = useState(0);
    const [modalEditar, setModalEditar] = useState(false);

    const [estado, setEstado] = useState(null);
    const [texto, setTexto] = useState(null);

    let today = new Date()
    let fecha = today.toISOString().split('T')[0]
    let hora = new Date().toLocaleTimeString().split(':')[0]
    let min = new Date().toLocaleTimeString().split(':')[1]
    let sec = new Date().toLocaleTimeString().split(':')[2]
    if (hora.length ===1) hora = '0' + hora
    let horafinal = hora + ':' + min + ':' + sec

    try {


        useEffect(() => {
            document.title = 'MESES'
            if (lista.length === 0) {
                listarInicio()
                listarGestion()
            } else listar()
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
        const listarInicio = async () => {
            setListaGestion([{ id: 1, nombre: fecha.split('-')[0] }])
            setAño(fecha.split('-')[0])

            setGestion({ campo: 1, valido: null })
            setEstado(1)
            setTexto('cargando...')
            axios.post(URL + '/mes/listarinicio', { gestion: fecha.split('-')[0] }).then(json => {
                if (json.data.ok) {
                    setLista(json.data.data[0])
                    setCantidad(json.data.data[1])
                    setEstado(0)
                } else {alert2({ icono: 'warning', titulo: 'Operacion fallida o acceso denegado', boton: 'ok', texto: json.data.msg }); setEstado(0)}
            }).catch(function (error) {setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }
        const listarGestion = async () => {
            axios.post(URL + '/mes/listargestion').then(json => {
                if (json.data.ok) {
                    setListaGestion(json.data.data)
                } else alert2({ icono: 'warning', titulo: 'Operacion fallida o acceso denegado', boton: 'ok', texto: json.data.msg })
            }).catch(function (error) {setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }
        const listar = async () => {
            if (gestion.valido === 'true') {
                listaGestion.forEach(e => {
                    if (gestion.campo == e.id)
                        setAño(e.nombre)
                })
                setEstado(1)
                setTexto('cargando...')
                axios.post(URL + '/mes/listar', { id: gestion.campo }).then(json => {
                    if (json.data.ok) {
                        setLista(json.data.data[0])
                        setCantidad(json.data.data[1])
                        setEstado(0)
                    } else {alert2({ icono: 'warning', titulo: 'Operacion fallida o acceso denegado', boton: 'ok', texto: json.data.msg });setEstado(0)}
                }).catch(function (error) {setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            }
        }





        const actualizar = async (a) => {
            let accion = await confirmarActualizar({ titulo: 'Actualizar accesos', boton: 'ok', texto: 'Ok para continuar...' })
            if (accion.isConfirmed) {
                setEstado(1)
                setTexto('Actualizando fecha de acceso...')
                setModalEditar(false)
                axios.post(URL + '/mes/actualizar', {
                    id: id.campo,
                    f1: ini.campo,
                    h1: iniH.campo,
                    f2: fin.campo,
                    h2: finH.campo,
                    modificado: fecha + ' ' + horafinal
                }).then(json => {
                    if (json.data.ok) {
                        setLista(json.data.data[0])
                        setCantidad(json.data.data[1])
                        setEstado(0)
                        alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: json.data.msg })
                    } else {alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0)}
                }).catch(function (error) {setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });

                setModalEditar(false)
            }
        }

        const activar = async (a) => {

            let accion = await confirmarActualizar({ titulo: 'Activar Mes', boton: 'ok', texto: 'Ok para continuar.' })
            if (accion.isConfirmed) {
                setEstado(1)
                setTexto('Activando acceso...')
                axios.post(URL + '/mes/activar', { id: a, modificado: fecha + ' ' + horafinal }).then(json => {
                    if (json.data.ok) {
                        setLista(json.data.data[0])
                        setCantidad(json.data.data[1])
                        setEstado(0)
                        alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: json.data.msg })
                    } else {alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0)}
                }).catch(function (error) {setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            }
        }

        const desactivar = async (a) => {
            let accion = await confirmarActualizar({ titulo: 'Desartivar Mes', boton: 'ok', texto: 'Ok para continuar.' })
            if (accion.isConfirmed) {
                setEstado(1)
                setTexto('Desactivando acceso...')
                axios.post(URL + '/mes/desactivar', { id: a, modificado: fecha + ' ' + horafinal }).then(json => {
                    if (json.data.ok) {
                        setLista(json.data.data[0])
                        setCantidad(json.data.data[1])
                        setEstado(0)
                        alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: json.data.msg })
                    } else {alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0)}
                }).catch(function (error) {setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            }
        }

        const rellenar = (f) => {
            setMes(f.mes.split(' ')[0])
            setId({ campo: f.id, valido: 'true' })
            let i = f.ini.split(' ')[0]
            let ih = f.ini.split(' ')[1]

            let fn = f.fin.split(' ')[0]
            let fnh = f.fin.split(' ')[1]

            setIni({ campo: i, valido: "true" })
            setIniH({ campo: ih, valido: "true" })

            setFin({ campo: fn, valido: "true" })
            setFinH({ campo: fnh, valido: "true" })
            setModalEditar(true)
        }

        return (
            <div>
                <div className="container_">
                {estado === 1 && <Load texto={texto} />}
                    <div className='contenedor-cabecera-1'>
                        <div className='titulo-pagina' >
                            {'MESES  (GESTIÓN ' + año + ')'}
                        </div>
                    </div>

                    <div className='contenedor m-2'>
                        <Select1XL
                            estado={gestion}
                            cambiarEstado={setGestion}
                            ExpresionRegular={INPUT.ID}
                            lista={listaGestion}
                            etiqueta={'Gestion'}
                            funcion={listar}
                            msg='Seleccione una opcion'
                        />
                        <table className="table table-sm" >
                            <thead>
                                <tr >
                                    <th className="col-2 ">MES</th>
                                    <th className="col-lg-3 col-md-3 col-sm-3 col-2 ">ESTADO</th>
                                    <th className="col-lg-4 col-3 ">INICIAL</th>
                                    <th className="col-lg-4 col-3">FINAL</th>
                                    <th className="col-1  "></th>
                                </tr>
                            </thead>
                        </table>
                        <div className="table table-responsive custom p-2 mb-2" >
                            <table className="table table-sm" >
                                <tbody >
                                    {lista.map((a) => (
                                        <tr key={a.id} >
                                            <td className="col-2 ">{a.mes}</td>
                                            {a.estado === 1 ?
                                                <td className="col-3 " >
                                                    <FontAwesomeIcon icon={faWindowClose} onClick={() => desactivar(a.id)} className='boton-xm-desactivar' />
                                                    ACTIVO</td> :
                                                <td className="col-3 " >
                                                    <FontAwesomeIcon icon={faCheck} onClick={() => activar(a.id)} className='boton-xm-activar' />
                                                    NO ACTIVO</td>}
                                            <td className="col-4 " >{a.ini}</td>
                                            <td className="col-4 " >{a.fin}</td>
                                            <td className="col-2 " onClick={() => rellenar(a)}><div className='cantidad-registros' style={{ cursor: 'pointer' }}>Gestionar</div></td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                            {lista.length < 1 && <div style={{ fontSize: '18px' }}>Lista Vacia</div>}
                        </div>
                        <div className='cantidad-registros'>{cantidad + ' Registro(s)'}</div>
                    </div>
                    <div className='contenedor-foot'>

                    </div>
                </div>

                <Modal isOpen={modalEditar}>

                    <ModalHeader toggle={() => {
                        setModalEditar(false)
                    }}>  {'GESTIÓN  ' + año + ' (' + mes + ')'}</ModalHeader>
                    <ModalBody>
                        <div className='row'>
                            <div className='col-6'>
                                <InputUsuario
                                    estado={ini}
                                    tipo='date'
                                    cambiarEstado={setIni}
                                    placeholder="Clasificacion"
                                    ExpresionRegular={INPUT.FECHA}  //expresion regular  
                                    etiqueta='Fecha inicial'
                                    msg={'Este campo acepta letras, numero y algunos caracteres'}
                                />
                            </div>
                            <div className='col-6'>
                                <InputUsuario
                                    estado={iniH}
                                    tipo='time'
                                    cambiarEstado={setIniH}
                                    placeholder="Clasificacion"
                                    ExpresionRegular={INPUT.HORA}  //expresion regular  
                                    etiqueta='hora Inicial'
                                    msg={'Este campo acepta letras, numero y algunos caracteres'}
                                />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-6'>
                                <InputUsuario
                                    estado={fin}
                                    tipo='date'
                                    cambiarEstado={setFin}
                                    placeholder="Clasificacion"
                                    ExpresionRegular={INPUT.FECHA}  //expresion regular  
                                    etiqueta='Fecha Fin'
                                    msg={'Este campo acepta letras, numero y algunos caracteres'}
                                />
                            </div>
                            <div className='col-6'>
                                <InputUsuario
                                    estado={finH}
                                    tipo='time'
                                    cambiarEstado={setFinH}
                                    placeholder="Clasificacion"
                                    ExpresionRegular={INPUT.HORA}  //expresion regular  
                                    etiqueta='Hora Final'
                                    msg={'Este campo acepta letras, numero y algunos caracteres'}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <div className='botonModal'>
                        <button className="btn-editar col-auto" onClick={() => actualizar()} >
                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faEdit} />Actualizar Accesos
                        </button>
                    </div>
                </Modal>

                <Toaster position='top-right' />
            </div>

        );

    } catch (error) {
        setEstado(0);// auth.logout()
        setEstado(0)
    }

}
export default Mes;
