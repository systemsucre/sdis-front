import React from 'react';
import { Table } from 'reactstrap';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../Auth/useAuth"
import { useState, useEffect } from "react";
import { INPUT, URL, } from '../Auth/config';
import axios from 'axios';
import { toast } from 'react-hot-toast'
import '../elementos/estilos.css'
import { alert2, confirmarGuardar } from '../elementos/alert2'
import Load from '../elementos/load'
import { Select1XL, SelectSM, } from '../elementos/elementos';
import { InputDinamico, } from '../elementos/stylos'


function Formulario3() {
    const auth = useAuth()


    const [listaGestion, setListaGestion] = useState([]);
    const [listaSs, setListaSs] = useState([]);
    const [datosVariable, setDatosVAriable] = useState([]);
    const [listaCabecera, setListaCabecera] = useState([]);
    const [maxOrden, setMaxOrden] = useState(0);



    const [listaVariable, setListaVariable] = useState([]);
    const [listaMes, setListaMes] = useState([]);
    const [estadomes, setEstadomes] = useState(null);
    const [listaIndicadores, setListaIndicadores] = useState([]);
    const [listaInput, setListaInput] = useState([]);

    const [gestion, setGestion] = useState({ campo: null, valido: null })
    const [mes, setMes] = useState({ campo: null, valido: null })
    const [variable, setVariable] = useState({ campo: null, valido: null })
    const [ss, setSs] = useState({ campo: null, valido: null })

    const [estado, setEstado] = useState(null);
    const [texto, setTexto] = useState(null);

    const [ventana, setVentana] = useState(0);



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
            document.title = 'FORMULARIO'
            listarGestion()
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
            axios.post(URL + '/formulario3/listargestion').then(json => {
                if (json.data.hasOwnProperty("sesion")) {
                    auth.logout()
                    alert('LA SESION FUE CERRADO DESDE EL SERVIDOR, VUELVA A INTRODODUCIR SUS DATOS DE INICIO')
                }
                if (json.data.ok) {
                    setListaGestion(json.data.data[0])
                    setListaSs(json.data.data[1])
                    setGestion({ campo: json.data.data[0].length > 0 ? json.data.data[0][0].id : null, valido: json.data.data[0].length > 0 ? 'true' : null })
                    setVentana(0)
                } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg })
            }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }

        const listarMes = async () => {
            if (gestion.valido === 'true') {
                axios.post(URL + '/formulario3/listarmes', { id: gestion.campo, fecha: fecha + ' ' + horafinal }).then(json => {
                    if (json.data.ok) {
                        setListaMes(json.data.data)
                        setVentana(0)
                        if (json.data.data.length === 0) {
                            alert2({ icono: 'warning', titulo: 'Lista vacía', boton: 'ok', texto: 'Fecha fuera de rango para su edición' })
                        }
                    } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg })
                }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            } else alert2({ icono: 'warning', titulo: 'Seleccione una gestion', boton: 'ok', })
        }

        const listarVariable = async () => {
            if (gestion.valido === 'true') {
                if (mes.valido === 'true') {
                    if (ss.valido === 'true') {
                        axios.post(URL + '/formulario3/listarvariable', { id: gestion.campo, ss: ss.campo }).then(json => {
                            if (json.data.ok) {
                                setListaVariable(json.data.data)
                                setVentana(0)
                            } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg })
                        }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                    } else alert2({ icono: 'warning', titulo: 'Seleccione Sub-sector', boton: 'ok' })
                } else alert2({ icono: 'warning', titulo: 'Seleccione el mes', boton: 'ok', })
            } else alert2({ icono: 'warning', titulo: 'Seleccione una gestion', boton: 'ok', })
        }


        const listarIndicadores = async (cabeceras = true) => {
            setListaIndicadores([])
            if (gestion.valido === 'true') {
                if (mes.valido === 'true') {
                    if (variable.valido === 'true') {
                        setEstado(1)
                        setTexto('Cargando...')
                        axios.post(URL + '/formulario3/listarindicadores', { variable: variable.campo, fecha: fecha, mes: mes.campo }).then(json => {
                            if (json.data.ok) {

                                console.log(
                                    json.data.data[1],
                                    json.data.data[2], 'valores al listar indicadores'
                                )
                                listaMes.forEach(m => {
                                    if (parseInt(m.id) === mes.campo) setEstadomes(m.estado)
                                })
                                setListaIndicadores(json.data.data[0])

                                json.data.data[1].forEach(e1 => {
                                    json.data.data[2].forEach(e2 => {
                                        if (parseInt(e1.input) === parseInt(e2.input)) {
                                            e1.valor = e2.valor
                                        }
                                    })
                                })
                                setTimeout(() => {
                                    setDatosVAriable(json.data.data[1])
                                    setEstado(0)
                                    setVentana(3);
                                }, 1000)
                                setTimeout(() => {
                                    json.data.data[1].forEach(e => {
                                        console.log(e.input, 'id input')

                                        document.getElementById(e.input).value = e.valor
                                    })
                                }, 1800)

                                if (cabeceras) {
                                    axios.post(URL + '/reportes3/listarcabeceras', { variable: variable.campo }).then(json => {
                                        if (json.data.ok) {
                                            setListaCabecera(json.data.data)
                                            let min = 0
                                            json.data.data.forEach(e => {
                                                if (parseInt(e.nivel) > min) {
                                                    min = e.nivel
                                                }
                                            })
                                            setMaxOrden(min)
                                        } else { alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg }); }
                                    }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });

                                }
                                // console.log(span1)
                            } else {
                                alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg }); setEstado(0)
                            }
                        }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); setEstado(0) });
                    } else alert2({ icono: 'warning', titulo: 'Seleccione el formulario', boton: 'ok', texto: null })
                } else alert2({ icono: 'warning', titulo: 'Seleccione El mes', boton: 'ok', texto: null })
            } else alert2({ icono: 'warning', titulo: 'Seleccione año', boton: 'ok', texto: null })
        }


        const onchange = (e) => {
            datosVariable.forEach(e1 => {
                if (parseInt(e1.input) === parseInt(e.target.id)) {
                    e1.valor = parseInt(e.target.value)
                }
            })
        }

        const validacion = (e) => {
            if (INPUT.ID.test(e.target.value) || e.target.value.length === 0) {
                listaInput.forEach(element => {
                    if (element.id === parseInt(e.target.id)) {
                        document.getElementById(e.target.id).setAttribute('class', 'form-control form-control-sm bordeTrue')
                    }
                })

            } else {
                listaInput.forEach(element => {
                    if (element.id === parseInt(e.target.id)) {
                        document.getElementById(e.target.id).setAttribute('class', 'form-control form-control-sm bordeFalse')
                    }
                })
                // if (e.target.value.length === 1)
                toast.error('Este campo debe ser de tipo entero numérico')
            }
        }

        const guardar = async () => {
            if (mes.valido === 'true' && variable.valido === 'true' && datosVariable.length > 0 && estado === 0 && gestion.valido === 'true' && estadomes) {
                let accion = await confirmarGuardar({ titulo: 'Enviar Datos', boton: 'ok', texto: 'Ok para continuar...' })
                if (accion.isConfirmed) {
                    setEstado(1)

                    setTexto('Enviando resultados...')
                    console.log(datosVariable, 'valores antes de anviar')



                    axios.post(URL + '/formulario3/guardar', {
                        mes: mes.campo,
                        gestion: gestion.campo,
                        fecha: fecha,
                        variable: variable.campo,
                        datos: datosVariable,
                        estado: estadomes,
                        hora: horafinal,
                    }).then(json => {
                        console.log(json.data)
                        if (json.data.ok) {
                            alert2({ icono: 'success', titulo: 'Información Guardada', boton: 'ok', texto: json.data.msg })

                            // json.data.data[1].forEach(e1 => {
                            //     json.data.data[2].forEach(e2 => {
                            //         if (parseInt(e1.input) === parseInt(e2.input)) {
                            //             e1.valor = e2.valor
                            //         }
                            //     })
                            // })
                            // setTimeout(() => {
                            //     setDatosVAriable(json.data.data[1])
                            //     setEstado(0)
                            //     setVentana(3);
                            // }, 1200)
                            // setTimeout(() => {
                            //     json.data.data[1].forEach(e => {
                            //         console.log(e.input, 'id input')

                            //         document.getElementById(e.input).value = e.valor
                            //     })
                            // }, 1700)
                            setEstado(0)
                        } else { alert2({ icono: 'warning', titulo: 'Error al procesar su solicitud', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                    }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); setEstado(0) });
                }
            }
        }

        return (
            <div className="container_formulario">
                <div className='contenedor-cabecera row' >
                    <span className='titulo'>{'FORMULARIO DE DATOS'} </span>
                    <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '0', color:'#595959'}} className='text-center'>{ localStorage.getItem('red')}  </p>
                </div>
                {estado === 1 && <Load texto={texto} />}

                <p className='texto-movh' style={{ marginBottom: '0', fontSize: '14px', fontWeight: 'bold', color: '#595959' }}>{' PARÁMETROS DE SELECCION::'}</p>
                <div className='orden-tiempo '>
                    <div className='row'>
                        <div className='col-4 col-sm-2 col-md-2 col-lg-2 p-1' onClick={() => {
                            setMes({ campo: null, valido: null }); setListaMes([]); setListaIndicadores([]); setVariable({ campo: null, valido: null }); setListaSs([]); setListaVariable([]); setListaInput([]); setListaCabecera([])
                        }}>
                            <Select1XL
                                estado={gestion}
                                cambiarEstado={setGestion}
                                ExpresionRegular={INPUT.ID}
                                lista={listaGestion}
                                etiqueta={'Gestion'}
                                estados={[setVariable, setMes]}
                                msg='Seleccione una opcion'
                                very = {1}

                            />
                        </div>
                        <div className='col-4 col-sm-2 col-md-2 col-lg-2 p-1' onClick={() => {
                            listarMes(); setListaIndicadores([]); setVariable({ campo: null, valido: null }); setListaVariable([]); setListaInput([]); setListaCabecera([]);
                        }}>
                            <Select1XL
                                estado={mes}
                                cambiarEstado={setMes}
                                ExpresionRegular={INPUT.ID}
                                lista={listaMes}
                                etiqueta={'Mes'}
                                msg='Seleccione una opcion'
                            />
                        </div>
                        <div className='col-4 col-sm-2 col-md-2 col-lg-2 p-1' onClick={() => {
                            setListaIndicadores([]); setVariable({ campo: null, valido: null }); setListaVariable([]); setListaInput([]); setListaCabecera([]);
                        }}>
                            <Select1XL
                                estado={ss}
                                cambiarEstado={setSs}
                                ExpresionRegular={INPUT.ID}
                                lista={listaSs}
                                etiqueta={'Sub-Sector'}
                                msg='Seleccione una opcion'
                            />
                        </div>


                        <div className='col-12 col-sm-6 col-md-6 col-lg-6 p-1 ' onClick={() => {
                            listarVariable(); setListaIndicadores([]); setListaInput([]); setListaCabecera([])
                        }}>
                            <Select1XL
                                estado={variable}
                                cambiarEstado={setVariable}
                                ExpresionRegular={INPUT.ID}
                                lista={listaVariable}
                                etiqueta={'Formulario'}
                                // funcion={listarIndicadores}
                                msg='Seleccione una opcion'

                            />
                        </div>
                    </div>
                </div>
                {ventana === 0 && <div className='botonModal' style={{ justifyContent: 'left' }}>
                    <button className="btn-form-info col-auto mb-4" onClick={() => listarIndicadores()}>
                        Cargar formulario <FontAwesomeIcon style={{ marginLeft: '10px' }} icon={faArrowRight} />
                    </button>

                </div>}


                {
                    ventana === 3 && mes.valido === 'true' && variable.valido === 'true' && gestion.valido === 'true' &&
                    <div className='mt-4'>
                        <div className='tituloPrimario' onClick={() => console.log(datosVariable, 'valores de las variables del formulario')} >{listaVariable.map(e => (parseInt(e.id) === variable.campo && <div key={e.id}>{e.nombre}</div>))}</div>

                        <div className="table table-responsive custom mb-3 quitarBorder" style={{ height: 'auto', padding: "0.0rem 0.0rem", marginBottom: '0' }}>
                            <Table className='table table-sm' style={{ border: "1px solid #000040", borderRight: 'none', borderTop: '1px solid white', borderSpacing: '0px', padding: '0px' }} >
                                {listaCabecera.length > 0 &&
                                    <thead className='cab-form'>
                                        <tr  >
                                            {maxOrden === 1 ?
                                                <th className="col-4 mincelda" style={{ color: '#595959', background: 'AliceBlue', borderRight: '1px solid #000040', borderTop: '1px solid #000040', }}>{'VARIABLE'}</th> :
                                                <th className="col-4 mincelda var" style={{ color: '#595959', background: 'AliceBlue', borderRight: '1px solid #000040', borderTop: '1px solid #000040', }}></th>}
                                            {listaCabecera.map(cb => (
                                                parseInt(cb.nivel) == 1 &&
                                                <th className=' nivel1F ' style={{
                                                    background: 'AliceBlue',
                                                    borderLeft: '1px solid white', borderRight: '1px solid #000040', borderTop: '1px solid #000040',
                                                    fontSize: '8pt', fontWeight: 'bold', fontFamily: 'Verdana', color: '#023c52', borderBottom: '1px solid #000040',
                                                }} colSpan={cb.span}
                                                    key={cb.id} >{cb.input}
                                                </th>
                                            ))}
                                        </tr>
                                        <tr style={{ borderTop: '1px solid #595959' }}>
                                            {maxOrden === 2 ? <th className="col-4 mincelda " style={{ color: '#595959', background: 'AliceBlue', borderRight: '1px solid #000040', borderTop: '0', }}>{'VARIABLE'}</th> :
                                                maxOrden === 1 ? null : <th className="col-4 mincelda var" style={{ color: '#595959', background: 'AliceBlue', borderRight: '1px solid #000040', borderTop: '1px solid #000040', }}></th>}
                                            {listaCabecera.map(cb => (
                                                parseInt(cb.nivel) == 2 &&
                                                <th className=' nivel1F' style={{
                                                    background: 'AliceBlue',
                                                    borderLeft: '1px solid white', borderRight: '1px solid #000040', borderTop: '1px solid #000040',
                                                    fontSize: '8pt', fontWeight: 'bold', fontFamily: 'Verdana', color: '#023c52', borderBottom: '1px solid #000040',
                                                }} colSpan={cb.span}
                                                    key={cb.id} >{cb.input}
                                                </th>
                                            ))}
                                        </tr>
                                        <tr style={{ borderTop: '1px solid #595959' }} >
                                            {maxOrden === 3 ? <th className="col-4 mincelda " style={{ color: '#595959', background: 'AliceBlue', borderRight: '1px solid #000040', borderTop: '0', }}>{'VARIABLE'}</th> :
                                                maxOrden === 1 || maxOrden === 2 ? null : <th className="col-4 mincelda var" style={{ color: '#595959', background: 'AliceBlue', borderRight: '1px solid #000040', borderTop: '1px solid #000040', }}></th>}
                                            {listaCabecera.map(cb => (
                                                parseInt(cb.nivel) == 3 &&
                                                <th className=' nivel1F' style={{
                                                    background: 'AliceBlue',
                                                    borderLeft: '1px solid white', borderRight: '1px solid #000040', borderTop: '1px solid #000040',
                                                    fontSize: '8pt', fontWeight: 'bold', fontFamily: 'Verdana', color: '#023c52', borderBottom: '1px solid #000040',
                                                }} colSpan={cb.span}
                                                    key={cb.id} >{cb.input}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>}
                                <tbody style={{ borderRight: '1px solid #000040', }}>
                                    {listaIndicadores.map((ind) => (
                                        <tr key={ind.id} style={{ borderRight: '1px solid #000040', }} >
                                            <td className="col-4 mincelda TituloSecundario" style={{
                                                padding: '4px 0px 0px 0px', borderBottom: '0px',
                                                borderTop: '1px solid #000040', borderRight: '1px solid #000040',
                                            }}>
                                                <div className='col-9 pl-4'>  {ind.indicador}</div>
                                            </td>
                                            {
                                                datosVariable.map(d => (
                                                    parseInt(ind.id) === parseInt(d.idindicador) && <td className="text-center"
                                                        style={{
                                                            ppadding: '4px 0px 0px 0px', paddingBottom: '0', background: 'white',
                                                            borderBottom: '0px', borderTop: '1px solid #000040', borderRight: '1px solid #000040',
                                                        }} key={d.id}>
                                                        <div style={{ border: '0.0px solid #ABB2B9', height: '29px' }}  >
                                                            <InputDinamico
                                                                type='number'
                                                                className="form-control form-control-sm"
                                                                id={d.input}
                                                                onChange={onchange}
                                                                onKeyUp={validacion}
                                                                onBlur={validacion}
                                                            />
                                                        </div>
                                                    </td>
                                                ))
                                            }
                                        </tr>
                                    ))}
                                </tbody>

                            </Table>
                        </div>
                        <div className='botonModal p-1'>
                            <button className='btn-guardar' onClick={() => guardar()} >GUARDAR</button>
                        </div>
                    </div >
                }
            </div >
        );

    } catch (error) {
        setEstado(0)
    }
}
export default Formulario3;


