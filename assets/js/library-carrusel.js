function ajustarAlturaCarrusel() {
    const topbar = document.querySelector('.bg-dark.text-white.py-1');
    const navbar = document.querySelector('.navbar');
    const carrusel = document.querySelector('.carousel-split');
    if (!carrusel) return;
    const alturaOcupada = (topbar ? topbar.offsetHeight : 0) + (navbar ? navbar.offsetHeight : 0);
    carrusel.style.height = `calc(100vh - ${alturaOcupada}px)`;
}

window.addEventListener('load', ajustarAlturaCarrusel);
window.addEventListener('resize', ajustarAlturaCarrusel);