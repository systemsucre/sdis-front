import React from 'react';


import useAuth from "../../Auth/useAuth"
import { useState, useEffect } from "react";
import { URL, INPUT } from '../../Auth/config';
import axios from 'axios';
import { toast } from 'react-hot-toast'
import '../../elementos/estilos.css'
import { alert2, } from '../../elementos/alert2'
import Load from '../../elementos/load'
import { SelectSM } from '../../elementos/elementos';
import { Table } from 'reactstrap';
import { img } from './logo';
import { imgG } from './gobernacion';

const ExcelJS = require('exceljs')



function ReportesFormularioArea() {
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
    const [listaSs, setListaSs] = useState([]);

    const [entidad, setEntidad] = useState([]);
    const [listaNivelAplicacion, setListaNivelAplicacion] = useState([
        { id: 1, nombre: 'ESTABLECIMIENTOS' }, { id: 2, nombre: 'MUNICIPIO' }, { id: 3, nombre: 'CONSOLIDADO MUNICIPIO' },
        { id: 4, nombre: 'RED' }, { id: 5, nombre: 'CONSOLIDADO RED' }, { id: 6, nombre: 'DEPARTAMENTO' }, { id: 7, nombre: 'CONSOLIDADO DEPTO' }]);
    const [nivelAplicacion, setNivelAplicacion] = useState({ campo: 1, valido: 'true' })
    const [maxOrden, setMaxOrden] = useState(0);

    const [listaGestion, setListaGestion] = useState([]);
    const [gestion, setGestion] = useState({ campo: null, valido: null })
    const [listaMes, setListaMes] = useState([]);
    const [mes1, setMes1] = useState({ campo: null, valido: null })
    const [mes2, setMes2] = useState({ campo: null, valido: null })
    const [idEntidad, setIdEntidad] = useState({ campo: null, valido: null })

    // DATOS PARA REPORTES
    const [cabecera, setCabecera] = useState([]); // una sola cabecera
    const [listaEstablecimientos, setListaEstablecimientos] = useState([]); // una sola estable
    const [data, setData] = useState([]);

    try {

        useEffect(() => {

            if (listaGestion.length < 1) {
                document.title = 'REPORTES'
                listarGestion()
            }
            if (nivelAplicacion.campo == 1) listarHospitales()
            if (nivelAplicacion.campo == 2) listarMunicipio()
            if (nivelAplicacion.campo == 3) listarMunicipio()
            if (nivelAplicacion.campo == 4) listarRed()
            if (nivelAplicacion.campo == 5) listarRed()
            if (nivelAplicacion.campo == 6) setEntidad([{ id: 6, nombre: 'DEPARTAMENTO' }])
            if (nivelAplicacion.campo == 7) { setEntidad([{ id: 7, nombre: 'DEPARTAMENTO CONSOLIDADO' }]) }
        }, [nivelAplicacion])
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
            axios.post(URL + '/reportes6/listargestion').then(json => {
                if (json.data.hasOwnProperty("sesion")) {
                    auth.logout()
                    alert('LA SESION FUE CERRADO DESDE EL SERVIDOR, VUELVA A INTRODODUCIR SUS DATOS DE INICIO')
                }
                if (json.data.ok) {
                    // console.log(json.data.data, 'lista gestion')
                    setListaGestion(json.data.data[0])
                    listarMes(json.data.data[0][0].id)
                    listarHospitales()
                    setGestion({ campo: json.data.data[0].length > 0 ? json.data.data[0][0].id : null, valido: json.data.data[0].length > 0 ? 'true' : null })
                } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg })
            }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }

        const listarMes = async (id = null) => {
            if (gestion.valido === 'true' || id) {
                axios.post(URL + '/reportes6/listarmes', { id: id ? id : gestion.campo, fecha: fecha + ' ' + horafinal }).then(json => {
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

        const listarHospitales = async () => {
            axios.post(URL + '/reportes6/listarhospitales').then(json => {
                if (json.data.ok) {
                    setEntidad(json.data.data)
                    setIdEntidad({ campo: json.data.data[0].id, valido: 'true' })
                } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg })
            }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }

        const listarMunicipio = async () => {
            axios.post(URL + '/reportes6/listarmunicipio').then(json => {
                if (json.data.ok) {
                    setEntidad(json.data.data)
                    setEntidad(json.data.data)
                    setIdEntidad({ campo: json.data.data[0].id, valido: 'true' })
                } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg })
            }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }

        const listarRed = async () => {
            axios.post(URL + '/reportes6/listarred').then(json => {
                if (json.data.ok) {
                    setEntidad(json.data.data)
                    setEntidad(json.data.data)
                    setIdEntidad({ campo: json.data.data[0].id, valido: 'true' })
                } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg })
            }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }



        const procesar = async () => {
            // consolidad todo el municipio
            if (mes1.valido === 'true' && mes2.valido === 'true' && gestion.valido === 'true' && idEntidad.valido === 'true' && nivelAplicacion.valido === 'true') {

                setEstado(1)
                setTexto('cargando información')
                if (nivelAplicacion.campo == 7) {

                    axios.post(URL + '/reportes6/procesar-consolidado', { gestion: gestion.campo, mes1: mes1.campo, mes2: mes2.campo }).then(json => {
                        if (json.data.ok) {
                            setListaEstablecimientos(json.data.conf)
                            setData(json.data.data)
                            setCabecera(json.data.cabecera)
                            setEstado(0)
                        } else { toast.error(json.data.msg); setEstado(0) }
                    })
                }
                if (nivelAplicacion.campo == 6) {

                    axios.post(URL + '/reportes6/procesar-por-redes', { gestion: gestion.campo, mes1: mes1.campo, mes2: mes2.campo }).then(json => {
                        if (json.data.ok) {
                            setListaEstablecimientos(json.data.conf)
                            setData(json.data.data)
                            setCabecera(json.data.cabecera)
                            setEstado(0)
                        } else { toast.error(json.data.msg); setEstado(0) }
                    })
                }
                if (nivelAplicacion.campo == 5) {

                    axios.post(URL + '/reportes6/procesar-red-consolidado', { red: idEntidad.campo, gestion: gestion.campo, mes1: mes1.campo, mes2: mes2.campo }).then(json => {
                        if (json.data.ok) {
                            setListaEstablecimientos(json.data.conf)
                            setData(json.data.data)
                            setCabecera(json.data.cabecera)
                            setEstado(0)
                        } else { toast.error(json.data.msg); setEstado(0) }
                    })
                }

                if (nivelAplicacion.campo == 4) {

                    axios.post(URL + '/reportes6/procesar-red', { red: idEntidad.campo, gestion: gestion.campo, mes1: mes1.campo, mes2: mes2.campo }).then(json => {
                        if (json.data.ok) {
                            setListaEstablecimientos(json.data.conf)
                            setData(json.data.data)
                            setCabecera(json.data.cabecera)
                            setEstado(0)
                        } else { toast.error(json.data.msg); setEstado(0) }
                    })
                }
                if (nivelAplicacion.campo == 3) {

                    axios.post(URL + '/reportes6/procesar-municipio-consolidado', { mun: idEntidad.campo, gestion: gestion.campo, mes1: mes1.campo, mes2: mes2.campo }).then(json => {
                        if (json.data.ok) {
                            setListaEstablecimientos(json.data.conf)
                            setData(json.data.data)
                            setCabecera(json.data.cabecera)
                            setEstado(0)
                        } else { toast.error(json.data.msg); setEstado(0) }
                    })
                }
                if (nivelAplicacion.campo == 2) {

                    axios.post(URL + '/reportes6/procesar-municipio', { mun: idEntidad.campo, gestion: gestion.campo, mes1: mes1.campo, mes2: mes2.campo }).then(json => {
                        if (json.data.ok) {
                            setListaEstablecimientos(json.data.conf)
                            setData(json.data.data)
                            setCabecera(json.data.cabecera)
                            setEstado(0)
                        } else { toast.error(json.data.msg); setEstado(0) }
                    })
                }
                if (nivelAplicacion.campo == 1) {
                    axios.post(URL + '/reportes6/procesar-establecimiento', { est: idEntidad.campo, gestion: gestion.campo, mes1: mes1.campo, mes2: mes2.campo }).then(json => {
                        if (json.data.ok) {
                            setListaEstablecimientos(json.data.conf)
                            setData(json.data.data)
                            setCabecera(json.data.cabecera)
                            setEstado(0)
                        } else { toast.error(json.data.msg); setEstado(0) }
                    })
                }
            } else alert2({ icono: 'question', titulo: 'selecione los parametros año, meses, entidad, ', boton: 'ok' })
        }

        const excel = () => {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'SDIS-VE';
            workbook.lastModifiedBy = 'SDIS-VE';


            const principal = workbook.addWorksheet(localStorage.getItem('area'), {
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
                column.font = { name: 'Arial', color: { argb: '595959' }, family: 2, size: 8, italic: false };
            })
            principal.mergeCells("B1:C5");
            principal.mergeCells("K1:L5");

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
            let entidad_ = null
            listaMes.forEach(e => {
                if (e.id == mes1.campo) mes1_ = e.nombre
            })
            listaMes.forEach(e => {
                if (e.id == mes2.campo) mes2_ = e.nombre
            })
            listaGestion.forEach(e => {
                if (e.id == gestion.campo) gestion_ = e.nombre
            })

            entidad.forEach(e => {
                if (e.id == idEntidad.campo) entidad_ = e.nombre
            })


            // CONFIGURACION DE LOS TIRULOS, NOMBRE HOSPITAL, MESES Y GESTION
            principal.addImage(imageId, { tl: { col: 1.1, row: 0.1 }, ext: { width: 100, height: 95 } })
            principal.addImage(imageIdGob, { tl: { col: 10.6, row: 0.1 }, ext: { width: 100, height: 100 } })
            principal.mergeCells('D2:J2');
            principal.getCell('D2').alignment = { vertical: 'center', horizontal: 'center' };
            principal.getCell('D2').value = 'INFORME MENSUAL DE  PRODUCCIÓN DE SERVICIOS SEDES CHUQUISACA'
            principal.getCell('D2').font = { bold: 700, color: { argb: '595959' }, italic: false }

            principal.mergeCells('D3:J3');
            principal.getCell('D3').alignment = { vertical: 'center', horizontal: 'center' };
            principal.getCell('D3').value = 'FORMULARIO ADICIONAL 301c ( SEDES - SDIS  N° 4-11/2023)'
            principal.getCell('D3').font = { bold: 600, color: { argb: '595959' }, italic: false }


            principal.mergeCells('E5:I5');
            principal.getCell('E5').alignment = { vertical: 'center', horizontal: 'center' };
            principal.getCell('E5').value = 'NIVEL FORMULARIO: ESTABLECIMIENTO'
            principal.getCell('E5').font = { bold: 600, color: { argb: '595959' }, italic: false }

            principal.mergeCells('B6:F6');
            principal.getCell('B6').alignment = { vertical: 'center', horizontal: 'left' };
            principal.getCell('B6').value =  nivelAplicacion.campo == 1 ? 'ESTABLECIEMIENTO: ' + entidad_: nivelAplicacion.campo == 2 ? 'MUNICIPIO: ' + entidad_ : nivelAplicacion.campo == 3 ? 'MUNICIPIO :' + entidad_+'(CONSOLIDADO)'
                : nivelAplicacion.campo == 4 ? 'RED: ' + entidad_  : nivelAplicacion.campo == 5 ? 'RED: ' + entidad_ +'(CONSOLIDADO)' : nivelAplicacion.campo == 6 ? 'DEPARTAMENTO CH.': nivelAplicacion.campo == 7 ?
                    'CONSOLIDADO DEPTO. CH.' : null

            principal.getCell('B6').font = { bold: 600, color: { argb: '595959' }, italic: false }


            principal.mergeCells('G6:H6');
            principal.getCell('G6').alignment = { vertical: 'center', horizontal: 'left' };
            principal.getCell('G6').value = 'GESTIÓN: ' + gestion_
            principal.getCell('G6').font = { bold: 600, color: { argb: '595959' }, italic: false }

            principal.mergeCells('I6:K6');
            principal.getCell('I6').alignment = { vertical: 'center', horizontal: 'left' };
            principal.getCell('I6').value = 'MES REPORTADO: ' + mes1_ + ' - ' + mes2_
            principal.getCell('I6').font = { bold: 600, color: { argb: '595959' }, italic: false }

            principal.mergeCells('B7:L7');
            principal.getCell('B7').alignment = { vertical: 'center', horizontal: 'left' };
            principal.getCell('B7').value = 'FORMULARIO: ' + localStorage.getItem('area')
            principal.getCell('B7').font = { bold: 800, color: { argb: '595959' }, size: 11, italic: true }

            let numero_fila = 7

            numero_fila = numero_fila + 1

            let numero_columna_1 = 8
            let numero_columna_2 = 8
            let numero_columna_3 = 8
            let aumento_1 = true
            let aumento_2 = true
            let aumento_ini = 0
            for (let c of cabecera) {

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
                        aumento_ini++
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
            let ini_titulo = principal.getRow(8).getCell(2)._address
            let fin_titulo = principal.getRow(8 + aumento_ini).getCell(4)._address
            principal.mergeCells(`${ini_titulo + ':' + fin_titulo}`);
            principal.getCell(`${ini_titulo}`).value = 'ENTIDAD'//lg.nombre 
            principal.getCell(`${ini_titulo}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'f0f8ff' }, }
            principal.getCell(`${ini_titulo}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };


            let ini_titulo_ = principal.getRow(8).getCell(5)._address
            let fin_titulo_ = principal.getRow(8 + aumento_ini).getCell(7)._address
            principal.mergeCells(`${ini_titulo_ + ':' + fin_titulo_}`);
            principal.getCell(`${ini_titulo_}`).value = 'VARIABLE'//lg.nombre 
            principal.getCell(`${ini_titulo_}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'f0f8ff' }, }
            principal.getCell(`${ini_titulo_}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };



            numero_fila = numero_fila + 1
            let ultimo = 0
            for (let e of listaEstablecimientos) {
                ultimo++
                let fila = principal.getRow(numero_fila)
                let ini_titulo = fila.getCell(2)._address
                let fin_titulo = fila.getCell(4)._address
                principal.mergeCells(`${ini_titulo + ':' + fin_titulo}`);
                principal.getCell(`${ini_titulo}`).value = e.est
                principal.getCell(`${ini_titulo}`).border = { top: {}, left: { style: 'thin' }, bottom: { style: ultimo == listaEstablecimientos.length ? 'thin' : null }, right: { style: 'thin' } };
                principal.getCell(`${ini_titulo}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: e.color ? 'FDEDEC' : null }, }

                let fila_ = principal.getRow(numero_fila)
                let ini_titulo_ = fila_.getCell(5)._address
                let fin_titulo_ = fila_.getCell(7)._address
                principal.mergeCells(`${ini_titulo_ + ':' + fin_titulo_}`);
                principal.getCell(`${ini_titulo_}`).value = e.indicador
                principal.getCell(`${ini_titulo_}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                principal.getCell(`${ini_titulo_}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: e.color ? 'FDEDEC' : null }, }
                let contador_columna = 8
                data.forEach(d => {
                    if (e.idest == d.idest && parseInt(d.indicador) === parseInt(e.id)) {
                        let ini_titulo = fila.getCell(contador_columna)._address
                        principal.getCell(`${ini_titulo}`).value = parseInt(d.valor)
                        principal.getCell(`${ini_titulo}`).alignment = { vertical: 'center', horizontal: 'right' };
                        principal.getCell(`${ini_titulo}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                        principal.getCell(`${ini_titulo}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: e.color ? 'FDEDEC' : null }, }
                        contador_columna++
                    }
                })
                numero_fila = numero_fila + 1
            }


            workbook.xlsx.writeBuffer().then(data => {
                const blob = new Blob([data], {
                    type: "aplication/vnd.openxmlformats-officedocumets.spreadshhed.sheed",
                });
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = 'FORMULARIO ADICIONAL 301C ' + gestion_ + '_' + mes1_ + '-' + mes2_ + '-' + localStorage.getItem('area') + '.xlsx';
                // 'FORMULARIO ADICIONAL 301C 2023_ABRIL-NOVIEMBRE_SAN ROQUE'
                anchor.click();
                window.URL.revokeObjectURL(url);
            })

        }
        return (
            <div style={{ background: '#e5e5e5', paddingTop: '0.5rem', paddingBottom: '0.5rem', minHeight: '90.5vh' }} >
                {estado === 1 && <Load texto={texto} />}
                <div className="container_reportes_formulario">
                    <div className='header-reportes'>
                        {/* <img src='img/sedes22.png' className='icono-partido' alt='sdis-ve' /> */}
                        <p className='titulo'>reporte estadístico </p>
                        <p style={{ fontSize: '15px', fontWeight: 'bold', color: '#595959', textAlign: 'center', marginBottom: '0' }} className='text-center'>{'AREA :: ' + localStorage.getItem('area')}  </p>

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
                                <div className='row '>
                                    <div className='col-4 col-sm-4 col-md-2 col-lg-2 p-1' onClick={() => {
                                        setListaEstablecimientos([]); setCabecera([]); setData([])
                                    }} >
                                        <SelectSM
                                            estado={nivelAplicacion}
                                            cambiarEstado={setNivelAplicacion}
                                            ExpresionRegular={INPUT.ID}
                                            lista={listaNivelAplicacion}
                                            etiqueta={'Nivel'}
                                            msg='Seleccione una opcion'
                                            very={1}
                                        />
                                    </div>
                                    <div className='col-6 col-sm-2 col-md-2 col-lg-1 p-1' onClick={() => {
                                        setListaEstablecimientos([]); setCabecera([]); setData([])
                                    }}  >
                                        <SelectSM
                                            estado={gestion}
                                            cambiarEstado={setGestion}
                                            ExpresionRegular={INPUT.ID}
                                            lista={listaGestion}
                                            very={1}
                                            etiqueta={'Gestion'}
                                            msg='Seleccione una opcion'
                                        />
                                    </div>

                                    <div className='col-6 col-sm-3 col-md-1 col-lg-1 p-1' onClick={() => { listarMes(); setListaEstablecimientos([]); setCabecera([]); setData([]) }} >
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
                                    <div className='col-6 col-sm-3 col-md-1 col-lg-1 p-1' onClick={() => { listarMes(); setListaEstablecimientos([]); setCabecera([]); setData([]) }} >
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
                                    <div className='col-8 col-sm-8 col-md-4 col-lg-5 mb-2 p-1' onClick={() => {
                                        setListaEstablecimientos([]); setCabecera([]); setData([])
                                    }} >
                                        <SelectSM
                                            estado={idEntidad}
                                            cambiarEstado={setIdEntidad}
                                            ExpresionRegular={INPUT.ID}
                                            lista={entidad}
                                            etiqueta={
                                                nivelAplicacion.campo == 1 ? 'Establecimiento' : nivelAplicacion.campo == 2 ? 'Municipio' : nivelAplicacion.campo == 3 ? 'Consolidado'
                                                    : nivelAplicacion.campo == 4 ? 'Red' : nivelAplicacion.campo == 5 ? 'Red' : nivelAplicacion.campo == 6 ? 'Departamento' : nivelAplicacion.campo == 7 ?
                                                        'Depto. Consolidado' : null}
                                            msg='Seleccione una opcion'
                                        />
                                    </div>

                                </div>
                                {window.innerWidth < 500 && <div className='col-12'>
                                    <div className=' row mt-3'>
                                        <div className='col-4'><p className='blue1'></p></div>
                                        <div className='col-4'><p className='red1'></p></div>
                                        <div className='col-4'><p className='blue2'></p></div>
                                    </div>
                                </div>}
                            </div>
                        </div>
                        <div className='botonModal m-2' style={{ justifyContent: 'right' }}>
                            <button className="botonProcesar col-auto mb-1" onClick={() => procesar()}>GENERAR </button>
                            {data.length > 0 &&
                                <button className="botonExcel col-auto mb-1" onClick={() => excel()}>EXCEL </button>
                            }
                        </div>
                    </div>
                    <div className='contenedor cajareportes p-2 p-sm-3 p-md-4 p-lg-4  pt-2 pb-2'>
                        {cabecera.length > 0 && <>
                            {/* {
                                entidad.map(e => (
                                    idEntidad.campo == parseInt(e.id) &&
                                    <p style={{ fontSize: '13px', marginBottom: '0', fontWeight: 'bold' }}>{e.nombre} {nivelAplicacion.campo }</p>

                                ))
                            } */}
                            < div className="table table-responsive custom" style={{ height: 'auto', padding: "0.0rem 0.0rem", marginBottom: '0' }}>
                                <Table className=' table-sm' style={{ border: "1px solid #000040", borderRight: 'none', borderTop: '1px solid white', borderSpacing: '0px', padding: '0px' }} >
                                    {cabecera.length > 0 &&
                                        <thead className='cab-form'>
                                            <tr  >
                                                <th className="col-3 mincelda var" style={{ color: '#595959', background: 'AliceBlue', borderRight: '1px solid #000040', borderTop: '1px solid #000040', }}>
                                                    {(nivelAplicacion.campo == 1 || nivelAplicacion.campo == 2) ? 'ESTABLECIMIENTO' : nivelAplicacion.campo == 3 ? 'MUNICIPIO' : nivelAplicacion.campo == 4 ? 'MUNICIPIO' :
                                                        nivelAplicacion.campo == 5 ? 'RED' : nivelAplicacion.campo == 6 ? 'DEPTO' : nivelAplicacion.campo == 7 ? 'DEPTO. CONSOLIDADO' : null}</th>
                                                <th className="col-3 mincelda var" style={{ color: '#595959', background: 'AliceBlue', borderRight: '1px solid #000040', borderTop: '1px solid #000040', }}>VARIABLE</th>
                                                {cabecera.map(cb => (
                                                    parseInt(cb.nivel) == 1 &&
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
                                                <th className="col-3 mincelda " style={{ color: '#595959', background: 'AliceBlue', borderRight: '1px solid #000040', }}></th>
                                                {cabecera.map(cb => (
                                                    parseInt(cb.nivel) == 2 &&
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
                                                <th className="col-3 mincelda " style={{ color: '#595959', background: ' AliceBlue', borderRight: '1px solid #000040', }}></th>
                                                {cabecera.map(cb => (
                                                    parseInt(cb.nivel) == 3 &&
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
                                    <tbody>
                                        {
                                            listaEstablecimientos.map((e, index) => (
                                                // parseInt(ind.variable) === parseInt(gs) &&
                                                <tr className='item' key={index} style={{ borderRight: '1px solid #000040', background: e.color == 1 ? '#FDEDEC' : null, }}>
                                                    <td className="col-3 mincelda TituloSecundario"
                                                        style={{
                                                            padding: '3px 0px 0px 3px', borderBottom: '0px',

                                                            borderRight: '1px solid #000040',
                                                        }}
                                                    >{e.est}</td>
                                                    <td className="col-3 mincelda TituloSecundario"
                                                        style={{
                                                            padding: '3px 0px 0px 3px', borderBottom: '0px', borderTop: '1px solid #000040',
                                                            borderRight: '1px solid #000040',
                                                        }}
                                                    >{e.indicador}</td>
                                                    {
                                                        data.map(d => (
                                                            parseInt(e.idest) === parseInt(d.idest) && parseInt(d.indicador) === parseInt(e.id) &&
                                                            <td className="text-center item_1"
                                                                style={{
                                                                    padding: '4px 0px 0px 0px', paddingBottom: '0',
                                                                    borderBottom: '0px', borderTop: '1px solid #000040', borderRight: '1px solid #000040',
                                                                }} key={d.id}>
                                                                <div style={{ height: '29px' }}  >{d.valor}</div>
                                                            </td>
                                                        ))
                                                    }
                                                </tr>
                                            ))

                                        }
                                    </tbody>

                                </Table>
                            </div>
                        </>}
                    </div>
                </div>
            </div >
        );

    } catch (error) {
        setEstado(0);// auth.logout()

    }

}
export default ReportesFormularioArea;
