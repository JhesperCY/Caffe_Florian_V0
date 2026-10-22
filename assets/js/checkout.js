function formatMoney(valor) {
  return 'S/ ' + valor.toFixed(2);
}

function calcularTotalCarrito() {
  return carrito.reduce((suma, item) => suma + (item.precio * item.cantidad), 0);
}

function abrirResumenCompra() {
  if (carrito.length === 0) return;

  const resumenItems = document.getElementById('resumenItems');
  resumenItems.innerHTML = '';

  carrito.forEach(item => {
    resumenItems.innerHTML += `
      <div class="d-flex justify-content-between mb-2">
        <span>${item.nombre} x${item.cantidad}</span>
        <span>${formatMoney(item.precio * item.cantidad)}</span>
      </div>
    `;
  });

  document.getElementById('resumenTotal').textContent = formatMoney(calcularTotalCarrito());

  const offcanvasActivo = bootstrap.Offcanvas.getInstance(document.getElementById('carritoOffcanvas'));
  if (offcanvasActivo) offcanvasActivo.hide();

  new bootstrap.Modal(document.getElementById('modalResumenCompra')).show();
}

function irAConfirmacion() {
  bootstrap.Modal.getInstance(document.getElementById('modalResumenCompra')).hide();

  document.getElementById('confirmarTotal').textContent = formatMoney(calcularTotalCarrito());
  pintarMediosDePago();

  new bootstrap.Modal(document.getElementById('modalConfirmarCompra')).show();
}

function pintarMediosDePago() {
  const lista = document.getElementById('medioPagoLista');
  const tarjeta = JSON.parse(localStorage.getItem('tarjetaGuardada'));

  let html = `
    <div class="d-flex align-items-center gap-2 border rounded p-2 mb-2">
      <input class="form-check-input mt-0" type="radio" name="medioPago" id="pagoYape" value="yape">
      <label class="form-check-label mb-0" for="pagoYape">Yape</label>
    </div>
  `;

  if (tarjeta) {
    html += `
      <div class="d-flex align-items-center gap-2 border rounded p-2">
        <input class="form-check-input mt-0" type="radio" name="medioPago" id="pagoTarjeta" value="tarjeta">
        <label class="form-check-label mb-0" for="pagoTarjeta">
          Tarjeta terminada en ${tarjeta.ultimos4} - ${tarjeta.titular}
        </label>
      </div>
    `;
  }

  lista.innerHTML = html;
  document.getElementById('btnPagarFinalizar').disabled = true;

  lista.querySelectorAll('input[name="medioPago"]').forEach(input => {
    input.addEventListener('change', () => {
      document.getElementById('btnPagarFinalizar').disabled = false;
    });
  });
}

function abrirNuevaTarjeta() {
  bootstrap.Modal.getInstance(document.getElementById('modalConfirmarCompra')).hide();
  new bootstrap.Modal(document.getElementById('modalNuevaTarjeta')).show();
}

function guardarTarjeta() {
  const numero = document.getElementById('tarjetaNumero').value.replace(/\s/g, '');
  const titular = document.getElementById('tarjetaTitular').value;
  const vencimiento = document.getElementById('tarjetaVencimiento').value;

  if (numero.length < 4 || titular.trim() === '' || vencimiento.trim() === '') {
    alert('Completa todos los campos de la tarjeta');
    return;
  }

  const tarjeta = {
    ultimos4: numero.slice(-4),
    titular: titular,
    vencimiento: vencimiento
  };

  localStorage.setItem('tarjetaGuardada', JSON.stringify(tarjeta));

  bootstrap.Modal.getInstance(document.getElementById('modalNuevaTarjeta')).hide();

  pintarMediosDePago();
  new bootstrap.Modal(document.getElementById('modalConfirmarCompra')).show();
}

function confirmarPago() {
  const total = calcularTotalCarrito();
  const gravada = total / 1.18;
  const igv = total - gravada;

  const boleta = {
    numero: 'BF01-' + Math.floor(Math.random() * 9000000 + 1000000),
    fecha: new Date().toLocaleDateString('es-PE'),
    hora: new Date().toLocaleTimeString('es-PE'),
    items: carrito,
    gravada: gravada,
    igv: igv,
    total: total
  };

  localStorage.setItem('ultimaBoleta', JSON.stringify(boleta));

  carrito = [];
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarCarritoUI();

  bootstrap.Modal.getInstance(document.getElementById('modalConfirmarCompra')).hide();
  new bootstrap.Modal(document.getElementById('modalCompraExitosa')).show();
}

function descargarComprobantePDF() {
  const boleta = JSON.parse(localStorage.getItem('ultimaBoleta'));
  if (!boleta) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'mm', 'a4');

  doc.setFontSize(8);
  doc.text('COMPROBANTE DE PAGO', 15, 12);

  doc.setFontSize(11);
  doc.text('Razon Social: Caffe Florian E.I.R.L.', 15, 25);
  doc.text('RUC: 20999999999', 15, 31);
  doc.text('Direccion: Av. Los Cafetales 123, Lima - San Isidro', 15, 37);

  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('BOLETA DE VENTA ELECTRONICA', 125, 25);
  doc.text(boleta.numero, 145, 32);
  doc.setFont(undefined, 'normal');

  doc.setFontSize(10);
  doc.text('Fecha de emision: ' + boleta.fecha + '   Hora: ' + boleta.hora, 15, 50);

  let y = 62;
  doc.setFont(undefined, 'bold');
  doc.text('DESCRIPCION', 15, y);
  doc.text('CANT.', 120, y);
  doc.text('P. UNIT S/', 145, y);
  doc.text('IMPORTE S/', 175, y);
  doc.setFont(undefined, 'normal');
  y += 4;
  doc.line(15, y, 195, y);
  y += 6;

  boleta.items.forEach(item => {
    doc.text(item.nombre, 15, y);
    doc.text(String(item.cantidad), 122, y);
    doc.text(item.precio.toFixed(2), 145, y);
    doc.text((item.precio * item.cantidad).toFixed(2), 175, y);
    y += 7;
  });

  y += 4;
  doc.line(15, y, 195, y);
  y += 8;

  doc.text('Operacion Gravada S/:', 130, y);
  doc.text(boleta.gravada.toFixed(2), 175, y);
  y += 6;
  doc.text('IGV S/:', 130, y);
  doc.text(boleta.igv.toFixed(2), 175, y);
  y += 6;
  doc.setFont(undefined, 'bold');
  doc.text('MONTO TOTAL S/:', 130, y);
  doc.text(boleta.total.toFixed(2), 175, y);
  doc.setFont(undefined, 'normal');

  y += 15;
  doc.setFontSize(8);
  doc.text('Representacion de prueba de Boleta de Venta electronica.', 15, y);

  doc.save('boleta-caffe-florian.pdf');
}

function actualizarTotalCatering(tipo) {
  const seleccionado = document.querySelector(`input[name="servicioCatering_${tipo}"]:checked`);
  const precioUnitario = parseFloat(seleccionado.dataset.precio);
  const personas = parseInt(document.getElementById(`cateringPersonas_${tipo}`).value) || 0;
  const total = precioUnitario * personas;
  document.getElementById(`totalCatering_${tipo}`).textContent = 'S/ ' + total.toFixed(2);
}

function obtenerSeleccionados(selectorClase) {
  return Array.from(document.querySelectorAll(selectorClase + ':checked')).map(el => el.dataset.etiqueta);
}

function agregarCateringAlCarrito(tipo, nombreEvento) {
  const seleccionado = document.querySelector(`input[name="servicioCatering_${tipo}"]:checked`);
  const precioUnitario = parseFloat(seleccionado.dataset.precio);
  const personas = parseInt(document.getElementById(`cateringPersonas_${tipo}`).value) || 0;
  const total = precioUnitario * personas;

  const postres = obtenerSeleccionados(`.catering-postre-${tipo}`);
  const cafes = obtenerSeleccionados(`.catering-cafe-${tipo}`);
  const preparaciones = obtenerSeleccionados(`.catering-prep-${tipo}`);
  const alergias = obtenerSeleccionados(`.catering-alergia-${tipo}`);

  let nombre = nombreEvento + ' - ' + seleccionado.labels[0].textContent.trim() + ' x' + personas + ' personas';
  if (postres.length > 0) nombre += ' | Postres: ' + postres.join(', ');
  if (cafes.length > 0) nombre += ' | Cafe: ' + cafes.join(', ');
  if (preparaciones.length > 0) nombre += ' | Preparacion: ' + preparaciones.join(', ');
  if (alergias.length > 0) nombre += ' | Restricciones: ' + alergias.join(', ');

  agregarAlCarrito(nombre, total);
}
