(function () {
    setTimeout(() => {
        const listElements = document.querySelectorAll('.menu__item--show')

        const addClick = () => {
            listElements.forEach(element => {
                element.addEventListener('click', () => {
                    let subMenu = element.children[1]
                    let height = 0;
                    element.classList.toggle('menu__item--active')

                    if (subMenu.clientHeight === 0) {
                        height = subMenu.scrollHeight;
                    }
                    subMenu.style.height = `${height}px`;
                })
            })
        }

        addClick()
        if (window.innerWidth <= 800) {
            addClick();
        }

        const deleteStyleHeight = () => {
            listElements.forEach(element => {
                if (element.children[1].getAttribute('style')) {
                    element.children[1].removeAttribute('style');
                    element.classList.remove('menu__item--active')
                }
            })
        }
        window.addEventListener('resize', () => {
            if (window.innerWidth > 800) {
                deleteStyleHeight()
                // if (list.classList.contains('menu__links--show'))
                //     list.classList.remove('menu__links--show')
            } else {
                addClick()
            }
        })


        let tam = window.innerWidth
        if (tam <= 800) {
            addClick();
        }
        const list = document.querySelector('.menu__links');
        const menu = document.querySelector('.menu__hamburguer')
        const hidden_from_variables = document.querySelector('.hidden_from_variables')
        const hidden_from_administracion = document.querySelector('.hidden_from_administracion')
        const hidden_from_reports = document.querySelector('.hidden_from_reports')
        const hidden_from_g_usuarios = document.querySelector('.hidden_from_g_usuarios')
        const hidden_from_g_gestion = document.querySelector('.hidden_from_g_gestion')
        const hidden_from_g_mes = document.querySelector('.hidden_from_g_mes')
        const hidden_from_g_variables = document.querySelector('.hidden_from_g_variables')

        const hidden_from_mostrar_perfil = document.querySelector('.hidden_from_mostrar_perfil')
        const hidden_from_cerrar_sesion = document.querySelector('.hidden_from_cerrar_sesion')
        const hidden_from_formulario = document.querySelector('.hidden_from_formulario')
        if (menu) {
            // console.log(menu, list, 'menu element enconttrddadcdfffcgod')
            menu.addEventListener('click', () => list.classList.toggle('menu__links--show'));
            if (hidden_from_variables)
                hidden_from_variables.addEventListener('click', () => list.classList.toggle('menu__links--show'));
            if (hidden_from_administracion)
                hidden_from_administracion.addEventListener('click', () => list.classList.toggle('menu__links--show'));
            if (hidden_from_reports)
                hidden_from_reports.addEventListener('click', () => list.classList.toggle('menu__links--show'));
            if (hidden_from_g_usuarios)
                hidden_from_g_usuarios.addEventListener('click', () => list.classList.toggle('menu__links--show'));

            if (hidden_from_g_gestion)
                hidden_from_g_gestion.addEventListener('click', () => list.classList.toggle('menu__links--show'));
            if (hidden_from_g_mes)
                hidden_from_g_mes.addEventListener('click', () => list.classList.toggle('menu__links--show'));
            if (hidden_from_g_variables)
                hidden_from_g_variables.addEventListener('click', () => list.classList.toggle('menu__links--show'));

            if (hidden_from_mostrar_perfil)
                hidden_from_mostrar_perfil.addEventListener('click', () => list.classList.toggle('menu__links--show'));
            if (hidden_from_cerrar_sesion)
                hidden_from_cerrar_sesion.addEventListener('click', () => list.classList.toggle('menu__links--show'));

                
            if (hidden_from_formulario)
                hidden_from_formulario.addEventListener('click', () => list.classList.toggle('menu__links--show'));
        }
    }, 1000)

})();

