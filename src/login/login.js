import './login.css'
import { InputUsuario } from './elementos'
import { INPUT } from './expresiones'
import { useState } from 'react'
import useAuth from "../Auth/useAuth";
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { URL } from '../Auth/config';
import md5 from 'md5';
import { alert2 } from '../elementos/alert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignIn, faStairs } from '@fortawesome/free-solid-svg-icons';


export default function Login() {

    const [usuario, setUsuario] = useState({ campo: '', valido: null })
    const [password, setPassword] = useState({ campo: '', valido: null })

    const auth = useAuth()
    const iniciarSesion = async () => {
        if (usuario.valido === 'true' && password.valido === 'true') {

            axios.get(URL + '/', {
                params: {
                    'intel': usuario.campo,
                    'power': '8989389892njn89h8982njcnjnskdjcn909u09j3oi2n3i2093j2kn3k23',
                    'viva': md5(password.campo),
                    'tigo': 'juana',
                    'start': 'garay',
                    'pass': '7827huin3jnud3978EEy9uhn88839j8nld32d23d32dcdsvDFDEewrer',
                }
            }).then(json => {
                if (json.data.ok) {
                    localStorage.setItem('tiempo', new Date().getMinutes())
                    const token = json.data.token
                    localStorage.setItem("token", token)
                    localStorage.setItem('username', json.data.username)
                    localStorage.setItem('nombre', json.data.nombre)
                    localStorage.setItem('apellido', json.data.apellido)
                    localStorage.setItem('rol', json.data.rol)
                    localStorage.setItem('numRol', json.data.numRol)
                    localStorage.setItem('est', json.data.establecimiento)
                    localStorage.setItem('red', json.data.red)
                    localStorage.setItem('mun', json.data.municipio)
                    auth.login('ok')

                }
                else
                    toast.error(json.data.msg)
            }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al iniciar Sesión', boton: 'ok', texto: error.toJSON().message }); });
        } else toast.error('Introduzca sus credenciales de acceso')
    }
    return (

        <div className="main">
            <div style={{ minHeight: '657px' }}>
                <div className='page'>
                    <div className='sistema'>SISTEMA SDIS VE</div>
                    <div className='institucion'>
                        <h5 className="titulo">SEDES CH</h5>
                        <p className='titulo1'>SERVICIO DEPARTAMENTAL DE SALUD</p>
                        <h2 className='titulo2'>CHUQUISACA-BOLIVIA</h2>
                    </div>
                    <br />
                    <div className='m-3'>
                        <div className="col-12 mb-3">
                            <InputUsuario
                                estado={usuario}
                                cambiarEstado={setUsuario}
                                tipo="text"
                                placeholder="Usuario"
                                ExpresionRegular={INPUT.INPUT_USUARIO}
                                span="fas fa-envelope"
                                campoUsuario={true}
                                etiqueta={'Usuario'}
                                eventoBoton={iniciarSesion}
                                msg={'Este campo acepta letras minúsculas'}
                            />
                        </div>
                        <div className="col-12 mb-3">
                            <InputUsuario
                                estado={password}
                                cambiarEstado={setPassword}
                                tipo="password"
                                placeholder="Contraseña"
                                ExpresionRegular={INPUT.PASSWORD}
                                span="fas fa-lock"
                                etiqueta={'Contraseña'}
                                eventoBoton={iniciarSesion}
                                msg={'Este campo acepta de 4-12 de todos los caracteres'}
                            />
                        </div>
                        <button
                            onClick={iniciarSesion}
                            className=" mb-3 btn btn-primary btn-block btn-iniciar col-12 mb-4"
                        >Ingresar
                        </button>
                        <div className='row mt-4 pb-4'>


                                <div className='botonModal'>
                                    <a style={{textDecoration:'none'}} href='/registrarme'>
                                    <span style={{paddingRight:'15px', fontSize:'16px'}}> Registrarme</span>  <FontAwesomeIcon style={{fontSize:'18px', paddingRight:'3px'}} icon={faSignIn} />
                                    </a>
                                </div>



                        </div>

                    </div>
                </div>
                <Toaster position='top-right' />
            </div>
        </div >
    )
}