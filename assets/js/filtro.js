function filtrarCatalogo(categoria, boton) {
    document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('active'));
    boton.classList.add('active');

    document.querySelectorAll('[data-categoria]').forEach(producto => {
        let coincide;
        if (categoria === 'todos') {
            coincide = true;
        } else if (categoria === 'ofertas') {
            coincide = producto.dataset.oferta === 'si';
        } else {
            coincide = producto.dataset.categoria === categoria;
        }
        producto.classList.toggle('d-none', !coincide);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const parametros = new URLSearchParams(window.location.search);
  const categoria = parametros.get('categoria');
  if (categoria) {
    const boton = document.querySelector(`.btn-filtro[data-filtro="${categoria}"]`);
    if (boton) {
      filtrarCatalogo(categoria, boton);
      boton.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
});