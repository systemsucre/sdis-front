import React from 'react';
import { Modal, ModalBody, ModalHeader, Table } from 'reactstrap';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faHandPointRight, faPlusCircle, faRecycle, faSave, faTrashAlt, faWindowClose } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../Auth/useAuth"
import { InputUsuario, Select1, } from '../elementos/elementos';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados
import { useState, useEffect } from "react";
import { URL, INPUT } from '../Auth/config';
import axios from 'axios';
import { toast } from 'react-hot-toast'
import '../elementos/estilos.css'
import { alert2, confirmarActualizar, confirmarEliminar, confirmarGuardar } from '../elementos/alert2'
import Load from '../elementos/load'


function Variable() {
    const auth = useAuth()



    const [ventana, setVentana] = useState(0);
    const [lista, setLista] = useState([]);
    const [listaRol, setListaRol] = useState([]);
    const [listaGestion, setListaGestion] = useState([]);
    const [variable, setVariable] = useState({ campo: null, valido: null });
    const [id, setId] = useState({ campo: null, valido: null })
    const [gestion, setGestion] = useState({ campo: null, valido: null })
    const [idRol, setIdRol] = useState({ campo: null, valido: null })
    const [rol, setRol] = useState(null)

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


    const [estado, setEstado] = useState(0);
    const [texto, setTexto] = useState(0);


    //INDICADORES
    const [idVariable, setIdVariable] = useState({ campo: null, valido: null })
    const [idIndicador, setIdIndicador] = useState({ campo: null, valido: null })
    const [indicador, setIndicador] = useState({ campo: null, valido: null })
    const [idIndicadores, setIdIndicadores] = useState(new Array())



    // INPUT

    const [idInput, setIdInput] = useState({ campo: null, valido: null })
    const [ordenInput, setOrdenInput] = useState({ campo: null, valido: null })
    const [orden, setOrden] = useState({ campo: null, valido: null })
    const [nivel, setNivel] = useState({ campo: null, valido: null })
    const [input, setInput] = useState({ campo: null, valido: null })
    const [idPrincipal, setPrincipal] = useState({ campo: null, valido: null })
    const [codigo, setCodigo] = useState(null)


    const [listaIndicador, setListaIndicador] = useState([]);
    const [listaInput, setListaInput] = useState([]);
    const [cantidadIndicador, setCantidadIndicador] = useState(0);
    const [cantidadInput, setCantidadInput] = useState(0);







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

    try {
        useEffect(() => {
            document.title = 'VARIABLES'
            if (lista.length === 0) {
                listarInicio()
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
        const listarInicio = async () => {
            setEstado(1)
            setTexto('Cargando...')
            setListaGestion([{ id: 1, nombre: fecha.split('-')[0] }])
            setListaRol([{ id: 5, nombre: 'ESTABLECIMIENTO' }])
            setAño(fecha.split('-')[0])
            setRol('ESTABLECIMIENTO')

            setGestion({ campo: 1, valido: 'true' })
            setIdRol({ campo: 5, valido: 'true' })
            axios.post(URL + '/variable/listarinicio', { gestion: fecha.split('-')[0], rol_: 5 }).then(json => {
                if (json.data.ok) {
                    setLista(json.data.data[0])
                    setCantidad(json.data.data[1])
                    setEstado(0)
                } else { alert2({ icono: 'warning', titulo: 'Operacion fallida o acceso denegado', boton: 'ok', texto: json.data.msg }); setEstado(0) }
            }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }
        const listarGestion = async () => {
            axios.post(URL + '/variable/listargestion').then(json => {
                if (json.data.ok) {
                    setListaGestion(json.data.data[0])
                    setListaRol(json.data.data[1])
                } else alert2({ icono: 'warning', titulo: 'Operacion fallida o acceso denegado', boton: 'ok', texto: json.data.msg })
            }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }
        const listar = async () => {
            setEstado(1)
            setTexto('Cargando...')
            if ((gestion.valido === 'true' || año) && idRol.valido === 'true') {
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
                    } else alert2({ icono: 'warning', titulo: 'Operacion fallida o acceso denegado', boton: 'ok', texto: json.data.msg })
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            } else { toast.error('Seleccione la gestion y el rol'); setEstado(0) }
        }



        const registrar = async (a) => {
            if ((gestion.valido === 'true' || año !== null) && variable.valido === 'true' && estado === 0) {
                let accion = await confirmarGuardar({ titulo: 'Registrar Grupo', boton: 'ok', texto: 'Ok para continuar...' })
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
                let accion = await confirmarActualizar({ titulo: 'Actualizar Grupo', boton: 'ok', texto: 'Ok para continuar...' })
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







        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //INDICADORES

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
                    } else { alert2({ icono: 'warning', titulo: 'Operacion fallida o acceso denegado', boton: 'ok', texto: json.data.msg }); setVentana(0); setEstado(0) }
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
                            console.log(e, 'datos asignados')
                        })
                    } else { alert2({ icono: 'warning', titulo: 'Operacion fallida o acceso denegado', boton: 'ok', texto: json.data.msg }); setVentana(0); setEstado(0) }
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            }
        }


        const insertarIndicador = async () => {
            if (indicador.valido === 'true' && idVariable.valido === 'true' && estado === 0) {
                let accion = await confirmarGuardar({ titulo: 'Añadir variable', boton: 'ok', texto: 'Ok para continuar...' })
                if (accion.isConfirmed) {
                    setEstado(1)
                    setTexto('Guardando...')
                    axios.post(URL + '/variable/insertarindicador', {
                        variable1: idVariable.campo,
                        indicador: indicador.campo,
                        creado: fecha + ' ' + horafinal
                    }).then(json => {
                        if (json.data.ok) {
                            setListaIndicador(json.data.data[0])
                            // console.log(json.data.data[0])
                            listarInputAux(json.data.data[0][0].id, json.data.data[1])
                            // console.log(json.data.data[0][0].id, 'id primer indicador')
                            // setCantidadIndicador(json.data.data[0].length)
                            setIndicador({ campo: null, valido: null })
                            setModalRegistrarVariable(false)
                            setEstado(0)

                            alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: json.data.msg })
                        } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                    }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });

                }
            } else toast.error('Escriba correctamente la varialbe')
        }
        const actualizarIndicador = async () => {
            if (idIndicador.valido === 'true' && indicador.valido === 'true' && idVariable.valido === 'true') {
                let accion = await confirmarActualizar({ titulo: 'Actualizar variable', boton: 'ok', texto: 'Ok para continuar...' })
                if (accion.isConfirmed) {
                    setEstado(1)
                    setTexto('Actualizando...')
                    axios.post(URL + '/variable/actualizarindicador', {
                        id: idIndicador.campo,
                        variable1: idVariable.campo,
                        indicador: indicador.campo,
                        modificado: fecha + ' ' + horafinal
                    }).then(json => {
                        if (json.data.ok) {
                            setListaIndicador(json.data.data[0])
                            setCantidadIndicador(json.data.data[1])
                            setIndicador({ campo: null, valido: null })
                            setIdIndicador({ campo: null, valido: null })
                            setModalActualizarVariable(false)
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
                    setTexto('Actualizando...')
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



        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //CARASTERISTICAS

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
                                axios.post(URL + '/variable/anadirnuevosinput', {
                                    indicador: nuevoInd,
                                    variable_: idVariable.campo,
                                    lista: data,
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
                                                                                            } else alert2({ icono: 'warning', titulo: 'Operacion fallida o acceso denegado', boton: 'ok', texto: json2.data.msg })
                                                                                        })
                                                                                    }
                                                                                })
                                                                            })
                                                                        } else alert2({ icono: 'warning', titulo: 'Operacion fallida o acceso denegado', boton: 'ok', texto: json2.data.msg })
                                                                    })
                                                                }
                                                            })
                                                        })
                                                    } else alert2({ icono: 'warning', titulo: 'Operacion fallida o acceso denegado', boton: 'ok', texto: json2.data.msg })
                                                })
                                            }
                                        })
                                    })
                                } else alert2({ icono: 'warning', titulo: 'Operacion fallida o acceso denegado', boton: 'ok', texto: json2.data.msg })
                            })
                        })
                        setEstado(0)
                    } else { alert2({ icono: 'warning', titulo: 'Operacion fallida o acceso denegado', boton: 'ok', texto: json1.data.msg }); setEstado(0) }
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); })
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
                                                                                            } else alert2({ icono: 'warning', titulo: 'Operacion fallida o acceso denegado', boton: 'ok', texto: json2.data.msg })
                                                                                        })
                                                                                    }
                                                                                })
                                                                            })
                                                                        } else alert2({ icono: 'warning', titulo: 'Operacion fallida o acceso denegado', boton: 'ok', texto: json2.data.msg })
                                                                    })
                                                                }
                                                            })
                                                        })
                                                    } else alert2({ icono: 'warning', titulo: 'Operacion fallida o acceso denegado', boton: 'ok', texto: json2.data.msg })
                                                })
                                            }
                                        })
                                    })
                                } else alert2({ icono: 'warning', titulo: 'Operacion fallida o acceso denegado', boton: 'ok', texto: json2.data.msg })
                            })
                        })
                        setEstado(0)
                    } else { alert2({ icono: 'warning', titulo: 'Operacion fallida o acceso denegado', boton: 'ok', texto: json1.data.msg }); setEstado(0) }
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });

            } else toast.error('Añade porlomenos un indicador')
        }

        const insertarInput = async () => {
            console.log(input, estado, idVariable, idIndicadores)
            if (input.valido === 'true' && estado === 0 && idVariable.valido === 'true' && idIndicadores.length > 0) {
                let accion = await confirmarGuardar({ titulo: 'Añadir Cabecera', boton: 'ok', texto: 'Ok para continuar...' })
                if (accion.isConfirmed) {
                    setEstado(1)
                    setTexto('Guardando...')
                    axios.post(URL + '/variable/insertarinput', {
                        input: input.campo,
                        variable_: idVariable.campo,
                        listaInd: idIndicadores,
                        creado: fecha + ' ' + horafinal
                    }).then(json => {
                        if (json.data.ok) {
                            setTimeout(() => {
                                listarInput(idIndicador.campo)
                            }, 700)
                            setInput({ campo: null, valido: null })
                            setOrden({ campo: null, valido: null })
                            setEstado(0)
                            setModalCabecera(false)
                            alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: json.data.msg })
                        } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                    }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                }
            } else toast.error('Complete el formulario')
        }

        const actualizarInput = async () => {
            if (idIndicador.valido === 'true') {
                if (input.valido === 'true' && idInput.valido === 'true' && codigo && idPrincipal.valido === 'true') {
                    let accion = await confirmarActualizar({ titulo: 'Actualizar Cabecera', boton: 'ok', texto: 'Ok para continuar...' })
                    if (accion.isConfirmed) {
                        setEstado(1)
                        setTexto('Actualizando...')
                        axios.post(URL + '/variable/actualizarinput', {
                            idinput: idInput.campo,
                            input: input.campo,
                            id: idPrincipal.campo,
                            codigo: codigo,
                            modificado: fecha + ' ' + horafinal
                        }).then(json => {
                            if (json.data.ok) {
                                setTimeout(() => {
                                    listarInput(idIndicador.campo)
                                }, 700)
                                setInput({ campo: null, valido: null })
                                setPrincipal({ campo: null, valido: null })
                                setIdInput({ campo: null, valido: null })
                                setModalEditarCabecera(false)
                                setCodigo(0)
                                setEstado(0)
                                alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: json.data.msg })
                            } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                        }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                    }
                } else toast.error('Complete el formulario')
            } else toast.error('No se ha encontrado el Indicador')
        }


        const eliminarInput = async (codigo) => {
            if (codigo) {
                let accion = await confirmarEliminar({ titulo: 'Eliminar esta Cabecera', boton: 'ok', texto: 'Ok para continuar...' })
                if (accion.isConfirmed) {
                    setEstado(1)
                    setTexto('Eliminando...')
                    axios.post(URL + '/variable/eliminarinput', {
                        codigo: codigo,
                        modificado: fecha + ' ' + horafinal
                    }).then(json => {
                        if (json.data.ok) {
                            setTimeout(() => {
                                listarInput(idIndicador.campo)
                            }, 700)
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
                idVariable.valido === 'true' && codigo && estado === 0) {
                let accion = await confirmarGuardar({ titulo: 'Añadir Cabecera', boton: 'ok', texto: 'Ok para continuar...' })
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
                        variable_: idVariable.campo,
                        creado: fecha + ' ' + horafinal
                    }).then(json => {
                        if (json.data.ok) {
                            listarInput(idIndicador.campo)
                            setInput({ campo: null, valido: null })
                            setIdInput({ campo: null, valido: null })
                            setOrdenInput({ campo: null, valido: null })
                            setNivel({ campo: null, valido: null })
                            setCodigo(null)
                            setEstado(0)
                            alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: json.data.msg })
                        } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0); }
                    }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                }
            } else toast.error('Complete el formulario')
        }


        return (
            <div>
                {ventana === 0 &&
                    <div className="container_">
                        {estado === 1 && ventana === 0 && <Load texto={texto} />}

                        <div className='contenedor-cabecera row'>
                            <div className='contenedor-titulo col-6'>
                                <div className='titulo-pagina' >

                                    <p> {'GRUPO VARIABLES'}</p>

                                </div>
                            </div>
                            <div className='contenedor-boton col-6'>
                                <button className="btn-nuevo col-auto" onClick={() => setModalRegistrar(true)} >
                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faPlusCircle} />Nuevo
                                </button>
                            </div>

                        </div>

                        <div className='contenedor'>
                            <div className='row'>
                                <div className='col-3'>
                                    <Select1
                                        estado={gestion}
                                        cambiarEstado={setGestion}
                                        ExpresionRegular={INPUT.ID}
                                        lista={listaGestion}
                                        etiqueta={'Gestion'}
                                        msg='Seleccione una opcion'
                                    />
                                </div>
                                <div className='col-5'>
                                    <Select1
                                        estado={idRol}
                                        cambiarEstado={setIdRol}
                                        ExpresionRegular={INPUT.ID}
                                        lista={listaRol}
                                        etiqueta={'Rol'}
                                        msg='Seleccione una opcion'
                                    />
                                </div>
                                <div className='col-3'>
                                    <button className="btn-simple col-auto" onClick={() => listar()} >Cargar
                                    </button>
                                </div>
                            </div>

                            <div className="table table-responsive custom mb-2" style={{ height: 'auto' }}>
                                <Table className="table table-sm" >
                                    <thead>
                                        <tr >
                                            <th className="col-5 ">GRUPO</th>
                                            <th className="col-3">GESTION</th>
                                            <th className="col-3">ASIGNACION</th>

                                            <th className="col-1  "></th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        {lista.map((a) => (
                                            <tr key={a.id} >

                                                <td className='cantidad-registros' style={{ cursor: 'pointer' }} onClick={() => {
                                                    listarIndicadores(a.id);
                                                    setNombreVariable(a.variable);
                                                    setIdVariable({ campo: a.id, valido: 'true' })
                                                }}>  <div className='cantidad-registros' style={{ cursor: 'pointer' }}>
                                                        <FontAwesomeIcon icon={faHandPointRight} /> {a.variable}
                                                    </div></td>
                                                <td  >{a.gestion}</td>
                                                <td  >{a.rol}</td>
                                                <td className="largTable">
                                                    <FontAwesomeIcon icon={faTrashAlt} onClick={() => eliminar(a.id)} className='botonEliminar' />
                                                    <FontAwesomeIcon icon={faEdit} className='botonEditar'
                                                        onClick={() => {
                                                            setId({ campo: a.id, valido: 'true' });
                                                            setVariable({ campo: a.variable, valido: 'true' });
                                                            setModalEditar(true)
                                                        }} />
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>

                                </Table>
                                {lista.length < 1 && <div style={{ fontSize: '18px' }}>Lista Vacia</div>}
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

                            <div className='contenedor-titulo col-6'>
                                <div className='titulo-pagina' >
                                    <p > {'GESTIONAR VARIABLES'}</p>
                                    <p style={{ fontSize: '13px' }}> {nombreVariable + ' ' + año}</p>
                                </div>
                            </div>
                            <div className='contenedor-boton col-6'>

                                <button className="btn-nuevo col-auto" onClick={() => setModalRegistrarVariable(true)} >
                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faPlusCircle} />Nuevo
                                </button>
                            </div>

                        </div>

                        <div className='contenedor m-2'>
                            <div className="table table-responsive custom mb-2" style={{ height: 'auto' }}>
                                <table className="table table-sm" >
                                    <thead>
                                        <tr >
                                            <th className="col-5 ">VARIABLE</th>
                                            <th className="col-3">GRUPO</th>
                                            <th className="col-1  "></th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        {listaIndicador.map((a) => (
                                            <tr key={a.id} >

                                                <td onClick={() => {
                                                    listarInput(a.id)
                                                    setIdIndicador({ campo: a.id, valido: 'true' });
                                                    listarIndicadoresAux(idVariable.campo);
                                                }} >
                                                    <div className='cantidad-registros' style={{ cursor: 'pointer' }}><FontAwesomeIcon icon={faHandPointRight} /> {a.indicador}</div>
                                                </td>
                                                <td >{a.variable}</td>
                                                <td className="largTable ">
                                                    <FontAwesomeIcon icon={faTrashAlt} onClick={() => eliminarIndicador(a.id)} className='botonEliminar' />
                                                    <FontAwesomeIcon icon={faEdit} className='botonEditar'
                                                        onClick={() => {
                                                            setIdIndicador({ campo: a.id, valido: 'true' });
                                                            setIndicador({ campo: a.indicador, valido: 'true' })
                                                            setModalActualizarVariable(true)
                                                        }} />
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

                            <div className='contenedor-titulo col-6'>
                                <div className='titulo-pagina' >
                                    <p > {'GESTIONAR CABECERAS'}</p>
                                    <p style={{ fontSize: '13px' }} > {nombreVariable + ' ' + año}</p>

                                </div>
                            </div>
                            <div className='contenedor-boton col-6'>
                                <button className="btn-nuevo col-auto" onClick={() => setModalCabecera(true)} >
                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faPlusCircle} />Nuevo
                                </button>
                            </div>
                        </div>

                        <div className='contenedor m-2'>
                            <div className="table table-responsive custom mb-2" style={{ height: 'auto' }}>
                                <table className="table table-sm" >
                                    <thead>
                                        <tr >
                                            <th className="col-1 " ></th>
                                            <th className="col-5 ">CABECERA</th>
                                            <th className="col-1 ">PROFUNDIDAD</th>
                                            <th className="col-2  "></th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        {listaInput.map((a) => (

                                            <tr key={a.id} className={a.nivel === 1 ? `nivel1` :
                                                a.nivel === 2 ? `nivel2` : a.nivel === 3 ? `nivel3` :
                                                    a.nivel === 4 ? `nivel4` : a.nivel === 5 ? `nivel5` : null}>
                                                <td onClick={() => {
                                                    setOrdenInput({ campo: a.orden, valido: 'true' })
                                                    setIdInput({ campo: a.id, valido: 'true' })
                                                    setModalCabecera(true);
                                                    setCodigo(a.cod)
                                                    setNivel({ campo: a.nivel, valido: 'true' })
                                                    setNombreIndicador(a.input)
                                                }}><div className='cantidad-registros' style={{ cursor: 'pointer' }}>Incluir otro</div></td>
                                                <td >{a.input}</td>
                                                <td className="text-center">{a.nivel}</td>
                                                <td className=" largTable">
                                                    <FontAwesomeIcon icon={faTrashAlt}
                                                        onClick={() => eliminarInput(a.cod)} className='botonEliminar' />
                                                    <FontAwesomeIcon icon={faEdit} className='botonEditar'
                                                        onClick={() => {
                                                            setInput({ campo: a.input, valido: 'true' });
                                                            setPrincipal({ campo: a.id, valido: 'true' });
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
                    }}> <p>AÑADIR GRUPO</p>
                        <h5 > {'GESTIÓN  ' + año}</h5>
                        {listaRol.length > 0 && <> {listaRol.map(e => (
                            e.id == idRol.campo &&
                            <h5> {'ROl (' + e.nombre + ')'}</h5>
                        ))}
                        </>
                        }

                    </ModalHeader>
                    <ModalBody>

                        <InputUsuario
                            estado={variable}
                            cambiarEstado={setVariable}
                            placeholder="GRUPO"
                            ExpresionRegular={INPUT.VARIABLE}  //expresion regular  
                            etiqueta='Grupo'
                            msg={'Este campo acepta letras, numero y algunos caracteres'}
                        />
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
                    }}>  <p>ACTUALIZAR GRUPO</p>
                        <h5 > {'GESTIÓN  ' + año}</h5>
                        {listaRol.length > 0 && <> {listaRol.map(e => (
                            e.id == idRol.campo &&
                            <h5> {'ROl (' + e.nombre + ')'}</h5>
                        ))}
                        </>
                        }
                    </ModalHeader>
                    <ModalBody>
                        <InputUsuario
                            estado={variable}
                            cambiarEstado={setVariable}
                            placeholder="GRUPO"
                            ExpresionRegular={INPUT.VARIABLE}  //expresion regular  
                            etiqueta='Grupo'
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
                    }}> <p>AÑADIR VARIABLE</p>
                        <h5> {nombreVariable + '  ' + año}</h5>


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
                    }}> <p>ACTUALIZAR VARIABLE</p>
                        <h5> {nombreVariable + '  ' + año}</h5>

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
                    </ModalBody>
                    <div className='botonModal'>
                        <button className="btn-editar col-auto" onClick={() => actualizarIndicador()} >
                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faEdit} /> Actualizar
                        </button>
                    </div>
                </Modal>



                <Modal isOpen={modalCabecera}>
                    <ModalHeader toggle={() => {
                        setModalCabecera(false); setIdInput({ campo: null, valido: null }); setNombreIndicador(null);
                    }}>
                        <p>AÑADIR CABECERA</p>
                        <h5> {nombreVariable + '  ' + año}</h5>
                        <h5 style={{ fontSize: '13px' }}> {nombreIndicador ? 'Antecesor  ' + nombreIndicador : 'Antecesor: Elemento primario'}</h5>



                    </ModalHeader>
                    <ModalBody>
                        <InputUsuario
                            estado={input}
                            cambiarEstado={setInput}
                            placeholder="Cabecera"
                            ExpresionRegular={INPUT.VARIABLE}  //expresion regular  
                            etiqueta='Cabecera'
                            msg={'Este campo acepta letras, numero y algunos caracteres'}
                        />
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

                    }}><p>ACTUALIZAR CABECERA</p>
                        <h5> {nombreVariable + '  ' + año}</h5>
                        {/* <h5 style={{ fontSize: '13px' }}> {nombreIndicador ? 'Antecesor  ' + nombreIndicador : 'Antecesor: Elemento primario'}</h5> */}

                    </ModalHeader>
                    <ModalBody>
                        <InputUsuario
                            estado={input}
                            cambiarEstado={setInput}
                            placeholder="Cabecera"
                            ExpresionRegular={INPUT.VARIABLE}  //expresion regular  
                            etiqueta='Cabecera'
                            msg={'Este campo acepta letras, numero y algunos caracteres'}
                        />
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
