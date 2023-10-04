import React from 'react';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCheck, faCheckCircle, faClose, faHandPointRight, faUpDown, faWindowClose } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../../Auth/useAuth"
import { useState, useEffect } from "react";
import { URL, INPUT } from '../../Auth/config';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast'
import '../../elementos/estilos.css'
import { alert2, confirmarActualizar } from '../../elementos/alert2'
import Load from '../../elementos/load'
import { ComponenteCheck, ComponenteCheckXL, SelectSM } from '../../elementos/elementos';
import { Table } from 'reactstrap';


function Reportes3() {
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

    const [estado, setEstado] = useState(0)
    const [texto, setTexto] = useState(null);

    const [listaGestion, setListaGestion] = useState([]);
    const [grupoSeleccionados, setGruposSeleccionado] = useState([])
    const [variablesSeleccionado, setVariablesSeleccionados] = useState([])
    const [listaGrupo, setListaGrupo] = useState([]);
    const [listaVariable, setListaVariable] = useState([]);
    const [todosGrupos, setTodosGrupos] = useState(false)
    const [todosVariables, setTodosVariables] = useState(false)

    const [gestion, setGestion] = useState({ campo: null, valido: null })
    const [mes1, setMes1] = useState({ campo: null, valido: null })
    const [mes2, setMes2] = useState({ campo: null, valido: null })
    const [listaMes, setListaMes] = useState([]);

    const [variable, setVariable] = useState({ campo: null, valido: null })
    const [indicador, setIndicador] = useState({ campo: null, valido: null })
    try {

        useEffect(() => {

            if (listaGestion.length < 1) {
                document.title = 'REPORTES'
                listarGestion()
                listarGrupoInicio()
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
            axios.post(URL + '/reportes3/listargestion').then(json => {
                if (json.data.ok) {
                    setListaGestion(json.data.data)
                    setGestion({ campo: json.data.data.length > 0 ? json.data.data[0].id : null, valido: json.data.data.length > 0 ? 'true' : null })
                } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg })
            }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }
        const listarMes = async () => {
            if (gestion.valido === 'true') {
                axios.post(URL + '/reportes3/listarmes', { id: gestion.campo, fecha: fecha + ' ' + horafinal }).then(json => {
                    if (json.data.ok) {
                        setListaMes(json.data.data)

                    } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg })
                }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            } else alert2({ icono: 'warning', titulo: 'Seleccione una gestion', boton: 'ok', })
        }


        const listarGrupoInicio = async () => {
            axios.post(URL + '/reportes3/listarvariableinicio').then(json => {
                if (json.data.ok) {
                    setListaGrupo(json.data.data)
                } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg })
            }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }

        const listarGrupos = async () => {
            if (gestion.valido === 'true') {
                axios.post(URL + '/reportes3/listarvariable', { id: gestion.campo }).then(json => {
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
            axios.post(URL + '/reportes3/listarindicadores', { variable: id }).then(json => {
                if (json.data.ok) {
                    setListaVariable(json.data.data[0])
                    setEstado(0)
                    // listarCabeceras(json.data.data[0][0].id)

                } else { alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg }); setEstado(0) }
            }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); setEstado(0) });
        }
        // const listarCabeceras = async (id) => {
        //     let data = []
        //     axios.post(URL + '/registro/listarinput', { id: id, }).then(json1 => {

        //         if (json1.data.ok) {
        //             console.log(json1.data.data, 'cabecera de nivel 1')

        //             data = json1.data.data
        //             setListaCabecera(data)
        //             setEstado(0)
        //             setCantidadInput(json1.data.data.length)
        //             setProfundidad1(json1.data.data[0].nivel)
        //             json1.data.data.forEach(e1 => {
        //                 axios.post(URL + '/registro/listarinput2', { id: e1.id, }).then(json2 => {
        //                     if (json2.data.ok) {
        //                         setEstado(0)
        //                         json1.data.data.forEach(async e1 => {
        //                             await json2.data.data.forEach(e2 => {

        //                                 if (parseInt(e1.id) === parseInt(e2.idinput)) {
        //                                     const indice = data.findIndex((elemento, indice) => {
        //                                         if (parseInt(elemento.id) === parseInt(e2.idinput)) {
        //                                             return true;
        //                                         }
        //                                     });
        //                                     data.splice(indice + 1, 0, e2)
        //                                     setListaCabecera(data)
        //                                     setCantidadInput(data.length)
        //                                     setProfundidadCantiadad2(json2.data.data.length)
        //                                     setProfundidad2(json2.data.data[0].nivel)


        //                                     axios.post(URL + '/registro/listarinput2', { id: e2.id, }).then(json3 => {
        //                                         // console.log('nivel 3', json3.data.data)

        //                                         if (json3.data.ok) {
        //                                             json2.data.data.forEach(async e2 => {
        //                                                 await json3.data.data.forEach(e3 => {

        //                                                     if (parseInt(e2.id) === parseInt(e3.idinput)) {
        //                                                         const indice = data.findIndex((elemento, indice) => {
        //                                                             if (parseInt(elemento.id) === parseInt(e3.idinput)) {
        //                                                                 return true;
        //                                                             }
        //                                                         });
        //                                                         data.splice(indice + 1, 0, e3)
        //                                                         setListaCabecera(data)
        //                                                         setCantidadInput(data.length)
        //                                                         setProfundidadCantiadad3(json3.data.data.length)
        //                                                         setProfundidad3(json3.data.data[0].nivel)

        //                                                         axios.post(URL + '/registro/listarinput2', { id: e3.id, }).then(json4 => {
        //                                                             // console.log(json3.data.data)

        //                                                             if (json4.data.ok) {
        //                                                                 json3.data.data.forEach(async e3 => {
        //                                                                     await json4.data.data.forEach(e4 => {

        //                                                                         if (parseInt(e3.id) === parseInt(e4.idinput)) {
        //                                                                             const indice = data.findIndex((elemento, indice) => {
        //                                                                                 if (parseInt(elemento.id) === parseInt(e4.idinput)) {
        //                                                                                     return true;
        //                                                                                 }
        //                                                                             });
        //                                                                             data.splice(indice + 1, 0, e4)
        //                                                                             setListaCabecera(data)
        //                                                                             setCantidadInput(data.length)
        //                                                                             setProfundidadCantiadad4(json4.data.data.length)
        //                                                                             setProfundidad4(json4.data.data[0].nivel)
        //                                                                             axios.post(URL + '/registro/listarinput2', { id: e4.id, }).then(json5 => {
        //                                                                                 // console.log(json3.data.data)

        //                                                                                 if (json5.data.ok) {
        //                                                                                     json4.data.data.forEach(async e4 => {
        //                                                                                         await json5.data.data.forEach(e5 => {

        //                                                                                             if (parseInt(e4.id) === parseInt(e5.idinput)) {
        //                                                                                                 const indice = data.findIndex((elemento, indice) => {
        //                                                                                                     if (parseInt(elemento.id) === parseInt(e5.idinput)) {
        //                                                                                                         return true;
        //                                                                                                     }
        //                                                                                                 });
        //                                                                                                 data.splice(indice + 1, 0, e5)
        //                                                                                                 setListaCabecera(data)
        //                                                                                                 setCantidadInput(data.length)
        //                                                                                                 setProfundidadCantiadad5(json5.data.data.length)
        //                                                                                                 setProfundidad5(json5.data.data[0].nivel)
        //                                                                                             }
        //                                                                                         })
        //                                                                                     })
        //                                                                                 } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json2.data.msg })
        //                                                                             })
        //                                                                         }
        //                                                                     })
        //                                                                 })
        //                                                             } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json2.data.msg })
        //                                                         })
        //                                                     }
        //                                                 })
        //                                             })
        //                                         } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json2.data.msg })
        //                                     })
        //                                 }
        //                             })
        //                         })
        //                     } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json2.data.msg })
        //                 })
        //             })

        //         } else { alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json1.data.msg }); setEstado(0); }
        //     }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }) });
        //     setVentana(3);
        // }



        return (
            <div style={{ background: '#e5e5e5', paddingTop: '0.5rem', paddingBottom: '0.5rem' }} >
                <div className="container_reportes">
                    {estado === 1 && <Load texto={texto} />}
                    <div className='header-reportes'>
                        <img src='img/sedes22.png' className='icono-partido' alt='sdis-ve' /><span className='titulo'>reportes estadísticos </span>
                    </div>
                    <div className='separador mb-3 mb-sm-0 mb-md-0 mb-lg-0'>
                        <span>
                            PARÁMETROS DE SELECCION::
                        </span>
                    </div>
                    <p className='texto-mov' style={{ marginBottom: '0', fontSize: '12px' }}>{localStorage.getItem('est')}</p>
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
                                <div className='col-3 col-sm-3 col-md-3 col-lg-3 m-1' onClick={() => { listarMes() }} >
                                    <SelectSM
                                        estado={mes1}
                                        cambiarEstado={setMes1}
                                        ExpresionRegular={INPUT.ID}
                                        lista={listaMes}
                                        etiqueta={'Desde'}
                                        msg='Seleccione una opcion'
                                    />
                                </div>
                                <div className='col-3 col-sm-3 col-md-3 col-lg-3 m-1' onClick={() => { listarMes() }} >
                                    <SelectSM
                                        estado={mes2}
                                        cambiarEstado={setMes2}
                                        ExpresionRegular={INPUT.ID}
                                        lista={listaMes}
                                        etiqueta={'hasta'}
                                        msg='Seleccione una opcion'
                                    />
                                </div>
                                <div className='col-2 col-sm-3 col-md-3 col-lg-3 m-1 ml-0 mr-0' >
                                    <div className='col-12 col-sm-10 col-md-4 col-lg-3  m-auto row mt-3'>
                                        <div className='col-3'><p className='blue1'></p></div>
                                        <div className='col-3'><p className='red1'></p></div>
                                        <div className='col-3'><p className='blue2'></p></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='cajaprimario-reportes m-0 m-sm-2 m-md-3 m-lg-3 mt-0 mt-lg-0 '>
                        <div className='contenedor cajareportes p-3 p-sm-3 p-md-4 p-lg-4  pt-2 pb-2'>
                            <div className='col-12 col-sm-12 col-md-10 col-lg-10 m-auto'>
                                <div className='row'  >
                                    <div className='col-12 col-sm-12 col-md-7 col-lg-7' >
                                        <h5 className='titulo-parametros'>Grupo</h5>
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
                                                estado={setTodosGrupos}
                                            />
                                        </div>
                                    </div>
                                    <div className='col-12 col-sm-12 col-md-5 col-lg-5'>
                                        <h5 className='titulo-parametros'>Variables</h5>
                                        <div className='table table-responsive caja-scroll' style={{ marginBottom: '.1rem' }}>
                                            {listaVariable.length > 0 ? <Table className="table table-sm" >
                                                <tbody>
                                                    {listaVariable.map((x) => (
                                                        <tr>
                                                            <td>
                                                                <ComponenteCheck
                                                                    id={x.id}
                                                                    item={x.indicador}
                                                                    admitidos={variablesSeleccionado}
                                                                    prefijo={'variables'}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table> : <small style={{ fontWeight: 'bold', fontSize: '12px', color: '#595959' }}>Seleccione un solo grupo</small>}
                                        </div>
                                        {listaVariable.length > 0 && <ComponenteCheckXL
                                            id={2222}
                                            item={'Seleccionar todos'}
                                            setAdmitidos={setVariablesSeleccionados}
                                            admitidos={variablesSeleccionado}
                                            lista={listaVariable}
                                            prefijo={'variables'}
                                            estado={setTodosVariables}
                                        />}
                                    </div>
                                </div>
                                <div className='botonModal'>
                                    <button className='botonProcesar'>Procesar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >

        );

    } catch (error) {
        setEstado(0);// auth.logout()

    }

}
export default Reportes3;
