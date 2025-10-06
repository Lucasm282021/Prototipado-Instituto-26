document.addEventListener("DOMContentLoaded", () => {
  const main = document.getElementById("main-content");

  // ✅ Cargar contenido inicial por defecto
  fetch("/pages/inicio.html")
    .then(response => response.text())
    .then(html => {
      main.innerHTML = html;
      if (main.firstElementChild) {
        main.firstElementChild.classList.add("fade-in");
      }
    })
    .catch(error => {
      main.innerHTML = "<p>Error al cargar la página de inicio.</p>";
      console.error("Error al cargar /pages/inicio.html:", error);
    });
    
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

  // === Modal de login: abrir, cerrar y accesibilidad ===
  const loginButton = document.getElementById('login-button');
  const loginModal = document.getElementById('login-modal');
  const modalClose = document.querySelector('.modal__close');

  if (loginButton && loginModal) {
    const focusableSelectors = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]';
    let lastFocused = null;

    function openModal() {
      lastFocused = document.activeElement;
      loginModal.removeAttribute('hidden');
      // Allow CSS transition to apply
      requestAnimationFrame(() => loginModal.classList.add('modal--visible'));
      document.body.style.overflow = 'hidden'; // evitar scroll de fondo
      // trap focus to first focusable element inside modal
      const firstFocusable = loginModal.querySelector(focusableSelectors);
      if (firstFocusable) firstFocusable.focus();
      loginModal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
      loginModal.classList.remove('modal--visible');
      // esperar la transición antes de ocultar
      loginModal.addEventListener('transitionend', function handler() {
        loginModal.setAttribute('hidden', '');
        document.body.style.overflow = ''; // restaurar scroll
        if (lastFocused) lastFocused.focus();
        loginModal.removeEventListener('transitionend', handler);
      });
      loginModal.setAttribute('aria-hidden', 'true');
    }

    loginButton.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });

    if (modalClose) {
      modalClose.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
      });
    }

    // Cerrar al hacer click fuera del contenido (overlay)
    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) {
        closeModal();
      }
    });

    // Cerrar con ESC y trap simple de tab
    document.addEventListener('keydown', (e) => {
      if (loginModal.hasAttribute('hidden')) return;
      if (e.key === 'Escape' || e.key === 'Esc') {
        closeModal();
      } else if (e.key === 'Tab') {
        // manejo simple de focus trap
        const focusable = Array.from(loginModal.querySelectorAll(focusableSelectors)).filter(el => el.offsetParent !== null);
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    });
  }
});
