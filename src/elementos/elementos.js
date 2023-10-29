import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Input, LeyendaError, InputBuscador, SelectStyle, SelectStylexl, SelectSm, ContenedorCheck, ContenedorCheckXL } from './stylos'
import { useEffect, useState } from 'react'
import { faEnvelope, faGlobe, faMailBulk, faPhone, faSearch } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'



const InputUsuario = ({ estado, cambiarEstado, name, placeholder, tipo = 'text', ExpresionRegular, etiqueta, campoUsuario = false, msg, important = true }) => {

    const [mensaje, setMensaje] = useState(null)

    useEffect(() => {
        setTimeout(() => {
            setMensaje(null)
        }, 10000)
    }, [mensaje])

    const onChange = (e) => {
        if (campoUsuario) {
            cambiarEstado({ ...estado, campo: e.target.value.toLowerCase() })
        }
        else
            cambiarEstado({ ...estado, campo: e.target.value.toUpperCase() })
    }

    const validacion = () => {
        if (ExpresionRegular) {
            if (ExpresionRegular.test(estado.campo) && estado.campo != null) {
                cambiarEstado({ ...estado, valido: 'true' })  //el valor del campo valido, debe ser una cadena 
                setMensaje(null)
            }
            else {
                cambiarEstado({ ...estado, valido: 'false' })
                setMensaje(msg)
            }
        }
    }

    // console.log(estado)
    return (
        <div >
            {/* <div className=" field" style={{ position: 'relative', paddingBottom: '0px' }}> */}
            <p className='nombreentradas'>{important ? etiqueta + '  *' : etiqueta + ''}
                <Input
                    type={tipo}
                    className="form-control form-control-sm"
                    id={name}
                    name={name}
                    expresionRegular={ExpresionRegular}
                    placeholder={placeholder}
                    value={estado.campo || ''}
                    onChange={onChange}
                    onKeyUp={validacion} //se ejecuta cuando dejamos de presionar la tecla
                    onBlur={validacion}  //si presionamos fuera del input
                    valido={estado.valido}
                />
                <LeyendaError>{mensaje}</LeyendaError>
            </p>
            {/* </div> */}
        </div >

    )
}


const ComponenteInputBuscar_ = ({ estado, cambiarEstado, name, ExpresionRegular, placeholder, eventoBoton, etiqueta }) => {

    const onchange = (e) => {
        cambiarEstado({ ...estado, campo: e.target.value.toUpperCase() }) // cambiarEstado({ ...estado, campo: e.target})
    }
    const validacion = () => {
        if (ExpresionRegular) {

            if (ExpresionRegular.test(estado.campo)) {
                cambiarEstado({ ...estado, valido: 'true' })  //el valor del campo valido, debe ser una cadena 
            }
            else {
                cambiarEstado({ ...estado, valido: 'false' })
            }
        }
    }

    const handleKeyPress = (e) => {
        if (e.keyCode === 13 && estado.valido === 'true') {
            eventoBoton()
        }
    }

    return (
        <>
            {/* <label>{etiqueta + '  :   '}</label> */}
            <InputBuscador
                type='text'
                value={estado.campo || ''}
                id={'idBuscador'}
                className="form-control form-control-sm "
                name={name}
                placeholder={placeholder}
                onKeyUp={validacion} //se ejecuta cuando dejamos de presionar la tecla
                onBlur={validacion}  //si presionamos fuera del input
                onChange={onchange}
                valido={estado.valido}
                onKeyDown={handleKeyPress}
            // keyup = {teclaenter}
            />
            <button className="icon" onClick={eventoBoton}> <FontAwesomeIcon icon={faSearch} /></button>
        </>

    )
}

const Select1 = ({ estado, cambiarEstado, Name, ExpresionRegular, lista, funcion, estado_ = null, etiqueta, msg, funcion1, funcion2, funcion3 }) => {
    const [mensaje, setMensaje] = useState(null)
    useEffect(() => {
        setTimeout(() => {
            setMensaje(null)
        }, 10000)
    }, [mensaje])

    const onChange = (e) => {
        cambiarEstado({ campo: parseInt(e.target.value), valido: 'true' });
    }
    const validacion = () => {
        if (ExpresionRegular) {
            if (ExpresionRegular.test(estado.campo) && estado.campo != 'Seleccionar') {
                cambiarEstado({ ...estado, valido: 'true' })  //el valor del campo valido, debe ser una cadena 
                if (funcion) {
                    funcion()
                    if (estado_)
                        estado_({ campo: null, valido: null })
                }
                if (funcion1) {
                    if (estado.campo == 5)
                        funcion1()
                }
                if (funcion2) {
                    if (estado.campo == 4) {
                        funcion2()
                        console.log('municipio en componentes')
                    }
                }
                if (funcion3) {
                    if (estado.campo == 3)
                        funcion3()
                }

                setMensaje(null)

            }
            else {
                cambiarEstado({ ...estado, valido: 'false' })
                setMensaje(msg)
            }
        }
    }


    return (
        <div >
            <p className='nombreentradas'>{etiqueta + '   *  '}
                <SelectStyle
                    name={Name}
                    className="form-control form-control-sm"
                    onChange={onChange}
                    // onKeyUp={validacion} //se ejecuta cuando dejamos de presionar la tecla
                    // onBlur={validacion}  //si presionamos fuera del input
                    valido={estado.valido}
                    value={estado.campo || ''}
                    onClick={validacion}
                >
                    <option>Seleccionar</option>

                    {lista.map((r) => (

                        <option key={r.id} value={r.id} style={{color:'#595959', fontSize:'12px'}}>{r.nombre}</option>
                    ))}
                </SelectStyle>
                <LeyendaError>{mensaje}</LeyendaError>
            </p>
        </div>
    )
}

const SelectSMString = ({ estado, cambiarEstado, Name, ExpresionRegular, lista, funcion, estado_ = null, etiqueta, msg, nivel = null }) => {
    const [mensaje, setMensaje] = useState(null)
    useEffect(() => {
        setTimeout(() => {
            setMensaje(null)
        }, 10000)
    }, [mensaje])

    const onChange = (e) => {
        cambiarEstado({ campo: e.target.value, valido: 'true' });
    }
    const validacion = () => {
        if (ExpresionRegular) {
            if (ExpresionRegular.test(estado.campo) && estado.campo != 'Seleccionar') {
                cambiarEstado({ ...estado, valido: 'true' })  //el valor del campo valido, debe ser una cadena 
                if (funcion) {
                    funcion()
                    if (estado_)
                        estado_({ campo: null, valido: null })
                }

                setMensaje(null)

                if (nivel) {
                    console.log('asignacion nivel')
                    setTimeout(() => {
                        lista.forEach(e_ => {
                            if (e_.id == estado.campo) { nivel(e_.numero); console.log('asignar nivel,', e_.numero, estado) }
                        })
                    }, 200)
                }
            }
            else {
                cambiarEstado({ ...estado, valido: 'false' })
                setMensaje(msg)
            }
        }
    }


    return (
        <div >
            <p className='nombreentradassm reportes-select' >{etiqueta}
                <SelectSm
                    name={Name}
                    className="form-control form-control-sm"
                    onChange={onChange}
                    // onKeyUp={validacion} //se ejecuta cuando dejamos de presionar la tecla
                    // onBlur={validacion}  //si presionamos fuera del input
                    valido={estado.valido}
                    value={estado.campo || ''}
                    onClick={validacion}
                >
                    <option>Seleccionar</option>

                    {lista.map((r, index) => (

                        <option key={index} value={r.id} style={{color:'#595959', fontSize:'12px'}}>{r.nombre}</option>
                    ))}
                </SelectSm>
                <LeyendaError>{mensaje}</LeyendaError>
            </p>
        </div>
    )
}

const SelectSM = ({ estado, cambiarEstado, Name, ExpresionRegular, lista, funcion, estado_ = null, etiqueta, msg,  very = 0 }) => {
    const [mensaje, setMensaje] = useState(null)
    useEffect(() => {
        setTimeout(() => {
            setMensaje(null)
        }, 10000)
    }, [mensaje])

    const onChange = (e) => {
        cambiarEstado({ campo: parseInt(e.target.value), valido: 'true' });
    }
    const validacion = () => {
        if (ExpresionRegular) {
            if (ExpresionRegular.test(estado.campo) && estado.campo != 'Seleccionar') {
                cambiarEstado({ ...estado, valido: 'true' })  //el valor del campo valido, debe ser una cadena 
                if (funcion) {
                    funcion()
                    if (estado_)
                        estado_({ campo: null, valido: null })
                }

                setMensaje(null)

            }
            else {
                cambiarEstado({ ...estado, valido: 'false' })
                setMensaje(msg)
            }
        }
    }


    return (
        <div >
            <p className='nombreentradassm reportes-select' >{etiqueta}
                <SelectSm
                    name={Name}
                    className="form-control form-control-sm"
                    onChange={onChange}
                    // onKeyUp={validacion} //se ejecuta cuando dejamos de presionar la tecla
                    // onBlur={validacion}  //si presionamos fuera del input
                    valido={estado.valido}
                    value={estado.campo || ''}
                    onClick={validacion}
                >
                    {very == 0 && < option > Seleccionar</option>}

                    {lista.map((r, index) => (

                        <option key={index} value={r.id} style={{color:'#595959', fontSize:'12px'}}>{r.nombre}</option>
                    ))}
                </SelectSm>
                <LeyendaError>{mensaje}</LeyendaError>
            </p>
        </div >
    )
}
const Select1XL = ({ estado, cambiarEstado, ExpresionRegular, lista, funcion, estados = null, etiqueta, msg, very = 0 }) => {
    const [mensaje, setMensaje] = useState(null)
    useEffect(() => {
        setTimeout(() => {
            setMensaje(null)
        }, 10000)
    }, [mensaje])

    const onChange = (e) => {
        cambiarEstado({ campo: parseInt(e.target.value), valido: 'true' });
        if (estados)
            estados.forEach(element => {
                element({ campo: null, valido: null })
            });
    }
    const validacion = (e) => {
        if (ExpresionRegular) {
            if (ExpresionRegular.test(estado.campo) && estado.campo != 'Seleccionar') {
                cambiarEstado({ ...estado, valido: 'true' })  //el valor del campo valido, debe ser una cadena 
                if (funcion) funcion()
                setMensaje(null)
            }
            else {
                cambiarEstado({ ...estado, valido: 'false' })
                setMensaje(msg)
            }
        }
    }

    // if (listas)
    //     listas.forEach(element => {
    //         element([])
    //         // console.log(element=[])
    //     });
    return (
        <div >
            <p className='nombreentradas'>{etiqueta + '   *  '}
                {/* <div className='my-custom-select'> */}
                <SelectSm
                    className="form-control form-control-sm"
                    onChange={onChange}
                    // onKeyUp={funcion} //se ejecuta cuando dejamos de presionar la tecla
                    // onBlur={validacion}  //si presionamos fuera del input
                    valido={estado.valido}
                    value={estado.campo || ''}
                    onClick={validacion}
                >
                    {very == 0 && <option value={'no valido'}>Seleccionar</option>}

                    {lista.map((r) => (

                        <option key={r.id} value={r.id}>{r.nombre}</option>
                    ))}
                </SelectSm>
                <LeyendaError style={{ fontSize: '12px' }}>{mensaje}</LeyendaError>
            </p>
        </div>
    )
}

const ComponenteCheck = ({ id, item, admitidos, funcion = null, setLista = null, prefijo }) => {
    // lista: setlista de indicadores para en caso de ponerlos en vacio
    // funcion: funcion listar indicadores para cargar la lista si y solo si se selecciona un variable
    const onChange = (e) => {

        if (e.target.checked) {

            admitidos.push(parseInt(e.target.value))
            if (admitidos.length === 1) {
                if (funcion) {
                    funcion(admitidos[0])
                }
            }
            else if (setLista) setLista([])


        }

        if (e.target.checked === false) {
            let indiceEliminar = null
            admitidos.forEach(x => {
                if (x == parseInt(e.target.value)) {
                    indiceEliminar = admitidos.indexOf(parseInt(e.target.value))
                    admitidos.splice(indiceEliminar, 1);
                }
            })
            if (admitidos.length === 1) {
                if (funcion) {
                    funcion(admitidos[0])
                }
            }
            else if (setLista) setLista([])
        }
        let check = document.getElementById(1111)
        if (check)
            check.checked = false
        let check2 = document.getElementById(2222)
        if (check2)
            check2.checked = false
    }


    let check = false
    admitidos.forEach(e => {
        if (id === e)
            check = true
    })

    return (
        <ContenedorCheck>
            <label htmlFor={id + prefijo} > {/*el id es un elemento escencial al momento de marcar el check  */}
                <input
                    type="checkbox"
                    name={id}
                    value={id}
                    id={id + prefijo}
                    onChange={onChange}
                    defaultChecked={check}
                />
                <small>{item}</small>
            </label>
        </ContenedorCheck>
    )
}


const ComponenteCheckXL = ({ id, item, setAdmitidos, admitidos, lista, prefijo, }) => {
    const onChange = (e) => {
        if (e.target.checked) {
            lista.forEach(e1 => {
                admitidos.push(e1.id)
                document.getElementById(e1.id + prefijo).checked = true
                let result = admitidos.filter((item, index) => {
                    return admitidos.indexOf(item) === index;
                })
                setAdmitidos(result)
            })
            // console.log(admitidos) 
        }

        if (e.target.checked === false) {
            setAdmitidos([])
            lista.forEach(e1 => {
                document.getElementById(e1.id + prefijo).checked = false
            })
            // console.log(admitidos)
        }
    }

    return (
        <ContenedorCheckXL>
            <label htmlFor={id} > {/*el id es un elemento escencial al momento de marcar el check  */}
                <input
                    type="checkbox"
                    name={id}
                    value={id}
                    id={id}
                    onChange={onChange}
                // defaultChecked={check}
                />
                <small style={{ color: '#595959', paddingTop: '0', fontSize: "12px" }}>{item}</small>
            </label>
        </ContenedorCheckXL>
    )
}
const ComponenteCheckMTM = ({ id, item, admitidos, marcarTodos = false }) => {

    const onChange = (e) => {
        if (e.target.checked) {
            admitidos.push(parseInt(e.target.value))
        }

        if (e.target.checked === false) {
            let indiceEliminar = null
            admitidos.forEach(x => {
                if (x == parseInt(e.target.value)) {
                    indiceEliminar = admitidos.indexOf(parseInt(e.target.value))
                    admitidos.splice(indiceEliminar, 1);
                }
            })
        }
    }


    let check = false
    admitidos.forEach(e => {
        console.log(e, id, 'comparacion')
        if (parseInt(id) === e) {
            check = true
        }
    })

    if (marcarTodos) {
        console.log('sekeccion de subsectro en componente ', admitidos)
        admitidos.forEach(e => {
            // console.log(e, id, 'comparacion')
            if (parseInt(id) === e) {
                check = true
            }
        })
    }

    // console.log('seleccionados ', admitidos)

    return (
        <ContenedorCheck>
            <label htmlFor={id + 'ser'} > {/*el id es un elemento escencial al momento de marcar el check  */}
                <input
                    type="checkbox"
                    name={id}
                    value={id}
                    id={id + 'ser'}
                    onChange={onChange}
                    defaultChecked={check}
                />
                <small>{item}</small>
            </label>
        </ContenedorCheck>
    )
}


export { InputUsuario, ComponenteInputBuscar_, Select1, Select1XL, ComponenteCheck, ComponenteCheckXL, SelectSM, SelectSMString, ComponenteCheckMTM }