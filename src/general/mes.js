import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faCog, faCogs, faEdit, faHandPointRight, } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../Auth/useAuth"
import { InputUsuario, Select1XL, } from '../elementos/elementos';  // componente input que incluye algunas de las funcionalidades como, setInput, validaciones cambio de estados
import { useState, useEffect } from "react";
import { URL, INPUT } from '../Auth/config';
import axios from 'axios';
import { Toaster } from 'react-hot-toast'
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
                if (json.data.hasOwnProperty("sesion")) {
                    auth.logout()
                    alert('LA SESION FUE CERRADO DESDE EL SERVIDOR, VUELVA A INTRODODUCIR SUS DATOS DE INICIO')
                }
                if (json.data.ok) {
                    setLista(json.data.data[0])
                    setCantidad(json.data.data[1])
                    setEstado(0)
                } else { alert2({ icono: 'warning', titulo: 'Operacion fallida o acceso denegado', boton: 'ok', texto: json.data.msg }); setEstado(0) }
            }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }
        const listarGestion = async () => {
            axios.post(URL + '/mes/listargestion').then(json => {
                if (json.data.ok) {
                    setListaGestion(json.data.data)
                } else alert2({ icono: 'warning', titulo: 'Operacion fallida o acceso denegado', boton: 'ok', texto: json.data.msg })
            }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
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
                    } else { alert2({ icono: 'warning', titulo: 'Operacion fallida o acceso denegado', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
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
                    } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });

                setModalEditar(false)
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
            <div style={{ background: '#e5e5e5', paddingTop: '0.4rem', paddingBottom: '0.4rem', height: '100vh' }}>
                <div className="container_">
                    {estado === 1 && <Load texto={texto} />}

                    <div className='contenedor-cabecera row'>

                        <div className='contenedor-cabecera row'>
                            <span className='titulo'>
                                {'MESES  (GESTIÓN ' + año + ')'}
                            </span>
                        </div>
                    </div>
                    <div className='separador mb-3 mb-sm-0 mb-md-0 mb-lg-0'>
                        <span>
                            {'GESTION :: ' + año}
                        </span>
                    </div>
                    <div className='contenedor p-2'>
                        <div className=' row elementos-contenedor botonModal'>
                            <div className='col-7'>
                                <Select1XL
                                    estado={gestion}
                                    cambiarEstado={setGestion}
                                    ExpresionRegular={INPUT.ID}
                                    lista={listaGestion}
                                    etiqueta={'Gestion'}
                                    funcion={listar}
                                    msg='Seleccione una opcion'
                                /></div>
                        </div>

                        <div className="table table-responsive custom mb-2" style={{ height: '310px' }}>
                            <table className="table table-sm" >
                                <thead>
                                    <tr >
                                        <th style={{background:'white', border:'2px solid  #006699 ' , borderBottom:'none'}}  ></th>
                                        <th className="col-6 ">MES</th>
                                        <th className="col-3 ">INICIAL</th>
                                        <th className="col-3">FINAL</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {lista.map((a) => (
                                        <tr key={a.id} >
                                            <th className='tooltip_' >
                                                <span class="tooltiptext_">Modificar fechas</span>
                                                <button type="button" class="adicionar" onClick={() => rellenar(a)}style={{ cursor: 'pointer' }}>
                                                    <FontAwesomeIcon icon={faCog} />
                                                </button>
                                            </th>

                                            <td >{a.mes}</td>
                                            <td  >{a.ini}</td>
                                            <td  >{a.fin}</td>

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
                    }}>  {mes + ' (GESTIÓN  ' + año + ')'}</ModalHeader>
                    <ModalBody>
                        <div className='row'>
                            <div className='col-6'>
                                <InputUsuario
                                    estado={ini}
                                    tipo='date'
                                    cambiarEstado={setIni}
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
                                    ExpresionRegular={INPUT.HORA}  //expresion regular  
                                    etiqueta='Hora Final'
                                    msg={'Este campo acepta letras, numero y algunos caracteres'}
                                />
                            </div>
                        </div>
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
        setEstado(0);// auth.logout()
    }

}
export default Mes;
