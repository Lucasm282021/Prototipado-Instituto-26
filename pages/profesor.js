// Ejemplo: confirmación al abrir recursos
document.querySelectorAll('.docente-recursos__lista a').forEach(link => {
  link.addEventListener('click', e => {
    const confirmado = confirm("¿Deseás abrir este recurso en una nueva pestaña?");
    if (!confirmado) e.preventDefault();
  });
});
