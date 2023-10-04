import React from 'react';
import { Button, Modal, ModalBody, ModalHeader, Table } from 'reactstrap';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCheck, faEdit, faHandPointLeft, faHandPointRight, faTrashAlt, faWindowClose } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../Auth/useAuth"
import { useState, useEffect } from "react";
import { INPUT, URL, } from '../Auth/config';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast'
import '../elementos/estilos.css'
import { alert2, confirmarGuardar } from '../elementos/alert2'
import Load from '../elementos/load'
import { Select1XL, } from '../elementos/elementos';
import { Input, InputDinamico, LeyendaError } from '../elementos/stylos'


function Formulario() {
    const auth = useAuth()


    const [listaGestion, setListaGestion] = useState([]);
    const [valor, setValor] = useState(new Array());
    let [data, setData] = useState(new Array());
    const [datosGrupo, setDatosGrupo] = useState([]);
    const [listaCabecera, setListaCabecera] = useState([]);
    const [maxOrden, setMaxOrden] = useState(0);

    const [span1, setSpan1] = useState([]);
    const [span2, setSpan2] = useState([]);
    const [span2_, setSpan2_] = useState(false);
    const [span3_, setSpan3_] = useState(false);




    const [profuncidadCantiadad2, setProfundidadCantiadad2] = useState(0)
    const [profuncidadCantiadad3, setProfundidadCantiadad3] = useState(0)
    const [profuncidadCantiadad4, setProfundidadCantiadad4] = useState(0)
    const [profuncidadCantiadad5, setProfundidadCantiadad5] = useState(0)
    const [profundidad1, setProfundidad1] = useState(0)
    const [profundidad2, setProfundidad2] = useState(0)
    const [profundidad3, setProfundidad3] = useState(0)
    const [profundidad4, setProfundidad4] = useState(0)
    const [profundidad5, setProfundidad5] = useState(0)



    const [listaVariable, setListaVariable] = useState([]);
    const [listaMes, setListaMes] = useState([]);
    const [listaIndicadores, setListaIndicadores] = useState([]);
    const [listaInput, setListaInput] = useState([]);
    const [cantidadInput, setCantidadInput] = useState(0);

    const [gestion, setGestion] = useState({ campo: null, valido: null })
    const [mes, setMes] = useState({ campo: null, valido: null })
    const [variable, setVariable] = useState({ campo: null, valido: null })
    const [indicador, setIndicador] = useState({ campo: null, valido: null })

    const [estado, setEstado] = useState(null);
    const [texto, setTexto] = useState(null);

    const [ventana, setVentana] = useState(0);
    const [idAnterior, setidAnterior] = useState(0);



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
            axios.post(URL + '/registro/listargestion').then(json => {
                if (json.data.hasOwnProperty("sesion")) {
                    auth.logout()
                    alert('LA SESION FUE CERRADO DESDE EL SERVIDOR, VUELVA A INTRODODUCIR SUS DATOS DE INICIO')
                }
                if (json.data.ok) {
                    setListaGestion(json.data.data)
                    setGestion({ campo: json.data.data.length > 0 ? json.data.data[0].id : null, valido: json.data.data.length > 0 ? 'true' : null })
                    setVentana(0)
                } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg })
            }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
        }

        const listarMes = async () => {
            if (gestion.valido === 'true') {
                axios.post(URL + '/registro/listarmes', { id: gestion.campo, fecha: fecha + ' ' + horafinal }).then(json => {
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
                    axios.post(URL + '/registro/listarvariable', { id: gestion.campo }).then(json => {
                        if (json.data.ok) {
                            setListaVariable(json.data.data)
                            setVentana(0)
                        } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg })
                    }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); });
                } else alert2({ icono: 'warning', titulo: 'Seleccione el mes', boton: 'ok' })
            } else alert2({ icono: 'warning', titulo: 'Seleccione una gestion', boton: 'ok', })
        }


        const listarIndicadores = async (cabeceras = true) => {
            setListaIndicadores([])
            if (gestion.valido === 'true') {
                if (mes.valido === 'true') {
                    if (variable.valido === 'true') {
                        setEstado(1)
                        setTexto('Cargando...')
                        axios.post(URL + '/registro/listarindicadores', { variable: variable.campo, fecha: fecha, mes: mes.campo }).then(json => {
                            if (json.data.ok) {
                                setListaIndicadores(json.data.data[0])

                                setEstado(0)
                                setVentana(3);
                                // listarCabeceras_1(json.data.data[0][0].id)
                                setDatosGrupo(json.data.data[1])
                                // setListaCabecera(json.data.data[1])
                                if (cabeceras) {
                                    axios.post(URL + '/reportes5/listarcabeceras', { variable: variable.campo }).then(json => {
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
                    } else alert2({ icono: 'warning', titulo: 'Seleccione el grupo de variable', boton: 'ok', texto: null })
                } else alert2({ icono: 'warning', titulo: 'Seleccione El mes', boton: 'ok', texto: null })
            } else alert2({ icono: 'warning', titulo: 'Seleccione año', boton: 'ok', texto: null })
        }


        const listarInput = async (id) => {

            if (id && mes.valido === 'true' && variable.valido === 'true' && gestion.valido === 'true') {
                setListaInput([])
                setEstado(1)
                setTexto('Cargando...')

                await axios.post(URL + '/registro/valoresinput', {

                    gestion: gestion.campo,
                    mes: mes.campo,
                    variable: variable.campo,
                    hora: horafinal,
                    fecha: fecha,
                    id: id,

                }).then(json => {
                    let data = []
                    if (json.data.ok) {
                        // console.log(json.data.data)
                        axios.post(URL + '/registro/listarinput', { id: id, fecha: fecha, }).then(json1 => {

                            if (json1.data.ok) {

                                console.log(json1.data.data, 'datos para el formulario')
                                data = json1.data.data
                                setTimeout(() => {
                                    json.data.data.forEach(e => {
                                        // json1.data.data.forEach(e1 => {
                                        data.forEach(e1 => {
                                            if (parseInt(e.id) === parseInt(e1.id)) {
                                                document.getElementById(e1.id).value = e.valor
                                                valor[e1.id] = { id: e1.id, valor: e.valor }
                                            } else {

                                            }
                                        })
                                    })
                                }, 500)

                                setListaInput(data)
                                setEstado(0)
                                setCantidadInput(json1.data.data.length)
                                json1.data.data.forEach(e1 => {
                                    axios.post(URL + '/registro/listarinput2', { id: e1.id, fecha: fecha, }).then(json2 => {
                                        if (json2.data.ok) {
                                            setEstado(0)
                                            json1.data.data.forEach(async e1 => {
                                                await json2.data.data.forEach(e2 => {

                                                    if (parseInt(e1.id) === parseInt(e2.idinput)) {
                                                        const indice = data.findIndex((elemento, indice) => {
                                                            if (parseInt(elemento.id) === parseInt(e2.idinput)) {
                                                                return true;
                                                            }
                                                        });
                                                        data.splice(indice + 1, 0, e2)
                                                        setListaInput(data)
                                                        setCantidadInput(data.length)
                                                        setTimeout(() => {
                                                            json.data.data.forEach(e => {
                                                                json2.data.data.forEach(e2 => {
                                                                    if (parseInt(e2.id) === parseInt(e.id)) {
                                                                        document.getElementById(e2.id).value = e.valor
                                                                        valor[e2.id] = { id: e2.id, valor: e.valor }
                                                                    }
                                                                })
                                                            })
                                                        }, 500)

                                                        axios.post(URL + '/registro/listarinput2', { id: e2.id, fecha: fecha, }).then(json3 => {
                                                            // console.log(json3.data.data)

                                                            if (json3.data.ok) {
                                                                json2.data.data.forEach(async e2 => {
                                                                    await json3.data.data.forEach(e3 => {

                                                                        if (parseInt(e2.id) === parseInt(e3.idinput)) {
                                                                            const indice = data.findIndex((elemento, indice) => {
                                                                                if (parseInt(elemento.id) === parseInt(e3.idinput)) {
                                                                                    return true;
                                                                                }
                                                                            });
                                                                            data.splice(indice + 1, 0, e3)
                                                                            setListaInput(data)
                                                                            setCantidadInput(data.length)
                                                                            setTimeout(() => {
                                                                                json.data.data.forEach(e => {
                                                                                    json3.data.data.forEach(e3 => {
                                                                                        if (parseInt(e3.id) === parseInt(e.id)) {
                                                                                            document.getElementById(e3.id).value = e.valor
                                                                                            valor[e3.id] = { id: e3.id, valor: e.valor }
                                                                                        }
                                                                                    })
                                                                                })
                                                                            }, 500)
                                                                            axios.post(URL + '/registro/listarinput2', { id: e3.id, fecha: fecha, }).then(json4 => {
                                                                                // console.log(json3.data.data)

                                                                                if (json4.data.ok) {
                                                                                    json3.data.data.forEach(async e3 => {
                                                                                        await json4.data.data.forEach(e4 => {

                                                                                            if (parseInt(e3.id) === parseInt(e4.idinput)) {
                                                                                                const indice = data.findIndex((elemento, indice) => {
                                                                                                    if (parseInt(elemento.id) === parseInt(e4.idinput)) {
                                                                                                        return true;
                                                                                                    }
                                                                                                });
                                                                                                data.splice(indice + 1, 0, e4)
                                                                                                setListaInput(data)
                                                                                                setCantidadInput(data.length)
                                                                                                setTimeout(() => {
                                                                                                    json.data.data.forEach(e => {
                                                                                                        json4.data.data.forEach(e4 => {
                                                                                                            if (parseInt(e4.id) === parseInt(e.id)) {
                                                                                                                document.getElementById(e4.id).value = e.valor
                                                                                                                valor[e4.id] = { id: e4.id, valor: e.valor }
                                                                                                            }
                                                                                                        })
                                                                                                    })
                                                                                                }, 350)
                                                                                                axios.post(URL + '/registro/listarinput2', { id: e4.id, fecha: fecha, }).then(json5 => {
                                                                                                    // console.log(json3.data.data)

                                                                                                    if (json5.data.ok) {
                                                                                                        json4.data.data.forEach(async e4 => {
                                                                                                            await json5.data.data.forEach(e5 => {

                                                                                                                if (parseInt(e4.id) === parseInt(e5.idinput)) {
                                                                                                                    const indice = data.findIndex((elemento, indice) => {
                                                                                                                        if (parseInt(elemento.id) === parseInt(e5.idinput)) {
                                                                                                                            return true;
                                                                                                                        }
                                                                                                                    });
                                                                                                                    data.splice(indice + 1, 0, e5)
                                                                                                                    setListaInput(data)
                                                                                                                    setCantidadInput(data.length)
                                                                                                                    setTimeout(() => {
                                                                                                                        json.data.data.forEach(e => {
                                                                                                                            json5.data.data.forEach(e5 => {
                                                                                                                                if (parseInt(e5.id) === parseInt(e.id)) {
                                                                                                                                    document.getElementById(e5.id).value = e.valor
                                                                                                                                    valor[e5.id] = { id: e5.id, valor: e.valor }
                                                                                                                                }
                                                                                                                            })
                                                                                                                        })
                                                                                                                    }, 350)

                                                                                                                }
                                                                                                            })
                                                                                                        })
                                                                                                    } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json2.data.msg })
                                                                                                })
                                                                                            }
                                                                                        })
                                                                                    })
                                                                                } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json2.data.msg })
                                                                            })
                                                                        }
                                                                    })
                                                                })
                                                            } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json2.data.msg })
                                                        })
                                                    }
                                                })
                                            })
                                        } else alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json2.data.msg })
                                    })
                                })

                            } else { alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json1.data.msg }); setEstado(0) }

                        }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }) });
                    } else { toast.error('Error el crear registros vacios. Consulte con el administrador '); setEstado(0) }
                }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }) });
            } else toast.error('Seleccione un Indicador')

            setVentana(1);
        }

        const onchange = (e) => {
            valor[e.target.id] = { id: e.target.id, valor: e.target.value }
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


        const revisar = () => {
            console.log(valor, valor.length, 'valores desde la bd')
            if (valor.length === 0) {
                listaInput.forEach(element => {
                    console.log('agregando valores a la valores')
                    if (element.tope === 1) {
                        valor[element.id] = { id: element.id, valor: 0 }
                    }
                })
            }

            valor.forEach((e) => {
                if (e.valor.length == '') e.valor = 0
                if (INPUT.ID.test(e.valor)) {
                    // if (e.valor >= 0 && e.valor < 100000) {
                    data[e.id] = e
                }
                else {
                    console.log(e.id)
                    alert2({ icono: 'error', titulo: 'Valores erróneos', boton: 'Corregir', texto: 'Los valores deben ser numéricos y enteros.' })
                    setVentana(1)
                }
            })

            console.log(data, listaInput, 'data e inputs')

            listaInput.forEach(d => {
                let id = data.filter(id => parseInt(id.id) === parseInt(d.id));
                console.log(id, 'id del lista input que esta en valores')
                if (id.length === 0 && d.tope == 1) {
                    data[d.id] = { id: parseInt(d.id), valor: 0 }
                }
            })

            console.log(data, 'lista fina con datos flatantes')
        }

        const corregir = () => {
            setTimeout(() => {
                listaInput.forEach(e => {
                    if (parseInt(e.tope) === 1) {
                        data.forEach(e1 => {
                            if (parseInt(e1.id) === parseInt(e.id)) {
                                document.getElementById(e.id).value = e1.valor
                                document.getElementById(e.id).setAttribute('class', 'form-control form-control-sm bordeTrue')
                            }
                        })
                    }
                })
            }, 300)
            console.log(data)
        }

        const guardar = async () => {
            if (mes.valido === 'true' && variable.valido === 'true' && data.length > 0 && estado === 0 && gestion.valido === 'true' && indicador.valido === 'true') {
                let accion = await confirmarGuardar({ titulo: 'Enviar Datos', boton: 'ok', texto: 'Ok para continuar...' })
                if (accion.isConfirmed) {
                    setEstado(1)
                    let data_ = []
                    data.forEach(e => {
                        data_.push(e)
                    })

                    let c = 1
                    setTexto('Actualizando resultados...')
                    console.log(data_, listaInput, 'valores antes de anviar')


                    data_.forEach(element => {

                        let aux = false
                        axios.post(URL + '/registro/guardar', {
                            mes: mes.campo,
                            gestion: gestion.campo,
                            indicador: indicador.campo,
                            fecha: fecha,
                            variable: variable.campo,
                            input: element.id,
                            valor: element.valor,
                            hora: horafinal,
                        }).then(j => {
                            console.log(c, j.data)
                            if (j.data.ok && c === data_.length) {
                                aux = j.data.data
                                setTimeout(() => {
                                    listarIndicadores(false); setEstado(0);
                                    setValor([])
                                    setData([])
                                    setTexto('Cargando...')
                                    alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: 'Valores Actualizados' })
                                }, 2500)
                            }
                            c = c + 1

                        })
                    });

                }
            } else alert2({ icono: 'error', titulo: 'Información Incompleta', boton: 'ok', texto: 'Revise que la informacion este completa' })
        }



        return (
            <div className="container_formulario">
                {estado === 1 && <Load texto={texto} />}
                <div className='row mt-4'>
                    <div className='col-6 col-sm-6 col-md-3 col-lg-3' onClick={() => {
                        setProfundidad1(0)
                        setProfundidad2(0)
                        setProfundidad3(0)
                        setProfundidad4(0)
                        setProfundidad5(0)
                        setProfundidadCantiadad2(0)
                        setProfundidadCantiadad3(0)
                        setProfundidadCantiadad4(0)
                        setProfundidadCantiadad5(0)
                        setSpan1([])
                        setSpan2([])
                        setSpan2_(false)
                        setSpan3_(false)
                        setMes({ campo: null, valido: null }); setidAnterior(null); setListaMes([]); setListaIndicadores([]); setVariable({ campo: null, valido: null }); setListaVariable([]); setData([]); setValor([]); setListaInput([]); setListaCabecera([])
                    }}>
                        <Select1XL
                            estado={gestion}
                            cambiarEstado={setGestion}
                            ExpresionRegular={INPUT.ID}
                            lista={listaGestion}
                            etiqueta={'Gestion'}
                            estados={[setVariable, setMes]}
                            msg='Seleccione una opcion'
                        />
                    </div>
                    <div className='col-6 col-sm-6 col-md-3 col-lg-3' onClick={() => {
                        setProfundidad1(0)
                        setProfundidad2(0)
                        setProfundidad3(0)
                        setProfundidad4(0)
                        setProfundidad5(0)
                        setProfundidadCantiadad2(0)
                        setProfundidadCantiadad3(0)
                        setProfundidadCantiadad4(0)
                        setProfundidadCantiadad5(0)
                        setSpan1([])
                        setSpan2([])
                        setSpan2_(false)
                        setSpan3_(false)
                        listarMes(); setListaIndicadores([]); setidAnterior(null); setVariable({ campo: null, valido: null }); setListaVariable([]); setData([]); setValor([]); setListaInput([]); setListaCabecera([])
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

                    <div className='col-12 col-sm-12 col-md-6 col-lg-6' onClick={() => {

                        setProfundidad1(0)
                        setProfundidad2(0)
                        setProfundidad3(0)
                        setProfundidad4(0)
                        setProfundidad5(0)
                        setProfundidadCantiadad2(0)
                        setProfundidadCantiadad3(0)
                        setProfundidadCantiadad4(0)
                        setProfundidadCantiadad5(0)
                        setSpan1([])
                        setSpan2([])
                        setSpan2_(false)
                        setSpan3_(false)
                        listarVariable(); setListaIndicadores([]); setidAnterior(null); setData([]); setValor([]); setListaInput([]); setListaCabecera([])
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
                {ventana === 0 && <div className='botonModal' style={{ justifyContent: 'left' }}>
                    <button className="btn-form-info col-auto mb-4" onClick={() => listarIndicadores()}>
                        Cargar formulario <FontAwesomeIcon style={{ marginLeft: '10px' }} icon={faArrowRight} />
                    </button>

                </div>}

                {ventana === 1 && mes.valido === 'true' && variable.valido === 'true' && gestion.valido === 'true' &&

                    <div className='col-11 col-sm-12 col-md-10 col-lg-7 m-auto'>

                        <div className="table table-responsive custom contenedor-formulario" style={{ height: 'auto', padding: "0.1rem 0.5rem" }}>

                            {listaVariable.map(e => (parseInt(e.id) === variable.campo && <div className='tituloPrimarioFormulario' key={e.id}>{e.nombre}</div>))}
                            {listaIndicadores.map(e => (parseInt(e.id) === indicador.campo && <div className='TituloSecundarioFormulario' key={e.id}>{e.indicador}</div>))}

                            {listaInput.map((a) => (
                                <div key={a.id} className={a.nivel === 1 ? `nivel1F` :
                                    a.nivel === 2 ? `nivel2F` : a.nivel === 3 ? `nivel3F` :
                                        a.nivel === 4 ? `nivel4F` : a.nivel === 5 ? `nivel5F` : null}>

                                    {(a.tope === 0 && a.nivel === 1) && <div>{a.orden + '.' + a.input}</div>}
                                    {(a.tope === 0 && a.nivel > 1) && <div>{a.input}</div>}

                                    {a.tope === 1 && a.nivel === 1 &&
                                        <div className='row fila-sin-margen'>
                                            <div className='col-8'><span>{a.nivel === 1 ? a.orden + '.' + a.input : a.input}</span></div>
                                            <div className='col-4'>
                                                {a.estado ? <InputDinamico
                                                    type='number'
                                                    className="form-control form-control-sm"
                                                    id={a.id}
                                                    placeholder={0}
                                                    onChange={onchange}
                                                    onKeyUp={validacion}
                                                    onBlur={validacion}
                                                /> : <InputDinamico
                                                    type='number'
                                                    className="form-control form-control-sm"
                                                    id={a.id}
                                                    placeholder={0}
                                                    disabled
                                                    onChange={onchange}
                                                    onKeyUp={validacion}
                                                    onBlur={validacion}
                                                />}
                                            </div>
                                        </div>
                                    }
                                    {a.tope === 1 && a.nivel > 1 &&
                                        <div className='row '>
                                            <div className='col-8'><span>{a.nivel === 1 ? a.orden + '.' + a.input : a.input}</span></div>
                                            <div className='col-4'>
                                                {a.estado ? <InputDinamico
                                                    type='number'
                                                    className="form-control form-control-sm"
                                                    id={a.id}
                                                    placeholder={0}
                                                    onChange={onchange}
                                                    onKeyUp={validacion}
                                                    onBlur={validacion}
                                                /> : <InputDinamico
                                                    type='number'
                                                    className="form-control form-control-sm"
                                                    id={a.id}
                                                    placeholder={0}
                                                    disabled
                                                    onChange={onchange}
                                                    onKeyUp={validacion}
                                                    onBlur={validacion}
                                                />}
                                            </div>
                                        </div>
                                    }
                                </div>
                            ))}


                            {listaInput.length < 1 && estado === 0 && < div style={{ fontSize: '18px' }}>Documento no habilitado para su edicion</div>}

                            {/* <div className='botonModal'>
                                <button className="btn-cancelar col-auto" onClick={() => { setVentana(3); setidAnterior(null); setData([]); setValor([]); setListaInput([]) }} >
                                    Cerrar
                                </button>
                                <button className="btn-guardar col-auto" onClick={() => {
                                    setVentana(2); revisar();
                                }} >
                                    Guardar
                                </button>
                            </div> */}
                        </div >

                        <div className='botonModal row pb-3'>
                            <div className='col-auto'>
                                <button className="form-cerrar" onClick={() => { setVentana(3); setidAnterior(null); setData([]); setValor([]); setListaInput([]) }} >
                                    Cancelar
                                </button>
                            </div>

                            <div className='col-auto'>
                                <button className="iniciar" onClick={() => {
                                    setVentana(2); revisar();
                                }} >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                }

                {
                    ventana === 2 && mes.valido === 'true' && variable.valido === 'true' && gestion.valido === 'true' &&
                    <div className='col-12 col-sm-12 col-md-10 col-lg-7 m-auto'>

                        <div className="table table-responsive custom contenedor-formulario" style={{ height: 'auto', height: 'auto', padding: "0.1rem 0.5rem" }}>
                            {listaVariable.map(e => (parseInt(e.id) === variable.campo && <div className='tituloPrimarioFormulario' key={e.id}>{e.nombre}</div>))}
                            {listaIndicadores.map(e => (parseInt(e.id) === indicador.campo && <div className='TituloSecundarioFormulario' key={e.id}>{e.indicador}</div>))}


                            {listaInput.map((a) => (
                                <div key={a.id} className={a.nivel === 1 ? `nivel1F` :
                                    a.nivel === 2 ? `nivel2F` : a.nivel === 3 ? `nivel3F` :
                                        a.nivel === 4 ? `nivel4F` : a.nivel === 5 ? `nivel5F` : null}>

                                    {(a.tope === 0 && a.nivel === 1) && <div>{a.orden + '.' + a.input}</div>}
                                    {(a.tope === 0 && a.nivel > 1) && <div>{a.input}</div>}

                                    {a.tope === 1 && a.nivel === 1 &&
                                        <div className='row fila-sin-margen'>
                                            <div className='col-8'><span>{a.nivel === 1 ? a.orden + '.' + a.input : a.input}</span></div>
                                            <div className='col-4'>
                                                {data.map(e1 => (
                                                    parseInt(a.id) === parseInt(e1.id) &&
                                                    <p key={a.id}>{e1.valor}</p>
                                                ))}

                                            </div>
                                        </div>
                                    }
                                    {a.tope === 1 && a.nivel > 1 &&

                                        <div className='row '>
                                            <div className='col-8'><span>{a.nivel === 1 ? a.orden + '.' + a.input : a.input}</span></div>
                                            <div className='col-4'>
                                                {data.map(e1 => (
                                                    parseInt(a.id) === parseInt(e1.id) &&
                                                    <p key={e1.id}>{e1.valor}</p>
                                                ))}
                                            </div>
                                        </div>
                                    }
                                </div>
                            ))}

                        </div >
                        <div className='botonModal row pb-3'>
                            <div className='col-auto'>

                                <button className="form-cerrar" onClick={() => { setVentana(1); corregir() }} >
                                    Modificar
                                </button>
                            </div>
                            <div className='col-auto'>

                                <button className="iniciar" onClick={() => guardar()} >
                                    Enviar valores
                                </button>
                            </div>
                        </div>
                    </div>
                }



                {
                    ventana === 3 && mes.valido === 'true' && variable.valido === 'true' && gestion.valido === 'true' &&
                    <div className='mt-4'>
                        <div className='tituloPrimario'>{listaVariable.map(e => (parseInt(e.id) === variable.campo && <div key={e.id}>{e.nombre}</div>))}</div>

                        <div className="table table-responsive custom mb-3 quitarBorder" style={{ height: 'auto', width: 'auto' }}>
                            <Table className='table table-sm' style={{ border: "2px solid #006699", borderSpacing: '0px', padding: '0px' }} >
                                {listaCabecera.length > 0 &&
                                    <thead className='cab-form'>
                                        <tr  >
                                            {maxOrden === 1 ? <th className="col-4 mincelda titulo-var" style={{ fontWeight: 'bold', fontSize: '14px', color: '#595959', textAlign: 'center' }}>{'VARIABLE'}</th> :
                                                <th className="col-4 mincelda titulo-var" style={{ color: '#595959', paddingLeft: '' }}></th>}
                                            {listaCabecera.map(cb => (
                                                parseInt(cb.nivel) == 1 &&
                                                <th className='text-center nivel1F' style={{ background: '#006699', borderRight: '1px solid white' }} colSpan={cb.span}
                                                    key={cb.id} >{cb.input}
                                                </th>
                                            ))}
                                        </tr>
                                        <tr style={{ borderTop: '1px solid #595959' }}>
                                            {maxOrden === 2 ? <th className="col-4 mincelda titulo-var" style={{ fontWeight: 'bold', fontSize: '14px', color: '#595959', textAlign: 'center' }}>{'VARIABLE'}</th> :
                                                maxOrden === 1 ? null : <th className="col-4 mincelda titulo-var" style={{ color: '#595959', paddingLeft: '' }}></th>}
                                            {listaCabecera.map(cb => (
                                                parseInt(cb.nivel) == 2 &&
                                                <th className='text-center nivel1F' style={{ background: '#006699', borderRight: '1px solid white', borderTop: '1px solid white' }} colSpan={cb.span}
                                                    key={cb.id} >{cb.input}
                                                </th>
                                            ))}
                                        </tr>
                                        <tr style={{ borderTop: '1px solid #595959' }} >
                                            {maxOrden === 3 ? <th className="col-4 mincelda titulo-var" style={{ fontWeight: 'bold', fontSize: '14px', color: '#595959', textAlign: 'center' }}>{'VARIABLE'}</th> :
                                                maxOrden === 1 || maxOrden === 2 ? null : <th className="col-4 mincelda titulo-var" style={{ color: '#595959', paddingLeft: '' }}></th>}
                                            {listaCabecera.map(cb => (
                                                parseInt(cb.nivel) == 3 &&
                                                <th className='text-center nivel1F' style={{ background: '#006699', borderRight: '1px solid white', borderTop: '1px solid white' }} colSpan={cb.span}
                                                    key={cb.id} >{cb.input}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>}
                                <tbody >
                                    {listaIndicadores.map((ind) => (
                                        <tr key={ind.id}>
                                            <td className="col-4 mincelda TituloSecundario" style={{ border: '1px solid #006699' }}>
                                                <div className='row' >
                                                    <div className='col-9'>{ind.indicador}</div>
                                                    <div className='col-3 btntabla' onClick={() => { setIndicador({ campo: ind.id, valido: 'true' }); listarInput(ind.id) }}>
                                                        <span> {window.innerWidth > 990 ? 'Llenar datos' : 'ir'}</span></div>
                                                </div> </td>
                                            {
                                                datosGrupo.map(d => (
                                                    parseInt(ind.id) === parseInt(d.idindicador) && <td className="text-center"
                                                        style={{ padding: '2px', paddingBottom: '0', background: 'white' }} key={d.id}>
                                                        <div style={{ border: '0.5px solid #ABB2B9', height: '29px' }}  >{d.valor}</div>
                                                    </td>
                                                ))
                                            }
                                        </tr>
                                    ))}
                                </tbody>

                            </Table>
                        </div>
                    </div >
                }
            </div >

        );

    } catch (error) {
        setEstado(0)
    }

}
export default Formulario;


