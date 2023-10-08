import React from 'react';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCheck, faCheckCircle, faClose, faHandPointRight, faUpDown, faWindowClose } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../../Auth/useAuth"
import { useState, useEffect } from "react";
import { URL, INPUT } from '../../Auth/config';
import axios from 'axios';
import '../../elementos/estilos.css'
import { alert2, } from '../../elementos/alert2'
import Load from '../../elementos/load'
import { ComponenteCheck, ComponenteCheckXL, SelectSM } from '../../elementos/elementos';
import { Table } from 'reactstrap';



function Opeinf4() {
    const auth = useAuth()
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

    const [ventana, setVentana] = useState(0)
    const [estado, setEstado] = useState(0)
    const [texto, setTexto] = useState(null);

    const [grupoSeleccionados, setGruposSeleccionado] = useState([])
    const [variablesSeleccionado, setVariablesSeleccionados] = useState([])

    const [listaGrupo, setListaGrupo] = useState([]);
    const [listaVariable, setListaVariable] = useState([]);



    const [listaGestion, setListaGestion] = useState([]);
    const [gestion, setGestion] = useState({ campo: null, valido: null })
    const [est, setEst] = useState({ campo: null, valido: null })
    const [listaMes, setListaMes] = useState([]);
    const [listaEst, setListaEst] = useState([]);
    const [mes1, setMes1] = useState({ campo: null, valido: null })
    const [mes2, setMes2] = useState({ campo: null, valido: null })

    // DATOS PARA REPORTES
    const [listaIndicadores, setListaIndicadores] = useState([]);
    const [cabecera, setCabecera] = useState([]); // una sola cabecera
    const [data, setData] = useState([]);

    try {

        useEffect(() => {

            if (listaGestion.length < 1) {
                document.title = 'OPORTUNIDAD DE INFORMACION MUNICIPIOS'
                listarGestion()
                listarGrupoInicio()
                listarEst()
            }
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
            axios.post(URL + '/opeinf4/listargestion').then(json => {
                if (json.data.hasOwnProperty("sesion")) {
                    auth.logout()
                    alert('LA SESION FUE CERRADO DESDE EL SERVIDOR, VUELVA A INTRODODUCIR SUS DATOS DE INICIO')
                }
                if (json.data.ok) {
                    setListaGestion(json.data.data)
                    setGestion({ campo: json.data.data.length > 0 ? json.data.data[0].id : null, valido: json.data.data.length > 0 ? 'true' : null })
                } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg })
            }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }
        const listarMes = async () => {
            if (gestion.valido === 'true') {
                axios.post(URL + '/opeinf4/listarmes', { id: gestion.campo, fecha: fecha + ' ' + horafinal }).then(json => {
                    if (json.data.ok) {
                        setListaMes(json.data.data)

                    } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg })
                }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            }
        }
        const listarEst = async () => {
            axios.post(URL + '/opeinf4/listarest').then(json => {
                if (json.data.ok) {
                    setListaEst(json.data.data)

                } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg })
            }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }



        const listarGrupoInicio = async () => {
            axios.post(URL + '/opeinf4/listarvariableinicio').then(json => {
                if (json.data.ok) {
                    setListaGrupo(json.data.data)
                } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg })
            }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }

        const listarGrupos = async () => {
            if (gestion.valido === 'true') {
                axios.post(URL + '/opeinf4/listarvariable', { id: gestion.campo }).then(json => {
                    if (json.data.ok) {
                        setListaGrupo(json.data.data)
                        // console.log(json.data.data,'data de la bd')
                    } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg })
                }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            }
        }


        const listarVariables = async (id) => {
            setListaVariable([])
            setEstado(1)
            setTexto('Cargando...')
            axios.post(URL + '/opeinf4/listarindicadores', { variable: id }).then(json => {
                if (json.data.ok) {
                    setListaVariable(json.data.data)
                    setEstado(0)
                    // listarCabeceras(json.data.data[0][0].id)

                } else { alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg }); setEstado(0) }
            }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); setEstado(0) });
        }
        const procesar = async () => {
            // console.log(grupoSeleccionados, 'grupos seleccinados')

            if (mes1.valido === 'true' && mes2.valido === 'true' && gestion.valido === 'true' && est.valido === 'true')
                if (grupoSeleccionados.length > 0) {
                    setEstado(1)
                    setTexto('Espere unos segundos, se esta procesando la informacion...')

                    console.log(grupoSeleccionados)
                    let dataCabeceras = []
                    let dataInd_ = []
                    let data_ = []
                    grupoSeleccionados.forEach(e => {
                        axios.post(URL + '/opeinf4/listarcabeceras', { variable: e }).then(json => {
                            if (json.data.ok)
                                json.data.data.forEach(e => {
                                    dataCabeceras.push(e)
                                })
                            else { alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg }); }
                        }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });

                        axios.post(URL + '/opeinf4/listarindicadores', { variable: e }).then(json => {
                            if (json.data.ok)
                                json.data.data.forEach(e => {
                                    dataInd_.push(e)
                                })
                            else { alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg }); }
                        }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });

                        axios.post(URL + '/opeinf4/all-inf', { establecimiento: est.campo, variable: e, gestion: gestion.campo, mes1: mes1.campo, mes2: mes2.campo }).then(json => {
                            if (json.data.ok)
                                json.data.data.forEach(e => {
                                    data_.push(e)
                                })
                            else { alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg }); }
                        }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                    })
                    setCabecera(dataCabeceras)
                    setListaIndicadores(dataInd_)
                    setData(data_)
                    setTimeout(() => {
                        setData([])
                        setCabecera([])
                        setListaIndicadores([])
                        setListaIndicadores(dataInd_)
                        setData(data_)
                        setCabecera(dataCabeceras)
                        setEstado(0)
                    }, 4000)
                    setVentana(1)
                } else alert2({ icono: 'question', titulo: 'debe seleccionar almenos un cuaderno', boton: 'ok' })
            else alert2({ icono: 'question', titulo: 'selecione los parametros año, mes1, mes2 y establecimiento', boton: 'ok' })

        }


        return (
            <div style={{ background: '#e5e5e5', paddingTop: '0.5rem', paddingBottom: '0.5rem', height: '95vh' }} >
                {estado === 1 && <Load texto={texto} />}
                {ventana === 0 ?
                    <div className="container_reportes">
                        <div className='header-reportes'>
                            <img src='img/sedes22.png' className='icono-partido' alt='sdis-ve' /><span className='titulo'>OPORTUNIDAD DE INFORMACIÓN </span>
                        </div>
                        <div className='separador mb-3 mb-sm-0 mb-md-0 mb-lg-0'>
                            <span onClick={() => console.log(data, 'datos', cabecera, 'cabeceras')}>
                                PARÁMETROS DE SELECCION::
                            </span>
                        </div>
                        <p className='texto-mov' style={{ marginBottom: '0', fontSize: '12px' }}>{'MUNICIPIO :: ' + localStorage.getItem('mun')}</p>
                        <div className='p-0 p-sm-2 p-md-3 p-lg-3 pb-0 pt-0 pt-lg-0 pt-md-0 pb-lg-0'>
                            <div className='orden-tiempo '>
                                <div className='row '>
                                    <div className='col-2 col-sm-2 col-md-2 col-lg-2 m-1' >
                                        <SelectSM
                                            estado={gestion}
                                            cambiarEstado={setGestion}
                                            ExpresionRegular={INPUT.ID}
                                            lista={listaGestion}
                                            etiqueta={'Gestion'}
                                            funcion={listarGrupos}
                                            msg='Seleccione una opcion'
                                        />
                                    </div>
                                    <div className='col-2 col-sm-2 col-md-2 col-lg-2 m-1' onClick={() => { listarMes() }} >
                                        <SelectSM
                                            estado={mes1}
                                            cambiarEstado={setMes1}
                                            ExpresionRegular={INPUT.ID}
                                            lista={listaMes}
                                            etiqueta={'Desde'}
                                            msg='Seleccione una opcion'
                                        />
                                    </div>
                                    <div className='col-2 col-sm-2 col-md-2 col-lg-2 m-1' onClick={() => { listarMes() }} >
                                        <SelectSM
                                            estado={mes2}
                                            cambiarEstado={setMes2}
                                            ExpresionRegular={INPUT.ID}
                                            lista={listaMes}
                                            etiqueta={'hasta'}
                                            msg='Seleccione una opcion'
                                        />
                                    </div>
                                    <div className='col-4 col-sm-4 col-md-4 col-lg-4 m-1'  >
                                        <SelectSM
                                            estado={est}
                                            cambiarEstado={setEst}
                                            ExpresionRegular={INPUT.ID}
                                            lista={listaEst}
                                            etiqueta={'Establecimiento'}
                                            msg='Seleccione una opcion'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='cajaprimario-reportes m-0 m-sm-2 m-md-3 m-lg-3 mt-0 mt-lg-0 '>
                            <div className='contenedor cajareportes p-3 p-sm-3 p-md-4 p-lg-4  pt-2 pb-2'>

                                <div className='col-12 col-sm-12 col-md-10 col-lg-10 m-auto'>

                                    <h5 className='titulo-parametros'>Cuaderno</h5>
                                    <div className='table table-responsive caja-scroll' style={{ marginBottom: '.1rem' }}>
                                        <Table className="table table-sm" >
                                            <tbody >
                                                {listaGrupo.map((x) => (
                                                    <tr key={x.id}>
                                                        <td>
                                                            <ComponenteCheck
                                                                id={x.id}
                                                                item={x.nombre}
                                                                admitidos={grupoSeleccionados}
                                                                funcion={listarVariables}
                                                                setLista={setListaVariable}
                                                                prefijo={'grupo'}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                    <div onClick={() => {
                                        setVariablesSeleccionados([])
                                        setListaVariable([])
                                        // alert()
                                    }} >
                                        <ComponenteCheckXL

                                            id={1111}
                                            item={'Seleccionar todos'}
                                            setAdmitidos={setGruposSeleccionado}
                                            admitidos={grupoSeleccionados}
                                            lista={listaGrupo}
                                            prefijo={'grupo'}
                                        />
                                    </div>

                                    <div className='botonModal'>
                                        <button className='botonProcesar' onClick={() => procesar()}>Verificar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="container_reportes m-auto" style={{ width: '97%' }}>

                        <p className='titulo-reportes' style={{ marginBottom: '0px' }} > FORMULARIO ADICIONAL 301c</p>
                        <p className='titulo-reportes' style={{ marginBottom: '0px' }}>GESTION {' ' + año}</p>
                        {listaEst.map(e => (
                            parseInt(e.id) === parseInt(est.campo) &&
                            <p key={e.id} className='titulo-reportes' style={{ textAlign: 'left', paddingLeft: '8px', marginBottom: '0', fontSize: '11px' }}>ESTABLECIMIENTO : {e.nombre}</p>
                        ))}
                        <p className='titulo-reportes' style={{ textAlign: 'left', paddingLeft: '8px', marginBottom: '0',  }}>
                            CONTROL DE LA INFORMACIÓN
                        </p>


                        <div className='p-2'>

                            {listaGrupo.map(lg => (
                                grupoSeleccionados.map(gs => (
                                    parseInt(lg.id) === parseInt(gs) && <div key={gs}>
                                        <p style={{ fontSize: '12.5px', marginBottom: '0', fontWeight: 'bold' }}>{lg.nombre}   </p>
                                        <div className="table table-responsive custom" style={{ height: 'auto', padding: "0.0rem 0.0rem", marginBottom: '0' }}>
                                            <Table className=' table-sm' style={{ border: "1px solid #000040", borderRight: 'none', borderTop: '1px solid white', borderSpacing: '0px', padding: '0px' }} >
                                                {cabecera.length > 0 &&
                                                    <thead className='cab-form'>
                                                        <tr  >
                                                            <th className="col-3 mincelda var" style={{ color: '#595959', background: 'AliceBlue', borderRight: '1px solid #000040', borderTop: '1px solid #000040', }}>VARIABLE</th>
                                                            {cabecera.map(cb => (
                                                                parseInt(cb.variable) === parseInt(gs) && parseInt(cb.nivel) == 1 &&
                                                                <th className='text-center nivel1F' style={{
                                                                    background: 'AliceBlue',
                                                                    borderLeft: '1px solid white', borderRight: '1px solid #000040', borderTop: '1px solid #000040',
                                                                    fontSize: '8pt', fontWeight: 'bold', fontFamily: 'Verdana', color: '#023c52', borderBottom: '1px solid #000040',
                                                                }} colSpan={cb.span}
                                                                    key={cb.id} >{cb.input}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                        <tr style={{ borderTop: '1px solid #595959' }}>
                                                            <th className="col-3 mincelda " style={{ color: '#595959', background: 'AliceBlue', borderRight: '1px solid #000040', }}></th>
                                                            {cabecera.map(cb => (
                                                                parseInt(cb.variable) === parseInt(gs) && parseInt(cb.nivel) == 2 &&
                                                                <th className='text-center nivel1F' style={{
                                                                    background: 'AliceBlue',
                                                                    borderLeft: '1px solid white', borderRight: '1px solid #000040', borderTop: '1px solid #000040',
                                                                    fontSize: '8pt', fontWeight: 'bold', fontFamily: 'Verdana', color: '#023c52', borderBottom: '1px solid #000040',
                                                                }} colSpan={cb.span}
                                                                    key={cb.id} >{cb.input}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                        <tr style={{ borderTop: '1px solid #595959' }} >
                                                            <th className="col-3 mincelda " style={{ color: '#595959', background: ' AliceBlue', borderRight: '1px solid #000040', }}></th>
                                                            {cabecera.map(cb => (
                                                                parseInt(cb.variable) === parseInt(gs) && parseInt(cb.nivel) == 3 &&
                                                                <th className='text-center nivel1F' style={{
                                                                    background: 'AliceBlue',
                                                                    borderLeft: '1px solid white', borderRight: '1px solid #000040', borderTop: '1px solid #000040',
                                                                    fontSize: '8pt', fontWeight: 'bold', fontFamily: 'Verdana', color: '#023c52'
                                                                }} colSpan={cb.span}
                                                                    key={cb.id} >{cb.input}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>}
                                                    {data.length>0?<>
                                               { variablesSeleccionado.length > 0 ?
                                                
                                                    // VARIABLES ESPECIFICOS
                                                    <tbody style={{ borderRight: '1px solid #000040', }}>

                                                        {listaIndicadores.map((ind) => (
                                                            parseInt(ind.variable) === parseInt(gs) &&
                                                            // <div key={ind.id}>{
                                                            variablesSeleccionado.map(vs => (
                                                                parseInt(ind.id) === parseInt(vs) &&
                                                                <tr key={ind.id} style={{ borderRight: '1px solid #000040', }}>
                                                                    <td className="col-3 mincelda TituloSecundario" style={{ padding: '4px 0px 0px 0px', borderBottom: '0px', borderTop: '1px solid #000040', borderRight: '1px solid #000040', }}>{ind.indicador}</td>
                                                                    {
                                                                        data.map(d => (
                                                                            parseInt(ind.id) === parseInt(d.indicador) && <td className="text-center"
                                                                                style={{ padding: '4px 0px 0px 0px', paddingBottom: '0', background: 'white', borderBottom: '0px', borderTop: '1px solid #000040', borderRight: '1px solid #000040', }} key={d.id}>
                                                                                <div style={{ border: '0.0px solid #ABB2B9', height: '29px' }}  >{d.valor}</div>
                                                                            </td>
                                                                        ))
                                                                    }
                                                                </tr>
                                                            ))
                                                            // }</div>
                                                        ))}
                                                    </tbody> :
                                                    // TODAS LAS VARIABLES
                                                    <tbody>
                                                        {listaIndicadores.map((ind) => (
                                                            parseInt(ind.variable) === parseInt(gs) &&
                                                            <tr key={ind.id} style={{ borderRight: '1px solid #000040', }}>
                                                                <td className="col-3 mincelda TituloSecundario" style={{ padding: '4px 0px 0px 0px', borderBottom: '0px', borderTop: '1px solid #000040', borderRight: '1px solid #000040', }}>{ind.indicador}</td>
                                                                {
                                                                    data.map(d => (
                                                                        parseInt(ind.id) === parseInt(d.indicador) && <td className="text-center"
                                                                            style={{ padding: '4px 0px 0px 0px', paddingBottom: '0', background: 'white', borderBottom: '0px', borderTop: '1px solid #000040', borderRight: '1px solid #000040', }} key={d.id}>
                                                                            <div style={{ height: '29px' }}  >{d.valor}</div>
                                                                        </td>
                                                                    ))
                                                                }
                                                            </tr>
                                                        ))}
                                                    </tbody>}</>:'SIN DATOS'}
                                            </Table>
                                        </div>
                                    </div>
                                ))
                            ))}

                            <div className='botonModal p-1'>
                                <button className='botonProcesar' onClick={() => window.location.href = '/oportunidad-de-informacion-municipios'}>CERRAR</button>
                            </div>
                        </div>
                    </div>
                }
            </div >
        );

    } catch (error) {
        setEstado(0);// auth.logout()

    }

}
export default Opeinf4;
