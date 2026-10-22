let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    function actualizarCarritoUI() {
      const carritoItems = document.getElementById('carritoItems');
      const carritoTotal = document.getElementById('carritoTotal');
      const cartCount = document.getElementById('cartCount');
      const totalAmount = document.getElementById('totalAmount');

      if (carrito.length === 0) {
        carritoItems.innerHTML = '<p class="text-center text-muted">El carrito esta vacio</p>';
        carritoTotal.classList.add('d-none');
        cartCount.style.display = 'none';
        return;
      }

      carritoItems.innerHTML = '';
      let total = 0;

      carrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        carritoItems.innerHTML += `
        <div class="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
          <div>
            <h6 class="mb-0">${item.nombre}</h6>
            <small class="text-muted">S/ ${item.precio.toFixed(2)} c/u</small>
          </div>
          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${index}, -1)">-</button>
            <span>${item.cantidad}</span>
            <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${index}, 1)">+</button>
            <button class="btn btn-sm btn-outline-danger" onclick="eliminarDelCarrito(${index})">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      `;
      });

      totalAmount.textContent = `S/ ${total.toFixed(2)}`;
      carritoTotal.classList.remove('d-none');
      cartCount.textContent = carrito.reduce((sum, item) => sum + item.cantidad, 0);
      cartCount.style.display = 'inline-block';
    }

    function agregarAlCarrito(nombre, precio) {
      const existingItem = carrito.find(item => item.nombre === nombre);
      if (existingItem) {
        existingItem.cantidad++;
      } else {
        carrito.push({ nombre, precio, cantidad: 1 });
      }
      localStorage.setItem('carrito', JSON.stringify(carrito));
      actualizarCarritoUI();

      const offcanvas = new bootstrap.Offcanvas(document.getElementById('carritoOffcanvas'));
      offcanvas.show();
    }

    function cambiarCantidad(index, cambio) {
      carrito[index].cantidad += cambio;
      if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
      }
      localStorage.setItem('carrito', JSON.stringify(carrito));
      actualizarCarritoUI();
    }

    function eliminarDelCarrito(index) {
      carrito.splice(index, 1);
      localStorage.setItem('carrito', JSON.stringify(carrito));
      actualizarCarritoUI();
    }

    function finalizarCompra() {
      if (carrito.length === 0) return;
      alert('¡Gracias por tu compra! Total: ' + document.getElementById('totalAmount').textContent);
      carrito = [];
      localStorage.setItem('carrito', JSON.stringify(carrito));
      actualizarCarritoUI();
      bootstrap.Offcanvas.getInstance(document.getElementById('carritoOffcanvas')).hide();
    }

    document.addEventListener('DOMContentLoaded', actualizarCarritoUI);