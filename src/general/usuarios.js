import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faEdit, faHandPointRight, faLock, faRefresh, faSave, faUser, } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../Auth/useAuth"
import { InputUsuario, ComponenteInputBuscar_, Select1 } from '../elementos/elementos';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados
import { InputUsuario as User_, } from '../login/elementos';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados
import { useState, useEffect } from "react";
import { URL, INPUT } from '../Auth/config';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast'
import '../elementos/estilos.css'
import { alert2, confirmarActualizar, confirmarEliminar, confirmarGuardar, recet } from '../elementos/alert2'
import md5 from 'md5'
import Load from '../elementos/load'


function Usuario() {
    const auth = useAuth()

    const [lista, setLista] = useState([]);
    const [usuario, setUsuario] = useState([]);
    const [cantidad, setCantidad] = useState(0);
    const [listaRol, setListaRol] = useState([]);
    const [listaHopistal, setListaHospital] = useState([]);

    const [id, setId] = useState({ campo: null, valido: null })
    const [rol, setRol] = useState({ campo: null, valido: null });
    const [hospital, setHospital] = useState({ campo: null, valido: null });
    const [username, setUsername] = useState({ campo: null, valido: null });
    const [pass, setPass] = useState({ campo: null, valido: null });
    const [pass1, setPass1] = useState({ campo: null, valido: null });
    const [nombre, setNombre] = useState({ campo: null, valido: null });
    const [ape1, setApe1] = useState({ campo: null, valido: null });
    const [ape2, setApe2] = useState({ campo: null, valido: null });
    const [correo, setCorreo] = useState({ campo: null, valido: null });
    const [celular, setCelular] = useState({ campo: null, valido: null });
    const [direccion, setDireccion] = useState({ campo: null, valido: null });

    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalVer, setModalVer] = useState(false);
    const [modalRecet, setModalRecet] = useState(false);


    const [inputBuscar, setInputBuscar] = useState({ campo: null, valido: null })

    const [estado, setEstado] = useState(0)
    const [texto, setTexto] = useState(null)
    const [act, setAct] = useState(1)



    let today = new Date()
    let fecha = today.toISOString().split('T')[0]
    console.log(today)
    let hora = new Date().toLocaleTimeString().split(':')[0]
    let min = new Date().toLocaleTimeString().split(':')[1]
    let sec = new Date().toLocaleTimeString().split(':')[2]
    if (hora.length === 1) hora = '0' + hora
    let horafinal = hora + ':' + min + ':' + sec


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
    try {
        useEffect(() => {
            document.title = 'USUARIOS'
            if (inputBuscar.valido === null && act === 1) listar()
            if (inputBuscar.valido === 'false' && act === 1) listar()

            if (inputBuscar.valido === null && act === 0) listarNuevos()
            if (inputBuscar.valido === 'false' && act === 0) listarNuevos()
        }, [inputBuscar])

        const listar = async () => {
            setEstado(1)
            setTexto('cargando...')
            axios.post(URL + '/usuarios/listar1').then(json => {
                if (json.data.ok) {
                    setLista(json.data.data[0])
                    setCantidad(json.data.data[1])
                    setEstado(0)
                }
                else { alert2({ icono: 'warning', titulo: 'Sin datos', boton: 'ok', texto: json.data.msg }); setEstado(0) }
            }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }
        const listarNuevos = async () => {
            setEstado(1)
            setTexto('cargando...')
            axios.post(URL + '/usuarios/listar2').then(json => {
                if (json.data.ok) {
                    setLista(json.data.data[0])
                    setCantidad(json.data.data[1])
                    setEstado(0)
                    if (json.data.data[0].length < 1) {
                        alert2({ icono: 'info', titulo: 'Lista vacía', boton: 'ok', texto: 'No hay registros de nuevos usuarios' })
                    }
                }
                else { alert2({ icono: 'warning', titulo: 'Sin datos', boton: 'ok', texto: json.data.msg }); setEstado(0) }
            }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }
        const verUsuario = async (id) => {
            axios.post(URL + '/usuarios/ver', { id: id }).then(json => {
                if (json.data.ok) {
                    setUsuario(json.data.data)
                    setModalVer(true)
                }
                else alert2({ icono: 'warning', titulo: 'Sin datos', boton: 'ok', texto: json.data.msg })
            }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }

        const listarRol = async () => {
            axios.post(URL + '/usuarios/rol').then(json => {
                setListaRol(json.data)
            }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }
        const listarHospital = async () => {
            if (rol.valido === 'true') {
                axios.post(URL + '/usuarios/establecimientos', { id: rol.campo }).then(json => {
                    setListaHospital(json.data)
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            }
        }


        const rellenar = async () => {
            listarHospital()
            listarRol()
            setId({ campo: usuario[0].id, valido: 'true' })
            setRol({ campo: usuario[0].idrol ? usuario[0].idrol : null, valido: usuario[0].idrol ? 'true' : null })
            setHospital({ campo: usuario[0].idestablecimiento, valido: 'true' })
            setNombre({ campo: usuario[0].nombre, valido: 'true' })
            setApe1({ campo: usuario[0].apellido1, valido: 'true' })
            setApe2({ campo: usuario[0].apellido2, valido: 'true' })
            setCelular({ campo: usuario[0].celular, valido: 'true' })
            setDireccion({ campo: usuario[0].direccion, valido: 'true' })
            setCorreo({ campo: usuario[0].correo, valido: 'true' })
            setListaHospital([{ id: usuario[0].idestablecimiento, nombre: usuario[0].establecimiento }])
            setModalEditar(true)
        }
        const vaciarDatos = async () => {
            listarHospital()
            listarRol()
            setPass({ campo: null, valido: null })
            setPass1({ campo: null, valido: null })
            setId({ campo: null, valido: null })
            setRol({ campo: null, valido: null })
            setHospital({ campo: null, valido: null })
            setNombre({ campo: null, valido: null })
            setApe1({ campo: null, valido: null })
            setApe2({ campo: null, valido: null })
            setCelular({ campo: null, valido: null })
            setDireccion({ campo: null, valido: null })
            setCorreo({ campo: null, valido: null })
            setEstado(0)
            setModalEditar(false)
            setModalInsertar(false)
        }

        const insertar = async () => {
            if (username.valido === 'true' && rol.valido === 'true' && pass.valido === 'true' && pass1.valido === 'true' &&
                hospital.valido === 'true' && nombre.valido === 'true' && ape1.valido === 'true' && ape2.valido === 'true' &&
                celular.valido === 'true' && direccion.valido === 'true' && correo.valido === 'true' && estado === 0) {
                if (pass.campo === pass1.campo) {
                    let accion = await confirmarGuardar({ titulo: 'Guardar Registro ?', boton: 'ok', texto: 'Ok para continuar.' })
                    if (accion.isConfirmed) {
                        setEstado(1)
                        setModalInsertar(false)
                        setTexto('Guardado...')
                        axios.post(URL + '/usuarios/registrar', {
                            "username": username.campo,
                            'otros': md5(pass.campo),
                            'hospital': hospital.campo,
                            'rol_': rol.campo,
                            'nombre': nombre.campo,
                            'ape1': ape1.campo, 'ape2': ape2.campo,
                            'direccion': direccion.campo, 'celular': celular.campo, 'correo': correo.campo,
                            'creado': fecha + ' ' + horafinal
                        }).then(async json => {
                            if (json.data.ok) {
                                alert2({ icono: 'success', titulo: 'Registro Guardado', boton: 'ok', texto: json.data.msg })
                                setLista(json.data.data)
                                vaciarDatos()
                                setEstado(0)
                            } else { alert2({ icono: 'warning', titulo: 'Registro Fállido', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                        }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                    }
                } else alert2({ icono: 'error', titulo: 'Contraseñas diferentes', boton: 'ok', texto: 'las contraseñas no coinciden!, verifique e intente nuevamente' })
            } else toast.error('Complete todos los campos con *, o verifique que todos los datos proporcionados sean los correctos')
        }


        const recet_ = async () => {
            if (pass.valido === 'true' && pass1.valido === 'true') {
                if (pass.campo === pass1.campo) {
                    let accion = await recet({ titulo: 'Reiniciar Contraseña?', boton: 'ok', texto: 'Ok para continuar.' })
                    if (accion.isConfirmed) {
                        setEstado(1)
                        setTexto('Creando nueva contraseña...')
                        setModalRecet(false)
                        axios.post(URL + '/usuarios/recet', {
                            'id': usuario[0].id,
                            'otros': md5(pass.campo),
                            'modificado': fecha + ' ' + horafinal
                        }).then(async json => {
                            if (json.data.ok) {
                                alert2({ icono: 'success', titulo: 'Reinicio Exitoso', boton: 'ok', texto: json.data.msg })
                                vaciarDatos()
                                setEstado(0)
                            } else { alert2({ icono: 'warning', titulo: 'Operacion Fállida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                        }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                    }
                } else alert2({ icono: 'error', titulo: 'Contraseñas diferentes', boton: 'ok', texto: 'las contraseñas no coinciden!, verifique e intente nuevamente' })
            } else toast.error('Complete todos los campos con *, o verifique que todos los datos proporcionados sean los correctos')
        }


        const actualizar = async (e) => {
            if (id.valido === 'true' && rol.valido === 'true' &&
                hospital.valido === 'true' && nombre.valido === 'true' && ape1.valido === 'true' && ape2.valido === 'true' &&
                celular.valido === 'true' && direccion.valido === 'true' && correo.valido === 'true' && estado === 0) {
                let accion = await confirmarActualizar({ titulo: 'Actualizar Registro ?', boton: 'ok', texto: 'Ok para continuar.' })
                if (accion.isConfirmed) {
                    setEstado(1)
                    setTexto('Actualizando...')
                    setModalEditar(false)
                    setModalVer(false)
                    axios.post(URL + '/usuarios/actualizar', {
                        "id": id.campo,
                        'hospital': hospital.campo,
                        'rol_': rol.campo,
                        'nombre': nombre.campo,
                        'ape1': ape1.campo, 'ape2': ape2.campo,
                        'direccion': direccion.campo, 'celular': celular.campo, 'correo': correo.campo,
                        'modificado': fecha + ' ' + horafinal
                    }).then(json => {
                        if (json.data.ok) {
                            alert2({ icono: 'success', titulo: 'Actualizado', boton: 'ok', texto: json.data.msg })
                            setUsuario(json.data.data)
                            vaciarDatos()
                            setEstado(0)
                            setModalVer(true)
                        } else { alert2({ icono: 'warning', titulo: 'Operacion Fállida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                    }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });

                }
            } else toast.error('Complete todos los campos com * y verifique que esten bien escritos')
        }

        const eliminar = async (a) => {
            let accion = await confirmarEliminar({ titulo: 'Eliminar Registro ?', boton: 'ok', texto: 'Ok para continuar.' })
            if (accion.isConfirmed) {
                if (usuario[0].id) {
                    setEstado(1)
                    setTexto('Eliminando...')
                    setModalVer(false)
                    axios.post(URL + '/usuarios/eliminar', { id: usuario[0].id, modificado: fecha + ' ' + horafinal }).then(json => {
                        if (json.data.ok) {
                            alert2({ icono: 'success', titulo: 'Registro Eliminado!', boton: 'ok', texto: json.data.msg })
                            setUsuario([])
                            vaciarDatos()
                            setLista(json.data.data[0])
                            setEstado(0)
                            setCantidad(json.data.data[1])
                        } else { alert2({ icono: 'warning', titulo: 'Operacion Fállida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                    }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                }
            }
        }

        const buscar = () => {
            if (inputBuscar.valido === 'true' && act === 1) {

                axios.post(URL + '/usuarios/buscar', { dato: inputBuscar.campo }).then(json => {
                    if (json.data.ok) {
                        setLista(json.data.data)
                        setCantidad(json.data.data.length)
                    }
                    else toast.error(json.data.msg)
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            }
            if (inputBuscar.valido === 'true' && act === 0) {

                axios.post(URL + '/usuarios/buscar_', { dato: inputBuscar.campo }).then(json => {
                    if (json.data.ok) {
                        setLista(json.data.data)
                        setCantidad(json.data.data.length)
                    }
                    else toast.error(json.data.msg)
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            }
        }

        const siguiente = () => {
            let dir = null
            if (act === 1)
                dir = URL + '/usuarios/next'
            if (act === 0)
                dir = URL + '/usuarios/next_'
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
            let dir = null
            if (act === 1)
                dir = URL + '/usuarios/anterior'
            if (act === 0)
                dir = URL + '/usuarios/anterior_'
            if (lista.length > 0) {
                const last = lista[0].id
                console.log(last, lista)
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
                    <div className='titulo-pagina' >

                    </div>
                    <div className='contenedor-cabecera row'>


                        <div className='contenedor-titulo col-12 col-sm-6 col-md-6 col-lg-6'>
                            <div className='titulo-pagina' >
                                <p>
                                    GESTIONAR USUARIOS{act === 0 &&
                                        <span style={{ color: '#f54021', marginLeft: '5px' }}>{"  [USUARIOS SIN VALIDAR]"}</span>
                                    }
                                </p>
                            </div>
                        </div>
                        <div className='contenedor-boton col-12 col-sm-6 col-md-6 col-lg-6'>

                            {act == 1 && <button className="btn-guardar col-auto" onClick={() => { setModalInsertar(true); listarHospital(); listarRol() }} >
                                <FontAwesomeIcon className='btn-icon-nuevo' icon={faUser} />Nuevo
                            </button>}
                            {lista.length > 0 && lista[0].estado == 1 ?
                                <button className="btn-editar col-auto" onClick={() => { listarNuevos(); setAct(0) }} >
                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faUser} />Validar
                                </button> :

                                <button className="btn-guardar col-auto" onClick={() => { listar(); setAct(1) }} >
                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faUser} />Volver
                                </button>
                            }
                        </div>
                    </div>
                    <div className='contenedor p-1'>
                        <div className="container-4">
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
                        <div className="table table-responsive custom mb-2">

                            <table className="table table-sm" >
                                <thead>
                                    <tr >
                                        <th className="col-5 ">TITULAR</th>
                                        <th className="col-3 ">CELULAR</th>
                                        <th className="col-3 ">ESTABLECIMIENTO</th>
                                        <th className="col-3 ">USUARIO</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lista.map((a) => (
                                        a.estado === 1 ?
                                            <tr key={a.id} onClick={() => verUsuario(a.id)} className='item'>
                                                <td className="col-5 ">
                                                    <div className='cantidad-registros' style={{ cursor: 'pointer' }}>
                                                        <FontAwesomeIcon icon={faHandPointRight} /> {a.titular}
                                                    </div>
                                                </td>
                                                <td className="col-3 ">{a.celular}</td>
                                                <td className="col-3 " >{a.hospital}</td>
                                                <td className="col-3 " >{a.username}</td>
                                            </tr> : <tr key={a.id} onClick={() => verUsuario(a.id)} className='item'>
                                                <td className="col-5" >
                                                    <div className='cantidad-registros' style={{ cursor: 'pointer' }}>
                                                        <FontAwesomeIcon icon={faHandPointRight} /> {a.titular}
                                                    </div>
                                                </td>
                                                <td className="col-3 ">{a.celular}</td>
                                                <td className="col-3 " >{a.hospital}</td>
                                                <td className="col-3 " >{a.username}</td>
                                            </tr>
                                    ))}
                                </tbody>
                            </table>
                            {lista.length < 1 && <div style={{ fontSize: '18px' }}>Lista Vacia</div>}
                        </div>
                        <div className='cantidad-registros'>{cantidad + ' Registro(s)'}
                        </div>
                    </div>
                    <div className='contenedor-foot'>
                        <div className='navegador-tabla'>
                            <a href="#" onClick={() => anterior()} className='move moveLeft'>
                                Anterior
                            </a>

                            <a href="#" onClick={() => siguiente()} className='move moveRight'>
                                Siguiente
                            </a>
                            {/* <div className='row'>
                                <FontAwesomeIcon className='col-auto anterior' icon={faArrowLeft} onClick={() => anterior()} > </FontAwesomeIcon>
                                <div className=' col-auto now'>{lista.length > 0 ? lista[lista.length - 1].id + ' - ' + lista[0].id : '0   -   0'}</div>
                                <FontAwesomeIcon className='col-auto next' icon={faArrowRight} onClick={() => siguiente()}> </FontAwesomeIcon>
                            </div> */}
                        </div>
                    </div>
                </div>


                <Modal isOpen={modalVer}>

                    {act == 1 ? <ModalHeader toggle={() => setModalVer(false)}>DATOS PERSONALES</ModalHeader> :
                        <ModalHeader toggle={() => { setModalVer(false); listarNuevos() }}>DATOS PERSONALES</ModalHeader>}
                    <ModalBody>
                        {usuario.length > 0 && <div>
                            {usuario[0].estado == 0 && <p style={{ fontSize: '18px', color: '#f54021' }}>USUARIO SIN VALIDAR</p>}
                            <div className='row p-2 mb-1'>
                                <div className='encabezado col-6'>Establecimiento</div>
                                <div className='contenido col-6' >{usuario[0].establecimiento}</div>
                            </div>
                            <div className='row p-2 mb-1'>
                                <div className='encabezado col-6'>Rol Usuario</div>
                                <div className='contenido col-6'>{usuario[0].rol ? usuario[0].rol : 'NO TIENE'}</div>
                            </div>
                            <div className='row p-2'>
                                <div className='encabezado col-6'>Nombre de Usuario</div>
                                <div className='contenido col-6'>{usuario[0].username}</div>
                            </div>

                            <div className='row p-2'>
                                <div className='encabezado col-6'>Nombre Completo</div>
                                <div className='contenido col-6'>{usuario[0].nombre}</div>
                            </div>
                            <div className='row p-2'>
                                <div className='encabezado col-6'>Apellido Paterno</div>
                                <div className='contenido col-6'>{usuario[0].apellido1}</div>
                            </div>
                            <div className='row p-2'>
                                <div className='encabezado col-6'>Apellido Materno</div>
                                <div className='contenido col-6'>{usuario[0].apellido2}</div>
                            </div>
                            <div className='row p-2'>
                                <div className='encabezado col-6'>Celular/telef.</div>
                                <div className='contenido col-6'>{usuario[0].celular}</div>
                            </div>
                            <div className='row p-2'>
                                <div className='encabezado col-6'>Correo</div>
                                <div className='contenido col-6'>{usuario[0].correo}</div>
                            </div>
                            <div className='row p-2'>
                                <div className='encabezado col-6'>Direccion</div>
                                <div className='contenido col-6' >{usuario[0].direccion}</div>
                            </div></div>}

                    </ModalBody>
                    <div className='botonModal'>
                        <button className="btn-eliminar col-auto" onClick={() => setModalRecet(true)} >
                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faLock} />Reiniciar Contraseña
                        </button>
                        <button className="btn-editar col-auto" onClick={() => rellenar()} >
                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faEdit} />ACTUALIZAR
                        </button>
                    </div>
                    {/* <div className='cantidad-registros'>SISTEMA DEPARTAMENTAR DE INFORAMACION DE SALUD SDIS</div> */}

                </Modal>
                <Modal isOpen={modalRecet}>

                    <ModalHeader toggle={() => setModalRecet(false)}> Reiniciar Contraseña</ModalHeader>
                    <ModalBody>

                        <User_
                            estado={pass}
                            cambiarEstado={setPass}
                            placeholder="CONTRASEÑA"
                            ExpresionRegular={INPUT.PASSWORD}  //expresion regular  
                            etiqueta='Contraseña'
                            msg={'Este campo acepta todos los caracteres'}
                            campoUsuario={true}
                        />

                        <User_
                            estado={pass1}
                            cambiarEstado={setPass1}
                            placeholder="CONTRASEÑA"
                            ExpresionRegular={INPUT.PASSWORD}  //expresion regular  
                            etiqueta='Confirmar contraseña'
                            msg={'Este campo acepta todos los caracteres'}
                            campoUsuario={true}
                        />

                    </ModalBody>
                    <div className='botonModal'>
                        <button className="btn-eliminar col-auto" onClick={() => recet_()} >
                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faRefresh} />Reiniciar Contraseña
                        </button>
                    </div>
                </Modal>
                <Modal isOpen={modalInsertar}>

                    <ModalHeader toggle={() => setModalInsertar(false)}> Nuevo Usuario</ModalHeader>
                    <ModalBody>
                        <Select1
                            estado={rol}
                            cambiarEstado={setRol}
                            ExpresionRegular={INPUT.ID}
                            lista={listaRol}
                            etiqueta={'Rol'}
                            msg='Seleccione una opcion'
                            funcion={listarHospital}
                            estado_={setHospital}
                        />

                        <Select1
                            estado={hospital}
                            cambiarEstado={setHospital}
                            ExpresionRegular={INPUT.ID}
                            lista={listaHopistal}
                            etiqueta={'Establecimiento'}
                            msg='Seleccione una opcion'
                        />

                        <div className='row'>
                            <div className='col-8'>
                                <User_
                                    estado={username}
                                    cambiarEstado={setUsername}
                                    placeholder="USUARIO"
                                    ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular  
                                    etiqueta='Username'
                                    campoUsuario={true}
                                    msg={'Este campo acepta letras minúsculas'}
                                /></div>
                            <div className='col-6'>
                                <User_
                                    estado={pass}
                                    cambiarEstado={setPass}
                                    placeholder="CONTRASEÑA"
                                    ExpresionRegular={INPUT.PASSWORD}  //expresion regular  
                                    etiqueta='Contraseña'
                                    msg={'Este campo acepta todos los caracteres'}
                                    campoUsuario={true}
                                /></div>
                            <div className='col-6'>
                                <User_
                                    estado={pass1}
                                    cambiarEstado={setPass1}
                                    placeholder="CONTRASEÑA"
                                    ExpresionRegular={INPUT.PASSWORD}  //expresion regular  
                                    etiqueta='Confirmar contraseña'
                                    msg={'Este campo acepta todos los caracteres'}
                                    campoUsuario={true}
                                /></div>
                        </div>
                        <InputUsuario
                            estado={nombre}
                            cambiarEstado={setNombre}
                            placeholder="NOMBRE"
                            ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular  
                            etiqueta='Nombre'
                            msg={'Este campo acepta solo letras '}
                        />
                        <div className='row'>
                            <div className='col-6'>
                                <InputUsuario
                                    estado={ape1}
                                    cambiarEstado={setApe1}
                                    placeholder="APELLIDO1"
                                    ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular  
                                    etiqueta='Apellido paterno'
                                    msg={'Este campo acepta solo letras '}
                                /></div>
                            <div className='col-6'>
                                <InputUsuario
                                    estado={ape2}
                                    cambiarEstado={setApe2}
                                    placeholder="APELLIDO 2 "
                                    ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular  
                                    etiqueta='Apellido materno'
                                    msg={'Este campo acepta solo letras '}
                                /></div>
                        </div>
                        <div className='row'>
                            <div className='col-6'>
                                <InputUsuario
                                    estado={celular}
                                    cambiarEstado={setCelular}
                                    placeholder="CELULAR/TELEF."
                                    ExpresionRegular={INPUT.TELEFONO}  //expresion regular  
                                    etiqueta='Celular/Telf.'
                                    msg={'Este campo acepta solo números '}
                                /></div>
                            <div className='col-6'>
                                <User_
                                    estado={correo}
                                    cambiarEstado={setCorreo}
                                    placeholder="CORREO"
                                    ExpresionRegular={INPUT.CORREO}  //expresion regular  
                                    etiqueta='Correo'
                                    msg={'Este campo acepta en formato de correo'}
                                    campoUsuario={true}
                                /></div>
                        </div>
                        <InputUsuario
                            estado={direccion}
                            cambiarEstado={setDireccion}
                            placeholder="DIRECCION"
                            ExpresionRegular={INPUT.DIRECCION}  //expresion regular  
                            etiqueta='Dirección'
                            msg={'Este campo acepta letras numero y algunos carateres'}
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
                        vaciarDatos()
                    }}>  Actualizar Usuario</ModalHeader>
                    <ModalBody>
                        <Select1
                            estado={rol}
                            cambiarEstado={setRol}
                            ExpresionRegular={INPUT.ID}
                            lista={listaRol}
                            etiqueta={'Rol'}
                            msg='Seleccione una opcion'
                            funcion={listarHospital}
                            estado_={setHospital}
                        />
                        <Select1
                            estado={hospital}
                            cambiarEstado={setHospital}
                            ExpresionRegular={INPUT.ID}
                            lista={listaHopistal}
                            etiqueta={'Establecimiento'}
                            msg='Seleccione una opcion'
                        />


                        <InputUsuario
                            estado={nombre}
                            cambiarEstado={setNombre}
                            placeholder="NOMBRE"
                            ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular  
                            etiqueta='Nombre'
                            msg={'Este campo acepta solo letras '}
                        />
                        <div className='row'>
                            <div className='col-6'>
                                <InputUsuario
                                    estado={ape1}
                                    cambiarEstado={setApe1}
                                    placeholder="APELLIDO1"
                                    ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular  
                                    etiqueta='Apellido paterno'
                                    msg={'Este campo acepta solo letras '}
                                /></div>
                            <div className='col-6'>
                                <InputUsuario
                                    estado={ape2}
                                    cambiarEstado={setApe2}
                                    placeholder="APELLIDO 2 "
                                    ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular  
                                    etiqueta='Apellido materno'
                                    msg={'Este campo acepta solo letras '}
                                /></div>
                        </div>
                        <div className='row'>
                            <div className='col-6'>
                                <InputUsuario
                                    estado={celular}
                                    cambiarEstado={setCelular}
                                    placeholder="CELULAR/TELEF."
                                    ExpresionRegular={INPUT.TELEFONO}  //expresion regular  
                                    etiqueta='Celular/Telf.'
                                    msg={'Este campo acepta solo números '}
                                /></div>
                            <div className='col-6'>
                                <User_
                                    estado={correo}
                                    cambiarEstado={setCorreo}
                                    placeholder="CORREO"
                                    ExpresionRegular={INPUT.CORREO}  //expresion regular  
                                    etiqueta='Correo'
                                    msg={'Este campo acepta en formato de correo'}
                                    campoUsuario={true}
                                /></div>
                        </div>
                        <InputUsuario
                            estado={direccion}
                            cambiarEstado={setDireccion}
                            placeholder="DIRECCION"
                            ExpresionRegular={INPUT.DIRECCION}  //expresion regular  
                            etiqueta='Dirección'
                            msg={'Este campo acepta letras numero y algunos carateres'}
                        />
                    </ModalBody>
                    <div className='botonModal'>
                        <button className="btn-eliminar col-auto" onClick={() => eliminar()} >
                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faUser} />Eliminar
                        </button>
                        <button className="btn-editar col-auto" onClick={() => actualizar()} >
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
export default Usuario;
