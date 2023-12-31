import React from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCog, faCogs, faEdit, faPlay, faPlusCircle, faSave, faStop, faTrashAlt, } from '@fortawesome/free-solid-svg-icons';

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
    const [ssector, setSsector] = useState([]);
    const [cantidad_, setCantidad] = useState(0);
    const [listaMunicipio, setListaMunicipio] = useState([]);
    const [municipio, setMunicipio] = useState({ campo: null, valido: null });
    const [hospital, setHospital] = useState({ campo: null, valido: null });
    const [id, setId] = useState({ campo: null, valido: null })
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [estado, setEstado] = useState(null);
    const [texto, setTexto] = useState(null);

    const [inputBuscar, setInputBuscar] = useState({ campo: null, valido: null })
    const [eliminado, setEliminado] = useState([{ id: 2, nombre: 'BAJA' }, { id: 1, nombre: 'ALTA' },]);
    const [eli, setEli] = useState({ campo: null, valido: null });
    const [ss, setSs] = useState({ campo: null, valido: null });

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
            document.title = 'ESTABLECIMIENTOS'
            setTimeout(() => {
                if (inputBuscar.valido === null) listarHospital()
                if (inputBuscar.valido === 'false') listarHospital()
            }, 200)
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
                    setSsector(json.data.data[1])

                } else alert2({ icono: 'warning', titulo: 'Operacion fallida o acceso denegado', boton: 'ok', texto: json.data.msg })
            }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }

        const listarHospital = async () => {
            setEstado(1)
            setTexto('cargando...')
            axios.post(URL + '/est/listar', { cantidad: auth.cantidad }).then(json => {
                if (json.data.hasOwnProperty("sesion")) {
                    auth.logout()
                    alert('LA SESION FUE CERRADO DESDE EL SERVIDOR, VUELVA A INTRODODUCIR SUS DATOS DE INICIO')
                }
                if (json.data.ok) {
                    setLista(json.data.data[0])
                    // console.log(json.data.data[1], 'cantidad')
                    setCantidad(json.data.data[1])
                    setEstado(0)
                } else { alert2({ icono: 'warning', titulo: 'Operacion fallida o acceso denegado', boton: 'ok', texto: json.data.msg }); setEstado(0) }
            }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }


        const insertar = async () => {
            if (municipio.valido === 'true' && hospital.valido === 'true' && estado === 0 && ss.valido ==='true') {
                setEstado(1)
                setTexto('Guardando...')
                setModalInsertar(false)
                axios.post(URL + '/est/insertar', {
                    esta: hospital.campo,
                    municipio: municipio.campo,
                    ssector: ss.campo,
                    creado: fecha + ' ' + horafinal,
                    cantidad: auth.cantidad
                }).then(json => {
                    if (json.data.ok) {
                        alert2({ icono: 'success', titulo: 'Operacion exitoso', boton: 'ok', texto: json.data.msg })
                        setEstado(0)
                        setLista(json.data.data[0])
                        setCantidad(json.data.data[1])
                        setSs({ campo: null, valido: null })

                        setHospital({ campo: null, valido: null })
                        setMunicipio({ campo: null, valido: null })
                    } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            } else toast.error('Formulario incompleto!')
        }


        const actualizar = async (e) => {
            if (municipio.valido === 'true' && hospital.valido === 'true' && id.valido === 'true' && ss.valido ==='true') {
                let accion = await confirmarActualizar({ titulo: 'Actualizar Registro ?', boton: 'ok', texto: 'Ok para continuar.' })
                if (accion.isConfirmed) {
                    setEstado(1)
                    setTexto('Actualizando...')
                    setModalEditar(false)
                    axios.post(URL + '/est/actualizar', {
                        id: id.campo,
                        esta: hospital.campo,
                        municipio: municipio.campo,
                        ssector: ss.campo,
                        modificado: fecha + ' ' + horafinal,
                        cantidad: auth.cantidad,
                        estado: eli.campo === 2 ? 1 : 0
                    }).then(json => {
                        if (json.data.ok) {
                            alert2({ icono: 'success', titulo: 'Operacion exitoso', boton: 'ok', texto: json.data.msg })
                            setLista(json.data.data[0])
                            setCantidad(json.data.data[1])
                            setId({ campo: null, valido: null })
                            setSs({ campo: null, valido: null })

                            setHospital({ campo: null, valido: null })
                            setMunicipio({ campo: null, valido: null })
                            setEstado(0)
                        } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                    }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                }
            } else toast.error('Formulario incompleto!')
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
                axios.post(dir, { id: last, cantidad: auth.cantidad }).then(json => {
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
                console.log(last, lista)
                axios.post(dir, { id: last, cantidad: auth.cantidad }).then(json => {
                    if (json.data.ok) {
                        setLista(json.data.data)
                    } else {
                        toast.error(json.data.msg)
                    }
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            }
        }
        // console.log(window.innerWidth, window.innerHeight, 'tamaño de la pantall')

        return (
            <div style={{ background: '#e5e5e5', paddingTop: '0.4rem', paddingBottom: '0.4rem', height: '100vh' }}>

                <div className="container_"  >
                    {estado === 1 && <Load texto={texto} />}

                    <div className='contenedor-cabecera row'>

                        <div className='contenedor-cabecera row'>
                            <span className='titulo'>
                                CREAR ESTABLECIMIENTOS
                            </span>
                        </div>

                    </div>
                    <div className='contenedor p-2'>
                        <div className=' row elementos-contenedor botonModal'>
                            <button className="btn-nuevo col-auto mb-3" onClick={() => { setModalInsertar(true); listarMunic() }}  >
                                <FontAwesomeIcon className='btn-icon-nuevo' icon={faPlusCircle} />Nuevo
                            </button>
                            {/* <p className='alertas' >{'Al cambiar la configuracion de accesos del usaurio interfiere directamente con la interaccion del usuario con el Sistema. Se recomienda realizar los cambios con absoluta responsabilidad'}</p> */}

                        </div>
                        <div className="container-4 pt-2">
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

                        <div className="table table-responsive custom mb-2 " style={{ height: "auto" }}>

                            <table className="table table-sm" >
                                <thead >
                                    <tr >
                                        <th className="col-4 ">ESTABLECIMIENTO</th>
                                        <th className="col-1 ">CODIGO</th>
                                        <th className="col-2 ">ESTADO</th>
                                        <th className="col-3 ">MUNICIPIO</th>
                                        <th className="col-2 ">SUB-SECTOR</th>
                                        {/* <th className="col-1  "></th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {lista.map((a) => (
                                        <tr key={a.id}>
                                            <td >{a.establecimiento}</td>
                                            <td >{a.cod}</td>
                                            <td >
                                                <div className='row'>
                                                    <div className='col-auto'>
                                                        {a.eliminado ?
                                                            <FontAwesomeIcon className='stop' style={{ color: 'red' }} icon={faStop} />
                                                            :
                                                            <FontAwesomeIcon className='play' icon={faPlay} />}
                                                    </div>
                                                    <div className='col-auto'>
                                                        {a.eliminado ? <span>BAJA</span> : <span> ALTA</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td  >{a.municipio}</td>
                                            <td >{a.ssector}</td>
                                            <td className="col-1 largTable">
                                                {/* <FontAwesomeIcon icon={faTrashAlt} onClick={() => eliminar(a.id)} className='botonEliminar' /> */}
                                                <FontAwesomeIcon icon={faCog} className='botonEditar'
                                                    onClick={() => {
                                                        listarMunic();
                                                        setId({ campo: a.id, valido: 'true' });
                                                        setHospital({ campo: a.establecimiento, valido: 'true' });
                                                        setMunicipio({ campo: a.idmunicipio, valido: 'true' });
                                                        setEli({ campo: a.eliminado ? 2 : 1, valido: 'true' })
                                                        setSs({ campo: a.idssector, valido: 'true' })
                                                        setModalEditar(true)
                                                    }} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>

                    </div>

                    <div className='row pb-2'>

                        <div className='col-5'><div className='cantidad-registros'>{cantidad_ + ' Registro(s)'}</div></div>
                        <div className='col-7'>
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
                            estado={ss}
                            cambiarEstado={setSs}
                            ExpresionRegular={INPUT.ID}
                            lista={ssector}
                            etiqueta={'Sub-sector'}
                            msg='Seleccione una opcion'
                        />


                        <InputUsuario
                            estado={hospital}
                            cambiarEstado={setHospital}
                            name="clasificacion"
                            placeholder="ESTABLECIMIENTO"
                            ExpresionRegular={INPUT.ESTABLECIMIENTO}  //expresion regular  
                            etiqueta='Nombre'
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
                            estado={ss}
                            cambiarEstado={setSs}
                            ExpresionRegular={INPUT.ID}
                            lista={ssector}
                            etiqueta={'Sub-sector'}
                            msg='Seleccione una opcion'
                        />

                        <InputUsuario
                            estado={hospital}
                            cambiarEstado={setHospital}
                            name="clasificacion"
                            placeholder="ESTABLECIMIENTO"
                            ExpresionRegular={INPUT.CLASIFICACION}  //expresion regular  
                            etiqueta='nombre'
                            msg={'Este campo acepta letras, numero y algunos caracteres'}
                        />
                        <Select1
                            estado={eli}
                            cambiarEstado={setEli}
                            ExpresionRegular={INPUT.ID}
                            lista={eliminado}
                            etiqueta={'Estado'}
                            msg='Seleccione una opcion'
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
        // auth.logout()
    }

}
export default Establecimiento;
