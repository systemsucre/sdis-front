import { Input, LeyendaError } from './stylos'
import { useEffect, useState } from 'react'



const InputUsuario = ({ estado, cambiarEstado, name, placeholder, tipo = 'text', ExpresionRegular, etiqueta, campoUsuario = false, msg, eventoBoton= null, important = true }) => {

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

    const handleKeyPress = (e) => {
        if (eventoBoton)
            if (e.keyCode === 13 && estado.valido === 'true') {
                eventoBoton()
            }
    }


    return (
        <div >
            {/* <div className=" field" style={{ position: 'relative', paddingBottom: '0px' }}> */}
            <p className='nombreentradas'>{important ? etiqueta + '   *' : etiqueta +''}
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
                    onKeyDown={handleKeyPress}
                />
                <LeyendaError>{mensaje}</LeyendaError>
            </p>
            {/* </div> */}
        </div >

    )
}

export { InputUsuario }