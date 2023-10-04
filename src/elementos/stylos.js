import styled, { css } from 'styled-components';
const colores = {
    bordes: "#17a2b8",
    error: "#dc3545",
    texto: '#777',
    exito: '#17a2b8',
    // "#28a745",
    encabezado: "#006572",
    borde: "#6c757d"
}
const Input = styled.input` 

    width:100%;
    // height: 20px;
    font-size: 11px;
    padding: 0px 5px 0px 5px;  //campos donde va abarcar el texto dentro del input
    margin-bottom: 0px;   
    transition: .3s ease all;
    border: 1px solid ${colores.borde};
    white-space: normal;
    border-radius: 2px;
    &:focus {
        border:1px solid ${colores.bordes};
        outline: none;
        box-shadow: 3px 0px 30px rgba(163,163,163,0.4);
    }
    ${props => props.valido === 'true' && css`
        border: 1px solid ${colores.exito}
    `}

    ${props => props.valido === 'false' && css`
        border: 1px solid ${colores.error} !important;
        color:red
    `}

`;

const InputDinamico = styled.input` 

    width:100%;
    // height: 20px;
    font-size: 11px;
    padding: 0px 5px 0px 5px;  //campos donde va abarcar el texto dentro del input
    margin-bottom: 0px;   
    transition: .3s ease all;
    border: 1px solid ${colores.borde};
    white-space: normal;
    border-radius: 0px;
    margin:0;
    &:focus {
        border:1px solid ${colores.bordes};
        outline: none;
        box-shadow: 3px 0px 30px rgba(163,163,163,0.4);
    }
    ${props => props.valido === 'true' && css`
        border: 1px solid ${colores.exito}
    font-size: 12px;

    `}

    ${props => props.valido === 'false' && css`
        border: 1px solid ${colores.error} !important;
    font-size: 12px;

        color:red
    `}

`;
const InputSimple = styled.input` 

    width:100%;
    font-size: 14px;
    padding: 0px 5px 0px 5px;  //campos donde va abarcar el texto dentro del input
    margin-bottom: 0px;   
    transition: .3s ease all;
    border-radius:0;
    border: 1px solid ${colores.borde};
    border-radius: 2px;
    &:focus {
        border:1px solid ${colores.bordes};
        outline: none;
        box-shadow: 3px 0px 30px rgba(163,163,163,0.4);
    }
    ${props => props.valido === 'true' && css`
        border: 1px solid ${colores.exito}
    `}

    ${props => props.valido === 'false' && css`
        border: 1px solid ${colores.error} !important;
        color:red
    `}
    @media(max-width:400px) {
        font-size: 12px;
    }
    @media(max-width:300px) {
        font-size: 11px;
    }
`;


const LeyendaError = styled.span`
    font-size: 11px;
    margin:0;
    text-align: left; 
    position: absolute;


    ${props => props.valido === 'true' && css`
        display: none;    
    `}

    ${props => props.valido === 'false' && css`
        display: block;
    `}
` ;

const InputBuscador = styled.input` 

    border: 1px solid ${colores.borde};
    border-radius: 2px;
    &:focus {
        border:1px solid ${colores.bordes};
        outline: none;
        box-shadow: 3px 0px 30px rgba(163,163,163,0.4);
    }
    ${props => props.valido === 'true' && css`
        border: 1px solid ${colores.exito}
    `}

    ${props => props.valido === 'false' && css`
        border: 1px solid ${colores.error} !important;
        
    `}
    @media(max-width:400px) {
        font-size: 12px;
    }
    @media(max-width:300px) {
        font-size: 11px;
    }
`;

const SelectStyle = styled.select`
    width:100%;
    font-size: 11px;
    padding: 0 5px 0 5px;  //campos donde va abarcar el texto dentro del input
    transition: .3s ease all;
    color:#4c4c51;
    border: 1px solid ${colores.borde};
    border-radius: 2px;
    &:focus {
        border:1px solid ${colores.bordes};
        outline: node;
        box-shadow: 3px 0px 30px rgba(163,163,163,0.4);
    }
    ${props => props.valido === 'true' && css`
        border: 1px solid ${colores.exito} !important;
    `}

    ${props => props.valido === 'false' && css`
        border: 1px solid ${colores.error} !important;
    `}
    // @media(max-width:400px) {
    //     font-size: 12px;
    // }
    // @media(max-width:300px) {
    //     font-size: 11px;
    // }
`;


const SelectStylexl = styled.select`
    width:100%;
    font-size: 16px;
    padding: 0 5px 0 10px;  //campos donde va abarcar el texto dentro del input
    transition: .3s ease all;
    color:#4c4c51;
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: 1px solid ${colores.bordes};
    border-radius: 0;
    color:${colores.texto};
    &:focus {
        border-top: 0;
        border-left: 0;
        border-right: 0;
        
        border-bottom: 1px solid ${colores.bordes};
        outline: node;
        // box-shadow: 3px 0px 30px rgba(163,163,163,0.4);
    }
    ${props => props.valido === 'true' && css`

        border-top: 0;
        border-left: 0;
        border-right: 0;
        border-bottom: 1px solid ${colores.exito} !important;
    `}

    ${props => props.valido === 'false' && css`
        border-top: 0;
        border-left: 0;
        border-right: 0;
        border-bottom: 1px solid ${colores.error} !important;

    `}
    @media(max-width:400px) {
        font-size: 14px;
    }
    @media(max-width:300px) {
        font-size: 12px;
    }
`;


const SelectSm = styled.select`
    width:100%;
    font-size: 13px;
    padding: 0 5px 0 5px;  //campos donde va abarcar el texto dentro del input
    transition: .3s ease all;
    color:#4c4c51;
    border: 1px solid #595959;
    font-weight: bold;
    border-radius: 2px;
    &:focus {
        border:1px solid #595959;
        outline: node;
        box-shadow: 3px 0px 30px rgba(163,163,163,0.4);
    }
    ${props => props.valido === 'true' && css`
        border: 1px solid #595959 !important;
    `}

    ${props => props.valido === 'false' && css`
        border: 1px solid #595959 !important;
    `}
    @media(max-width:400px) {
        font-size: 11px;
    }
    @media(max-width:300px) {
        font-size: 11px;
    }
`;

const ContenedorCheck = styled.div` 

margin: 0px;
padding:0px;
height:auto;
width:100%;
font-weight: bold;
font-size : 11.5px;
grid-column :span 2;  // abarca dos columnas
input {
    margin-right : 5px;  //para separar el parrafo de la casilla check
}

@media (max-width: 800px){  //en dispositivos pequeños se dapatara a una columna 
    grid-column: span 1;
}
`;

const ContenedorCheckXL = styled.div` 

margin: 0px;
padding:0px;
height:auto;
width:100%;
font-weight: bold;
grid-column :span 2;  // abarca dos columnas
input {
    margin-right : 5px;  //para separar el parrafo de la casilla check
}

@media (max-width: 800px){  //en dispositivos pequeños se dapatara a una columna 
    grid-column: span 1;
}
`;


export { Input, InputDinamico, InputSimple, LeyendaError, InputBuscador, SelectStyle, SelectStylexl, ContenedorCheck,SelectSm,
     ContenedorCheckXL}