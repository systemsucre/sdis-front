import Swal from 'sweetalert2'

// import 'sweetalert2/src/sweetalert2.scss'


const alert2 = ({ icono, titulo, boton, texto, footer = null, }) => {
    return Swal.fire({
        title: titulo,
        text: texto,
        icon: icono,
        footer: footer ? footer : 'SDIS-VE',
        backdrop: true,
        allowEscapeKey: true,
        allowEnterKey: true,
        stopKeydownPropagation: false,
        confirmButtonText: boton,

        customClass: {
            popup: 'popup-class',
        }

    })
}

const confirmarEliminar = async ({ icono, titulo, boton, texto, footer = null, }) => {
    const data = await Swal.fire({
        title: titulo,
        text: texto,
        imageUrl: 'img/delete.png',
        imageWidth: 100,
        imageHeight: 100,
        footer: footer ? footer : 'SDIS-VE',
        backdrop: true,
        allowEscapeKey: true,
        allowEnterKey: true,
        stopKeydownPropagation: false,

        showCancelButton: true,
        confirmButtonText: boton,

        cancelButtonText: 'Cancelar',

        customClass: {
            popup: 'popup-class',
            // actions: 'boton-popup-eliminar',
        }
    })

    return data
}

const confirmarActualizar = async ({  titulo, boton, texto, footer = null, }) => {
    const data = await Swal.fire({
        title: titulo,
        text: texto,
        imageUrl: 'img/actualizar.png',
        imageWidth: 100,
        imageHeight: 100,
        footer: footer ? footer : 'SDIS-VE',
        backdrop: true,
        allowEscapeKey: true,
        allowEnterKey: true,
        stopKeydownPropagation: false,

        showCancelButton: true,
        confirmButtonText: boton,

        cancelButtonText: 'Cancelar',

        customClass: {
            popup: 'popup-class',
        }
    })
    return data
}

const confirmarGuardar = async ({  titulo, boton, texto, footer = null, }) => {
    const data = await Swal.fire({
        title: titulo,
        text: texto,
        imageUrl: 'img/guardar.png',
        imageWidth: 100,
        imageHeight: 100,
        footer: footer ? footer : 'SDIS-VE',
        backdrop: true,
        allowEscapeKey: true,
        allowEnterKey: true,
        stopKeydownPropagation: false,

        showCancelButton: true,
        confirmButtonText: boton,

        cancelButtonText: 'Cancelar',

        customClass: {
            popup: 'popup-class',
        }
    })
    return data
}

const exito = async ({  titulo, boton, texto, footer = null, }) => {
    const data = await Swal.fire({
        title: titulo,
        text: texto,
        imageUrl: 'img/exito.png',
        imageWidth: 100,
        imageHeight: 100,
        footer: footer ? footer : 'SDIS-VE',
        backdrop: true,
        allowEscapeKey: true,
        allowEnterKey: true,
        stopKeydownPropagation: false,

        showCancelButton: true,
        confirmButtonText: boton,

        cancelButtonText: 'Registrar otro',

        customClass: {
            popup: 'popup-class',
        }
    })
    return data
}

const recet = async ({  titulo, boton, texto, footer = null, }) => {
    const data = await Swal.fire({
        title: titulo,
        text: texto,
        imageUrl: 'img/recet.png',
        imageWidth: 100,
        imageHeight: 100,
        footer: footer ? footer : 'SDIS-VE',
        backdrop: true,
        allowEscapeKey: true,
        allowEnterKey: true,
        stopKeydownPropagation: false,

        showCancelButton: true,
        confirmButtonText: boton,

        cancelButtonText: 'Cancelar',

        customClass: {
            popup: 'popup-class',
        }
    })
    return data
}

const salir = async ({  titulo, boton, texto, footer = null, }) => {
    const data = await Swal.fire({
        title: titulo,
        text: texto,
        imageUrl: 'img/salir.png',
        imageWidth: 100,
        imageHeight: 100,
        footer: footer ? footer : 'SDIS-VE',
        backdrop: true,
        allowEscapeKey: true,
        allowEnterKey: true,
        stopKeydownPropagation: false,

        showCancelButton: true,
        confirmButtonText: boton,

        cancelButtonText: 'Cancelar',

        customClass: {
            popup: 'popup-class',
        }
    })
    return data
}


export { alert2, confirmarEliminar, confirmarActualizar,confirmarGuardar, exito, recet, salir }