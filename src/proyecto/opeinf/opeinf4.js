import React from 'react';


import useAuth from "../../Auth/useAuth"
import { useState, useEffect } from "react";
import { URL, INPUT } from '../../Auth/config';
import axios from 'axios';
import '../../elementos/estilos.css'
import { alert2, } from '../../elementos/alert2'
import Load from '../../elementos/load'
import { Select1 } from '../../elementos/elementos';
import { img } from '../reportes/logo';
import { imgG } from '../reportes/gobernacion';
const ExcelJS = require('exceljs')


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

    const [estado, setEstado] = useState(0)
    const [texto, setTexto] = useState(null);
    const [data, setData] = useState([]);



    const [listaGestion, setListaGestion] = useState([]);
    const [gestion, setGestion] = useState({ campo: null, valido: null })
    const [listaMes, setListaMes] = useState([]);
    const [mes1, setMes1] = useState({ campo: null, valido: null })


    try {

        useEffect(() => {

            if (listaGestion.length < 1) {
                document.title = 'OPORTUNIDAD DE INFORMACION SEDES'
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
            axios.post(URL + '/opeinf4/listargestion').then(json => {
                if (json.data.hasOwnProperty("sesion")) {
                    auth.logout()
                    alert('LA SESION FUE CERRADO DESDE EL SERVIDOR, VUELVA A INTRODODUCIR SUS DATOS DE INICIO')
                }
                if (json.data.ok) {
                    // console.log('años', json.data.data)
                    setListaGestion(json.data.data)
                    listarMes(json.data.data[0].id)
                    setGestion({ campo: json.data.data.length > 0 ? json.data.data[0].id : null, valido: json.data.data.length > 0 ? 'true' : null })
                } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg })
            }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }
        const listarMes = async (id = null) => {
            if (gestion.valido === 'true' || id) {
                axios.post(URL + '/opeinf4/listarmes', { id: id ? id : gestion.campo, fecha: fecha + ' ' + horafinal }).then(json => {
                    if (json.data.ok) {
                        setListaMes(json.data.data)
                        let mesActual = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date());
                        json.data.data.forEach(e => {
                            // console.log('llamada a mlistarmes', e.nombre, mesActual)
                            if (e.nombre.toLowerCase() == mesActual && id) {
                                setMes1({ campo: e.id, valido: 'true' })
                            }
                        })

                    } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg })
                }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
            }
        }





        const procesar = async () => {
            // console.log(grupoSeleccionados, 'grupos seleccinados')
            if (mes1.valido === 'true' && gestion.valido === 'true')

                axios.post(URL + '/opeinf4/listardatos', { gestion: gestion.campo, mes1: mes1.campo }).then(json => {
                    if (json.data.ok) {
                        json.data.data[1].forEach(h => {

                            json.data.data[0].forEach(v => {
                                if (parseInt(h.id) === parseInt(v.establecimiento))
                                    h.fecha = v.fecha
                                h.estado = v.estado
                            })
                        });
                        setData(json.data.data[1])
                    }
                    else { alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg }); }
                }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });


            else alert2({ icono: 'question', titulo: 'selecione los parametros año y mes', boton: 'ok' })

        }

        const excel = () => {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'SDIS-VE';
            workbook.lastModifiedBy = 'SDIS-VE';

            const principal = workbook.addWorksheet('OPORTUNIDAD DE INFORMACION', {
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
                column.alignment = { vertical: 'middle', wrapText: true }
                column.font = { name: 'Arial', color: { argb: '595959' }, family: 2, size: 9, italic: false };
            })
            principal.mergeCells("C1:D5");
            principal.mergeCells("L1:M5");

            const imageId = workbook.addImage({
                base64: img,
                extension: 'png',
            })
            const imageIdGob = workbook.addImage({
                base64: imgG,
                extension: 'png',
            })

            let mes1_ = null
            let gestion_ = null
            listaMes.forEach(e => {
                if (e.id == mes1.campo) mes1_ = e.nombre
            })
            listaGestion.forEach(e => {
                if (e.id == gestion.campo) gestion_ = e.nombre
            })
            // CONFIGURACION DE LOS TIRULOS, NOMBRE HOSPITAL, MESES Y GESTION
            principal.addImage(imageId, { tl: { col: 2.6, row: 0.1 }, ext: { width: 100, height: 95 } })
            principal.addImage(imageIdGob, { tl: { col: 11.6, row: 0.1 }, ext: { width: 100, height: 100 } })
            principal.mergeCells('E2:K2');
            principal.getCell('E2').alignment = { vertical: 'center', horizontal: 'center' };
            principal.getCell('E2').value = 'OPORTUNIDAD DE LA INFORMACION POR ESTABLECIMIENTOS'
            principal.mergeCells('E3:K3');
            principal.getCell('E3').alignment = { vertical: 'center', horizontal: 'center' };
            principal.getCell('E3').value = 'SDIS-VE'

            // principal.mergeCells('D4:H4');

            principal.mergeCells('C6:G6');
            principal.getCell('C6').alignment = { vertical: 'center', horizontal: 'left' };
            principal.getCell('C6').value = 'MUNICIPIO: ' + localStorage.getItem('mun')

            principal.mergeCells('H6:I6');
            principal.getCell('H6').alignment = { vertical: 'center', horizontal: 'left' };
            principal.getCell('H6').value = 'GESTIÓN: ' + gestion_
            principal.mergeCells('J6:K6');
            principal.getCell('J6').alignment = { vertical: 'center', horizontal: 'left' };
            principal.getCell('J6').value = 'MES: ' + mes1_



            principal.mergeCells('C7:G7');
            principal.mergeCells('H7:I7');
            principal.mergeCells('J7:K7');
            principal.mergeCells('L7:M7');
            principal.getCell('C7').value = 'ESTABLECIMIENTO'
            principal.getCell('H7').value = 'OPORTUNO'
            principal.getCell('C7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DC7633' }, }
            principal.getCell('H7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DC7633' }, }
            principal.getCell('C7').font = { name: 'Arial Black', color: { argb: 'ECF0F1' }, italic: false };
            principal.getCell('H7').font = { name: 'Arial Black', color: { argb: 'ECF0F1' }, italic: false };

            principal.getCell('J7').value = 'RETRAZO'
            principal.getCell('J7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DC7633' }, }
            principal.getCell('J7').font = { name: 'Arial Black', color: { argb: 'ECF0F1' }, italic: false };

            principal.getCell('L7').value = 'FUERA DE PLAZO'
            principal.getCell('L7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DC7633' }, }
            principal.getCell('L7').font = { name: 'Arial Black', color: { argb: 'ECF0F1' }, italic: false };

            let i = 8
            data.forEach(d => {
                principal.mergeCells(`C` + i + `:G` + i);
                principal.mergeCells(`H` + i + `:I` + i);
                principal.mergeCells(`J` + i + `:K` + i);
                principal.mergeCells(`L` + i + `:M` + i);
                principal.getCell(`C` + i).value = d.establecimiento
                principal.getCell(`H` + i).value = d.estado == 1 ? d.fecha : null
                principal.getCell(`J` + i).value = d.estado == 2 ? d.fecha : null
                principal.getCell(`L` + i).value = d.estado == 3 ? d.fecha : null
                principal.getCell(`C` + i).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                principal.getCell(`H` + i).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                principal.getCell(`J` + i).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                principal.getCell(`L` + i).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                i++
            })
            workbook.xlsx.writeBuffer().then(data => {
                const blob = new Blob([data], {
                    type: "aplication/vnd.openxmlformats-officedocumets.spreadshhed.sheed",
                });
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = 'OPORTUNIDAD DE INFORMACION SDIS-VE.xlsx';
                anchor.click();
                window.URL.revokeObjectURL(url);
            })
        }

        return (
            <div style={{ background: '#e5e5e5', paddingTop: '0.5rem', paddingBottom: '0.5rem', minHeight: '95vh' }} >
                {estado === 1 && <Load texto={texto} />}

                <div className="container_reportes">
                    <div className='contenedor-cabecera'>
                        <p className='titulo' style={{ textAlign: 'center' }} onClick={() => console.log(data)}>OPORTUNIDAD DE INFORMACIÓN </p>
                    </div>

                    <div className='p-0 p-sm-2 p-md-3 p-lg-3 pb-0 pt-0 pt-lg-0 pt-md-0 pb-lg-0'>
                        <div className='orden-tiempo '>
                            <div className='row '>
                                <div className='col-2 m-1' >
                                    <Select1
                                        estado={gestion}
                                        cambiarEstado={setGestion}
                                        ExpresionRegular={INPUT.ID}
                                        lista={listaGestion}
                                        etiqueta={'Gestion'}
                                        msg='Seleccione una opcion'
                                    />
                                </div>
                                <div className='col-3 m-1' onClick={() => { listarMes() }} >
                                    <Select1
                                        estado={mes1}
                                        cambiarEstado={setMes1}
                                        ExpresionRegular={INPUT.ID}
                                        lista={listaMes}
                                        etiqueta={'Desde'}
                                        msg='Seleccione una opcion'
                                    />
                                </div>

                            </div>
                        </div>
                        <div className='botonModal mt-2' style={{ justifyContent: 'right' }}>
                            <button className="botonProcesar col-auto mb-1" onClick={() => procesar()}>VERIFICAR </button>
                            {data.length > 0 &&
                                <button className="botonExcel col-auto mb-1" onClick={() => excel()}>EXCEL </button>
                            }
                        </div>
                    </div>
                    <div className='cajaprimario-reportes m-0 m-sm-2 m-md-3 m-lg-3 mt-0 mt-lg-0 '>
                        <div className='contenedor cajareportes p-3 p-sm-3 p-md-4 p-lg-4  pt-2 pb-2'>


                            <div className='col-12 m-auto'>

                                {listaMes.map(e => (
                                    parseInt(e.id) == mes1.campo &&
                                    <p className='titulo-reportes' style={{ color: '#2980B9', textAlign: 'left', paddingLeft: '8px', marginBottom: '0', }}>
                                        {'OPORTUNIDAD DE INFORMACION ' + e.nombre}
                                    </p>
                                ))}

                                <div className="table table-responsive custom mb-2 " style={{ height: "auto", }}>
                                    <table className="table table-sm" >
                                        <thead >
                                            <tr >
                                                <th className="col-5 ">ESTABLECIMIENTO</th>
                                                <th className="col-2 ">OPORTUNO</th>
                                                <th className="col-2 ">RETRAZO</th>
                                                <th className="col-2 ">FUERA DE PLAZO</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((a) => (
                                                <tr className='item' key={a.id}>
                                                    <td className="col-5 ">{a.establecimiento}</td>

                                                    <td className="col-2 item_1" >{a.estado == 1 ? a.fecha : null}</td>
                                                    <td className="col-2 item_1" >{a.estado == 2 ? a.fecha : null}</td>
                                                    <td className="col-2 item_1" >{a.estado == 3 ? a.fecha : null}</td>
                                                </tr>
                                            ))}
                                        </tbody>

                                    </table>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>


            </div >
        );

    } catch (error) {
        setEstado(0);// auth.logout()

    }

}
export default Opeinf4;
