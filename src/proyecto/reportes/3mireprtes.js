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
import { img } from './logo';
const ExcelJS = require('exceljs')



function Mireportes3() {
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
    const [listaSs, setListaSs] = useState([]);
    const [ss, setSs] = useState({ campo: null, valido: null })
    const [grupoSeleccionados, setGruposSeleccionado] = useState([])
    const [variablesSeleccionado, setVariablesSeleccionados] = useState([])

    const [listaGrupo, setListaGrupo] = useState([]);
    const [listaVariable, setListaVariable] = useState([]);

    ///////////////////////////  USO PRINCIPAL PARA IDENTIFICAR SI SE VAN A SELECCIONAR TODAS LAS VARIABLES(TRUE) O SOLO UNA VARIABLE (FALSE)
    const [todosGrupos, setTodosGrupos] = useState(false)
    const [variable, setVariable] = useState({ campo: null, valido: null }) // solo una variable

    ///////////////////////////  USO PRINCIPAL PARA IDENTIFICAR SI SE VAN A SELECCIONAR TODAS LOS INDICADORES(TRUE) O SOLO UN INDICADOR (FALSE)
    const [todosVariables, setTodosVariables] = useState(false)
    const [indicador, setIndicador] = useState({ campo: null, valido: null }) // solo un indicador


    const [listaGestion, setListaGestion] = useState([]);
    const [gestion, setGestion] = useState({ campo: null, valido: null })
    const [listaMes, setListaMes] = useState([]);
    const [mes1, setMes1] = useState({ campo: null, valido: null })
    const [mes2, setMes2] = useState({ campo: null, valido: null })

    // DATOS PARA REPORTES
    const [listaIndicadores, setListaIndicadores] = useState([]);
    const [cabecera, setCabecera] = useState([]); // una sola cabecera
    const [data, setData] = useState([]);

    try {

        useEffect(() => {

            if (listaGestion.length < 1) {
                document.title = 'REPORTES'
                listarGestion()
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
                if (json.data.hasOwnProperty("sesion")) {
                    auth.logout()
                    alert('LA SESION FUE CERRADO DESDE EL SERVIDOR, VUELVA A INTRODODUCIR SUS DATOS DE INICIO')
                }
                if (json.data.ok) {
                    // console.log(json.data.data, 'lista gestion')
                    setListaGestion(json.data.data[0])
                    listarMes(json.data.data[0][0].id)
                    listarTodosGrupos(json.data.data[0][0].id)
                    json.data.data[1].unshift({ id: 1000, nombre: 'TODOS' })
                    setSs({ campo: 1000, valido: 'true' })
                    setListaSs(json.data.data[1])
                    setGestion({ campo: json.data.data[0].length > 0 ? json.data.data[0][0].id : null, valido: json.data.data[0].length > 0 ? 'true' : null })
                } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg })
            }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }
        const listarMes = async (id = null) => {
            if (gestion.valido === 'true' || id) {
                axios.post(URL + '/reportes3/listarmes', { id: id ? id : gestion.campo, fecha: fecha + ' ' + horafinal }).then(json => {
                    if (json.data.ok) {
                        // console.log(json.data.data, 'lista de meses')
                        setListaMes(json.data.data)
                        let mesActual = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date());
                        json.data.data.forEach(e => {
                            // console.log('llamada a mlistarmes', e.nombre, mesActual)
                            if (e.nombre.toLowerCase() == mesActual && id) {
                                setMes1({ campo: e.id, valido: 'true' })
                                setMes2({ campo: e.id, valido: 'true' })
                            }
                        })

                    } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg })
                }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            }
        }
        const listarTodosGrupos = async (id = null) => {
            console.log('todos los grupos')
            if (gestion.valido === 'true' || id) {
                axios.post(URL + '/reportes3/listartodosvariableR', { id: id ? id : gestion.campo, }).then(json => {
                    if (json.data.ok) {
                        setListaGrupo(json.data.data)
                        // console.log(json.data.data,'data de la bd')
                    } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg })
                }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            } else toast.error('Seleccione la gestion ')
        }



        const listarGrupos = async () => {
            console.log('listar grupos especificos')
            if (gestion.valido === 'true') {
                axios.post(URL + '/reportes3/listarvariableR', { id: gestion.campo, ssector: ss.campo }).then(json => {
                    if (json.data.ok) {
                        setListaGrupo(json.data.data)
                        // console.log(json.data.data,'data de la bd')
                    } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg })
                }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            } else toast.error('Seleccione la gestion ')
        }



        const listarVariables = async (id) => {

            setListaVariable([])
            setEstado(1)
            setTexto('Cargando...')
            axios.post(URL + '/reportes3/listarindicadores', { variable: id }).then(json => {
                if (json.data.ok) {
                    setListaVariable(json.data.data)
                    setEstado(0)
                    // listarCabeceras(json.data.data[0][0].id)

                } else { alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg }); setEstado(0) }
            }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); setEstado(0) });
        }






        const procesar = async () => {
            // console.log(grupoSeleccionados, 'grupos seleccinados')

            if (mes1.valido === 'true' && mes2.valido === 'true' && gestion.valido === 'true')
                if (grupoSeleccionados.length > 0) {
                    setEstado(1)
                    setTexto('Espere unos segundos, se esta procesando la informacion...')
                    if (variablesSeleccionado.length > 0) {
                        let data_ = []
                        axios.post(URL + '/reportes3/listarcabeceras', { variable: grupoSeleccionados[0] }).then(json => {
                            if (json.data.ok)
                                setCabecera(json.data.data)
                            else { alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg }); }
                        }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                        axios.post(URL + '/reportes3/listarindicadores', { variable: grupoSeleccionados[0] }).then(json => {
                            if (json.data.ok)
                                setListaIndicadores(json.data.data)
                            else { alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg }); }
                        }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                        variablesSeleccionado.forEach(e => {

                            axios.post(URL + '/reportes3/indicadorespecificoR', { indicador: e, gestion: gestion.campo, mes1: mes1.campo, mes2: mes2.campo }).then(json => {
                                if (json.data.ok)
                                    json.data.data[1].forEach(e1 => {
                                        json.data.data[0].forEach(e2 => {
                                            if (parseInt(e1.input) === parseInt(e2.idinput)) {
                                                e1.valor = e2.valor
                                            }
                                        })
                                        data_.push(e1)
                                    })
                                else { alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg }); }
                            }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                        })
                        setData(data_)
                        setTimeout(() => {
                            setData([])
                            setData(data_)
                            setEstado(0)
                        }, 2000)

                    } else {
                        console.log(grupoSeleccionados)
                        let dataCabeceras = []
                        let dataInd_ = []
                        let data_ = []
                        grupoSeleccionados.forEach(e => {
                            axios.post(URL + '/reportes3/listarcabeceras', { variable: e }).then(json => {
                                if (json.data.ok)
                                    json.data.data.forEach(e => {
                                        dataCabeceras.push(e)
                                    })
                                else { alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg }); }
                            }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });

                            axios.post(URL + '/reportes3/listarindicadores', { variable: e }).then(json => {
                                if (json.data.ok)
                                    json.data.data.forEach(e => {
                                        dataInd_.push(e)
                                    })
                                else { alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg }); }
                            }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });

                            axios.post(URL + '/reportes3/unavariableR', { variable: e, gestion: gestion.campo, mes1: mes1.campo, mes2: mes2.campo }).then(json => {
                                if (json.data.ok)
                                    json.data.data[1].forEach(e1 => {
                                        json.data.data[0].forEach(e2 => {
                                            if (parseInt(e1.input) === parseInt(e2.idinput)) {
                                                e1.valor = e2.valor
                                            }
                                        })
                                        data_.push(e1)
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
                    }
                    setVentana(1)
                } else alert2({ icono: 'question', titulo: 'selecione una o mas formularios', boton: 'ok' })
            else alert2({ icono: 'question', titulo: 'selecione los parametros año, mes1 y mes2', boton: 'ok' })

        }

        const excel = () => {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'SDIS-VE';
            workbook.lastModifiedBy = 'SDIS-VE';

            const principal = workbook.addWorksheet('DATOS', {
                views:
                    [
                        // { showGridLines: false },
                        // { state: 'frozen', xSplit: 0, ySplit: 6, topLeftCell: 'G10', activeCell: 'A2' }
                        // {state: 'split', xSplit:2000,ySplit:3000,topLeftCell:'G10', activeCell:'A2'}
                    ],
                properties:
                {
                    tabColor: { argb: '28B463' }
                },
                pageSetup: {
                    paperSize: 9, orientation: 'landscape'
                },

            })

            for (let index = 1; index < 1000; index++) {
                principal.getColumn(index).width = 12
            }

            principal.columns.forEach((column) => {
                column.alignment = { vertical: 'middle', wrapText: true }
                column.font = { name: 'Arial', color: { argb: '595959' }, family: 2, size: 9, italic: false };
            })
            principal.mergeCells("A1:B5");

            const imageId = workbook.addImage({
                base64: img,
                extension: 'png',
            })
            let mes1_ = null
            let mes2_ = null
            let gestion_ = null
            listaMes.forEach(e => {
                if (e.id == mes1.campo) mes1_ = e.nombre
                if (e.id == mes2.campo) mes2_ = e.nombre
            })
            listaGestion.forEach(e => {
                if (e.id == gestion.campo) gestion_ = e.nombre
            })
            // CONFIGURACION DE LOS TIRULOS, NOMBRE HOSPITAL, MESES Y GESTION
            principal.addImage(imageId, { tl: { col: 0.5, row: 0.5 }, ext: { width: 100, height: 100 } })
            principal.mergeCells('C2:H2');
            principal.getCell('C2').alignment = { vertical: 'center', horizontal: 'center' };
            principal.getCell('C2').value = 'INFORME MENSUAL DE  PRODUCCIÓN DE SERVICIOS I NIVEL SEDES CHUQUISACA'
            principal.mergeCells('C3:H3');
            principal.getCell('C3').alignment = { vertical: 'center', horizontal: 'center' };
            principal.getCell('C3').value = 'FORMULARIO ADICIONAL 301c ( SEDES - SDIS  N° 2-4/2020)'
            principal.mergeCells('C4:H4');
            principal.getCell('C4').alignment = { vertical: 'center', horizontal: 'center' };
            principal.getCell('C4').value = 'INFORME EST. ' + localStorage.getItem('est')
            principal.getCell('C4').font = { name: 'Arial', color: { argb: '595959' }, family: 2, size: 8, italic: false };

            principal.mergeCells('A6:D6');
            principal.getCell('A6').alignment = { vertical: 'center', horizontal: 'left' };
            principal.getCell('A6').value = 'MES REPORTADO: ' + mes1_ + ' - ' + mes2_
            principal.mergeCells('E6:F6');
            principal.getCell('E6').alignment = { vertical: 'center', horizontal: 'left' };
            principal.getCell('E6').value = 'GESTIÓN: ' + gestion_


            //IMPLEMENTACION DE LAS CABECERAS INDICADORES Y LOS DATOS EN EL CUERPO DE LA HOJA

            let x = 0
            // for (let i = 7; i <= listaIndicadores.length + cabecera.length + grupoSeleccionados.length; i++) {
            // const fila = principal.getRow(i)

            let i = 7
            var fila = null
            grupoSeleccionados.forEach(g => {
                axios.post(URL + '/reportes3/maxorden', { id: g }).then(json => {
                    if (json.data.ok) {
                        let ultimo = json.data.data
                        let body = []
                        fila = principal.getRow(i)

                        let numIni = 5
                        cabecera.forEach(c => {

                            if (parseInt(g) === parseInt(c.variable)) {

                                if (c.nivel === 1) {
                                    let ini = fila.getCell(parseInt(numIni))._address  // NOMBRE DE LA CELDA
                                    let numFinal = numIni + c.span - 1

                                    // console.log(numIni, numFinal, 'numero inicial con incremento', c.nivel, grupoSeleccionados)
                                    let fin = fila.getCell(numFinal)._address
                                    let convi = JSON.stringify(ini + ":" + fin)
                                    console.log(`${ini.split(0) + ini.split(1) + ':' + fin.split(0) + fin.split(1)}`, 'string convinado jsonstrinfy', ini, fin)
                                    principal.mergeCells(`${ini.split(0) + ini.split(1) + ':' + fin.split(0) + fin.split(1)}`);
                                    principal.getCell(JSON.stringify(ini)).value = 'Este es una cabecera'
                                    numIni = numFinal + 1

                                }
                            }
                        })

                        fila.values = body
                        i++
                    }
                    else { alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg }); }
                })


            })


            // principal.mergeCells(`A` + i + `:D` + i);
            // principal.getCell(`A` + i).value = 'INDICADR' + x
            // x++

            // }







            workbook.xlsx.writeBuffer().then(data => {
                const blob = new Blob([data], {
                    type: "aplication/vnd.openxmlformats-officedocumets.spreadshhed.sheed",
                });
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = 'REPORTE SDIS-VE.xlsx';
                anchor.click();
                window.URL.revokeObjectURL(url);
            })
        }




        return (
            <div style={{ background: '#e5e5e5', paddingTop: '0.5rem', paddingBottom: '0.5rem', height: '95vh' }} >
                {estado === 1 && <Load texto={texto} />}
                {ventana === 0 ?
                    <div className="container_reportes">
                        <div className='header-reportes'>
                            {/* <img src='img/sedes22.png' className='icono-partido' alt='sdis-ve' /> */}
                            <p className='titulo'>reporte estadístico SDIS-VE</p>
                            <p style={{ fontSize: '15px', fontWeight: 'bold', color: '#595959', textAlign: 'center', marginBottom: '0' }} className='text-center'>{ localStorage.getItem('red')}  </p>

                        </div>
                        <div className='separador mb-3 mb-sm-0 mb-md-0 mb-lg-0'>
                            <span onClick={() => console.log(data, 'datos', cabecera, 'cabeceras')}>
                                PARÁMETROS DE SELECCION::
                            </span>
                        </div>
                        <p className='texto-mov' style={{ marginBottom: '0', fontSize: '12px' }}>{''}</p>
                        <div className='p-0 p-sm-2 p-md-3 p-lg-3 pb-0 pt-0 pt-lg-0 pt-md-0 pb-lg-0'>
                            <div className='orden-tiempo '>
                                    <div className='col-12'>
                                        <div className='row pb-2 '>
                                            <div className='col-3 col-sm-4 col-md-4 col-lg-4 p-1' >
                                                <SelectSM
                                                    estado={ss}
                                                    cambiarEstado={setSs}
                                                    ExpresionRegular={INPUT.ID}
                                                    lista={listaSs}
                                                    etiqueta={'Sub-Sector'}
                                                    msg='Seleccione una opcion'
                                                    fn={[listarTodosGrupos, listarGrupos]}
                                                    very = {1}
                                                />
                                            </div>
                                            <div className='col-3 col-sm-4 col-md-4 col-lg-4 p-1' >
                                                <SelectSM
                                                    estado={gestion}
                                                    cambiarEstado={setGestion}
                                                    ExpresionRegular={INPUT.ID}
                                                    lista={listaGestion}
                                                    etiqueta={'Gestion'}
                                                    // funcion={listarGrupos}
                                                    msg='Seleccione una opcion'
                                                    very = {1}
                                                />
                                            </div>

                                            <div className='col-3 col-sm-2 col-md-2 col-lg-2 p-1' onClick={() => { listarMes() }} >
                                                <SelectSM
                                                    estado={mes1}
                                                    cambiarEstado={setMes1}
                                                    ExpresionRegular={INPUT.ID}
                                                    lista={listaMes}
                                                    etiqueta={'de:'}
                                                    msg='Seleccione una opcion'
                                                    very = {1}
                                                />
                                            </div>
                                            <div className='col-3 col-sm-2 col-md-2 col-lg-2 p-1' onClick={() => { listarMes() }} >
                                                <SelectSM
                                                    estado={mes2}
                                                    cambiarEstado={setMes2}
                                                    ExpresionRegular={INPUT.ID}
                                                    lista={listaMes}
                                                    etiqueta={'a:'}
                                                    msg='Seleccione una opcion'
                                                    very = {1}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                    {window.innerWidth < 500 &&  <div className='col-12'>
                                        <div className=' row mt-3'>
                                            <div className='col-4'><p className='blue1'></p></div>
                                            <div className='col-4'><p className='red1'></p></div>
                                            <div className='col-4'><p className='blue2'></p></div>
                                        </div>
                                    </div>
                                    }
                                </div>
                        </div>
                        <div className='cajaprimario-reportes m-0 m-sm-2 m-md-3 m-lg-3 mt-0 mt-lg-0 '>
                            <div className='contenedor cajareportes p-3 p-sm-3 p-md-4 p-lg-4  pt-2 pb-2'>

                                <div className='col-12 col-sm-12 col-md-10 col-lg-10 m-auto'>

                                    <div className='row'  >
                                        <div className='col-12 col-sm-12 col-md-7 col-lg-7' >
                                            <h5 className='titulo-parametros'>Formularios</h5>
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
                                    <div className='botonModal mt-1'>
                                        <button className='botonProcesar' onClick={() => procesar()}>GENERAR</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="container_reportes m-auto" style={{ width: '97%' }}>

                        <p className='titulo-reportes_1' style={{ marginBottom: '0px' }} > FORMULARIO ADICIONAL 301c</p>
                        <p className='titulo-reportes_1' style={{ marginBottom: '0px' }}>GESTION {' ' + año}</p>
                        <div className='row'>
                            <div className='col-6'>
                                <p className='titulo-reportes' style={{ color: '#2980B9', textAlign: 'left', paddingLeft: '8px', marginBottom: '0', }}>{
                                     localStorage.getItem('red')
                                }  </p>

                            </div>
                            <div className='col-6'>
                                {listaSs.map(e => (
                                    ss.campo == e.id && <p className='titulo-reportes' style={{ color: '#2980B9', textAlign: 'left', paddingLeft: '8px', marginBottom: '0', }}>{'SUB-SECTOR: ' + e.nombre} </p>
                                ))}
                            </div>
                        </div>

                        <div className='col-6'>
                            <p className='titulo-reportes'
                                style={{ color: '#2980B9', textAlign: 'left', paddingLeft: '8px', marginBottom: '0', }}>MES(es):
                                {
                                    listaMes.map(e => (
                                        mes1.campo == e.id && <span >{' ' + e.nombre + ' - '} </span>
                                    ))
                                }
                                {
                                    listaMes.map(e => (
                                        mes2.campo == e.id && <span >{e.nombre} </span>
                                    ))
                                }
                            </p>
                        </div>
                        <div className='p-2'>

                            {listaGrupo.map(lg => (
                                grupoSeleccionados.map(gs => (
                                    parseInt(lg.id) === parseInt(gs) && <div key={gs}>
                                        <p style={{ fontSize: '13px', marginBottom: '0', fontWeight: 'bold' }}>{lg.nombre}  {
                                            listaSs.map(e => (parseInt(e.id) == parseInt(ss.campo) && <span style={{fontWeight:'bold'}}>{'/ Sub-Sector: ' + e.nombre}</span>
                                            ))
                                        } </p>
                                        
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

                                                {variablesSeleccionado.length > 0 ?
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
                                                            <tr key={ind.id} style={{ borderRight: '1px solid #000040', }} className='item'>
                                                                <td className="col-3 mincelda TituloSecundario" style={{ padding: '4px 0px 0px 0px', borderBottom: '0px', borderTop: '1px solid #000040', borderRight: '1px solid #000040', }}>{ind.indicador}</td>
                                                                {
                                                                    data.map(d => (
                                                                        parseInt(ind.id) === parseInt(d.indicador) && <td className="text-center"
                                                                            style={{ padding: '4px 0px 0px 0px', paddingBottom: '0', borderBottom: '0px', borderTop: '1px solid #000040', borderRight: '1px solid #000040', }} key={d.id}>
                                                                            <div style={{ height: '29px' }}  >{d.valor}</div>
                                                                        </td>
                                                                    ))
                                                                }
                                                            </tr>
                                                        ))}
                                                    </tbody>}
                                            </Table>
                                        </div>
                                    </div>
                                ))
                            ))}

                            <div className='botonModal p-1'>
                                <button className='botonVolversm' onClick={() => window.location.href = '/mireportes3'}>Volver</button>
                                <button className='botonExcel' onClick={() => excel()} >EXCEL</button>
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
export default Mireportes3;
