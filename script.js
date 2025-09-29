document.addEventListener("DOMContentLoaded", () => {
  const main = document.getElementById("main-content");

  // 🔽 Activar comportamiento desplegable en ítems con dropdown
  const dropdownTriggers = document.querySelectorAll(".nav__item--has-dropdown > .nav__link");

  dropdownTriggers.forEach(trigger => {
    trigger.addEventListener("click", event => {
      event.preventDefault();
      const currentMenu = trigger.nextElementSibling;

      // Cerrar todos los dropdowns excepto el actual
      document.querySelectorAll(".nav__dropdown").forEach(menu => {
        if (menu !== currentMenu) {
          menu.classList.remove("show");
          menu.previousElementSibling.setAttribute("aria-expanded", "false");
        }
      });

      // Alternar visibilidad del menú actual
      const isVisible = currentMenu.classList.toggle("show");
      trigger.setAttribute("aria-expanded", isVisible.toString());
    });
  });

  // 🔒 Cerrar dropdowns si se hace clic fuera
  document.addEventListener("click", event => {
    if (!event.target.closest(".nav__item--has-dropdown")) {
      document.querySelectorAll(".nav__dropdown").forEach(menu => {
        menu.classList.remove("show");
        const trigger = menu.previousElementSibling;
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      });
    }
  });

  // 📦 Carga dinámica de secciones en el <main>
  const navLinks = document.querySelectorAll(".nav__link, .nav__dropdown-link");

  navLinks.forEach(link => {
    link.addEventListener("click", async event => {
      event.preventDefault();
      const href = link.getAttribute("href");

      // Ignorar enlaces vacíos o #
      if (!href || href === "#" || !href.endsWith(".html")) return;

      try {
        const response = await fetch(href);
        const html = await response.text();
        main.innerHTML = html;

        // Aplicar animación de entrada
        if (main.firstElementChild) {
          main.firstElementChild.classList.add("fade-in");
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        main.innerHTML = `<p>Error al cargar la sección: ${href}</p>`;
        console.error("Error al cargar contenido:", error);
      }
    });
  });
});
