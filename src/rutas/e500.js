import { Link } from 'react-router-dom'
import React from 'react';

function E500() {
    // console.log(parseInt(localStorage.getItem('numRol')), 'numero de rol')

    return (
        <>

            <div className="">
                <section className="content-header">
                    <div className="container-fluid">

                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1>500 No disponible</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><Link to='/'>INICIO</Link></li>
                                    <li className="breadcrumb-item active">404 Pagina no encontrado</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="content">
                    <div className="error-page">
                        <h2 className="headline text-danger">404</h2>

                        <div className="error-content">
                            <h3><i className="fas fa-exclamation-triangle text-danger"></i>!Ups! Algo salió mal.</h3>

                            <p>
                            Trabajaremos para solucionarlo de inmediato. Mientras tanto, puede
                                 <Link to="/">volver a la pagina de inicio</Link>.
                            </p>

                        </div>
                    </div>

                </section>
            </div>

        </>
    )

}
export default E500