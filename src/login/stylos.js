import styled, { css } from 'styled-components';
const colores = {
    bordes: "#17a2b8",
    error: "#dc3545",
    texto: 'rgb(238, 131, 131)',
    exito: '#17a2b8',
    // "#28a745",
    encabezado: "#006572",
    borde: "#6c757d"
}
const Input = styled.input` 

    width:100%;
    height: 20px;
    font-size: 13px;
    padding: 0px 5px 0px 5px;  //campos donde va abarcar el texto dentro del input
    margin-bottom: 0px;   
    transition: .3s ease all;
    border: 1px solid ${colores.borde};

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

    color: ${colores.texto};

    ${props => props.valido === 'true' && css`
        display: none;    
    `}

    ${props => props.valido === 'false' && css`
        display: block;
    `}
` ;

export {Input, LeyendaError}