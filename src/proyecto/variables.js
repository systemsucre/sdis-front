import React from 'react';
import { Modal, ModalBody, ModalHeader, Table } from 'reactstrap';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faEdit, faExclamation, faExclamationCircle, faExclamationTriangle, faEye, faHandPointRight, faPause, faPlay, faPlus, faPlusCircle, faPlusSquare, faRecycle, faSave, faStop, faTrashAlt, faWindowClose } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../Auth/useAuth"
import { InputUsuario, Select1, } from '../elementos/elementos';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados
import { useState, useEffect } from "react";
import { URL, INPUT } from '../Auth/config';
import axios from 'axios';
import { toast } from 'react-hot-toast'
import '../elementos/estilos.css'
import { alert2, confirmarActualizar, confirmarEliminar, confirmarGuardar } from '../elementos/alert2'
import Load from '../elementos/load'
import { InputDinamico } from '../elementos/stylos';


function Variable() {
    const auth = useAuth()

    let today = new Date()
    let fecha_ = today.toLocaleDateString()
    let dia = fecha_.split('/')[0]
    if (dia.length === 1) dia = '0' + dia
    let mes_ = fecha_.split('/')[1]
    if (mes_.length === 1) mes_ = '0' + mes_
    let año_ = fecha_.split('/')[2]
    let fecha = año_ + '-' + mes_ + '-' + dia
    let hora = new Date().toLocaleTimeString().split(':')[0]
    let min = new Date().toLocaleTimeString().split(':')[1]
    let sec = new Date().toLocaleTimeString().split(':')[2]
    if (hora.length === 1) hora = '0' + hora
    let horafinal = hora + ':' + min + ':' + sec

    const [ventana, setVentana] = useState(0);
    const [lista, setLista] = useState([]);
    const [listaRol, setListaRol] = useState([]);
    const [listaGestion, setListaGestion] = useState([]);
    const [variable, setVariable] = useState({ campo: null, valido: null });
    const [id, setId] = useState({ campo: null, valido: null })
    const [gestion, setGestion] = useState({ campo: null, valido: null })
    const [idRol, setIdRol] = useState({ campo: null, valido: null })

    const [cantidad, setCantidad] = useState(0);
    const [año, setAño] = useState(0);
    const [nombreVariable, setNombreVariable] = useState(null);
    const [nombreIndicador, setNombreIndicador] = useState(null);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalRegistrar, setModalRegistrar] = useState(false);
    const [modalRegistrarVariable, setModalRegistrarVariable] = useState(false);
    const [modalActualizarVariable, setModalActualizarVariable] = useState(false);

    const [modalCabecera, setModalCabecera] = useState(false);
    const [modalEditarCabecera, setModalEditarCabecera] = useState(false);


    const [estadoVar, setEstadoVar] = useState(0);
    const [idVarForm, setIdVarForm] = useState(0);

    const [estado, setEstado] = useState(0);
    const [texto, setTexto] = useState(0);


    //INDICADORES
    const [idVariable, setIdVariable] = useState({ campo: null, valido: null })
    const [idIndicador, setIdIndicador] = useState({ campo: null, valido: null })
    const [indicador, setIndicador] = useState({ campo: null, valido: null })
    const [idIndicadores, setIdIndicadores] = useState(new Array())
    const [ini, setIni] = useState({ campo: new Date().getFullYear() + '-01-01', valido: 'true' });
    const [fin, setFin] = useState({ campo: new Date().getFullYear() + '-12-30', valido: 'true' });



    // INPUT

    const [idInput, setIdInput] = useState({ campo: null, valido: null })
    const [ordenInput, setOrdenInput] = useState({ campo: null, valido: null })
    const [orden, setOrden] = useState({ campo: null, valido: null })
    const [nivel, setNivel] = useState({ campo: null, valido: null })
    const [input, setInput] = useState({ campo: null, valido: null })
    const [idPrincipal, setPrincipal] = useState({ campo: null, valido: null })
    const [codigo, setCodigo] = useState(null)
    const [estadoPadre, setEstadoPadre] = useState(null)


    const [listaIndicador, setListaIndicador] = useState([]);
    const [listaInput, setListaInput] = useState([]);
    const [cantidadIndicador, setCantidadIndicador] = useState(0);
    const [cantidadInput, setCantidadInput] = useState(0);









    try {
        useEffect(() => {
            document.title = 'VARIABLES'
            if (lista.length === 0) {
                listarGestion()
            } else listar()

            window.addEventListener('onload',
                window.onload = function () {
                    window.location.hash = "no-back-button";
                    window.location.hash = "Again-No-back-button"
                    window.onhashchange = function () {
                        setVentana(0)
                        setIdIndicador({ campo: null, valido: null });
                        setIndicador({ campo: null, valido: null });
                        setListaIndicador([])

                        setIdInput({ campo: null, valido: null });
                        setOrdenInput({ campo: null, valido: null });
                        setInput({ campo: null, valido: null });
                        setOrden({ campo: null, valido: null });
                        setIdIndicador({ campo: null, valido: null });
                        setNivel({ campo: null, valido: null })
                        setPrincipal({ campo: null, valido: null })
                        setCodigo(null)
                        setListaInput([])
                        setIdIndicadores([])
                        console.log(gestion, año, idRol, 'gestion, año, idrol')
                        if ((gestion.valido === 'true' || año) && idRol.valido === 'true') {
                            listar()
                        }
                        window.location.hash = "no-back-button";
                    }

                })
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


        const listarGestion = async () => {
            axios.post(URL + '/variable/listargestion').then(json => {
                if (json.data.hasOwnProperty("sesion")) {
                    auth.logout()
                    alert('LA SESION FUE CERRADO DESDE EL SERVIDOR, VUELVA A INTRODODUCIR SUS DATOS DE INICIO')
                }
                if (json.data.ok) {
                    // console.log(json.data.data[1], 'lista rol')
                    setListaGestion(json.data.data[0])
                    setListaRol(json.data.data[1])
                } else alert2({ icono: 'warning', titulo: 'Error al procesar su solicitud, Intente nuevamente', boton: 'ok', texto: json.data.msg })
            }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }

        const listar = async () => {

            if ((gestion.valido === 'true' || año) && idRol.valido === 'true') {
                setEstado(1)
                setTexto('Cargando...')
                listaGestion.forEach(e => {
                    if (gestion.campo == e.id)
                        setAño(e.nombre)
                })
                axios.post(URL + '/variable/listar', {
                    gestion: gestion.campo ? gestion.campo : año,
                    rol_: idRol.campo
                }).then(json => {
                    if (json.data.ok) {
                        setLista(json.data.data[0])
                        setCantidad(json.data.data[1])
                        setEstado(0)
                    } else alert2({ icono: 'warning', titulo: 'Error al procesar su solicitud, Intente nuevamente', boton: 'ok', texto: json.data.msg })

                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); setEstado(0) });
            } else { toast.error('Seleccione la gestion y el rol'); }
        }



        const registrar = async (a) => {
            if ((gestion.valido === 'true' || año !== null) && variable.valido === 'true' && estado === 0) {
                let accion = await confirmarGuardar({ titulo: 'Registrar nombre de formulario', boton: 'ok', texto: 'Ok para continuar...' })
                if (accion.isConfirmed) {
                    setEstado(1)
                    setTexto('Guardando...')
                    axios.post(URL + '/variable/insertar', {
                        variable1: variable.campo,
                        gestion: gestion.campo ? gestion.campo : año,
                        rol_: idRol.campo,
                        creado: fecha + ' ' + horafinal
                    }).then(json => {
                        if (json.data.ok) {
                            setLista(json.data.data[0])
                            setCantidad(json.data.data[1])
                            setModalRegistrar(false)
                            setVariable({ campo: null, valido: null })
                            setEstado(0)
                            alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: json.data.msg })
                        } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                    }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                }
            } else toast.error('Complete el campo variable')
        }


        const actualizar = async () => {
            if (id.valido === 'true' && (gestion.valido === 'true' || año !== null) && variable.valido === 'true') {
                let accion = await confirmarActualizar({ titulo: 'Actualizar nombre de formulario', boton: 'ok', texto: 'Ok para continuar...' })
                if (accion.isConfirmed) {
                    setModalEditar(false)
                    setEstado(1)
                    setTexto('Actualizando...')
                    axios.post(URL + '/variable/actualizar', {
                        id: id.campo,
                        variable1: variable.campo,
                        gestion: gestion.campo ? gestion.campo : año,
                        rol_: idRol.campo,
                        modificado: fecha + ' ' + horafinal
                    }).then(json => {
                        if (json.data.ok) {
                            setLista(json.data.data[0])
                            setCantidad(json.data.data[1])
                            setVariable({ campo: null, valido: null })
                            setEstado(0)
                            alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: json.data.msg })
                        } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                    }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                }
            } else toast.error('Complete el campo variable')
        }

        const eliminar = async (e) => {
            if (e && (gestion.valido === 'true' || año !== null)) {
                let accion = await confirmarEliminar({ titulo: 'Eliminar Registro ?', boton: 'ok', texto: 'Ok para continuar.' })
                if (accion.isConfirmed) {
                    let accion = await confirmarEliminar({ titulo: 'Eliminar formulario ?', boton: 'ok', texto: 'Ok para continuar.' })
                    if (accion.isConfirmed) {

                        setEstado(1)
                        setTexto('Eliminando...')
                        axios.post(URL + '/variable/eliminar', {
                            id: e,
                            gestion: gestion.campo ? gestion.campo : año,
                            rol_: idRol.campo,
                            modificado: fecha + ' ' + horafinal
                        }).then(json => {
                            if (json.data.ok) {
                                alert2({ icono: 'success', titulo: 'Operaccion Exitoso', boton: 'ok', texto: json.data.msg })
                                setLista(json.data.data[0])
                                setCantidad(json.data.data[1])
                                setEstado(0)
                            } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }

                        }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });

                    }
                }
            }
        }

        // const suspender = async (e) => {
        //     if (e && (gestion.valido === 'true' || año !== null) && idRol.valido === 'true') {
        //         let accion = await confirmarActualizar({ titulo: 'Suspender Formulario', boton: 'ok', texto: 'Ok para continuar.' })
        //         if (accion.isConfirmed) {

        //             setEstado(1)
        //             setTexto('Deteniendo...')
        //             axios.post(URL + '/variable/suspender', {
        //                 id: e,
        //                 gestion: gestion.campo ? gestion.campo : año,
        //                 rol_: idRol.campo,
        //                 modificado: fecha + ' ' + horafinal
        //             }).then(json => {
        //                 if (json.data.ok) {
        //                     alert2({ icono: 'success', titulo: 'Operaccion Exitoso', boton: 'ok', texto: json.data.msg })
        //                     setLista(json.data.data[0])
        //                     setCantidad(json.data.data[1])
        //                     setEstadoVar(3)
        //                     setEstado(0)
        //                 } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }

        //             }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });

        //         }
        //     }
        // }



        const iniciarVariable = async (e) => {
            if (e && (gestion.valido === 'true' || año !== null && listaInput.length > 0)) {
                let accion = await confirmarActualizar({ titulo: 'Iniciar todas los variables de este formulario', boton: 'ok', texto: 'Ok para continuar.' })
                if (accion.isConfirmed) {
                    setEstado(1)
                    setTexto('Asegurando configuraciones, Por favor espere unos segundos ....')
                    let span1 = 0
                    let span2 = 0
                    let spanaux = 0
                    listaInput.forEach(e1 => {
                        if (e1.tope === 1)
                            e1.span = 1
                        else
                            listaInput.forEach(e2 => {
                                if (parseInt(e1.id) === parseInt(e2.idinput)) {
                                    span1++ // nivel 1
                                    e1.span = span1
                                    span2 = 0
                                    if (e2.tope === 1) {
                                        // console.log('entra nivel dos con span 1 y tope 1')
                                        // e2.span = 1
                                    } else {

                                        listaInput.forEach(e3 => {
                                            if (parseInt(e2.id) === parseInt(e3.idinput)) {
                                                span2++
                                                e2.span = span2
                                                // if (e3.tope === 1) {
                                                spanaux++
                                                e1.span = spanaux
                                                // }
                                            }
                                        });

                                    }

                                }
                                span2 = 0

                            })
                        span1 = 0
                        spanaux = 0
                    })
                    setTimeout(() => {
                        axios.post(URL + '/variable/iniciar', {
                            variable_: e,
                            gestion: gestion.campo ? gestion.campo : año,
                            rol_: idRol.campo,
                            lista: listaInput,
                            modificado: fecha + ' ' + horafinal
                        }).then(json => {
                            if (json.data.ok) {
                                console.log(json.data.data[0], 'variables actuales')
                                alert2({ icono: 'success', titulo: 'Operaccion Exitoso', boton: 'ok', texto: json.data.msg })
                                setLista(json.data.data[0])
                                setCantidad(json.data.data[1])
                                setEstadoVar(1)

                                setEstado(0)
                            } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }

                        }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });

                    }, 3000)

                }
            }
        }


        const detener = async (e) => {
            if (e && (gestion.valido === 'true' || año !== null) && idRol.valido === 'true') {
                let accion = await confirmarActualizar({ titulo: 'Detener Formulario', boton: 'ok', texto: 'Ok para continuar.' })
                if (accion.isConfirmed) {

                    setEstado(1)
                    setTexto('Deteniendo...')
                    axios.post(URL + '/variable/detener', {
                        id: e,
                        gestion: gestion.campo ? gestion.campo : año,
                        rol_: idRol.campo,
                        modificado: fecha + ' ' + horafinal
                    }).then(json => {
                        if (json.data.ok) {
                            alert2({ icono: 'success', titulo: 'Operaccion Exitoso', boton: 'ok', texto: json.data.msg })
                            setLista(json.data.data[0])
                            setCantidad(json.data.data[1])
                            setEstadoVar(2)
                            setEstado(0)
                        } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }

                    }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });

                }
            }
        }






        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //VARIABLE

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        const listarIndicadores = async (id) => {
            setVentana(1)
            setEstado(1)

            setTexto('cargando..')
            if (id) {
                axios.post(URL + '/variable/listarindicador', { id: id }).then(json => {
                    if (json.data.ok) {
                        setListaIndicador(json.data.data[0])
                        setCantidadIndicador(json.data.data[1])
                        setEstado(0)
                    } else { alert2({ icono: 'warning', titulo: 'Error al procesar su solicitud, Intente nuevamente', boton: 'ok', texto: json.data.msg }); setVentana(0); setEstado(0) }
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            }
        }

        const listarIndicadoresParaFormulario = async (id) => {
            setEstado(1)
            setTexto('cargando..')
            if (id) {
                axios.post(URL + '/variable/listarindicador', { id: id }).then(json => {
                    if (json.data.ok) {
                        if (json.data.data[0].length > 0) {
                            console.log(json.data.data[0][0].id, 'id indicador')
                            listarInputFormulario(json.data.data[0][0].id)
                            setVentana(3)
                            setEstado(0)
                        } else { alert2({ icono: 'warning', titulo: 'Sin variables', boton: 'ok', texto: 'Primero cree variables' }); setVentana(0); setEstado(0) }
                    } else { alert2({ icono: 'warning', titulo: 'Error al procesar su solicitud, Intente nuevamente', boton: 'ok', texto: json.data.msg }); setVentana(0); setEstado(0) }
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            }
        }


        const listarIndicadoresAux = async (id) => {
            setEstado(1)
            setTexto('cargando..')
            if (id) {
                axios.post(URL + '/variable/listarindicador', { id: id }).then(json => {
                    if (json.data.ok) {
                        setListaIndicador(json.data.data[0])
                        setCantidadIndicador(json.data.data[1])
                        console.log(json.data.data[0], 'datos aux')
                        setEstado(0)
                        json.data.data[0].forEach(e => {
                            idIndicadores.push(e.id)
                        })
                    } else { alert2({ icono: 'warning', titulo: 'Error al procesar su solicitud, Intente nuevamente', boton: 'ok', texto: json.data.msg }); setVentana(0); setEstado(0) }
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            }
        }


        const insertarIndicador = async () => {
            if (indicador.valido === 'true' && idVariable.valido === 'true' && estado === 0 && ini.valido === 'true' && fin.valido === 'true') {
                let accion = await confirmarGuardar({ titulo: 'Añadir variable', boton: 'ok', texto: 'Ok para continuar...' })
                if (accion.isConfirmed) {
                    setEstado(1)
                    setTexto('Guardando...')
                    axios.post(URL + '/variable/insertarindicador', {
                        variable1: idVariable.campo,
                        indicador: indicador.campo,
                        ini: ini.campo,
                        fin: fin.campo,
                        creado: fecha + ' ' + horafinal
                    }).then(json => {
                        if (json.data.ok) {
                            setListaIndicador(json.data.data[0])
                            listarInputAux(json.data.data[0][0].id, json.data.data[1])
                            setIndicador({ campo: null, valido: null })
                            setModalRegistrarVariable(false)
                            setEstado(0)
                            setIni({ campo: new Date().getFullYear() + '-01-01', valido: 'true' })
                            setFin({ campo: new Date().getFullYear() + '-12-30', valido: 'true' })

                            alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: json.data.msg })
                        } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                    }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });

                }
            } else toast.error('Escriba correctamente la varialbe')
        }
        const actualizarIndicador = async () => {
            if (idIndicador.valido === 'true' && indicador.valido === 'true' && idVariable.valido === 'true' && ini.valido === 'true' && fin.valido === 'true') {
                let accion = await confirmarActualizar({ titulo: 'Actualizar variable', boton: 'ok', texto: 'Ok para continuar...' })
                if (accion.isConfirmed) {
                    setEstado(1)
                    setTexto('Actualizando...')
                    axios.post(URL + '/variable/actualizarindicador', {
                        id: idIndicador.campo,
                        variable1: idVariable.campo,
                        indicador: indicador.campo,
                        ini: ini.campo,
                        fin: fin.campo,
                        modificado: fecha + ' ' + horafinal
                    }).then(json => {
                        if (json.data.ok) {
                            setListaIndicador(json.data.data[0])
                            setCantidadIndicador(json.data.data[1])
                            setIndicador({ campo: null, valido: null })
                            setIdIndicador({ campo: null, valido: null })
                            setModalActualizarVariable(false)
                            setIni({ campo: new Date().getFullYear() + '-01-01', valido: 'true' })
                            setFin({ campo: new Date().getFullYear() + '-12-30', valido: 'true' })
                            setEstado(0)
                            alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: json.data.msg })
                        } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                    }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                }
            } else toast.error('Escriba correctamente la variable')
        }

        const eliminarIndicador = async (id) => {
            if (id && idVariable.valido === 'true') {
                let accion = await confirmarEliminar({ titulo: 'Eliminar variable', boton: 'ok', texto: 'Ok para continuar...' })
                if (accion.isConfirmed) {

                    setEstado(1)
                    setTexto('Eliminado...')
                    axios.post(URL + '/variable/eliminarindicador', {
                        id: id,
                        variable1: idVariable.campo,
                        modificado: fecha + ' ' + horafinal
                    }).then(json => {
                        if (json.data.ok) {
                            setListaIndicador(json.data.data[0])
                            setCantidadIndicador(json.data.data[1])
                            setIdIndicador({ campo: null, valido: null })
                            setEstado(0)
                            alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: json.data.msg })
                        } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                    }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                }
            } else toast.error('Error Consulte con el administrador')
        }

        const activarIndicador = async (id) => {
            if (id && idVariable.valido === 'true') {
                let accion = await confirmarActualizar({ titulo: 'Iniciar variable', boton: 'ok', texto: 'Ok para continuar...' })
                if (accion.isConfirmed) {
                    setEstado(1)
                    setTexto('activando variable...')
                    axios.post(URL + '/variable/activarindicador', {
                        id: id,
                        variable1: idVariable.campo,
                        modificado: fecha + ' ' + horafinal
                    }).then(json => {
                        if (json.data.ok) {
                            setListaIndicador(json.data.data[0])
                            setCantidadIndicador(json.data.data[1])
                            setIdIndicador({ campo: null, valido: null })
                            setEstado(0)
                            alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: json.data.msg })
                        } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                    }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                }
            } else toast.error('Error Consulte con el administrador')
        }
        const desactivarIndicador = async (id) => {
            if (id && idVariable.valido === 'true') {
                let accion = await confirmarActualizar({ titulo: 'desactivar variable', boton: 'ok', texto: 'Ok para continuar...' })
                if (accion.isConfirmed) {
                    setEstado(1)
                    setTexto('desactivando variable...')
                    axios.post(URL + '/variable/desactivarindicador', {
                        id: id,
                        variable1: idVariable.campo,
                        modificado: fecha + ' ' + horafinal
                    }).then(json => {
                        if (json.data.ok) {
                            setListaIndicador(json.data.data[0])
                            setCantidadIndicador(json.data.data[1])
                            setIdIndicador({ campo: null, valido: null })
                            setEstado(0)
                            alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: json.data.msg })
                        } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                    }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                }
            } else toast.error('Error Consulte con el administrador')
        }





        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //SUBVARIABLES

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        const listarInputAux = async (id, nuevoInd = null) => {
            let data = []
            if (id) {
                setEstado(1)
                setTexto('Cargando...')
                await axios.post(URL + '/variable/listarinput', { id: id }).then(async json1 => {

                    if (json1.data.ok) {
                        data = json1.data.data
                        setListaInput(data)
                        setCantidadInput(json1.data.data.length)

                        if (json1.data.data.length > 0) {
                            setEstado(1)
                            setTexto('Espere Creando cabeceras ... ')
                            console.log('antecitos del timeout')
                            setTimeout(async () => {
                                // alert('Se añadiran las cabeceras que corresponden a este grupo de variables')
                                console.log('cargado de la data', data)

                                setEstado(1)
                                setTexto('Guardando...')
                                axios.post(URL + '/variable/anadirnuevosinput', { //añade las cabeceras de la nueva variable
                                    indicador: nuevoInd,
                                    variable_: idVariable.campo,
                                    lista: data,
                                    ini: ini.campo,
                                    fin: fin.campo,
                                    creado: fecha + ' ' + horafinal
                                }).then(json => {
                                    if (json.data.ok) {
                                        setEstado(0)
                                        setVentana(1)
                                        alert2({ icono: 'success', titulo: 'Cabeceras añadidos', boton: 'ok', texto: json.data.msg })
                                    } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });


                            }, 4000)
                        }
                        json1.data.data.forEach(e1 => {
                            axios.post(URL + '/variable/listarinput2', { id: e1.id }).then(json2 => {
                                if (json2.data.ok) {
                                    console.log('se sigue ejecutando la linea siguiente')
                                    json1.data.data.forEach(async e1 => {
                                        await json2.data.data.forEach(e2 => {

                                            if (parseInt(e1.id) === parseInt(e2.idinput)) {
                                                const indice = data.findIndex((elemento, indice) => {
                                                    if (parseInt(elemento.id) === parseInt(e2.idinput)) {
                                                        return true;
                                                    }
                                                });
                                                data.splice(indice + 1, 0, e2)
                                                setListaInput(data)
                                                setCantidadInput(data.length)

                                                axios.post(URL + '/variable/listarinput2', { id: e2.id }).then(json3 => {
                                                    // console.log(json3.data.data)

                                                    if (json3.data.ok) {
                                                        json2.data.data.forEach(async e2 => {
                                                            await json3.data.data.forEach(e3 => {

                                                                if (parseInt(e2.id) === parseInt(e3.idinput)) {
                                                                    const indice = data.findIndex((elemento, indice) => {
                                                                        if (parseInt(elemento.id) === parseInt(e3.idinput)) {
                                                                            return true;
                                                                        }
                                                                    });
                                                                    data.splice(indice + 1, 0, e3)
                                                                    setListaInput(data)
                                                                    setCantidadInput(data.length)

                                                                    axios.post(URL + '/variable/listarinput2', { id: e3.id }).then(json4 => {
                                                                        // console.log(json3.data.data)

                                                                        if (json4.data.ok) {
                                                                            json3.data.data.forEach(async e3 => {
                                                                                await json4.data.data.forEach(e4 => {

                                                                                    if (parseInt(e3.id) === parseInt(e4.idinput)) {
                                                                                        const indice = data.findIndex((elemento, indice) => {
                                                                                            if (parseInt(elemento.id) === parseInt(e4.idinput)) {
                                                                                                return true;
                                                                                            }
                                                                                        });
                                                                                        data.splice(indice + 1, 0, e4)
                                                                                        setListaInput(data)
                                                                                        setCantidadInput(data.length)

                                                                                        axios.post(URL + '/variable/listarinput2', { id: e4.id }).then(json5 => {
                                                                                            // console.log(json3.data.data)

                                                                                            if (json5.data.ok) {
                                                                                                json4.data.data.forEach(async e4 => {
                                                                                                    await json5.data.data.forEach(e5 => {

                                                                                                        if (parseInt(e4.id) === parseInt(e5.idinput)) {
                                                                                                            const indice = data.findIndex((elemento, indice) => {
                                                                                                                if (parseInt(elemento.id) === parseInt(e5.idinput)) {
                                                                                                                    return true;
                                                                                                                }
                                                                                                            });
                                                                                                            data.splice(indice + 1, 0, e5)
                                                                                                            setListaInput(data)
                                                                                                            setCantidadInput(data.length)

                                                                                                        }
                                                                                                    })
                                                                                                })
                                                                                            } else alert2({ icono: 'warning', titulo: 'Error al procesar su solicitud, Intente nuevamente', boton: 'ok', texto: json2.data.msg })
                                                                                        })
                                                                                    }
                                                                                })
                                                                            })
                                                                        } else alert2({ icono: 'warning', titulo: 'Error al procesar su solicitud, Intente nuevamente', boton: 'ok', texto: json2.data.msg })
                                                                    })
                                                                }
                                                            })
                                                        })
                                                    } else alert2({ icono: 'warning', titulo: 'Error al procesar su solicitud, Intente nuevamente', boton: 'ok', texto: json2.data.msg })
                                                })
                                            }
                                        })
                                    })
                                } else alert2({ icono: 'warning', titulo: 'Error al procesar su solicitud, Intente nuevamente', boton: 'ok', texto: json2.data.msg })
                            })
                        })
                        setEstado(0)
                    } else { alert2({ icono: 'warning', titulo: 'Error al procesar su solicitud, Intente nuevamente', boton: 'ok', texto: json1.data.msg }); setEstado(0) }
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); })
            } else toast.error('Añade porlomenos un indicador')
        }

        const listarInputFormulario = async (id) => {
            let data = []
            if (id) {
                axios.post(URL + '/variable/listarinput', { id: id }).then(async json1 => {

                    if (json1.data.ok) {
                        data = json1.data.data
                        setListaInput(data)
                        setCantidadInput(json1.data.data.length)
                        json1.data.data.forEach(e1 => {
                            setEstado(1)
                            axios.post(URL + '/variable/listarinput2', { id: e1.id }).then(json2 => {
                                if (json2.data.ok) {

                                    setEstado(0)
                                    json1.data.data.forEach(async e1 => {
                                        await json2.data.data.forEach(e2 => {

                                            if (parseInt(e1.id) === parseInt(e2.idinput)) {
                                                const indice = data.findIndex((elemento, indice) => {
                                                    if (parseInt(elemento.id) === parseInt(e2.idinput)) {
                                                        return true;
                                                    }
                                                });
                                                data.splice(indice + 1, 0, e2)
                                                setListaInput(data)
                                                setCantidadInput(data.length)

                                                axios.post(URL + '/variable/listarinput2', { id: e2.id }).then(json3 => {
                                                    // console.log(json3.data.data)

                                                    if (json3.data.ok) {
                                                        json2.data.data.forEach(async e2 => {
                                                            await json3.data.data.forEach(e3 => {

                                                                if (parseInt(e2.id) === parseInt(e3.idinput)) {
                                                                    const indice = data.findIndex((elemento, indice) => {
                                                                        if (parseInt(elemento.id) === parseInt(e3.idinput)) {
                                                                            return true;
                                                                        }
                                                                    });
                                                                    data.splice(indice + 1, 0, e3)
                                                                    setListaInput(data)
                                                                    setCantidadInput(data.length)

                                                                    axios.post(URL + '/variable/listarinput2', { id: e3.id }).then(json4 => {
                                                                        // console.log(json3.data.data)

                                                                        if (json4.data.ok) {
                                                                            json3.data.data.forEach(async e3 => {
                                                                                await json4.data.data.forEach(e4 => {

                                                                                    if (parseInt(e3.id) === parseInt(e4.idinput)) {
                                                                                        const indice = data.findIndex((elemento, indice) => {
                                                                                            if (parseInt(elemento.id) === parseInt(e4.idinput)) {
                                                                                                return true;
                                                                                            }
                                                                                        });
                                                                                        data.splice(indice + 1, 0, e4)
                                                                                        setListaInput(data)
                                                                                        setCantidadInput(data.length)

                                                                                        axios.post(URL + '/variable/listarinput2', { id: e4.id }).then(json5 => {
                                                                                            // console.log(json3.data.data)

                                                                                            if (json5.data.ok) {
                                                                                                json4.data.data.forEach(async e4 => {
                                                                                                    await json5.data.data.forEach(e5 => {

                                                                                                        if (parseInt(e4.id) === parseInt(e5.idinput)) {
                                                                                                            const indice = data.findIndex((elemento, indice) => {
                                                                                                                if (parseInt(elemento.id) === parseInt(e5.idinput)) {
                                                                                                                    return true;
                                                                                                                }
                                                                                                            });
                                                                                                            data.splice(indice + 1, 0, e5)
                                                                                                            setListaInput(data)
                                                                                                            setCantidadInput(data.length)

                                                                                                        }
                                                                                                    })
                                                                                                })
                                                                                            } else alert2({ icono: 'warning', titulo: 'Error al procesar su solicitud, Intente nuevamente', boton: 'ok', texto: json2.data.msg })
                                                                                        })
                                                                                    }
                                                                                })
                                                                            })
                                                                        } else alert2({ icono: 'warning', titulo: 'Error al procesar su solicitud, Intente nuevamente', boton: 'ok', texto: json2.data.msg })
                                                                    })
                                                                }
                                                            })
                                                        })
                                                    } else alert2({ icono: 'warning', titulo: 'Error al procesar su solicitud, Intente nuevamente', boton: 'ok', texto: json2.data.msg })
                                                })
                                            }
                                        })
                                    })
                                } else alert2({ icono: 'warning', titulo: 'Error al procesar su solicitud, Intente nuevamente', boton: 'ok', texto: json2.data.msg })
                            })
                        })
                        setEstado(0)
                    } else { alert2({ icono: 'warning', titulo: 'Error al procesar su solicitud, Intente nuevamente', boton: 'ok', texto: json1.data.msg }); setEstado(0) }
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });

            } else toast.error('Añade porlomenos un indicador')
        }
        const listarInput = async (id) => {
            let data = []
            if (id) {
                setEstado(1)
                setTexto('Cargando...')
                axios.post(URL + '/variable/listarinput', { id: id }).then(async json1 => {

                    if (json1.data.ok) {
                        data = json1.data.data
                        setListaInput(data)
                        setCantidadInput(json1.data.data.length)
                        setVentana(2);
                        json1.data.data.forEach(e1 => {
                            setEstado(1)
                            axios.post(URL + '/variable/listarinput2', { id: e1.id }).then(json2 => {
                                if (json2.data.ok) {

                                    setEstado(0)
                                    json1.data.data.forEach(async e1 => {
                                        await json2.data.data.forEach(e2 => {

                                            if (parseInt(e1.id) === parseInt(e2.idinput)) {
                                                const indice = data.findIndex((elemento, indice) => {
                                                    if (parseInt(elemento.id) === parseInt(e2.idinput)) {
                                                        return true;
                                                    }
                                                });
                                                data.splice(indice + 1, 0, e2)
                                                setListaInput(data)
                                                setCantidadInput(data.length)

                                                axios.post(URL + '/variable/listarinput2', { id: e2.id }).then(json3 => {
                                                    // console.log(json3.data.data)

                                                    if (json3.data.ok) {
                                                        json2.data.data.forEach(async e2 => {
                                                            await json3.data.data.forEach(e3 => {

                                                                if (parseInt(e2.id) === parseInt(e3.idinput)) {
                                                                    const indice = data.findIndex((elemento, indice) => {
                                                                        if (parseInt(elemento.id) === parseInt(e3.idinput)) {
                                                                            return true;
                                                                        }
                                                                    });
                                                                    data.splice(indice + 1, 0, e3)
                                                                    setListaInput(data)
                                                                    setCantidadInput(data.length)

                                                                    axios.post(URL + '/variable/listarinput2', { id: e3.id }).then(json4 => {
                                                                        // console.log(json3.data.data)

                                                                        if (json4.data.ok) {
                                                                            json3.data.data.forEach(async e3 => {
                                                                                await json4.data.data.forEach(e4 => {

                                                                                    if (parseInt(e3.id) === parseInt(e4.idinput)) {
                                                                                        const indice = data.findIndex((elemento, indice) => {
                                                                                            if (parseInt(elemento.id) === parseInt(e4.idinput)) {
                                                                                                return true;
                                                                                            }
                                                                                        });
                                                                                        data.splice(indice + 1, 0, e4)
                                                                                        setListaInput(data)
                                                                                        setCantidadInput(data.length)

                                                                                        axios.post(URL + '/variable/listarinput2', { id: e4.id }).then(json5 => {
                                                                                            // console.log(json3.data.data)

                                                                                            if (json5.data.ok) {
                                                                                                json4.data.data.forEach(async e4 => {
                                                                                                    await json5.data.data.forEach(e5 => {

                                                                                                        if (parseInt(e4.id) === parseInt(e5.idinput)) {
                                                                                                            const indice = data.findIndex((elemento, indice) => {
                                                                                                                if (parseInt(elemento.id) === parseInt(e5.idinput)) {
                                                                                                                    return true;
                                                                                                                }
                                                                                                            });
                                                                                                            data.splice(indice + 1, 0, e5)
                                                                                                            setListaInput(data)
                                                                                                            setCantidadInput(data.length)

                                                                                                        }
                                                                                                    })
                                                                                                })
                                                                                            } else alert2({ icono: 'warning', titulo: 'Error al procesar su solicitud, Intente nuevamente', boton: 'ok', texto: json2.data.msg })
                                                                                        })
                                                                                    }
                                                                                })
                                                                            })
                                                                        } else alert2({ icono: 'warning', titulo: 'Error al procesar su solicitud, Intente nuevamente', boton: 'ok', texto: json2.data.msg })
                                                                    })
                                                                }
                                                            })
                                                        })
                                                    } else alert2({ icono: 'warning', titulo: 'Error al procesar su solicitud, Intente nuevamente', boton: 'ok', texto: json2.data.msg })
                                                })
                                            }
                                        })
                                    })
                                } else alert2({ icono: 'warning', titulo: 'Error al procesar su solicitud, Intente nuevamente', boton: 'ok', texto: json2.data.msg })
                            })
                        })
                        setEstado(0)
                    } else { alert2({ icono: 'warning', titulo: 'Error al procesar su solicitud, Intente nuevamente', boton: 'ok', texto: json1.data.msg }); setEstado(0) }
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });

            } else toast.error('Añade porlomenos un indicador')
        }

        const insertarInput = async () => {
            console.log(input, estado, idVariable, idIndicadores, gestion, ini, fin)
            if (input.valido === 'true' && estado === 0 && idVariable.valido === 'true' && gestion.valido === 'true' && idIndicadores.length > 0 && ini.valido === 'true' && fin.valido === 'true') {
                let accion = await confirmarGuardar({ titulo: 'Añadir subvariable', boton: 'ok', texto: 'Ok para continuar...' })
                if (accion.isConfirmed) {
                    setEstado(1)
                    setTexto('Guardando...')
                    axios.post(URL + '/variable/insertarinput', {
                        input: input.campo,
                        variable_: idVariable.campo,
                        listaInd: idIndicadores,
                        gestion: gestion.campo,
                        ini: ini.campo,
                        fin: fin.campo,
                        creado: fecha + ' ' + horafinal
                    }).then(json => {
                        if (json.data.ok) {
                            setTimeout(() => {
                                listarInput(idIndicador.campo)
                                listar()
                            }, 1500)
                            setInput({ campo: null, valido: null })
                            setOrden({ campo: null, valido: null })
                            setEstado(0)
                            setIni({ campo: new Date().getFullYear() + '-01-01', valido: 'true' })
                            setFin({ campo: new Date().getFullYear() + '-12-30', valido: 'true' })
                            setModalCabecera(false)
                            alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: json.data.msg })
                        } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                    }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                }
            } else toast.error('Complete el formulario aqui')
        }

        const actualizarInput = async () => {
            console.log(idInput)
            if (idIndicador.valido === 'true') {
                if (input.valido === 'true' && idInput.valido === 'true' && codigo && idPrincipal.valido === 'true' && ini.valido === 'true' && fin.valido === 'true') {
                    let accion = await confirmarActualizar({ titulo: 'Actualizar subvariable', boton: 'ok', texto: 'Ok para continuar...' })
                    if (accion.isConfirmed) {
                        setEstado(1)
                        setTexto('Actualizando...')
                        axios.post(URL + '/variable/actualizarinput', {
                            idinput: idInput.campo,
                            input: input.campo,
                            id: idPrincipal.campo,
                            codigo: codigo,
                            ini: ini.campo,
                            fin: fin.campo,
                            modificado: fecha + ' ' + horafinal
                        }).then(json => {
                            if (json.data.ok) {
                                setTimeout(() => {
                                    listarInput(idIndicador.campo)
                                }, 1500)
                                setInput({ campo: null, valido: null })
                                setPrincipal({ campo: null, valido: null })
                                setIdInput({ campo: null, valido: null })
                                setModalEditarCabecera(false)
                                setIni({ campo: new Date().getFullYear() + '-01-01', valido: 'true' })
                                setFin({ campo: new Date().getFullYear() + '-12-30', valido: 'true' })
                                setCodigo(0)
                                setEstado(0)
                                alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: json.data.msg })
                            } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                        }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                    }
                } else toast.error('Complete el formulario')
            } else toast.error('No se ha encontrado la variable')
        }


        const eliminarInput = async (codigo, idinput) => {
            if (codigo && idVariable.valido === 'true' && idinput && gestion.valido === 'true') {
                let accion = await confirmarEliminar({ titulo: 'Eliminar subvariable', boton: 'ok', texto: 'Ok para continuar...' })
                if (accion.isConfirmed) {
                    setEstado(1)
                    setTexto('Eliminando...')
                    axios.post(URL + '/variable/eliminarinput', {
                        codigo: codigo,
                        idinput: idinput,
                        modificado: fecha + ' ' + horafinal,
                        variable_: idVariable.campo,
                        gestion: gestion.campo,
                    }).then(json => {
                        if (json.data.ok) {
                            setTimeout(() => {
                                listarInput(idIndicador.campo)
                                listar()
                            }, 1500)
                            setEstado(0)
                            alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: json.data.msg })
                        } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                    }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                }
            } else toast.error('Error Consulte con el administrador')
        }


        const desactivarInput = async (codigo, idinput) => {
            if (codigo && idVariable.valido === 'true' && idinput && gestion.valido === 'true') {
                let accion = await confirmarActualizar({ titulo: 'desactivar subvariable', boton: 'ok', texto: 'Ok para continuar...' })
                if (accion.isConfirmed) {
                    setEstado(1)
                    setTexto('Eliminando...')
                    axios.post(URL + '/variable/desactivarinput', {
                        codigo: codigo,
                        idinput: idinput,
                        modificado: fecha + ' ' + horafinal,
                        variable_: idVariable.campo,
                        gestion: gestion.campo,
                    }).then(json => {
                        if (json.data.ok) {
                            setTimeout(() => {
                                listarInput(idIndicador.campo)
                                listar()
                            }, 1500)
                            setEstado(0)
                            alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: json.data.msg })
                        } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                    }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                }
            } else toast.error('Error Consulte con el administrador')
        }

        const activarInput = async (codigo, idinput) => {
            if (codigo && idVariable.valido === 'true' && idinput && gestion.valido === 'true') {
                let accion = await confirmarActualizar({ titulo: 'activar subvariable', boton: 'ok', texto: 'Ok para continuar...' })
                if (accion.isConfirmed) {
                    setEstado(1)
                    setTexto('Eliminando...')
                    axios.post(URL + '/variable/activarinput', {
                        codigo: codigo,
                        idinput: idinput,
                        modificado: fecha + ' ' + horafinal,
                        variable_: idVariable.campo,
                        gestion: gestion.campo,
                    }).then(json => {
                        if (json.data.ok) {
                            setTimeout(() => {
                                listarInput(idIndicador.campo)
                                listar()
                            }, 1500)
                            setEstado(0)
                            alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: json.data.msg })
                        } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                    }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                }
            } else toast.error('Error Consulte con el administrador')
        }



        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //OTRAS CARASTERISTICAS

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////



        const insertarOtroInput = async () => {
            if (ordenInput.valido === 'true' && idInput.valido === 'true' && input.valido === 'true' && nivel.valido === 'true' &&
                idVariable.valido === 'true' && codigo && estado === 0 && ini.valido === 'true' && fin.valido === 'true' && gestion.valido === 'true') {
                let accion = await confirmarGuardar({ titulo: 'Añadir subvariable', boton: 'ok', texto: ' Ok para continuar...' })
                if (accion.isConfirmed) {
                    setModalCabecera(false)
                    setEstado(1)
                    setTexto('Guardando...')
                    axios.post(URL + '/variable/insertarotroinput', {
                        orden: ordenInput.campo,
                        codigo: codigo,
                        idinput: idInput.campo,
                        input: input.campo,
                        nivel: nivel.campo,
                        ini: ini.campo,
                        fin: fin.campo,
                        estado: estadoPadre,
                        gestion: gestion.campo,
                        variable_: idVariable.campo,
                        creado: fecha + ' ' + horafinal
                    }).then(json => {
                        if (json.data.ok) {
                            setTimeout(() => {
                                listarInput(idIndicador.campo)
                                listar()
                            }, 1500)
                            setInput({ campo: null, valido: null })
                            setEstadoPadre(null)
                            setIdInput({ campo: null, valido: null })
                            setOrdenInput({ campo: null, valido: null })
                            setNivel({ campo: null, valido: null })
                            setIni({ campo: new Date().getFullYear() + '-01-01', valido: 'true' })
                            setFin({ campo: new Date().getFullYear() + '-12-30', valido: 'true' })
                            setCodigo(null)
                            setEstado(0)
                            alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: json.data.msg })
                        } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0); }
                    }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                }
            } else toast.error('Complete el formulario')
        }


        return (
            <div style={{ background: '#e5e5e5', paddingTop: '0.4rem', paddingBottom: '0.4rem', height: '95vh' }} >
                {estado === 1 && <Load texto={texto} />}
                {ventana === 0 &&
                    <div className="container_">
                        <div className='contenedor-cabecera row'>

                            <span className='titulo' style={{}}>GEstiÓn de Formularios estadíticos SDIS-VE </span>

                        </div>
                        <div className='contenedor'>
                            <div className='row elementos-contenedor'>
                                <div className='col-4 col-sm-3 col-md-3 col-lg-3'>
                                    <Select1
                                        estado={gestion}
                                        cambiarEstado={setGestion}
                                        ExpresionRegular={INPUT.ID}
                                        lista={listaGestion}
                                        etiqueta={'Gestion'}
                                        msg='Seleccione una opcion'
                                    />
                                </div>
                                <div className='col-4 col-sm-3 col-md-3 col-lg-3'>
                                    <Select1
                                        estado={idRol}
                                        cambiarEstado={setIdRol}
                                        ExpresionRegular={INPUT.ID}
                                        lista={listaRol}
                                        etiqueta={'Rol'}
                                        msg='Seleccione una opcion'
                                        funcion={listar}
                                    />
                                </div>
                                {/* <div className='col-4 col-sm-3 col-md-3 col-lg-3'>
                                    <button className="btn-simple col-auto" onClick={() => listar()} >Cargar
                                    </button>
                                </div> */}
                                <div className='col-4 col-sm-6 col-md-6 col-lg-6'>
                                    <div className='contenedor-boton'>
                                        <button className="btn-nuevo col-auto" onClick={() => setModalRegistrar(true)} >
                                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faPlusCircle} />Nuevo
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="table table-responsive custom mb-2" style={{ height: '340px' }}>
                                <Table className="table table-sm ancho-tabla" >
                                    <thead>
                                        <tr >
                                            <th style={{ background: 'white', border: '2px solid  #006699 ', borderBottom: 'none' }} ></th>
                                            <th className="col-7 ">FORMULARIO SDIS-VE</th>
                                            <th className="col-1">GESTION</th>
                                            <th ></th>
                                            <th className="col-2">Nivel de Aplicación</th>

                                        </tr>
                                    </thead>
                                    <tbody >
                                        {lista.map((a) => (
                                            <tr key={a.id} className='item'>
                                                <th className='tooltip_' >
                                                    <span class="tooltiptext_">Adicionar Variables para este formulario</span>
                                                    <button type="button" class="adicionar" onClick={() => {
                                                        listarIndicadores(a.id);
                                                        setNombreVariable(a.variable);
                                                        setIdVariable({ campo: a.id, valido: 'true' })
                                                    }} style={{ cursor: 'pointer' }}>
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </button>
                                                </th>
                                                <td  >
                                                    {a.variable}
                                                </td>
                                                <td  >{a.gestion}</td>
                                                <td className='tooltip_' >
                                                    <span class="tooltiptext_">Ver Formulario </span>
                                                    <div style={{ cursor: 'pointer' }} className='row' onClick={() => {
                                                        setNombreVariable(a.variable);
                                                        listarIndicadoresParaFormulario(a.id); setEstadoVar(a.estado); setIdVarForm(a.id)
                                                    }}>
                                                        <div className='col-auto' >
                                                            {a.estado == 1 && <FontAwesomeIcon className='play-f' icon={faEye} />}
                                                            {a.estado == 0 && <FontAwesomeIcon className='stop-f' icon={faEye} />}
                                                        </div>
                                                    </div>

                                                </td>
                                                <td  >{a.rol}</td>
                                                <td className="largTable">
                                                    {a.eliminar == 0 && <FontAwesomeIcon icon={faTrashAlt} className='botonEliminar'
                                                        onClick={() => {
                                                            eliminar(a.id)
                                                        }} />}
                                                    <FontAwesomeIcon icon={faEdit} className='botonEditar'
                                                        onClick={() => {
                                                            setId({ campo: a.id, valido: 'true' });
                                                            setVariable({ campo: a.variable, valido: 'true' });
                                                            setModalEditar(true)
                                                        }} />
                                                    {/* </div> */}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </Table>
                                {lista.length < 1 && (idRol.valido === null || gestion.valido === null) ? <div style={{ fontSize: '18px' }}>SELECCIONE EL AÑO y ROL</div> : lista.length < 1 &&
                                    <div style={{ fontSize: '18px' }}>LISTA VACÍA</div>}
                            </div>
                            <div className='cantidad-registros'>{cantidad + ' Registro(s)'}</div>
                        </div>
                    </div>
                }
                {
                    ventana === 1 &&
                    <div className="container_">
                        {estado === 1 && ventana === 1 && <Load texto={texto} />}

                        <div className='contenedor-cabecera row'>
                            <span className='titulo'>{'CREACIÓN DE VARIABLES'}</span>
                            <p style={{ fontSize: '13px', marginBottom: '0' }} className='text-center'>{nombreVariable + ' ' + año}  </p>
                        </div>


                        <div className='contenedor' style={{ paddingTop: '0' }}>
                            <div className=' elementos-contenedor'>
                                <div className='contenedor-boton'>
                                    <button className="btn-nuevo" style={{ marginTop: '4px', marginBottom: '18px' }} onClick={() => setModalRegistrarVariable(true)} >
                                        <FontAwesomeIcon className='btn-icon-nuevo' icon={faPlusCircle} />Nuevo
                                    </button>
                                </div>
                            </div>
                            {/* <p className='nota'><span style={{ fontWeight: 'bold' }}>nota ::</span> las variables de un grupo tienen el mismo formato de cabecera</p>
                            <p className='alertas' >{' Tomar en cuenta !. Una variable puede ser añadido en cualquier fecha del año. La nueva variable heredará la clasificación de este cuaderno de variables.'}</p> */}

                            <div className="table table-responsive custom mb-2" style={{ height: '340px' }}>
                                <table className="table table-sm ancho-tabla" >
                                    <thead>
                                        <tr >
                                            <th style={{ background: 'white', border: '2px solid  #006699 ', borderBottom: 'none' }} ></th>
                                            <th className="col-4 ">VARIABLE</th>
                                            <th className="col-4">FORMULARIO</th>
                                            <th className="col-2">ESTADO</th>
                                            <th className="col-1">DESDE</th>
                                            <th className="col-1">HASTA</th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        {listaIndicador.map((a) => (
                                            <tr key={a.id} className='item' >
                                                <td className='tooltip_ '>
                                                    <span class="tooltiptext_">Adicionar sub-variables</span>
                                                    <button type="button" class="adicionar"
                                                        onClick={() => {
                                                            listarInput(a.id)
                                                            setIdIndicador({ campo: a.id, valido: 'true' });
                                                            listarIndicadoresAux(idVariable.campo);
                                                        }} style={{ cursor: 'pointer' }}>
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </button>
                                                </td>
                                                <td  >{a.indicador}</td>
                                                <td >{a.variable}</td>
                                                <td className='tooltip_'  >
                                                    {a.estado == 0 && <span class="tooltiptext_">variable desactivado. Click para activar...</span>}
                                                    {a.estado == 1 && <span class="tooltiptext_">variable activado. Click para desactivar...</span>}

                                                    <div style={{ cursor: 'pointer' }} className='row' onClick={() => {
                                                        a.estado === 0 ? activarIndicador(a.id) : desactivarIndicador(a.id)
                                                    }}>
                                                        <div className='col-auto' >
                                                            {a.estado == 1 && <FontAwesomeIcon className='play' icon={faPlay} />}
                                                            {a.estado == 0 && <FontAwesomeIcon className='stop' icon={faStop} />}
                                                        </div>
                                                        <div className='col-auto'>
                                                            <div className=' ver-form' style={{ cursor: 'pointer' }}>
                                                                {a.estado == 1 && <span>DISPONIBLE</span>}
                                                                {a.estado == 0 && <span>NO DISPONIBLE</span>}
                                                            </div>
                                                        </div>
                                                    </div>

                                                </td>
                                                <td >{a.ini}</td>
                                                <td >{a.fin}</td>
                                                <td className="largTable row ">
                                                    <div className='col-6'>
                                                        {a.eliminar == 0 && <FontAwesomeIcon icon={faTrashAlt} onClick={() => eliminarIndicador(a.id)} className='botonEliminar' />}
                                                    </div>
                                                    <div className='col-6'>

                                                        <FontAwesomeIcon icon={faEdit} className='botonEditar'
                                                            onClick={() => {
                                                                setIni({ campo: a.ini, valido: 'true' })
                                                                setFin({ campo: a.fin, valido: 'true' })
                                                                setIdIndicador({ campo: a.id, valido: 'true' });
                                                                setIndicador({ campo: a.indicador, valido: 'true' })
                                                                setModalActualizarVariable(true)
                                                            }} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                                {listaIndicador.length < 1 && <div style={{ fontSize: '18px' }}>Lista Vacia</div>}
                            </div>
                            <div className='cantidad-registros'>{cantidadIndicador + ' Registro(s)'}</div>
                        </div>
                    </div>
                }


                {
                    ventana === 2 &&
                    <div className="container_">
                        {estado === 1 && ventana === 2 && <Load texto={texto} />}

                        <div className='contenedor-cabecera row'>
                            <span className='titulo'>{'CREACIÓN DE SUBVARIABLES'}</span>
                            <p style={{ fontSize: '13px', marginBottom: '0' }} className='text-center'>{nombreVariable + ' ' + año}  </p>
                        </div>

                        <div className='contenedor' style={{ paddingTop: '0' }}>
                            <div className=' elementos-contenedor'>
                                <div className='contenedor-boton'>
                                    <button className="btn-nuevo" style={{ marginTop: '4px', marginBottom: '18px' }} onClick={() => setModalCabecera(true)} >
                                        <FontAwesomeIcon className='btn-icon-nuevo' icon={faPlusCircle} />Nuevo
                                    </button>
                                </div>
                            </div>

                            {/* <p className='nota'><span style={{ fontWeight: 'bold' }}>nota ::</span> {' Despues de eliminar o crear una cabecera, debe volver a iniciar este cuaderno'}</p>
                            <p className='alertas' >{'Tomar en cuenta !. Se recomienda realizar esta configuración al inicio de la gestion. Al crear o eliminar una cabecera se quitaran todos los valores de todas las variables de este cuaderno de la gestion ' + año + ' almacenados hasta la fecha. (Esta regla omite la accion actualizar cabecera) '}</p> */}
                            <div className="table table-responsive custom mb-2" style={{ height: '315px' }}>
                                <table className="table table-sm ancho-tabla" >
                                    <thead>
                                        <tr >
                                            <th style={{ background: 'white', border: '2px solid  #006699 ', borderBottom: 'none' }}  ></th>
                                            <th className="col-5 ">SUBVARIABLES</th>
                                            <th className="col-2">ESTADO</th>
                                            <th className="col-3  ">DESDE</th>
                                            <th className="col-3  ">HASTA</th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        {listaInput.map((a) => (

                                            <tr key={a.id} className={a.nivel === 1 ? `nivel1 item` :
                                                a.nivel === 2 ? `nivel2 item` : a.nivel === 3 ? `nivel3 item` : null} >
                                                <th className='tooltip_' >
                                                    <span class="tooltiptext_">Adicionar subvariable dependiente de esta</span>
                                                    {a.nivel < 3 && <button type="button" class="adicionar"
                                                        onClick={() => {
                                                            setOrdenInput({ campo: a.orden, valido: 'true' })
                                                            setIdInput({ campo: a.id, valido: 'true' })
                                                            setModalCabecera(true);
                                                            setCodigo(a.cod)
                                                            setNivel({ campo: a.nivel, valido: 'true' })
                                                            setNombreIndicador(a.input)
                                                            setEstadoPadre(a.estado)
                                                        }}
                                                        style={{ cursor: 'pointer' }}>
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </button>}
                                                </th>


                                                <td>
                                                    {a.nivel === 1 && <div>{a.input}</div>}
                                                    {a.nivel === 2 && <div style={{ paddingLeft: '20px' }}>{a.input}</div>}
                                                    {a.nivel === 3 && <div style={{ paddingLeft: '40px' }}>{a.input}</div>}
                                                </td>
                                                <td className='tooltip_'  >
                                                    {a.estado == 0 && <span class="tooltiptext_">subvariable desactivado . Click para activar...</span>}
                                                    {a.estado == 1 && <span class="tooltiptext_">subvariable activo. Click para desactivar...</span>}

                                                    <div style={{ cursor: 'pointer' }} className='row' onClick={() => {
                                                        a.estado === 0 ? activarInput(a.cod, a.id) : desactivarInput(a.cod, a.id)
                                                    }}>
                                                        <div className='col-auto' >
                                                            {a.estado == 1 && <FontAwesomeIcon className='play' icon={faPlay} />}
                                                            {a.estado == 0 && <FontAwesomeIcon className='stop' icon={faStop} />}
                                                        </div>
                                                        <div className='col-auto'>
                                                            <div className=' ver-form' style={{ cursor: 'pointer' }}>
                                                                {a.estado == 1 && <span>DISPONIBLE</span>}
                                                                {a.estado == 0 && <span>NO DISPONIBLE</span>}
                                                            </div>
                                                        </div>
                                                    </div>

                                                </td>

                                                {/* <td className="text-center">{a.nivel}</td> */}
                                                <td className="">{a.ini}</td>
                                                <td className="">{a.fin}</td>
                                                <td className=" largTable">
                                                    {a.tope == 1 && a.eliminar == 0 && <FontAwesomeIcon icon={faTrashAlt}
                                                        onClick={() => eliminarInput(a.cod, a.id)} className='botonEliminar' />}
                                                    <FontAwesomeIcon icon={faEdit} className='botonEditar'
                                                        onClick={() => {
                                                            setInput({ campo: a.input, valido: 'true' });
                                                            setPrincipal({ campo: a.id, valido: 'true' });
                                                            setIni({ campo: a.ini, valido: 'true' })
                                                            setFin({ campo: a.fin, valido: 'true' })
                                                            setCodigo(a.cod)
                                                            setIdInput({ campo: a.idinput, valido: 'true' })
                                                            setModalEditarCabecera(true)
                                                        }} />
                                                </td>
                                            </tr>


                                        ))}
                                    </tbody>

                                </table>
                                {listaInput.length < 1 && <div style={{ fontSize: '18px' }}>Lista Vacia</div>}
                            </div>
                            <div className='cantidad-registros'>{cantidadInput + ' Registro(s)'}</div>
                        </div>

                    </div>
                }
                {ventana === 3 &&
                    <div className="container_">
                        <div className='col-11 col-sm-12 col-md-10 col-lg-7 m-auto'>
                            <div className='contenedor-cabecera row' onClick={() => console.log(listaInput, 'lista input')}>
                                <span className='titulo'>{'FORMULARIO GENERADO'}</span>
                                <p style={{ fontSize: '13px', marginBottom: '0' }} className='text-center'>{nombreVariable + ' ' + año}  </p>
                            </div>
                            {listaInput.length > 0 ?
                                <div>{estadoVar ?
                                    <div className='leyenda-form'>
                                        Formulario Iniciado
                                    </div> :
                                    <div className='leyenda-form'>
                                        Formulario detenido
                                    </div>
                                }</div> :
                                <div className='leyenda-form'>
                                    Para iniciar las variables de este cuaderno debe crear al menos una clasificacion para las variables
                                </div>}
                            <div className='contenedor' style={{ paddingTop: '0' }}>
                                <div className="table table-responsive custom contenedor-formulario" style={{ minHeight: '340px' }}>

                                    <div className='tituloPrimarioFormulario' >{nombreVariable}</div>
                                    <div className='TituloSecundarioFormulario' >1XX. INDICE FAMILIAR DE ... (EJEMPLO)</div>

                                    {listaInput.map((a) => (
                                        a.estado == 1 &&
                                        <div key={a.id} className={a.nivel === 1 ? `nivel1F` :
                                            a.nivel === 2 ? `nivel2F` : a.nivel === 3 ? `nivel3F` :
                                                a.nivel === 4 ? `nivel4F` : a.nivel === 5 ? `nivel5F` : null}>

                                            {(a.tope === 0 && a.nivel === 1) && <div>{a.orden + '.' + a.input}</div>}
                                            {(a.tope === 0 && a.nivel > 1) && <div>{a.input}</div>}

                                            {a.tope === 1 && a.nivel === 1 &&
                                                <div className='row fila-sin-margen'>
                                                    <div className='col-8'><span>{a.nivel === 1 ? a.orden + '.' + a.input : a.input}</span></div>
                                                    <div className='col-4'>
                                                        <InputDinamico
                                                            type='text'
                                                            className="form-control form-control-sm"
                                                            id={'000PRUEBA'}
                                                            placeholder={0}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                            }
                                            {a.tope === 1 && a.nivel > 1 &&
                                                <div className='row fila-sin-margen'>
                                                    <div className='col-8'><span>{a.nivel === 1 ? a.orden + '.' + a.input : a.input}</span></div>
                                                    <div className='col-4'>
                                                        <InputDinamico
                                                            type='text'
                                                            className="form-control form-control-sm"
                                                            id={'000PRUEBA'}
                                                            placeholder={0}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    ))}


                                    {listaInput.length < 1 && < div style={{ fontSize: '18px' }}>Documento no habilitado para su edicion</div>}


                                </div >
                            </div >
                            <div className='botonModal row pb-3'>
                                <div className='col-auto'>
                                    <button className="form-cerrar" onClick={() => { setVentana(0); setListaInput([]) }}>
                                        cerrar
                                    </button>
                                </div>
                                {listaInput.length > 0 && <>

                                    {estadoVar == 1 ?
                                        <div className='col-auto'>
                                            <button className="detener" onClick={() => detener(idVarForm)}>
                                                Detener Formulario
                                            </button>
                                        </div> :
                                        <div className='col-auto'>
                                            <button className="btn-nodisponible" onClick={() => iniciarVariable(idVarForm)}>
                                                Iniciar formulario
                                            </button>
                                        </div>
                                    }

                                </>}
                            </div>
                        </div>
                    </div>
                }

                {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////// */}




                <Modal isOpen={modalRegistrar}>
                    <ModalHeader toggle={() => {
                        setModalRegistrar(false)
                    }}> <p style={{ fontSize: '14px' }}>AÑADIR NOMBRE DE FORMULARIO</p>
                        <h6 > {'GESTIÓN  ' + año}</h6>
                        {listaRol.length > 0 && <> {listaRol.map(e => (
                            e.id == idRol.campo &&
                            <h5 style={{ fontSize: '12px' }}> {'ROl (' + e.nombre + ')'}</h5>
                        ))}
                        </>
                        }

                    </ModalHeader>
                    <ModalBody>

                        <InputUsuario
                            estado={variable}
                            cambiarEstado={setVariable}
                            placeholder="FORMULARIO"
                            ExpresionRegular={INPUT.VARIABLE}  //expresion regular  
                            etiqueta='Formulario'
                            msg={'Este campo acepta letras, numero y algunos caracteres'}
                        />
                        <div className='row'>
                            <div className='col-6'>
                                <Select1
                                    estado={gestion}
                                    cambiarEstado={setGestion}
                                    ExpresionRegular={INPUT.ID}
                                    lista={listaGestion}
                                    etiqueta={'Gestion'}
                                    msg='Seleccione una opcion'
                                />
                            </div>
                            <div className='col-6'>
                                <Select1
                                    estado={idRol}
                                    cambiarEstado={setIdRol}
                                    ExpresionRegular={INPUT.ID}
                                    lista={listaRol}
                                    etiqueta={'Rol'}
                                    msg='Seleccione una opcion'
                                />
                            </div>

                        </div>
                    </ModalBody>
                    <div className='botonModal'>
                        <button className="btn-guardar col-auto" onClick={() => registrar()} >
                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faSave} /> Guardar
                        </button>
                    </div>
                </Modal>

                <Modal isOpen={modalEditar}>
                    <ModalHeader toggle={() => {
                        setModalEditar(false)
                    }}>  <p style={{ fontSize: '14px' }}>ACTUALIZAR NOMBRE DE FORMULARIO</p>
                        <h6 > {'GESTIÓN  ' + año}</h6>
                        {listaRol.length > 0 && <> {listaRol.map(e => (
                            e.id == idRol.campo &&
                            <h5 style={{ fontSize: '12px' }}> {'ROl (' + e.nombre + ')'}</h5>
                        ))}
                        </>
                        }
                    </ModalHeader>
                    <ModalBody>
                        <InputUsuario
                            estado={variable}
                            cambiarEstado={setVariable}
                            placeholder="FORMULARIO"
                            ExpresionRegular={INPUT.VARIABLE}  //expresion regular  
                            etiqueta='Formulario'
                            msg={'Este campo acepta letras, numero y algunos caracteres'}
                        />
                    </ModalBody>
                    <div className='botonModal'>
                        <button className="btn-editar col-auto" onClick={() => actualizar()} >
                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faEdit} />Actualizar
                        </button>
                    </div>
                </Modal>




                {/* ////////////////////////////////////////////////////////////////////////////////////////// */}
                <Modal isOpen={modalRegistrarVariable}>
                    <ModalHeader toggle={() => {
                        setModalRegistrarVariable(false)
                    }}> <p style={{ fontSize: '14px' }}>AÑADIR VARIABLE</p>
                        <h5 style={{ fontSize: '12px' }}> {nombreVariable + '  ' + año}</h5>


                    </ModalHeader>
                    <ModalBody>

                        <InputUsuario
                            estado={indicador}
                            cambiarEstado={setIndicador}
                            placeholder="VARIABLE"
                            ExpresionRegular={INPUT.FILACOLUMNA}  //expresion regular  
                            etiqueta='Variable'
                            msg={'Este campo acepta letras, numero y algunos caracteres'}
                        />
                        <div className='row'>
                            <span style={{ fontStyle: 'italic' }}> Tiempo habilitado</span>
                            <div className='col-6'>
                                <InputUsuario
                                    estado={ini}
                                    tipo='date'
                                    cambiarEstado={setIni}
                                    ExpresionRegular={INPUT.FECHA}  //expresion regular  
                                    etiqueta='Desde'
                                    msg={'Este campo acepta fechas'}
                                />
                            </div>
                            <div className='col-6'>
                                <InputUsuario
                                    estado={fin}
                                    tipo='date'
                                    cambiarEstado={setFin}
                                    ExpresionRegular={INPUT.FECHA}  //expresion regular  
                                    etiqueta='Hasta'
                                    msg={'Este campo acepta fechas'}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <div className='botonModal'>
                        <button className="btn-guardar col-auto" onClick={() => insertarIndicador()}  >
                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faSave} /> Guardar
                        </button>
                    </div>
                </Modal>

                <Modal isOpen={modalActualizarVariable}>
                    <ModalHeader toggle={() => {
                        setModalActualizarVariable(false);
                        setIdInput({ campo: null, valido: null });
                        setOrden({ campo: null, valido: null })
                        setInput({ campo: null, valido: null })
                        setIni({ campo: new Date().getFullYear() + '-01-01', valido: 'true' })
                        setFin({ campo: new Date().getFullYear() + '-12-30', valido: 'true' })
                    }}> <p style={{ fontSize: '14px' }}>ACTUALIZAR VARIABLE</p>
                        <h5 style={{ fontSize: '12px' }}> {nombreVariable + '  ' + año}</h5>

                    </ModalHeader>
                    <ModalBody>

                        <InputUsuario
                            estado={indicador}
                            cambiarEstado={setIndicador}
                            placeholder="VARIABLE"
                            ExpresionRegular={INPUT.FILACOLUMNA}  //expresion regular  
                            etiqueta='Variable'
                            msg={'Este campo acepta letras, numero y algunos caracteres'}
                        />
                        <div className='row'>
                            <span style={{ fontStyle: 'italic' }}> Tiempo habilitado</span>
                            <div className='col-6'>
                                <InputUsuario
                                    estado={ini}
                                    tipo='date'
                                    cambiarEstado={setIni}
                                    ExpresionRegular={INPUT.FECHA}  //expresion regular  
                                    etiqueta='Desde'
                                    msg={'Este campo acepta fechas'}
                                />
                            </div>
                            <div className='col-6'>
                                <InputUsuario
                                    estado={fin}
                                    tipo='date'
                                    cambiarEstado={setFin}
                                    ExpresionRegular={INPUT.FECHA}  //expresion regular  
                                    etiqueta='Hasta'
                                    msg={'Este campo acepta fechas'}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <div className='botonModal'>
                        <button className="btn-editar col-auto" onClick={() => actualizarIndicador()} >
                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faEdit} /> Actualizar
                        </button>
                    </div>
                </Modal>

                <Modal isOpen={modalCabecera}>
                    <ModalHeader toggle={() => {
                        setModalCabecera(false); setIdInput({ campo: null, valido: null }); setNombreIndicador(null); setNivel({ campo: null, nivel: null })
                    }}>
                        <p style={{ fontSize: '14px' }}>AÑADIR SUBVARIABLE</p>
                        {/* <h5> {nombreVariable + '  ' + año}</h5> */}
                        <h5 style={{ fontSize: '12px' }}> {nombreIndicador ? 'Antecesor  ' + nombreIndicador : 'Antecesor: Elemento primario'}</h5>



                    </ModalHeader>
                    <ModalBody>
                        <InputUsuario
                            estado={input}
                            cambiarEstado={setInput}
                            placeholder="SUBVARIABLE"
                            ExpresionRegular={INPUT.VARIABLE}  //expresion regular  
                            etiqueta='subvariable'
                            msg={'Este campo acepta letras, numero y algunos caracteres'}
                        />
                        <div className='row'>
                            <span style={{ fontStyle: 'italic' }}> Tiempo habilitado</span>
                            <div className='col-6'>
                                <InputUsuario
                                    estado={ini}
                                    tipo='date'
                                    cambiarEstado={setIni}
                                    ExpresionRegular={INPUT.FECHA}  //expresion regular  
                                    etiqueta='Desde'
                                    msg={'Este campo acepta fechas'}
                                />
                            </div>
                            <div className='col-6'>
                                <InputUsuario
                                    estado={fin}
                                    tipo='date'
                                    cambiarEstado={setFin}
                                    ExpresionRegular={INPUT.FECHA}  //expresion regular  
                                    etiqueta='Hasta'
                                    msg={'Este campo acepta fechas'}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <div className='botonModal'>
                        <button className="btn-guardar col-auto" onClick={() => nivel.campo ? insertarOtroInput() : insertarInput()} >
                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faSave} />Guardar
                        </button>
                    </div>
                </Modal>

                <Modal isOpen={modalEditarCabecera}>
                    <ModalHeader toggle={() => {
                        setModalEditarCabecera(false)
                        setIdInput({ campo: null, valido: null })
                        setInput({ campo: null, valido: null })
                        setPrincipal({ campo: null, valido: null })
                        setNivel({ campo: null, valido: null })

                    }}><p style={{ fontSize: '14px' }}>ACTUALIZAR SUBVARIABLE</p>
                        {/* <h5> {nombreVariable + '  ' + año}</h5> */}
                        {/* <h5 style={{ fontSize: '13px' }}> {nombreIndicador ? 'Antecesor  ' + nombreIndicador : 'Antecesor: Elemento primario'}</h5> */}

                    </ModalHeader>
                    <ModalBody>
                        <InputUsuario
                            estado={input}
                            cambiarEstado={setInput}
                            placeholder="SUBVARIABLE"
                            ExpresionRegular={INPUT.VARIABLE}  //expresion regular  
                            etiqueta='Subvariable'
                            msg={'Este campo acepta letras, numero y algunos caracteres'}
                        />
                        <div className='row'>
                            <span style={{ fontStyle: 'italic' }}> Tiempo habilitado</span>
                            <div className='col-6'>
                                <InputUsuario
                                    estado={ini}
                                    tipo='date'
                                    cambiarEstado={setIni}
                                    ExpresionRegular={INPUT.FECHA}  //expresion regular  
                                    etiqueta='Desde'
                                    msg={'Este campo acepta fechas'}
                                />
                            </div>
                            <div className='col-6'>
                                <InputUsuario
                                    estado={fin}
                                    tipo='date'
                                    cambiarEstado={setFin}
                                    ExpresionRegular={INPUT.FECHA}  //expresion regular  
                                    etiqueta='Hasta'
                                    msg={'Este campo acepta fechas'}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <div className='botonModal'>
                        <button className="btn-editar col-auto" onClick={() => actualizarInput()} >
                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faEdit} />Actualizar
                        </button>
                    </div>
                </Modal>
            </div >
        );

    } catch (error) {
        setEstado(0);// auth.logout()
        setEstado(0)
    }

}
export default Variable;
