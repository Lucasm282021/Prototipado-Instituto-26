// Activar comportamiento desplegable en ítems con clase .dropdown
const dropdownTriggers = document.querySelectorAll('.dropdown > a');

dropdownTriggers.forEach(trigger => {
    trigger.addEventListener('click', event => {
        event.preventDefault();

        const currentMenu = trigger.nextElementSibling;

        // Cerrar todos los dropdowns excepto el actual
        document.querySelectorAll('.dropdown-content').forEach(menu => {
        if (menu !== currentMenu) {
            menu.classList.remove('show');
        }
        });

        // Alternar visibilidad del menú actual
        currentMenu.classList.toggle('show');
        });
    });
// Cerrar todos los dropdowns si se hace clic fuera del área de navegación
document.addEventListener('click', event => {
    const clickedInsideDropdown = event.target.closest('.dropdown');
    if (!clickedInsideDropdown) {
        document.querySelectorAll('.dropdown-content').forEach(menu => {
        menu.classList.remove('show');
        });
    }
});
