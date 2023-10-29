import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUser, } from '@fortawesome/free-solid-svg-icons';

import { InputUsuario, Select1 } from '../elementos/elementos';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados
import { InputUsuario as User_, } from '../login/elementos';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados
import { useState, useEffect } from "react";
import { URL, INPUT } from '../Auth/config';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast'
import '../elementos/estilos.css'
import { alert2, confirmarGuardar, exito } from '../elementos/alert2'
import md5 from 'md5'


function Registro() {

    const [listaHopistal, setListaHospital] = useState([]);

    const [hospital, setHospital] = useState({ campo: null, valido: null });
    const [username, setUsername] = useState({ campo: null, valido: null });
    const [pass, setPass] = useState({ campo: null, valido: null });
    const [pass1, setPass1] = useState({ campo: null, valido: null });
    const [nombre, setNombre] = useState({ campo: null, valido: null });
    const [ape1, setApe1] = useState({ campo: null, valido: null });
    const [ape2, setApe2] = useState({ campo: null, valido: null });
    const [correo, setCorreo] = useState({ campo: null, valido: null });
    const [celular, setCelular] = useState({ campo: null, valido: null });

    const [modalInsertar, setModalInsertar] = useState(false);

    const [estado, setEstado] = useState(0)



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
            document.title = 'username'
            axios.get(URL + '/listarestablecimiento').then(json => {
                setListaHospital(json.data)
            })
        }, [])


        const insertar = async () => {
            if (username.valido === 'true' && pass.valido === 'true' && pass1.valido === 'true' &&
                hospital.valido === 'true' && nombre.valido === 'true' && ape1.valido === 'true'  && estado === 0) {
                if (pass.campo === pass1.campo) {
                    let accion = await confirmarGuardar({ titulo: 'Guardar Registro ?', boton: 'ok', texto: 'Ok para continuar.' })
                    if (accion.isConfirmed) {
                        setEstado(1)
                        axios.get(URL + '/public/registrarme', {
                            params: {
                                "username": username.campo,
                                'otros': md5(pass.campo),
                                'hospital': hospital.campo,
                                'nombre': nombre.campo,
                                'ape1': ape1.campo, 'ape2': ape2.campo?ape2.campo:'NO REGISTRADO',
                                'celular': celular.campo ? celular.campo:'00000', 'correo': correo.campo ?correo.campo:'example@sdis.ve',
                                'creado': fecha + ' ' + horafinal
                            }
                        }).then(async json => {
                            if (json.data.ok) {
                                const a = await exito({ titulo: 'Registro Exitoso', boton: 'ok', texto: json.data.msg })
                                if (a.isConfirmed)
                                    window.location.href = '/sdis1'
                                else {
                                    setUsername({ campo: null, valido: null })
                                    setPass({ campo: null, valido: null })
                                    setPass1({ campo: null, valido: null })
                                    setHospital({ campo: null, valido: null })
                                    setNombre({ campo: null, valido: null })
                                    setApe1({ campo: null, valido: null })
                                    setApe2({ campo: null, valido: null })
                                    setCelular({ campo: null, valido: null })
                                    setCorreo({ campo: null, valido: null })
                                    setModalInsertar(false)
                                    setEstado(0)
                                }
                            } else { alert2({ icono: 'warning', titulo: 'Registro Fállido', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                        }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                    }
                } else alert2({ icono: 'error', titulo: 'Contraseñas diferentes', boton: 'ok', texto: 'las contraseñas no coinciden!, verifique e intente nuevamente' })
            } else toast.error('la informacion debe estar en el formato solicitado')
        }

        console.log(hospital, listaHopistal)

        return (
            <div style={{ background: '#e5e5e5', paddingTop: '0.4rem', paddingBottom: '0.4rem', height: '100vh' }} >
                <div className="container_regis" >
                    <div className='contenedor-cabecera row'>
                        <span className='titulo'> FORMULARIO REGISTRO DE USUARIO  </span>
                    </div>
                    <div className='separador mb-3 mb-sm-0 mb-md-0 mb-lg-0'>
                        <span>
                            {new Date().getFullYear() + '   '}::SDIS-VE
                        </span>
                    </div>


                    <div className='contenedor p-2'>
                        <div className='row elementos-contenedor'>
                            <p className='nota'><span style={{ fontWeight: 'bold' }}>nota ::</span>Seleccione el establecimiento correcto</p>
                            <p className='alertas' >{'Se recomienda llenar el siguiente formulario con informacion verdadera. Una vez realizado el registro el administrador le consedera el acceso al sistema SDIS-VE asignandole el rol correspondiente.'}</p>

                        </div>
                        <div className='cajaprimario-reportes p-3'>
                            <Select1
                                estado={hospital}
                                cambiarEstado={setHospital}
                                ExpresionRegular={INPUT.ID}
                                lista={listaHopistal}
                                etiqueta={'Establecimiento'}
                                msg='Seleccione una opcion'
                            />

                            <div className='row'>
                                <div className='col-lg-4 col-md-4 col-sm-4 col-12'>
                                    <User_
                                        estado={username}
                                        cambiarEstado={setUsername}
                                        placeholder="USUARIO"
                                        ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular  
                                        etiqueta='Username'
                                        campoUsuario={true}
                                        msg={'Este campo acepta letras minúsculas'}
                                    /></div>
                                <div className='col-lg-4 col-md-4 col-sm-4 col-6'>
                                    <User_
                                        estado={pass}
                                        cambiarEstado={setPass}
                                        placeholder="CONTRASEÑA"
                                        ExpresionRegular={INPUT.PASSWORD}  //expresion regular  
                                        etiqueta='Contraseña'
                                        msg={'Este campo acepta todos los caracteres'}
                                        campoUsuario={true}
                                    /></div>
                                <div className='col-lg-4 col-md-4 col-sm-4 col-6'>
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
                                        etiqueta='Primer apellido'
                                        msg={'Este campo acepta solo letras '}
                                    /></div>
                                <div className='col-6'>
                                    <InputUsuario
                                        estado={ape2}
                                        cambiarEstado={setApe2}
                                        placeholder="APELLIDO 2 "
                                        ExpresionRegular={INPUT.NOMBRE_PERSONA}  //expresion regular  
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

                        </div>

                    </div>
                    <div className='botonModal pb-2'>
                        <button className="btn-nuevo col-auto" style={{ marginTop: '5px' }} onClick={() => setModalInsertar(true)} >
                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faUser} />Registrarme
                        </button>
                    </div>

                </div>

                <Modal isOpen={modalInsertar}>

                    <ModalHeader toggle={() => setModalInsertar(false)}> FORMULARIO DE REGISTRO DE USUARIO</ModalHeader>
                    <ModalBody>
                        <p style={{ fontSize: '18px' }}>Datos Personales</p>
                        <div className='row p-2 mb-1'>
                            <div className='encabezado col-6'>Establecimiento</div>
                            {listaHopistal.map(e => (
                                parseInt(e.id) == hospital.campo && <div className='contenido col-6'>{e.nombre}</div>
                            ))}
                        </div>
                        <div className='row p-2'>
                            <div className='encabezado col-6'>Nombre de Usuario</div>
                            <div className='contenido col-6'>{username.campo}</div>
                        </div>
                        <div className='row p-2 mb-1'>

                            <div className='encabezado col-6'>Contraseña de Acceso</div>
                            <div className='contenido col-6'>{pass.campo}</div>
                        </div>
                        <div className='row p-2'>
                            <div className='encabezado col-6'>Nombre Completo</div>
                            <div className='contenido col-6'>{nombre.campo}</div>
                        </div>
                        <div className='row p-2'>
                            <div className='encabezado col-6'>Apellido Paterno</div>
                            <div className='contenido col-6'>{ape1.campo}</div>
                        </div>
                        <div className='row p-2'>
                            <div className='encabezado col-6'>Apellido Materno</div>
                            <div className='contenido col-6'>{ape2.campo}</div>
                        </div>
                        <div className='row p-2'>
                            <div className='encabezado col-6'>Celular/telef.</div>
                            <div className='contenido col-6'>{celular.campo}</div>
                        </div>
                        <div className='row p-2'>
                            <div className='encabezado col-6'>Correo</div>
                            <div className='contenido col-6'>{correo.campo}</div>
                        </div>

                    </ModalBody>
                    <div className='botonModal'>
                        <button className="btn-guardar col-auto" onClick={() => insertar()} >
                            <FontAwesomeIcon className='btn-icon-nuevo' icon={faSave} />Guardar Registro
                        </button>
                    </div>
                    {/* <div className='cantidad-registros'>SISTEMA DEPARTAMENTAR DE INFORAMACION DE SALUD SDIS</div> */}

                </Modal>



                <Toaster position='top-right' />
            </div>

        );

    } catch (error) {
        setEstado(0);// auth.logout()
    }

}
export default Registro;
