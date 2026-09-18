// Seleccionamos los elementos que van a tener comportamiento interactivo.
const temaBtn = document.querySelector('#temaBtn');
const buscador = document.querySelector('#buscar');
const filtros = document.querySelectorAll('.filtro');
const articulos = document.querySelectorAll('.tarjeta');
const sinResultados = document.querySelector('#sinResultados');
const formulario = document.querySelector('#formContacto');
const estadoFormulario = document.querySelector('#estadoFormulario');

// Recuperamos la preferencia del tema guardada en el navegador.
if (localStorage.getItem('tema') === 'oscuro') {
  document.body.classList.add('oscuro');
  temaBtn.textContent = '☀️ Modo claro';
}

// Alterna entre modo claro y oscuro y recuerda la elección con localStorage.
temaBtn.addEventListener('click', () => {
  document.body.classList.toggle('oscuro');
  const oscuro = document.body.classList.contains('oscuro');
  temaBtn.textContent = oscuro ? '☀️ Modo claro' : '🌙 Modo oscuro';
  localStorage.setItem('tema', oscuro ? 'oscuro' : 'claro');
});

let categoriaActiva = 'todos';

// Esta función combina el filtro de categoría con el texto escrito en el buscador.
function actualizarArticulos() {
  const texto = buscador.value.trim().toLowerCase();
  let visibles = 0;
  articulos.forEach((articulo) => {
    const coincideCategoria = categoriaActiva === 'todos' || articulo.dataset.categoria === categoriaActiva;
    const coincideTexto = articulo.textContent.toLowerCase().includes(texto);
    const mostrar = coincideCategoria && coincideTexto;
    articulo.hidden = !mostrar;
    if (mostrar) visibles++;
  });
  sinResultados.hidden = visibles !== 0;
}

// Al pulsar un filtro, se marca como activo y se actualiza la lista.
filtros.forEach((boton) => {
  boton.addEventListener('click', () => {
    filtros.forEach((f) => f.classList.remove('activo'));
    boton.classList.add('activo');
    categoriaActiva = boton.dataset.filtro;
    actualizarArticulos();
  });
});

// El evento input permite filtrar mientras el usuario escribe.
buscador.addEventListener('input', actualizarArticulos);

// Cada botón Leer más abre o cierra el contenido adicional de su propia tarjeta.
document.querySelectorAll('.leer').forEach((boton) => {
  boton.addEventListener('click', () => {
    const tarjeta = boton.closest('.tarjeta');
    const abierta = tarjeta.classList.toggle('abierta');
    boton.textContent = abierta ? 'Leer menos' : 'Leer más';
    boton.setAttribute('aria-expanded', String(abierta));
  });
});

// Validación del formulario en el lado del cliente. No se transmiten datos a ningún servidor.
formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const nombre = document.querySelector('#nombre').value.trim();
  const email = document.querySelector('#email').value.trim();
  const mensaje = document.querySelector('#mensaje').value.trim();
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  estadoFormulario.className = 'estado error';
  if (nombre.length < 2) return estadoFormulario.textContent = 'Escribe un nombre válido.';
  if (!emailValido) return estadoFormulario.textContent = 'Introduce un correo electrónico válido.';
  if (mensaje.length < 10) return estadoFormulario.textContent = 'El mensaje debe tener al menos 10 caracteres.';

  estadoFormulario.className = 'estado correcto';
  estadoFormulario.textContent = `Gracias, ${nombre}. El formulario se ha validado correctamente.`;
  formulario.reset();
});
