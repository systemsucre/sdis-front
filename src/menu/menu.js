import './css/stilos.css'
import './js/app'
import useAuth from '../Auth/useAuth';
import { salir as salir_, confirmarActualizar, alert2, recet } from '../elementos/alert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faLock, faPowerOff, faRefresh, faSave, } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { InputUsuario, Select1 } from '../elementos/elementos';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados
import { InputUsuario as User_, } from '../login/elementos';
import { useState } from "react";
import axios from 'axios';
import { URL, INPUT } from '../Auth/config';
import { toast, Toaster } from 'react-hot-toast';
import md5 from 'md5';

function Menu() {
    const [usuario, setUsuario] = useState([]);
    const [modalVer, setModalVer] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalRecet, setModalRecet] = useState(false);


    const [pass, setPass] = useState({ campo: null, valido: null });
    const [pass1, setPass1] = useState({ campo: null, valido: null });
    const [pass2, setPass2] = useState({ campo: null, valido: null });
    const [nombre, setNombre] = useState({ campo: null, valido: null });
    const [ape1, setApe1] = useState({ campo: null, valido: null });
    const [ape2, setApe2] = useState({ campo: null, valido: null });
    const [correo, setCorreo] = useState({ campo: null, valido: null });
    const [celular, setCelular] = useState({ campo: null, valido: null });

    const [estado, setEstado] = useState(0)

    let today = new Date()
    let fecha = today.toISOString().split('T')[0]
    console.log(today)
    let hora = new Date().toLocaleTimeString().split(':')[0]
    let min = new Date().toLocaleTimeString().split(':')[1]
    let sec = new Date().toLocaleTimeString().split(':')[2]
    // if (hora < 10 && hora != 0) hora = '0' + hora
    let horafinal = hora + ':' + min + ':' + sec


    const auth = useAuth()
    const salir = async () => {
        // const ok = await salir_({ titulo: 'Cerrar Sesión', boton: 'ok', texto: 'Ok para continuar.' })
        // if (ok.isConfirmed) {
        auth.logout()
        // }
    }
    const rellenar = async () => {
        setNombre({ campo: usuario[0].nombre, valido: 'true' })
        setApe1({ campo: usuario[0].apellido1, valido: 'true' })
        setApe2({ campo: usuario[0].apellido2, valido: 'true' })
        setCelular({ campo: usuario[0].celular, valido: 'true' })
        setCorreo({ campo: usuario[0].correo, valido: 'true' })
        setModalEditar(true)
    }

    const verUsuario = async (id) => {
        axios.post(URL + '/miPerfil/ver').then(json => {
            if (json.data.ok) {
                setUsuario(json.data.data)
                setModalVer(true)
            }
            else alert2({ icono: 'warning', titulo: 'Sin datos', boton: 'ok', texto: json.data.msg })
        }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
    }


    const recet_ = async () => {
        if (pass.valido === 'true' && pass1.valido === 'true' && pass2.valido === 'true') {
            if (pass1.campo === pass2.campo) {
                let accion = await recet({ titulo: 'Cambiar Contraseña', boton: 'ok', texto: 'Ok para continuar.' })
                if (accion.isConfirmed) {
                    axios.post(URL + '/miPerfil/cambiarMiContrasena', {
                        'pass1': md5(pass.campo),
                        'pass2': md5(pass2.campo),
                        'modificado': fecha + ' ' + horafinal
                    }).then(async json => {
                        if (json.data.ok) {
                            alert2({ icono: 'success', titulo: 'Operacion exitosa', boton: 'ok', texto: json.data.msg })
                            setModalRecet(false)
                        } else { alert2({ icono: 'warning', titulo: 'Operacion Fállida', boton: 'ok', texto: json.data.msg }) }
                    }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                }
            } else alert2({ icono: 'error', titulo: 'Contraseñas diferentes', boton: 'ok', texto: 'las contraseñas no coinciden!, verifique e intente nuevamente' })
        } else toast.error('Complete todos los campos con *, y verifique que todos los datos proporcionados sean los correctos')
    }


    const actualizar = async (e) => {
        if (nombre.valido === 'true' && ape1.valido === 'true' ) {
            let accion = await confirmarActualizar({ titulo: 'Actualizar Registro ?', boton: 'ok', texto: 'Ok para continuar.' })
            if (accion.isConfirmed) {
                axios.post(URL + '/miPerfil/actualizarMiPerfil', {
                    'nombre': nombre.campo,
                    'ape1': ape1.campo, "ape2": ape2.campo ? ape2.campo : 'NO REGISTRADO',
                    'celular': celular.campo ? celular.campo : '00000', 'correo': correo.campo ? correo.campo : 'example@sdis.ve',
                    'modificado': fecha + ' ' + horafinal
                }).then(json => {
                    if (json.data.ok) {
                        alert2({ icono: 'success', titulo: 'Actualizado', boton: 'ok', texto: json.data.msg })
                        setUsuario(json.data.data)
                        setModalEditar(false)
                    } else { alert2({ icono: 'warning', titulo: 'Operacion Fállida', boton: 'ok', texto: json.data.msg }) }
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });

            }
        }
    }




    return (
        <nav className='menu'>
            <section className='menu__container'>


                <ul className='contenedor-info'>
                    <li className='lista-logo'>
                        <h1 className='menu__logo'>SDIS-VE</h1>
                    </li>
                    <ul className='contenedorperfil' >
                        <li className='nombreperfil'>
                            <a>{localStorage.getItem('nombre') + ' ' + localStorage.getItem('apellido')}
                                <span style={{ textTransform: 'lowercase' }}>{' (' + localStorage.getItem('username') + ')'}</span></a>
                        </li>
                        <li className='rolperfil' >
                            <a>{localStorage.getItem('est')}</a>
                        </li>
                    </ul>
                </ul>
                <ul className='menu__links'>


                    {parseInt(localStorage.getItem('numRol')) === 1 &&
                        <>
                            <li className='menu__item hidden_from_variables'>
                                <a href='/variables' className='menu__link hidden_from_g_variables'>FORMULARIOS SDIS-VE</a>
                            </li>
                            <li className='menu__item menu__item--show'>
                                <a href='#' className='menu__link'>ADMINISTRACION <img src="./img/arrow.png" alt='Menus' className='menu__arrow' /></a>
                                <ul className='menu__nesting'>
                                    <li className='menu__inside hidden_from_g_usuarios'>
                                        <a href='/usuarios' className='menu__link menu_link--inside'>Usuarios</a>
                                    </li>
                                    <li className='menu__inside hidden_from_administracion'>
                                        <a href='/establecimiento' className='menu__link menu_link--inside '>Establecimientos</a>
                                    </li>
                                    <li className='menu__inside hidden_from_gestion'>
                                        <a href='/gestion' className='menu__link menu_link--inside '>Gestion</a>
                                    </li>
                                    <li className='menu__inside hidden_from_mes'>
                                        <a href='/meses' className='menu__link menu_link--inside '>Meses</a>
                                    </li>

                                </ul>
                            </li>
                        </>
                    }



                    {parseInt(localStorage.getItem('numRol')) === 2 &&
                        <>
                            <li className='menu__item hidden_from_formulario'>
                                <a href='/reportes2' className='menu__link'>REPORTES</a>
                            </li>

                            <li className='menu__item menu__item--show'>
                                <a href='#' className='menu__link'>ADMINISTRACION <img src="./img/arrow.png" alt='Menus' className='menu__arrow' /></a>
                                <ul className='menu__nesting'>
                                    <li className='menu__inside hidden_from_g_usuarios'>
                                        <a href='#' className='menu__link menu_link--inside'>Oportunidad de información</a>
                                    </li>
                                    <li className='menu__inside hidden_from_mes'>
                                        <a href='/meses' className='menu__link menu_link--inside '>Meses</a>
                                    </li>
                                </ul>
                            </li>
                        </>
                    }
                    {parseInt(localStorage.getItem('numRol')) === 3 &&
                        <>
                            <li className='menu__item hidden_from_formulario'>
                                <a href='/reportes3' className='menu__link'>REPORTES</a>
                            </li>

                            <li className='menu__item menu__item--show'>
                                <a href='#' className='menu__link'>ADMINISTRACION <img src="./img/arrow.png" alt='Menus' className='menu__arrow' /></a>
                                <ul className='menu__nesting'>
                                    <li className='menu__inside hidden_from_g_usuarios'>
                                        <a href='#' className='menu__link menu_link--inside'>Oportunidad de información</a>
                                    </li>

                                    <li className='menu__inside hidden_from_formulario'>
                                        <a href='/formulario' className='menu__link menu_link--inside'>Formulario</a>
                                    </li>
                                </ul>
                            </li>
                        </>
                    }
                    {parseInt(localStorage.getItem('numRol')) === 4 &&
                        <>
                            <li className='menu__item hidden_from_formulario'>
                                <a href='/reportes4' className='menu__link'>REPORTES</a>
                            </li>

                            <li className='menu__item menu__item--show'>
                                <a href='#' className='menu__link'>ADMINISTRACION <img src="./img/arrow.png" alt='Menus' className='menu__arrow' /></a>
                                <ul className='menu__nesting'>
                                    <li className='menu__inside hidden_from_g_usuarios'>
                                        <a href='#' className='menu__link menu_link--inside'>Oportunidad de información</a>
                                    </li>

                                    <li className='menu__inside hidden_from_formulario'>
                                        <a href='/formulario' className='menu__link menu_link--inside'>Formulario</a>
                                    </li>
                                </ul>
                            </li>
                        </>
                    }

                    {parseInt(localStorage.getItem('numRol')) === 5 && <>
                        <li className='menu__item hidden_from_formulario'>
                            <a href='/formulario' className='menu__link'>FORMULARIO</a>
                        </li>

                        <li className='menu__item hidden_from_formulario'>
                            <a href='/reportes5' className='menu__link'>REPORTES</a>
                        </li>
                    </>
                    }

                    <br />
                    <li className='menu__item menu__item--show'>
                        <a href='#' className='menu__link'>MI PERFIL <img src="./img/arrow.png" alt='Menus' className='menu__arrow' /></a>

                        <ul className='menu__nesting'>

                            <li className='menu__inside hidden_from_mostrar_perfil' onClick={() => verUsuario()}>
                                <a className='menu__link menu_link--inside' >{localStorage.getItem('nombre') + ' ' + localStorage.getItem('apellido')}
                                    <span style={{ textTransform: 'lowercase' }} >{' (' + localStorage.getItem('username') + ')'}</span></a>
                            </li>
                            <li className='menu__inside hidden_from_cerrar_sesion'>

                                <a href='#' className='menu__link menu_link--inside' onClick={() => salir()} ><span> <FontAwesomeIcon icon={faPowerOff} style={{ color: 'white', marginRight: '3px' }} /></span>Cerrar Sesion</a>
                            </li>
                        </ul>
                    </li>
                </ul>
                <div className='menu__hamburguer'>
                    <img src='./img/menu.png' className='menu__img' alt='menu amburguer' />
                </div>
            </section>
            <Modal isOpen={modalVer}>

                <ModalHeader toggle={() => setModalVer(false)}>DATOS PERSONALES</ModalHeader>
                <ModalBody>
                    {usuario.length > 0 && <>
                        {usuario[0].estado == 0 && <p style={{ fontSize: '18px', color: '#f54021' }}>USUARIO SIN VALIDAR</p>}
                        <div className='row p-2 mb-1'>
                            <div className='encabezado col-6'>Establecimiento</div>
                            <div className='contenido col-6'>{usuario[0].establecimiento}</div>
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
                    </>}

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
                        etiqueta='Contraseña Actual'
                        msg={'Este campo acepta todos los caracteres'}
                        campoUsuario={true}
                    />

                    <User_
                        estado={pass1}
                        cambiarEstado={setPass1}
                        placeholder="CONTRASEÑA"
                        ExpresionRegular={INPUT.PASSWORD}  //expresion regular  
                        etiqueta='Nueva Contraseña'
                        msg={'Este campo acepta todos los caracteres'}
                        campoUsuario={true}
                    />
                    <User_
                        estado={pass2}
                        cambiarEstado={setPass2}
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
            <Modal isOpen={modalEditar}>

                <ModalHeader toggle={() => {
                    setModalEditar(false)
                }}>  Actualizar mi Perfil</ModalHeader>
                <ModalBody>
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
                                placeholder="PRIMER APELLIDO"
                                ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular  
                                etiqueta='Primer apellido'
                                msg={'Este campo acepta solo letras '}
                            /></div>
                        <div className='col-6'>
                            <InputUsuario
                                estado={ape2}
                                cambiarEstado={setApe2}
                                placeholder="SEGUNDO APELLIDO"
                                ExpresionRegular={INPUT.PASSWORD}  //expresion regular  
                                etiqueta='Segundo apellido'
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
                    <button className="btn-editar col-auto" onClick={() => actualizar()} >
                        <FontAwesomeIcon className='btn-icon-nuevo' icon={faEdit} />Actualizar
                    </button>
                </div>
            </Modal>
            <Toaster position='bottom-right' toastOptions={{
                className: '',
                duration: 2000,
                style: {
                    background: '#363636',
                    color: '#fff',
                    fontSize: "12px",
                }
            }} />

        </nav>
    )
}

export default Menu; 