import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCheck, faEdit, faHandPointRight, faLock, faPlay, faRecycle, faRefresh, faSave, faStop, faUser, faUserCheck, faUserCog, faUserEdit, } from '@fortawesome/free-solid-svg-icons';

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
    const [eliminado, setEliminado] = useState([{ id: 2, nombre: 'BAJA' }, { id: 1, nombre: 'ALTA' },]);
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
    const [eli, setEli] = useState({ campo: null, valido: null });

    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalVer, setModalVer] = useState(false);
    const [modalRecet, setModalRecet] = useState(false);


    const [inputBuscar, setInputBuscar] = useState({ campo: null, valido: null })

    const [estado, setEstado] = useState(0)
    const [texto, setTexto] = useState(null)
    const [act, setAct] = useState(1)



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

            window.addEventListener('onload',
                window.onload = function () {
                    window.location.hash = "no-back-button";
                    window.location.hash = "Again-No-back-button"
                    window.onhashchange = function () {

                        listar(); setAct(1)

                        document.title = 'USUARIOS'
                        window.location.hash = "no-back-button";
                    }
                })
            if (inputBuscar.valido === null && act === 1) listar()
            if (inputBuscar.valido === 'false' && act === 1) listar()

            if (inputBuscar.valido === null && act === 0) listarNuevos()
            if (inputBuscar.valido === 'false' && act === 0) listarNuevos()
        }, [inputBuscar])

        const listar = async () => {
            setEstado(1)
            setTexto('cargando...')
            axios.post(URL + '/usuarios/listar1', { cantidad: auth.cantidad }).then(json => {
                if (json.data.hasOwnProperty("sesion")) {
                    auth.logout()
                    alert('LA SESION FUE CERRADO DESDE EL SERVIDOR, VUELVA A INTRODODUCIR SUS DATOS DE INICIO')
                }
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
            axios.post(URL + '/usuarios/listar2', { cantidad: auth.cantidad }).then(json => {
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
            axios.post(URL + '/usuarios/establecimientos',).then(json => {
                setListaHospital(json.data)
            }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
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
            setCorreo({ campo: usuario[0].correo, valido: 'true' })
            setEli({ campo: parseInt(usuario[0].eliminado) ? 2 : 1, valido: 'true' })

            setListaHospital([{ id: usuario[0].idestablecimiento, nombre: usuario[0].establecimiento }])
            setModalEditar(true)
        }
        const vaciarDatos = async () => {
            setPass({ campo: null, valido: null })
            setPass1({ campo: null, valido: null })
            setId({ campo: null, valido: null })
            setRol({ campo: null, valido: null })
            setHospital({ campo: null, valido: null })
            setNombre({ campo: null, valido: null })
            setApe1({ campo: null, valido: null })
            setApe2({ campo: null, valido: null })
            setCelular({ campo: null, valido: null })
            setCorreo({ campo: null, valido: null })
            setEstado(0)
            setModalEditar(false)
            setModalInsertar(false)
        }

        const insertar = async () => {
            if (username.valido === 'true' && rol.valido === 'true' && pass.valido === 'true' && pass1.valido === 'true' &&
                hospital.valido === 'true' && nombre.valido === 'true' && ape1.valido === 'true' && estado === 0) {
                if (pass.campo === pass1.campo) {
                    let accion = await confirmarGuardar({ titulo: 'Guardar Registro ?', boton: 'ok', texto: 'Ok para continuar.' })
                    if (accion.isConfirmed) {
                        setEstado(1)
                        setTexto('Guardado...')
                        axios.post(URL + '/usuarios/registrar', {
                            "username": username.campo,
                            'otros': md5(pass.campo),
                            'hospital': hospital.campo,
                            'rol_': rol.campo,
                            'nombre': nombre.campo,
                            'ape1': ape1.campo, 'ape2': ape2.campo ? ape2.campo : 'NO REGISTRADO',
                            'celular': celular.campo ? celular.campo : '00000', 'correo': correo.campo ? correo.campo : 'example@sdis.ve',
                            'creado': fecha + ' ' + horafinal,
                            cantidad: auth.cantidad,
                        }).then(async json => {
                            if (json.data.ok) {
                                alert2({ icono: 'success', titulo: 'Registro Guardado', boton: 'ok', texto: json.data.msg })
                                setLista(json.data.data[0])
                                setCantidad(json.data.data[1])
                                vaciarDatos()
                                setModalInsertar(false)
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
        const validar = async () => {
            if (id.valido === 'true' && rol.valido === 'true' &&
                hospital.valido === 'true' && nombre.valido === 'true' && ape1.valido === 'true' && estado === 0) {
                let accion = await confirmarActualizar({ titulo: 'Habilitar Registro ?', boton: 'ok', texto: 'Ok para continuar.' })
                if (accion.isConfirmed) {
                    setEstado(1)
                    setTexto('Actualizando...')
                    setModalEditar(false)
                    setModalVer(false)
                    axios.post(URL + '/usuarios/validar', {
                        "id": id.campo,
                        'hospital': hospital.campo,
                        'rol_': rol.campo,
                        'nombre': nombre.campo,
                        'ape1': ape1.campo, "ape2": ape2.campo ? ape2.campo : 'NO REGISTRADO',
                        'celular': celular.campo ? celular.campo : '00000', 'correo': correo.campo ? correo.campo : 'example@sdis.ve',
                        'modificado': fecha + ' ' + horafinal,
                        "cantidad": auth.cantidad,
                    }).then(json => {
                        if (json.data.ok) {
                            alert2({ icono: 'success', titulo: 'Usuario habilitado', boton: 'ok', texto: json.data.msg })
                            setLista(json.data.data[0])
                            setCantidad(json.data.data[1])
                            vaciarDatos()
                            setEstado(0)
                        } else { alert2({ icono: 'warning', titulo: 'Operacion Fállida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                    }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });

                }
            } else toast.error('Complete todos los campos com * y verifique que esten bien escritos')
        }



        const actualizar = async (e) => {
            if (id.valido === 'true' && rol.valido === 'true' &&
                hospital.valido === 'true' && nombre.valido === 'true' && ape1.valido === 'true' && estado === 0) {
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
                        'ape1': ape1.campo, "ape2": ape2.campo ? ape2.campo : 'NO REGISTRADO',
                        'celular': celular.campo ? celular.campo : '00000', 'correo': correo.campo ? correo.campo : 'example@sdis.ve',
                        'modificado': fecha + ' ' + horafinal,
                        'estado': eli.campo === 2 ? 1 : 0 // registro eliminado
                    }).then(json => {
                        if (json.data.ok) {
                            alert2({ icono: 'success', titulo: 'Actualizado', boton: 'ok', texto: json.data.msg })
                            setUsuario(json.data.data)
                            // setCantidad(json.data.data[1])
                            vaciarDatos()
                            setEstado(0)
                            setModalVer(true)
                        } else { alert2({ icono: 'warning', titulo: 'Operacion Fállida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                    }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });

                }
            } else toast.error('Complete todos los campos com * y verifique que esten bien escritos')
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
            if (act === 0) {
                dir = URL + '/usuarios/next_'
            }
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
            // alert()
            let dir = null
            if (act === 1)
                dir = URL + '/usuarios/anterior'
            if (act === 0)
                dir = URL + '/usuarios/anterior_'
            if (lista.length > 0) {
                const last = lista[0].id
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

        return (
            <div style={{ background: '#e5e5e5', paddingTop: '0.4rem', paddingBottom: '0.4rem', height: '100vh' }}>
                <div className="container_">
                    {estado === 1 && <Load texto={texto} />}
                    <div className='contenedor-cabecera row'>

                        <div className='contenedor-cabecera row'>
                            <span className='titulo'>
                                GESTIONAR USUARIOS
                                {act === 0 &&
                                    <span style={{ color: '#dc3545', marginLeft: '5px' }}>{"  [USUARIOS NO HABILITADOS]"}</span>
                                }
                            </span>
                        </div>

                    </div>
                    <div className='contenedor p-2'>
                        <div className=' row elementos-contenedor botonModal pb-3'>
                            {act == 1 && <button className="btn-nuevo col-auto" onClick={() => { setModalInsertar(true); listarHospital(); listarRol() }} >
                                <FontAwesomeIcon className='btn-icon-nuevo' icon={faUser} />Nuevo
                            </button>}
                            {lista.length > 0 && lista[0].estado == 1 &&
                                <button className="btn-simple col-auto" onClick={() => { listarNuevos(); setAct(0); document.title = 'habilitar Usuarios' }} >
                                    <FontAwesomeIcon className='btn-icon-nuevo' icon={faUserCheck} />Habilitar
                                </button>
                            }
                            {/* <p className='alertas' >{'Se recomienda realizar los cambios con absoluta responsabilidad'}</p> */}

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
                        <div className="table table-responsive custom mb-2">

                            <table className="table table-sm" >
                                <thead>
                                    <tr >
                                        <th style={{background:'white', border:'2px solid  #006699 ' , borderBottom:'none'}} ></th>
                                        <th className="col-4 ">TITULAR</th>
                                        <th className="col-2 ">CELULAR</th>
                                        <th className="col-4 ">ESTABLECIMIENTO</th>
                                        <th className="col-2 ">USUARIO</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lista.map((a) => (
                                        a.estado === 1 ?
                                            <tr key={a.id} className='item'>

                                                <th className='tooltip_' >
                                                    <span class="tooltiptext_">Configurar Usuario</span>
                                                    <button type="button" class="adicionar" 
                                                    onClick={() => verUsuario(a.id)} >
                                                        <FontAwesomeIcon icon={faUserCog} />
                                                    </button>
                                                </th>
                                                <td >
                                                {a.eliminado ?
                                                                <FontAwesomeIcon className='stop' style={{ color: 'red' }} icon={faStop} />
                                                                :
                                                                <FontAwesomeIcon className='play' icon={faPlay} />} {a.titular}</td>
                                                <td >{a.celular}</td>
                                                <td  >{a.hospital}</td>
                                                <td  >{a.username}</td>
                                            </tr> : <tr key={a.id} className='item'>
                                                <td className='tooltip_' >
                                                    <span class="tooltiptext_">Click para mas detalles...  </span>
                                                    <div className='cantidad-registros' style={{ cursor: 'pointer' }} onClick={() => verUsuario(a.id)}>
                                                        <FontAwesomeIcon icon={faHandPointRight} /> {a.titular}
                                                    </div>
                                                </td>
                                                <td >{a.celular}</td>
                                                <td >
                                                    <div className='row'>
                                                        <div className='col-auto'>
                                                            {a.eliminado ?
                                                                <FontAwesomeIcon className='stop' icon={faRecycle} />
                                                                :
                                                                <FontAwesomeIcon className='play' icon={faPlay} />}
                                                        </div>
                                                        <div className='col-auto'>
                                                            {a.eliminado ? <span>SIN ACCESO</span> : <span> CON ACCESO</span>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td  >{a.hospital}</td>
                                                <td  >{a.username}</td>
                                            </tr>
                                    ))}
                                </tbody>
                            </table>
                            {lista.length < 1 && <div style={{ fontSize: '18px' }}>Lista Vacia</div>}
                        </div>
                        <div className='cantidad-registros'>{cantidad + ' Registro(s)'}
                        </div>

                        <div className='navegador-tabla'>
                            <span onClick={() => anterior()} className='move moveLeft'>
                                Anterior
                            </span>

                            <span onClick={() => siguiente()} className='move moveRight'>
                                Siguiente
                            </span>
                        </div>
                    </div>
                </div>


                <Modal isOpen={modalVer}>

                    {act == 1 ? <ModalHeader toggle={() => { setModalVer(false); listar() }}>DATOS PERSONALES</ModalHeader> :
                        <ModalHeader toggle={() => { setModalVer(false); listarNuevos() }}>DATOS PERSONALES</ModalHeader>}
                    <ModalBody>
                        {usuario.length > 0 && <div>
                            {usuario[0].estado == 0 && <p style={{ fontSize: '18px', color: '#f54021' }}>USUARIO SIN VALIDAR</p>}
                            <div className='row p-1 mb-1'>
                                <div className='encabezado col-6'>Establecimiento</div>
                                <div className='contenido col-6' >{usuario[0].establecimiento}</div>
                            </div>
                            <div className='row p-1 mb-1'>
                                <div className='encabezado col-6'>Rol Usuario</div>
                                <div className='contenido col-6'>{usuario[0].rol ? usuario[0].rol : 'NO TIENE'}</div>
                            </div>
                            <div className='row p-1'>
                                <div className='encabezado col-6'>Nombre de Usuario</div>
                                <div className='contenido col-6'>{usuario[0].username}</div>
                            </div>

                            <div className='row p-1'>
                                <div className='encabezado col-6'>Nombre Completo</div>
                                <div className='contenido col-6'>{usuario[0].nombre}</div>
                            </div>
                            <div className='row p-1'>
                                <div className='encabezado col-6'>Primer apellido</div>
                                <div className='contenido col-6'>{usuario[0].apellido1}</div>
                            </div>
                            <div className='row p-1'>
                                <div className='encabezado col-6'>Segundo apellido</div>
                                <div className='contenido col-6'>{usuario[0].apellido2}</div>
                            </div>
                            <div className='row p-1'>
                                <div className='encabezado col-6'>Celular/telef.</div>
                                <div className='contenido col-6'>{usuario[0].celular}</div>
                            </div>
                            <div className='row p-1'>
                                <div className='encabezado col-6'>Correo</div>
                                <div className='contenido col-6'>{usuario[0].correo}</div>
                            </div>
                            <div className='row p-1'>
                                <div className='encabezado col-6'>Estado</div>
                                <div className='contenido col-6' >{usuario[0].eliminado ? 'SIN ACCESO' : 'CON ACCESO'}</div>
                            </div>
                        </div>}

                    </ModalBody>
                    {act === 1 ? <div className='botonModal'>
                        <button className="btn-eliminar col-auto" onClick={() => setModalRecet(true)} >
                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faLock} />Reiniciar Contraseña
                        </button>
                        <button className="btn-editar col-auto" onClick={() => rellenar()} >
                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faUserEdit} />ACTUALIZAR
                        </button>
                    </div> :
                        <div className='botonModal'>
                            <button className="btn-editar col-auto" onClick={() => rellenar()} >
                                <FontAwesomeIcon className='btn-icon-nuevo' icon={faCheck} />HABILITAR
                            </button>
                        </div>}
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
                        <div className='row'>
                            <div className='col-12 col-sm-6 col-md-6 col-lg-6'>
                                <Select1
                                    estado={rol}
                                    cambiarEstado={setRol}
                                    ExpresionRegular={INPUT.ID}
                                    lista={listaRol}
                                    etiqueta={'Rol'}
                                    msg='Seleccione una opcion'

                                />
                            </div>
                            <div className='col-12 col-sm-6 col-md-6 col-lg-6'>

                                <Select1
                                    estado={hospital}
                                    cambiarEstado={setHospital}
                                    ExpresionRegular={INPUT.ID}
                                    lista={listaHopistal}
                                    etiqueta={'Establecimiento'}
                                    msg='Seleccione una opcion'
                                />
                            </div>

                        </div>

                        <div className='row'>
                            <div className='col-8'>
                                <User_
                                    estado={username}
                                    cambiarEstado={setUsername}
                                    placeholder="USUARIO"
                                    ExpresionRegular={INPUT.INPUT_USUARIO}  //expresion regular  
                                    etiqueta='Username'
                                    campoUsuario={true}
                                    msg={'Este campo acepta solo letras '}
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
                                    important={false}
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
                                    important={false}
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
                                    important={false}
                                /></div>
                        </div>

                    </ModalBody>
                    <div className='botonModal'>
                        <button className="btn-guardar col-auto" onClick={() => insertar()} >
                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faSave} />Guardar
                        </button>
                    </div>
                </Modal>

                <Modal isOpen={modalEditar}>

                    <ModalHeader toggle={() => {
                        vaciarDatos();
                    }}>  Actualizar Usuario</ModalHeader>
                    <ModalBody>
                        <div className='row'>

                            <div className='col-12 col-sm-4 col-md-4 col-lg-4'>
                                <Select1
                                    estado={rol}
                                    cambiarEstado={setRol}
                                    ExpresionRegular={INPUT.ID}
                                    lista={listaRol}
                                    etiqueta={'Rol'}
                                    msg='Seleccione una opcion'
                                />
                            </div>
                            <div className='col-12 col-sm-5 col-md-5 col-lg-5'>

                                <Select1
                                    estado={hospital}
                                    cambiarEstado={setHospital}
                                    ExpresionRegular={INPUT.ID}
                                    lista={listaHopistal}
                                    etiqueta={'Establecimiento'}
                                    msg='Seleccione una opcion'
                                />
                            </div>
                            <div className='col-12 col-sm-3 col-md-3 col-lg-3'>

                                {act === 1 && <Select1
                                    estado={eli}
                                    cambiarEstado={setEli}
                                    ExpresionRegular={INPUT.ID}
                                    lista={eliminado}
                                    etiqueta={'Estado'}
                                    msg='Seleccione una opcion'
                                />}
                            </div>
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
                                    important={false}
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
                                    important={false}
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
                                    important={false}
                                /></div>
                        </div>

                    </ModalBody>
                    <div className='botonModal'>
                        {act === 1 ? <button className="btn-editar col-auto" onClick={() => actualizar()} >
                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faUserEdit} />Actualizar
                        </button> :
                            <button className="btn-editar col-auto" onClick={() => validar()} >
                                <FontAwesomeIcon className='btn-icon-nuevo' icon={faCheck} />Habilitar
                            </button>}
                    </div>
                </Modal>

            </div >

        );

    } catch (error) {

    }

}
export default Usuario;
