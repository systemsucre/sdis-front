import React from 'react';
import { Button, Modal, ModalBody, ModalHeader, Table } from 'reactstrap';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCheck, faEdit, faHandPointLeft, faTrashAlt, faWindowClose } from '@fortawesome/free-solid-svg-icons';

import useAuth from "../Auth/useAuth"
import { useState, useEffect } from "react";
import { INPUT, URL, } from '../Auth/config';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast'
import '../elementos/estilos.css'
import { alert2, confirmarActualizar, confirmarGuardar } from '../elementos/alert2'
import Load from '../elementos/load'
import { Select1XL, PiePagina } from '../elementos/elementos';
import { FilaDos, Input, InputDinamico, LeyendaError } from '../elementos/stylos'


function Formulario() {
    const auth = useAuth()


    const [listaGestion, setListaGestion] = useState([]);
    const [valor, setValor] = useState(new Array());
    let [data, setData] = useState(new Array());
    const [datosGrupo, setDatosGrupo] = useState([]);
    const [listaCabecera, setListaCabecera] = useState([]);

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
            } else alert2({ icono: 'warning', titulo: 'Seleccione una gestion', boton: 'ok', texto: 'Para cargar los meses primero seleccione una gestion' })
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
                } else alert2({ icono: 'warning', titulo: 'Seleccione el mes', boton: 'ok', texto: 'Para cargar las variables primero de seleccionar el mes' })
            } else alert2({ icono: 'warning', titulo: 'Seleccione una gestion', boton: 'ok', texto: 'Para cargar las variables primero seleccione una gestion' })
        }


        const listarIndicadores = async () => {
            setListaIndicadores([])
            if (gestion.valido === 'true') {
                if (mes.valido === 'true') {
                    if (variable.valido === 'true') {
                        setEstado(1)
                        setTexto('Cargando...')
                        axios.post(URL + '/registro/listarindicadores', { variable: variable.campo, mes: mes.campo }).then(json => {
                            if (json.data.ok) {
                                setListaIndicadores(json.data.data[0])

                                setEstado(0)
                                // setVentana(3);
                                listarCabeceras(json.data.data[0][0].id)
                                setDatosGrupo(json.data.data[1])

                            } else { alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                        }).catch(function (error) { alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }); setEstado(0) });
                    }
                    //  else alert2({ icono: 'warning', titulo: 'Seleccione el grupo de variable', boton: 'ok', texto: null })
                } else alert2({ icono: 'warning', titulo: 'Seleccione El mes', boton: 'ok', texto: null })
            } else alert2({ icono: 'warning', titulo: 'Seleccione año', boton: 'ok', texto: null })
        }





        const listarCabeceras = async (id) => {
            let data = []
            axios.post(URL + '/registro/listarinput', { id: id, }).then(json1 => {

                if (json1.data.ok) {
                    console.log(json1.data.data, 'cabecera de nivel 1')

                    data = json1.data.data
                    setListaCabecera(data)
                    setEstado(0)
                    setCantidadInput(json1.data.data.length)
                    setProfundidad1(json1.data.data[0].nivel)
                    json1.data.data.forEach(e1 => {
                        axios.post(URL + '/registro/listarinput2', { id: e1.id, }).then(json2 => {
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
                                            setListaCabecera(data)
                                            setCantidadInput(data.length)
                                            setProfundidadCantiadad2(json2.data.data.length)
                                            setProfundidad2(json2.data.data[0].nivel)


                                            axios.post(URL + '/registro/listarinput2', { id: e2.id, }).then(json3 => {
                                                // console.log('nivel 3', json3.data.data)

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
                                                                setListaCabecera(data)
                                                                setCantidadInput(data.length)
                                                                setProfundidadCantiadad3(json3.data.data.length)
                                                                setProfundidad3(json3.data.data[0].nivel)

                                                                axios.post(URL + '/registro/listarinput2', { id: e3.id, }).then(json4 => {
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
                                                                                    setListaCabecera(data)
                                                                                    setCantidadInput(data.length)
                                                                                    setProfundidadCantiadad4(json4.data.data.length)
                                                                                    setProfundidad4(json4.data.data[0].nivel)
                                                                                    axios.post(URL + '/registro/listarinput2', { id: e4.id, }).then(json5 => {
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
                                                                                                        setListaCabecera(data)
                                                                                                        setCantidadInput(data.length)
                                                                                                        setProfundidadCantiadad5(json5.data.data.length)
                                                                                                        setProfundidad5(json5.data.data[0].nivel)
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

                } else { alert2({ icono: 'warning', titulo: 'Intente Nuevamente mas tarde!', boton: 'ok', texto: json1.data.msg }); setEstado(0); }
            }).catch(function (error) { setEstado(0); alert2({ icono: 'error', titulo: 'Error al conectar a la API', boton: 'ok', texto: error.toJSON().message }) });
            setVentana(3);
        }

        const listarInput = async (id) => {

            if (id && mes.valido === 'true' && variable.valido === 'true' && gestion.valido === 'true') {
                setListaInput([])
                setEstado(1)
                setTexto('Cargando...')

                await axios.post(URL + '/registro/valoresinput', {

                    gestion: gestion.campo,
                    mes: mes.campo,
                    fecha: fecha,
                    variable: variable.campo,
                    hora: horafinal

                }).then(json => {
                    let data = []
                    if (json.data.ok) {
                        // console.log(json.data.data)
                        axios.post(URL + '/registro/listarinput', { id: id, }).then(json1 => {

                            if (json1.data.ok) {

                                console.log(json1.data.data, 'datos para el formulario')
                                data = json1.data.data
                                setTimeout(() => {
                                    json.data.data.forEach(e => {
                                        json1.data.data.forEach(e1 => {
                                            if (parseInt(e.id) === parseInt(e1.id)) {
                                                document.getElementById(e1.id).value = e.valor
                                                valor[e1.id] = { id: e1.id, valor: e.valor }
                                            }
                                        })
                                    })
                                }, 500)

                                setListaInput(data)
                                setEstado(0)
                                setCantidadInput(json1.data.data.length)
                                json1.data.data.forEach(e1 => {
                                    axios.post(URL + '/registro/listarinput2', { id: e1.id, }).then(json2 => {
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

                                                        axios.post(URL + '/registro/listarinput2', { id: e2.id, }).then(json3 => {
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
                                                                            axios.post(URL + '/registro/listarinput2', { id: e3.id, }).then(json4 => {
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
                                                                                                axios.post(URL + '/registro/listarinput2', { id: e4.id, }).then(json5 => {
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
                if (e.target.value.length === 1)
                    toast.error('Este campo debe ser de tipo entero numérico')
            }
        }


        const revisar = () => {
            console.log(valor, 'valores desde la bd')
            if (valor.length === 0) {
                listaInput.forEach(element => {
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
            console.log(data, 'lista fina')
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
                    axios.post(URL + '/registro/guardar', {
                        mes: mes.campo,
                        gestion: gestion.campo,
                        indicador: indicador.campo,
                        valores: data_,
                        fecha: fecha,
                        variable: variable.campo,
                        hora: horafinal
                    }).then(json => {
                        if (json.data.ok) {
                            setValor([])
                            setData([])
                            alert2({ icono: 'success', titulo: 'Operacion Exitoso', boton: 'ok', texto: json.data.msg })
                            setEstado(0)
                            setTimeout(() => { listarIndicadores() }, 500)
                        } else { alert2({ icono: 'warning', titulo: 'Operacion Fallida', boton: 'ok', texto: json.data.msg }); setEstado(0) }
                    })
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
                        setMes({ campo: null, valido: null }); setidAnterior(null); setListaMes([]); setListaIndicadores([]); setVariable({ campo: null, valido: null }); setListaVariable([]); setData([]); setValor([]); setListaInput([]); setListaCabecera([])
                    }}>
                        <Select1XL
                            estado={gestion}
                            cambiarEstado={setGestion}
                            ExpresionRegular={INPUT.ID}
                            lista={listaGestion}
                            etiqueta={'Gestion'}
                            estados={[setVariable, setMes]}
                            listas={[listaMes, listaVariable]}
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
                        listarVariable(); setListaIndicadores([]); setidAnterior(null); setData([]); setValor([]); setListaInput([]); setListaCabecera([])
                    }}>
                        <Select1XL
                            estado={variable}
                            cambiarEstado={setVariable}
                            ExpresionRegular={INPUT.ID}
                            lista={listaVariable}
                            etiqueta={'Grupo'}
                            // funcion={listarIndicadores}
                            msg='Seleccione una opcion'
                        />
                    </div>
                </div>
                {ventana === 0 && <div>
                    <button className="btn-form-info col-auto mb-4" onClick={() => listarIndicadores()}>
                        Cargar contenidos <FontAwesomeIcon style={{ marginLeft: '10px' }} icon={faArrowRight} />
                    </button>

                </div>}

                {ventana === 1 && mes.valido === 'true' && variable.valido === 'true' && gestion.valido === 'true' &&
                    <div className='col-12 col-sm-12 col-md-10 col-lg-7 m-auto'>

                        <div className="table table-responsive custom contenedor-formulario" style={{ height: 'auto' }}>

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
                                                <InputDinamico
                                                    type='text'
                                                    className="form-control form-control-sm"
                                                    id={a.id}
                                                    placeholder={0}
                                                    onChange={onchange}
                                                    onKeyUp={validacion}
                                                    onBlur={validacion}
                                                />
                                            </div>
                                        </div>
                                    }
                                    {a.tope === 1 && a.nivel > 1 &&
                                        <div className='row '>
                                            <div className='col-8'><span>{a.nivel === 1 ? a.orden + '.' + a.input : a.input}</span></div>
                                            <div className='col-4'>
                                                <InputDinamico
                                                    type='text'
                                                    className="form-control form-control-sm"
                                                    id={a.id}
                                                    placeholder={0}
                                                    onChange={onchange}
                                                    onKeyUp={validacion}
                                                    onBlur={validacion}
                                                />
                                            </div>
                                        </div>
                                    }
                                </div>
                            ))}


                            {listaInput.length < 1 && estado === 0 && < div style={{ fontSize: '18px' }}>Documento no habilitado para su edicion</div>}

                            <div className='botonModal'>
                                <button className="btn-cancelar col-auto" onClick={() => { setVentana(3); setidAnterior(null); setData([]); setValor([]); setListaInput([]) }} >
                                    Cerrar
                                </button>
                                <button className="btn-guardar col-auto" onClick={() => {
                                    setVentana(2); revisar();
                                }} >
                                    Guardar
                                </button>
                            </div>
                        </div >
                    </div>
                }

                {
                    ventana === 2 && mes.valido === 'true' && variable.valido === 'true' && gestion.valido === 'true' &&
                    <div className='col-12 col-sm-12 col-md-10 col-lg-7 m-auto'>

                        <div className="table table-responsive custom contenedor-formulario" style={{ height: 'auto' }}>
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

                            <div className='botonModal'>
                                <button className="btn-editar col-auto" onClick={() => { setVentana(1); corregir() }} >
                                    Corregir
                                </button>

                                <button className="btn-guardar col-auto" onClick={() => guardar()} >
                                    Enviar valores
                                </button>
                            </div>
                        </div >
                    </div>
                }



                {
                    ventana === 3 && mes.valido === 'true' && variable.valido === 'true' && gestion.valido === 'true' &&
                    <div className='mt-4'>
                        <div className='tituloPrimario'>{listaVariable.map(e => (parseInt(e.id) === variable.campo && <div key={e.id}>{e.nombre}</div>))}</div>

                        <div className="table table-responsive custom mb-3" style={{ height: 'auto', width: 'auto' }}>
                            <Table className="table table-sm" >
                                {listaCabecera.length > 0 ? <thead>
                                    <tr >
                                        <th className="col-4 mincelda" ></th>
                                        {listaCabecera.map(ele => (

                                            parseInt(ele.nivel) == 1 && <th colSpan={
                                                profundidad2 === 2 ? profuncidadCantiadad2 + profuncidadCantiadad3 + profuncidadCantiadad4 + profuncidadCantiadad5 + (profuncidadCantiadad4 > 0 ? profuncidadCantiadad4 : 0)
                                                    : 1}
                                                className='text-center nivel1' key={ele.id} >{ele.input}
                                            </th>
                                        ))}
                                    </tr>
                                    {profundidad2 == 2 && <tr >
                                        <th className="col-4 mincelda" ></th>
                                        {listaCabecera.map(ele => (
                                            parseInt(ele.nivel) == 2 && <th colSpan={profundidad3 === 3 ? profuncidadCantiadad3 + profuncidadCantiadad4 + profuncidadCantiadad5
                                                : 1} className='text-center nivel2' key={ele.id} >{ele.input}</th>
                                        ))}
                                    </tr>}
                                    {profundidad3 == 3 && <tr >
                                        <th className="col-4 mincelda" ></th>
                                        {listaCabecera.map(ele => (
                                            parseInt(ele.nivel) == 3 && <th colSpan={profundidad4 === 4 ? profuncidadCantiadad4 + profundidad5 : 1}
                                                className='text-center nivel3' key={ele.id} >
                                                {ele.input}</th>
                                        ))}
                                    </tr>}
                                    {profundidad4 == 4 && <tr >
                                        <th className="col-4 mincelda" ></th>
                                        {listaCabecera.map(ele => (
                                            parseInt(ele.nivel) == 4 && <th colSpan={profundidad5 === 5 ? profuncidadCantiadad5 : 1} className='text-center' key={ele.id} >{ele.input}</th>
                                        ))}
                                    </tr>}
                                    {/* {profundidad5 == 4 && <tr >
                                                    <th className="col-4 mincelda" ></th>
                                                    {listaCabecera.map(ele => (
                                                        parseInt(ele.nivel) == 4 && <th colSpan={profundidad5 === 5 ? profuncidadCantiadad5 : 1} className='text-center' key={ele.id} >{ele.input}</th>
                                                    ))}
                                                </tr>} */}

                                </thead> : <thead className='text-center'>No se crearon las caberas para esta variable</thead>
                                }
                                <tbody >
                                    {listaIndicadores.map((ind) => (
                                        <tr key={ind.id}>
                                            <td className="col-4 mincelda TituloSecundario"
                                                onClick={() => { setIndicador({ campo: ind.id, valido: 'true' }); listarInput(ind.id) }}
                                                key={ind.id}>{ind.indicador} <FontAwesomeIcon style={{ marginLeft: '5px' }} icon={faHandPointLeft} /></td>
                                            {
                                                datosGrupo.map(d => (
                                                    parseInt(ind.id) === parseInt(d.idindicador) && <td className="text-center" key={d.id}>{d.valor}</td>
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


