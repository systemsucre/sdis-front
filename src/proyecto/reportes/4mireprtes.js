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
import { imgG } from './gobernacion';
const ExcelJS = require('exceljs')


function Mireportes4() {
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
            if (ss.campo == 1000) listarTodosGrupos()
            else listarGrupos()
        }, [ss])

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
            axios.post(URL + '/reportes4/listargestion').then(json => {
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
                axios.post(URL + '/reportes4/listarmes', { id: id ? id : gestion.campo, fecha: fecha + ' ' + horafinal }).then(json => {
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
                axios.post(URL + '/reportes4/listartodosvariableM', { id: id ? id : gestion.campo, }).then(json => {
                    if (json.data.ok) {
                        setListaGrupo(json.data.data)
                        // console.log(json.data.data,'data de la bd')
                    } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg })
                }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            }
        }



        const listarGrupos = async () => {
            console.log('listar grupos especificos')
            if (gestion.valido === 'true') {
                axios.post(URL + '/reportes4/listarvariableM', { id: gestion.campo, ssector: ss.campo }).then(json => {
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
            axios.post(URL + '/reportes4/listarindicadores', { variable: id }).then(json => {
                if (json.data.ok) {
                    setListaVariable(json.data.data)
                    setEstado(0)
                    // listarCabeceras(json.data.data[0][0].id)

                } else { alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg }); setEstado(0) }
            }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); setEstado(0) });
        }






        const procesar = async () => {
            // console.log(grupoSeleccionados, 'grupos seleccinados')

            if (mes1.valido === 'true' && mes2.valido === 'true' && gestion.valido === 'true') {

                setEstado(1)
                setTexto('Procesando la informacion...')
                if (variablesSeleccionado.length > 0) {
                    axios.post(URL + '/reportes4/reportes-formularios-dividido-mi-formulario', { lista: variablesSeleccionado, variable: grupoSeleccionados[0], gestion: gestion.campo, mes1: mes1.campo, mes2: mes2.campo }).then(json => {
                        if (json.data.ok) {
                            console.log('datos del server', json.data)
                            setData(json.data.dataForm)
                            setCabecera(json.data.cabeceras)
                            setListaIndicadores(json.data.indicadores)
                            setVentana(1)
                            setEstado(0)
                        } else { alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                    }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                } else {
                    axios.post(URL + '/reportes4/reportes-formularios-enteros-mi-formulario', { lista: grupoSeleccionados, gestion: gestion.campo, mes1: mes1.campo, mes2: mes2.campo }).then(json => {
                        if (json.data.ok) {
                            console.log('datos del server', json.data)
                            setData(json.data.dataForm)
                            setCabecera(json.data.cabeceras)
                            setListaIndicadores(json.data.indicadores)
                            setVentana(1)
                            setEstado(0)
                        } else { alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                    }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                }

            }

            else alert2({ icono: 'question', titulo: 'selecione los parametros año, mes1 y mes2', boton: 'ok' })

        }

        const excel = () => {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'SDIS-VE';
            workbook.lastModifiedBy = 'SDIS-VE';

            const principal = workbook.addWorksheet('ESTRUCTURA', {
                properties:
                {
                    tabColor: { argb: 'ECF0F1' }
                },
                pageSetup: {
                    paperSize: 9, orientation: 'landscape'
                },

            })

            for (let index = 1; index < 1000; index++) {
                principal.getColumn(index).width = 12
            }

            principal.columns.forEach((column) => {
                column.alignment = { vertical: 'middle', }  //  wrapText: true ajustar texto dentro de la celda
                column.font = { name: 'Arial', color: { argb: '595959' }, family: 2, size: 7, italic: false };
            })
            principal.mergeCells("A1:A5");
            principal.mergeCells("H1:H5");

            const imageId = workbook.addImage({
                base64: img,
                extension: 'png',
            })
            const imageIdGob = workbook.addImage({
                base64: imgG,
                extension: 'png',
            })

            let mes1_ = null
            let mes2_ = null
            let gestion_ = null
            listaMes.forEach(e => {
                if (e.id == mes1.campo) mes1_ = e.nombre
            })
            listaMes.forEach(e => {
                if (e.id == mes2.campo) mes2_ = e.nombre
            })
            listaGestion.forEach(e => {
                if (e.id == gestion.campo) gestion_ = e.nombre
            })

            // CONFIGURACION DE LOS TIRULOS, NOMBRE HOSPITAL, MESES Y GESTION
            principal.addImage(imageId, { tl: { col: 0.1, row: 0.1 }, ext: { width: 100, height: 95 } })
            principal.addImage(imageIdGob, { tl: { col: 7, row: 0.1 }, ext: { width: 100, height: 100 } })
            principal.mergeCells('B2:G2');
            principal.getCell('B2').alignment = { vertical: 'center', horizontal: 'center' };
            principal.getCell('B2').value = 'INFORME MENSUAL DE  PRODUCCIÓN DE SERVICIOS SEDES CHUQUISACA'
            principal.getCell('B2').font = { bold: 700, size: 11, color: { argb: '595959' }, italic: false }

            principal.mergeCells('B3:G3');
            principal.getCell('B3').alignment = { vertical: 'center', horizontal: 'center' };
            principal.getCell('B3').value = 'FORMULARIO ADICIONAL 301c ( SEDES - SDIS  N° 4-11/2023)'
            principal.getCell('B3').font = { bold: 600, size: 11, color: { argb: '595959' }, italic: false }


            principal.mergeCells('C4:F4');
            principal.getCell('C4').alignment = { vertical: 'center', horizontal: 'center' };
            principal.getCell('C4').value = 'MUNICIPIO: ' + localStorage.getItem('mun')
            principal.getCell('C4').font = { bold: 700, size: 11, color: { argb: 'DC7633' }, italic: false }


            principal.mergeCells('C5:F5');
            principal.getCell('F5').alignment = { vertical: 'center', horizontal: 'center' };
            principal.getCell('F5').value = 'GESTIÓN ' + gestion_ + ' DEL MES ' + mes1_ + ' A ' + mes2_
            principal.getCell('C5').font = { bold: 600, size: 8, color: { argb: '808080' }, italic: false }

            let numero_fila = 6
            let inicio_fila_titulo = 6
            let fin_fila_titulo = 6
            listaGrupo.forEach(lg => {
                grupoSeleccionados.forEach(gs => {
                    if (parseInt(lg.id) === parseInt(gs)) {
                        numero_fila = numero_fila + 1
                        inicio_fila_titulo = inicio_fila_titulo + 1
                        fin_fila_titulo = fin_fila_titulo + 1
                        let numero_columna_1 = 6
                        let numero_columna_2 = 6
                        let numero_columna_3 = 6
                        let aumento_1 = true
                        let aumento_2 = true
                        let aumento_ini = 0
                        for (let c of cabecera) {

                            if (parseInt(c.variable) === parseInt(gs)) {

                                if (parseInt(c.nivel) == 1) {
                                    aumento_1 = true
                                    aumento_2 = true
                                    let fila_nivel1 = principal.getRow(numero_fila)
                                    let ini = fila_nivel1.getCell(parseInt(numero_columna_1))._address  // NOMBRE DE LA CELDA
                                    let numFinal_columna = numero_columna_1 + c.span - 1
                                    let fin = fila_nivel1.getCell(numFinal_columna)._address
                                    principal.mergeCells(`${ini + ':' + fin}`);
                                    principal.getCell(`${ini}`).value = c.input
                                    principal.getCell(`${ini}`).alignment = { vertical: 'center', horizontal: c.span > 1 ? 'center' : null }
                                    principal.getCell(`${ini}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'f0f8ff' }, }
                                    principal.getCell(`${ini}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                                    numero_columna_1 = numFinal_columna + 1

                                }
                                if (parseInt(c.nivel) == 2) {
                                    aumento_2 = true
                                    if (aumento_1) {
                                        aumento_1 = false;
                                        numero_fila = numero_fila + 1;
                                        inicio_fila_titulo = inicio_fila_titulo + 1;
                                        aumento_ini++
                                        fin_fila_titulo++
                                    }
                                    let fila_nivel1 = principal.getRow(numero_fila)
                                    let ini = fila_nivel1.getCell(parseInt(numero_columna_2))._address  // NOMBRE DE LA CELDA
                                    let numFinal_columna = numero_columna_2 + c.span - 1
                                    let fin = fila_nivel1.getCell(numFinal_columna)._address
                                    principal.mergeCells(`${ini + ':' + fin}`);
                                    principal.getCell(`${ini}`).value = c.input
                                    principal.getCell(`${ini}`).alignment = { vertical: 'center', horizontal: c.span > 1 ? 'center' : null }
                                    principal.getCell(`${ini}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'f0f8ff' }, }
                                    principal.getCell(`${ini}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                                    numero_columna_2 = numFinal_columna + 1
                                }
                                if (parseInt(c.nivel) == 3) {
                                    if (aumento_2) {
                                        aumento_2 = false;
                                        numero_fila = numero_fila + 1;
                                        inicio_fila_titulo = inicio_fila_titulo + 1;
                                        fin_fila_titulo++
                                        aumento_ini++
                                    }

                                    let fila_nivel1 = principal.getRow(numero_fila)
                                    let ini = fila_nivel1.getCell(parseInt(numero_columna_3))._address  // NOMBRE DE LA CELDA
                                    let numFinal_columna = numero_columna_3 + c.span - 1
                                    let fin = fila_nivel1.getCell(numFinal_columna)._address
                                    principal.mergeCells(`${ini + ':' + fin}`);
                                    principal.getCell(`${ini}`).value = c.input
                                    principal.getCell(`${ini}`).alignment = { vertical: 'center', horizontal: 'center' }
                                    principal.getCell(`${ini}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'f0f8ff' }, }
                                    principal.getCell(`${ini}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                                    numero_columna_3 = numFinal_columna + 1
                                }
                            }
                        }
                        let ini_titulo = principal.getRow(inicio_fila_titulo - aumento_ini).getCell(1)._address
                        let fin_titulo = principal.getRow(fin_fila_titulo).getCell(5)._address
                        principal.mergeCells(`${ini_titulo + ':' + fin_titulo}`);
                        principal.getCell(`${ini_titulo}`).value = lg.nombre
                        principal.getCell(`${ini_titulo}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'f0f8ff' }, }
                        principal.getCell(`${ini_titulo}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                        numero_fila = numero_fila + 1
                        inicio_fila_titulo = inicio_fila_titulo + 1
                        fin_fila_titulo = fin_fila_titulo + 1
                        for (let ind of listaIndicadores) {
                            if (parseInt(ind.variable) === parseInt(gs)) {
                                let contador_columna = 6
                                if (variablesSeleccionado.length > 0) {
                                    variablesSeleccionado.forEach(vs => {
                                        if (parseInt(ind.id) === parseInt(vs)) {
                                            let fila = principal.getRow(numero_fila)
                                            let ini_titulo = fila.getCell(1)._address
                                            let fin_titulo = fila.getCell(5)._address
                                            principal.mergeCells(`${ini_titulo + ':' + fin_titulo}`);
                                            principal.getCell(`${ini_titulo}`).value = ind.indicador
                                            principal.getCell(`${ini_titulo}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                                            data.forEach(d => {
                                                if (parseInt(ind.id) === parseInt(d.indicador)) {
                                                    let ini_titulo = fila.getCell(contador_columna)._address
                                                    principal.getCell(`${ini_titulo}`).value = parseInt(d.valor)
                                                    principal.getCell(`${ini_titulo}`).alignment = { vertical: 'center', horizontal: 'right' };
                                                    principal.getCell(`${ini_titulo}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                                                    principal.getCell(`${ini_titulo}`).font = { bold: 600, size: 8, color: { argb: '595959' }, italic: false }
                                                    contador_columna++
                                                }
                                            })
                                        }
                                    })
                                } else {
                                    let fila = principal.getRow(numero_fila)
                                    let ini_titulo = fila.getCell(1)._address
                                    let fin_titulo = fila.getCell(5)._address
                                    principal.mergeCells(`${ini_titulo + ':' + fin_titulo}`);
                                    principal.getCell(`${ini_titulo}`).value = ind.indicador
                                    principal.getCell(`${ini_titulo}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                                    data.forEach(d => {
                                        if (parseInt(ind.id) === parseInt(d.indicador)) {
                                            let ini_titulo = fila.getCell(contador_columna)._address
                                            principal.getCell(`${ini_titulo}`).value = parseInt(d.valor)
                                            principal.getCell(`${ini_titulo}`).alignment = { vertical: 'center', horizontal: 'right' };
                                            principal.getCell(`${ini_titulo}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                                            principal.getCell(`${ini_titulo}`).font = { bold: 600, size: 8, color: { argb: '595959' }, italic: false }
                                            contador_columna++
                                        }
                                    })
                                }
                                numero_fila = numero_fila + 1
                                inicio_fila_titulo = inicio_fila_titulo + 1
                                fin_fila_titulo = fin_fila_titulo + 1
                            }
                        }


                    }
                })
            })
            workbook.xlsx.writeBuffer().then(data => {
                const blob = new Blob([data], {
                    type: "aplication/vnd.openxmlformats-officedocumets.spreadshhed.sheed",
                });
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = 'FORMULARIO ADICIONAL 301C ' + gestion_ + '_' + mes1_ + '-' + mes2_ + '-' + localStorage.getItem('mun') + '.xlsx';
                // 'FORMULARIO ADICIONAL 301C 2023_ABRIL-NOVIEMBRE_SAN ROQUE'
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
                            <p style={{ fontSize: '15px', fontWeight: 'bold', color: '#595959', textAlign: 'center', marginBottom: '0' }} className='text-center'>{'MUNICIPIO :: ' + localStorage.getItem('mun')}  </p>

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
                                    <div className='row pb-2'>
                                        <div className='col-3 col-sm-4 col-md-4 col-lg-4 p-1' onClick={() => {
                                            setListaGrupo([]); setListaVariable([]); setGruposSeleccionado([]); setVariablesSeleccionados([])
                                        }}>
                                            <SelectSM
                                                estado={ss}
                                                cambiarEstado={setSs}
                                                ExpresionRegular={INPUT.ID}
                                                lista={listaSs}
                                                etiqueta={'Sub-Sector'}
                                                msg='Seleccione una opcion'
                                                // fn_1={[listarTodosGrupos, listarGrupos]}
                                                very={1}
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
                                                very={1}

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
                                                very={1}

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
                                                very={1}

                                            />
                                        </div>

                                    </div>
                                </div>
                                {window.innerWidth < 500 &&
                                    <div className='col-12'>
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

                        <p className='titulo-reportes_1' style={{ marginBottom: '0px', color: '#023c52', }}>{
                            'MUNICIPIO: ' + localStorage.getItem('mun')}</p>

                        <p className='titulo-reportes_1' style={{ marginBottom: '0px', fontSize: '10px' }} > FORMULARIO ADICIONAL 301c</p>

                        <p className='titulo-reportes'
                            style={{ color: '#023c52', textAlign: 'left', paddingLeft: '8px', marginBottom: '0', }}>GESTION {' ' + año + ' MES '}
                            {
                                listaMes.map(e => (
                                    mes1.campo == e.id && <span >{' ' + e.nombre + ' A '} </span>
                                ))
                            }
                            {
                                listaMes.map(e => (
                                    mes2.campo == e.id && <span >{e.nombre} </span>
                                ))
                            }
                        </p>




                        <div className='p-2'>

                            {listaGrupo.map(lg => (
                                grupoSeleccionados.map(gs => (
                                    parseInt(lg.id) === parseInt(gs) && <div key={gs}>
                                        <p style={{ fontSize: '13px', marginBottom: '0', fontWeight: 'bold' }}>{lg.nombre} </p>

                                        <div className="table table-responsive custom" style={{ height: 'auto', padding: "0.0rem 0.0rem", marginBottom: '0' }}>
                                            <Table className=' table-sm' style={{ border: "1px solid #dee2e6", borderRight: 'none', borderTop: '1px solid white', borderSpacing: '0px', padding: '0px' }} >
                                                {cabecera.length > 0 &&
                                                    <thead className='cab-form'>
                                                        <tr  >
                                                            <th className="col-3 mincelda var" style={{ color: '#595959', background: 'AliceBlue', borderRight: '1px solid #dee2e6', borderTop: '1px solid #dee2e6', }}>VARIABLE</th>
                                                            {cabecera.map(cb => (
                                                                parseInt(cb.variable) === parseInt(gs) && parseInt(cb.nivel) == 1 &&
                                                                <th className='text-center nivel1F' style={{
                                                                    background: 'AliceBlue',
                                                                    borderLeft: '1px solid white', borderRight: '1px solid #dee2e6', borderTop: '1px solid #dee2e6',
                                                                    fontSize: '8pt', fontWeight: 'bold', fontFamily: 'Verdana', color: '#023c52', borderBottom: '1px solid #dee2e6',
                                                                }} colSpan={cb.span}
                                                                    key={cb.id} >{cb.input}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                        <tr style={{ borderTop: '1px solid #595959' }}>
                                                            <th className="col-3 mincelda " style={{ color: '#595959', background: 'AliceBlue', borderRight: '1px solid #dee2e6', }}></th>
                                                            {cabecera.map(cb => (
                                                                parseInt(cb.variable) === parseInt(gs) && parseInt(cb.nivel) == 2 &&
                                                                <th className='text-center nivel1F' style={{
                                                                    background: 'AliceBlue',
                                                                    borderLeft: '1px solid white', borderRight: '1px solid #dee2e6', borderTop: '1px solid #dee2e6',
                                                                    fontSize: '8pt', fontWeight: 'bold', fontFamily: 'Verdana', color: '#023c52', borderBottom: '1px solid #dee2e6',
                                                                }} colSpan={cb.span}
                                                                    key={cb.id} >{cb.input}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                        <tr style={{ borderTop: '1px solid #595959' }} >
                                                            <th className="col-3 mincelda " style={{ color: '#595959', background: ' AliceBlue', borderRight: '1px solid #dee2e6', }}></th>
                                                            {cabecera.map(cb => (
                                                                parseInt(cb.variable) === parseInt(gs) && parseInt(cb.nivel) == 3 &&
                                                                <th className='text-center nivel1F' style={{
                                                                    background: 'AliceBlue',
                                                                    borderLeft: '1px solid white', borderRight: '1px solid #dee2e6', borderTop: '1px solid #dee2e6',
                                                                    fontSize: '8pt', fontWeight: 'bold', fontFamily: 'Verdana', color: '#023c52'
                                                                }} colSpan={cb.span}
                                                                    key={cb.id} >{cb.input}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>}

                                                {variablesSeleccionado.length > 0 ?
                                                    // VARIABLES ESPECIFICOS
                                                    <tbody style={{ borderRight: '1px solid #dee2e6', }}>

                                                        {listaIndicadores.map((ind) => (
                                                            parseInt(ind.variable) === parseInt(gs) &&
                                                            // <div key={ind.id}>{
                                                            variablesSeleccionado.map(vs => (
                                                                parseInt(ind.id) === parseInt(vs) &&
                                                                <tr key={ind.id} style={{ borderRight: '1px solid #dee2e6', }}>
                                                                    <td className="col-3 mincelda TituloSecundario" style={{ padding: '4px 0px 0px 0px', borderBottom: '0px', borderTop: '1px solid #dee2e6', borderRight: '1px solid #dee2e6', }}>{ind.indicador}</td>
                                                                    {
                                                                        data.map(d => (
                                                                            parseInt(ind.id) === parseInt(d.indicador) && <td className="text-center"
                                                                                style={{ padding: '3px 0px 3px 0px', paddingBottom: '0', background: 'white', borderBottom: '0px', borderTop: '1px solid #dee2e6', borderRight: '1px solid #dee2e6', }} key={d.id}>
                                                                                <div style={{ border: '0.0px solid #ABB2B9', height: 'auto' }}  >{d.valor}</div>
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
                                                            <tr key={ind.id} style={{ borderRight: '1px solid #dee2e6', }} className='item'>
                                                                <td className="col-3 mincelda TituloSecundario" style={{ padding: '4px 0px 0px 0px', borderBottom: '0px', borderTop: '1px solid #dee2e6', borderRight: '1px solid #dee2e6', }}>{ind.indicador}</td>
                                                                {
                                                                    data.map(d => (
                                                                        parseInt(ind.id) === parseInt(d.indicador) && <td className="text-center"
                                                                            style={{ padding: '3px 0px 3px 0px', paddingBottom: '0', borderBottom: '0px', borderTop: '1px solid #dee2e6', borderRight: '1px solid #dee2e6', }} key={d.id}>
                                                                            <div style={{ height: 'auto' }}  >{d.valor}</div>
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
                                <button className='botonVolversm' onClick={() => window.location.href = '/mireportes4'}>Volver</button>
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
export default Mireportes4;
