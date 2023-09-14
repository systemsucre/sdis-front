import React from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faEdit, faPlusCircle, faSave, faTrashAlt, } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../Auth/useAuth"
import { InputUsuario, ComponenteInputBuscar_, Select1 } from '../elementos/elementos';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados
import { useState, useEffect } from "react";
import { URL, INPUT } from '../Auth/config';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast'
import '../elementos/estilos.css'
import { alert2, confirmarActualizar, confirmarEliminar } from '../elementos/alert2'
import Load from '../elementos/load'


function Establecimiento() {
    const auth = useAuth()

    const [lista, setLista] = useState([]);
    const [cantidad, setCantidad] = useState(0);
    const [listaMunicipio, setListaMunicipio] = useState([]);
    const [listaRol, setListaRol] = useState([]);
    const [nivel, setNivel] = useState({ campo: null, valido: null });
    const [municipio, setMunicipio] = useState({ campo: null, valido: null });
    const [hospital, setHospital] = useState({ campo: null, valido: null });
    const [id, setId] = useState({ campo: null, valido: null })
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [estado, setEstado] = useState(null);
    const [texto, setTexto] = useState(null);

    const [inputBuscar, setInputBuscar] = useState({ campo: null, valido: null })


    let today = new Date()
    let fecha = today.toISOString().split('T')[0]
    let hora = new Date().toLocaleTimeString().split(':')[0]
    let min = new Date().toLocaleTimeString().split(':')[1]
    let sec = new Date().toLocaleTimeString().split(':')[2]
    if (hora.length === 1) hora = '0' + hora
    let horafinal = hora + ':' + min + ':' + sec

    try {


        useEffect(() => {
            document.title = 'ESTABLECIMIENTOS'
            if (inputBuscar.valido === null) listarHospital()
            if (inputBuscar.valido === 'false') listarHospital()
        }, [inputBuscar])



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

        const listarMunic = async () => {
            axios.post(URL + '/est/listarMunic').then(json => {
                if (json.data.ok) {
                    setListaMunicipio(json.data.data[0])
                    setListaRol(json.data.data[1])
                } else alert2({ icono: 'warning', titulo: 'Operacion fallida o acceso denegado', boton: 'ok', texto: json.data.msg })
            }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }


        const listarHospital = async () => {
            setEstado(1)
            setTexto('cargando...')
            axios.post(URL + '/est/listar').then(json => {
                if (json.data.ok) {
                    setLista(json.data.data[0])
                    setCantidad(json.data.data[1])
                    setEstado(0)
                } else { alert2({ icono: 'warning', titulo: 'Operacion fallida o acceso denegado', boton: 'ok', texto: json.data.msg }); setEstado(0) }
            }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }


        const insertar = async () => {
            if (municipio.valido === 'true' && nivel.valido === 'true' && hospital.valido === 'true' && estado === 0) {
                setEstado(1)
                setTexto('Guardando...')
                setModalInsertar(false)
                axios.post(URL + '/est/insertar', {
                    esta: hospital.campo,
                    nivel: nivel.campo,
                    municipio: municipio.campo,
                    creado: fecha + ' ' + horafinal
                }).then(json => {
                    if (json.data.ok) {
                        alert2({ icono: 'success', titulo: 'Operacion exitoso', boton: 'ok', texto: json.data.msg })
                        setEstado(0)
                        setLista(json.data.data[0])
                        setCantidad(json.data.data[1])

                        setHospital({ campo: null, valido: null })
                        setMunicipio({ campo: null, valido: null })
                        setNivel({ campo: null, valido: null })
                    } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            } else toast.error('Formulario incompleto!')
        }


        const actualizar = async (e) => {
            if (municipio.valido === 'true' && nivel.valido === 'true' && hospital.valido === 'true' && id.valido === 'true') {
                let accion = await confirmarActualizar({ titulo: 'Actualizar Registro ?', boton: 'ok', texto: 'Ok para continuar.' })
                if (accion.isConfirmed) {
                    setEstado(1)
                    setTexto('Actualizando...')
                    setModalEditar(false)
                    axios.post(URL + '/est/actualizar', {
                        id: id.campo,
                        esta: hospital.campo,
                        nivel: nivel.campo,
                        municipio: municipio.campo,
                        modificado: fecha + ' ' + horafinal
                    }).then(json => {
                        if (json.data.ok) {
                            alert2({ icono: 'success', titulo: 'Operacion exitoso', boton: 'ok', texto: json.data.msg })
                            setLista(json.data.data[0])
                            setCantidad(json.data.data[1])
                            setId({ campo: null, valido: null })

                            setHospital({ campo: null, valido: null })
                            setMunicipio({ campo: null, valido: null })
                            setNivel({ campo: null, valido: null })
                            setEstado(0)
                        } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                    }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                }
            } else toast.error('Formulario incompleto!')
        }

        const eliminar = async (e) => {
            if (e) {
                let accion = await confirmarEliminar({ titulo: 'Eliminar Registro ?', boton: 'ok', texto: 'Ok para continuar.' })
                if (accion.isConfirmed) {
                    setEstado(1)
                    setTexto('Eliminando...')
                    axios.post(URL + '/est/eliminar', { id: e }).then(json => {
                        if (json.data.ok) {
                            alert2({ icono: 'success', titulo: 'Operaccion Exitoso', boton: 'ok', texto: json.data.msg })
                            setLista(json.data.data)
                            setEstado(0)
                        } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                    }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });

                }
            }
        }

        const buscar = () => {
            let dir = URL + '/est/buscar'
            if (inputBuscar.valido === 'true') {

                axios.post(dir, { dato: inputBuscar.campo }).then(json => {
                    if (json.data.ok) {
                        setLista(json.data.data)
                        setCantidad(json.data.data.length)
                    }
                    else toast.error(json.data.msg)
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            }
        }

        const siguiente = () => {
            let dir = URL + '/est/next'

            if (lista.length > 0) {
                const last = lista[lista.length - 1].id
                // console.log(last, lista)
                axios.post(dir, { id: last }).then(json => {
                    if (json.data.ok) {
                        setLista(json.data.data)
                    } else {
                        toast.error(json.data.msg)
                    }
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            }
        }

        const anterior = () => {
            let dir = URL + '/est/anterior'
            if (lista.length > 0) {
                const last = lista[0].id
                // console.log(last, lista)
                axios.post(dir, { id: last }).then(json => {
                    if (json.data.ok) {
                        setLista(json.data.data)
                    } else {
                        toast.error(json.data.msg)
                    }
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            }
        }

        return (
            <div>
                <div className="container_">
                    {estado === 1 && <Load texto={texto} />}

                    <div className='contenedor-cabecera row'>
                        <div className='contenedor-titulo col-6'>
                            <div className='titulo-pagina' >
                                <p>ESTABLECIMIENTOS</p>
                            </div>
                        </div>
                        <div className='contenedor-boton col-6'>
                            <button className="btn-nuevo col-auto" onClick={() => { setModalInsertar(true); listarMunic() }}  >
                                <FontAwesomeIcon className='btn-icon-nuevo' icon={faPlusCircle} />Nuevo
                            </button>
                        </div>
                    </div>
                    <div className='contenedor '>
                        <div className="container-4 p-1">
                            <ComponenteInputBuscar_
                                estado={inputBuscar}
                                cambiarEstado={setInputBuscar}
                                name="inputBuscar"
                                ExpresionRegular={INPUT.INPUT_BUSCAR}  //expresion regular
                                placeholder="Escriba para filtrar ..."
                                eventoBoton={buscar}
                                etiqueta={'Buscar'}
                            />
                        </div>
                        {/* <div className="table table-responsive"> */}
                        <table className="table table-sm" >
                            <thead>
                                <tr >
                                    <th className="col-5 ">ESTABLECIMIENTO</th>
                                    <th className="col-3 ">NIVEL</th>
                                    <th className="col-3 ">MUNICIPIO</th>
                                    <th className="col-1  "></th>
                                </tr>
                            </thead>
                        </table>
                        {/* </div> */}
                        <div className="table table-responsive custom mb-2 ">

                            <table className="table table-sm" >

                                <tbody>
                                    {lista.map((a) => (
                                        <tr key={a.id}>
                                            <td className="col-5 ">{a.establecimiento}</td>
                                            <td className="col-3 ">{a.rol}</td>
                                            <td className="col-3 " >{a.municipio}</td>
                                            <td className="col-1 largTable">
                                                <FontAwesomeIcon icon={faTrashAlt} onClick={() => eliminar(a.id)} className='botonEliminar' />
                                                <FontAwesomeIcon icon={faEdit} className='botonEditar'
                                                    onClick={() => {
                                                        listarMunic();
                                                        setId({ campo: a.id, valido: 'true' });
                                                        setHospital({ campo: a.establecimiento, valido: 'true' });
                                                        setMunicipio({ campo: a.idmunicipio, valido: 'true' });
                                                        setNivel({ campo: a.idrol, valido: 'true' });
                                                        setModalEditar(true)
                                                    }} />
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
                            <a href="#" onClick={() => anterior()} className='move moveLeft'>
                                Anterior
                            </a>

                            <a href="#" onClick={() => siguiente()} className='move moveRight'>
                                Siguiente
                            </a>
                            {/* <div className=' col-auto now'>{lista.length > 0 ? lista[lista.length - 1].id + ' - ' + lista[0].id : '0   -   0'}</div> */}
                        </div>
                    </div>
                </div>

                <Modal isOpen={modalInsertar}>

                    <ModalHeader toggle={() => setModalInsertar(false)}> Nuevo ESTABLECIMIENTO</ModalHeader>
                    <ModalBody>
                        <Select1
                            estado={municipio}
                            cambiarEstado={setMunicipio}
                            ExpresionRegular={INPUT.ID}
                            lista={listaMunicipio}
                            etiqueta={'Municipio'}
                            msg='Seleccione una opcion'
                        />
                        <Select1
                            estado={nivel}
                            cambiarEstado={setNivel}
                            ExpresionRegular={INPUT.ID}
                            lista={listaRol}
                            etiqueta={'Rol para sus ususarios'}
                            msg='Seleccione una opcion'
                        />
                        <InputUsuario
                            estado={hospital}
                            cambiarEstado={setHospital}
                            name="clasificacion"
                            placeholder="ESTABLECIMIENTO"
                            ExpresionRegular={INPUT.ESTABLECIMIENTO}  //expresion regular  
                            etiqueta='Establecimiento'
                            msg={'Este campo acepta letras, numero y algunos caracteres'}
                        />
                    </ModalBody>
                    <div className='botonModal'>
                        <button className="btn-guardar col-auto" onClick={() => insertar()} >
                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faSave} />Guardar
                        </button>
                    </div>
                </Modal>

                <Modal isOpen={modalEditar}>

                    <ModalHeader toggle={() => {
                        setId({ campo: null, valido: null });
                        setHospital({ campo: null, valido: null });
                        setMunicipio({ campo: null, valido: null })
                        setModalEditar(false)
                    }}>  Actualizar Registro</ModalHeader>
                    <ModalBody>
                        <Select1
                            estado={municipio}
                            cambiarEstado={setMunicipio}
                            ExpresionRegular={INPUT.ID}
                            lista={listaMunicipio}
                            etiqueta={'Municipio'}
                            msg='Seleccione una opcion'
                        />
                        <Select1
                            estado={nivel}
                            cambiarEstado={setNivel}
                            ExpresionRegular={INPUT.ID}
                            lista={listaRol}
                            etiqueta={'Nivel Establecimiento'}
                            msg='Seleccione una opcion'
                        />
                        <InputUsuario
                            estado={hospital}
                            cambiarEstado={setHospital}
                            name="clasificacion"
                            placeholder="Clasificacion"
                            ExpresionRegular={INPUT.CLASIFICACION}  //expresion regular  
                            etiqueta='Hospital'
                            msg={'Este campo acepta letras, numero y algunos caracteres'}
                        />
                    </ModalBody>
                    <div className='botonModal'>
                        <button className="btn-editar col-auto" onClick={() => actualizar()} >
                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faEdit} />Actualizar
                        </button>
                    </div>
                </Modal>
            </div>

        );

    } catch (error) {
        setEstado(0)
        // auth.logout()
    }

}
export default Establecimiento;
