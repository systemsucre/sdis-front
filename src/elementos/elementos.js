import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Input, LeyendaError, InputBuscador, SelectStyle, InputSimple, SelectStylexl } from './stylos'
import { useEffect, useState } from 'react'
import { faArrowDown, faArrowUp, faChevronDown, faEnvelope, faGlobe, faMailBulk, faPhone, faSearch } from '@fortawesome/free-solid-svg-icons'
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
            if (ExpresionRegular.test(estado.campo)) {
                cambiarEstado({ ...estado, valido: 'true' })  //el valor del campo valido, debe ser una cadena 
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
            {/* <div className=" field" style={{ position: 'relative', paddingBottom: '0px' }}> */}
            <p className='nombreentradas'>{important ? etiqueta + '   *' : etiqueta}
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

const Select1 = ({ estado, cambiarEstado, Name, ExpresionRegular, lista, funcion, estado_ = null, etiqueta, msg, }) => {
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

                        <option key={r.id} value={r.id}>{r.nombre}</option>
                    ))}
                </SelectStyle>
                <LeyendaError>{mensaje}</LeyendaError>
            </p>
        </div>
    )
}


const Select1XL = ({ estado, cambiarEstado, Name, ExpresionRegular, lista, funcion, estados = null, etiqueta, msg, }) => {
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
                    <SelectStylexl
                        className="form-control form-control-sm"
                        onChange={onChange}
                        // onKeyUp={funcion} //se ejecuta cuando dejamos de presionar la tecla
                        // onBlur={validacion}  //si presionamos fuera del input
                        valido={estado.valido}
                        value={estado.campo || ''}
                        onClick={validacion}
                    >
                        <option>Seleccionar</option>

                        {lista.map((r) => (

                            <option key={r.id} value={r.id}>{r.nombre}</option>
                        ))}
                    </SelectStylexl>
                    {/* <label for="my-select">
                        <span class="material-icons">
                            <FontAwesomeIcon icon={faChevronDown} />
                        </span>
                    </label>
                </div> */}
                <LeyendaError style={{ fontSize: '12px' }}>{mensaje}</LeyendaError>
            </p>
        </div>
    )
}

const PiePagina = () => {

    return (
        <div className='footer-pague'><p className='nombre-intitucion'> SERVICIO DEPARTAMENTAL DE SALUD DE CHUQUISACA</p>
            <div className='row'>
                <div className='col-12 col-sm-6 col-md-4 col-lg-4'>

                    <div class="text_to_html">
                        <h3>©Area Informatica</h3>
                        <p>Unidad Sistemas de informacion</p>
                        <h6>Oficina, Calle Rodendo Villa N123 Sucre-Bolivia</h6>
                    </div>
                </div>

                <div className='col-12 col-sm-6 col-md-4 col-lg-4'>

                    <span className='soporte-tecnico'> CONTACTOS</span>
                    <ul class="footercontact">
                        <li><FontAwesomeIcon icon={faPhone} />  5443334, 4343453</li>
                        <li><FontAwesomeIcon icon={faEnvelope} /> sedesch@gob.bo</li>

                    </ul>
                </div>

                <div className='col-12 col-sm-6 col-md-4 col-lg-4'>
                    <div className="socials_wrapper">
                        <ul className="socials">
                            <li>
                                <span ><FontAwesomeIcon className='icon-redes' icon={faFacebook} /></span>
                                <a href="https://www.facebook.com/SEDESCh" title="https://www.facebook.com/SEDESCh" alt="https://www.facebook.com/SEDESCh" target="_blank">

                                    <span className="sr-only">https://www.facebook.com/SEDESCh</span>
                                    Página de Facebook
                                </a>
                            </li>
                            <li>
                                <span><FontAwesomeIcon className='icon-redes' icon={faGlobe} /></span>
                                <a href="https://sedeschuquisaca.gob.bo/" title="https://sedeschuquisaca.gob.bo/" alt="https://sedeschuquisaca.gob.bo/" target="_blank">
                                    <span className="sr-only">https://sedeschuquisaca.gob.bo/</span> Sitio Web
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>

        </div>
    )
}
export { InputUsuario, ComponenteInputBuscar_, Select1, Select1XL, PiePagina }