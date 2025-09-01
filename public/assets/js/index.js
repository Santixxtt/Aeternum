window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('sticky');
    } else {
        navbar.classList.remove('sticky');
    }
});

// Menú para celular
const menuIcon = document.getElementById('menu-icon');
const navMenu = document.getElementById('nav-menu');

let menuOpen = false;

menuIcon.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuOpen = !menuOpen;

    // Cambiar ícono
    if (menuOpen) {
        menuIcon.classList.remove('bx-menu');
        menuIcon.classList.add('bx-menu-alt-right');
    } else {
        menuIcon.classList.remove('bx-menu-alt-right'); 
        menuIcon.classList.add('bx-menu');
    }
});