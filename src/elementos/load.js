import './estilos.css'
export default function Loand({texto}){

    return (
        <div className=" load_">
            <div className="text-center">
                <h3> Espere por favor</h3>
                <span>{texto}</span>
            </div>
        </div>
    )

}
