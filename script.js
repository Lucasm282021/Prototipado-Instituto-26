document.addEventListener("DOMContentLoaded", () => {
  const main = document.getElementById("main-content");

  // 🚀 Función reutilizable para cargar páginas dinámicamente
  async function loadPage(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const html = await response.text();
      main.innerHTML = html;
      if (main.firstElementChild) {
        main.firstElementChild.classList.add("fade-in");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      main.innerHTML = `<p>Error al cargar la sección: ${url}</p>`;
      console.error("Error al cargar contenido:", error);
    }
  }

  // ✅ Cargar contenido inicial por defecto
  loadPage("/pages/inicio.html");

  // 🍔 Menú de hamburguesa para móvil
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('nav__list--show');
      const isExpanded = navMenu.classList.contains('nav__list--show');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Cierra el menú móvil al hacer clic en un enlace
    navMenu.addEventListener('click', (event) => {
        if (event.target.closest('a')) {
            navMenu.classList.remove('nav__list--show');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });


  }

    
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

  // 📦 Carga dinámica de contenido usando delegación de eventos
  // Esto funciona para los enlaces de navegación y también para los enlaces cargados dinámicamente (ej. en inicio.html)
  document.addEventListener("click", async (event) => {
    // Busca el enlace más cercano al elemento clickeado
    const link = event.target.closest("a");

    // Si no es un enlace o no tiene un href válido, no hacemos nada
    if (!link || !link.href) return;

    // Solo interceptamos enlaces internos que cargan páginas .html
    // Los enlaces a '#' (para dropdowns) o enlaces externos (target="_blank") se ignoran.
    const href = link.getAttribute("href");
    if (!href || href === "#" || !href.endsWith(".html") || link.target === "_blank") {
      return;
    }

    // Prevenimos la navegación normal del navegador
    event.preventDefault();

    loadPage(href);
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

    // Se ha eliminado el cierre del modal al hacer clic en el overlay para evitar cierres accidentales.

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

  // === Simulación de autenticación: alumno / profesor ===
  const logoutButton = document.getElementById('logout-button');
  const navAlumno = document.getElementById('nav-alumno');
  const navProfesor = document.getElementById('nav-profesor');
  const loginForm = document.querySelector('.modal__form');

  // Credenciales simuladas (para demo). En producción no usar así.
  const USERS = [
    { username: 'alumno', password: 'alumno123', role: 'alumno' },
    { username: 'profesor', password: 'profesor123', role: 'profesor' }
  ];

  function updateNavForRole(role) {
    if (navAlumno) navAlumno.hidden = role !== 'alumno';
    if (navProfesor) navProfesor.hidden = role !== 'profesor';
    // Mostrar logout y ocultar login
    if (logoutButton) {
      logoutButton.hidden = false;
      logoutButton.style.display = '';
    }
    if (loginButton) loginButton.hidden = true;
  }

  function clearNavAuth() {
    if (navAlumno) navAlumno.hidden = true;
    if (navProfesor) navProfesor.hidden = true;
    if (logoutButton) logoutButton.hidden = true;
    if (loginButton) loginButton.hidden = false;
  }

  // Restaurar sesión si existe
  const saved = sessionStorage.getItem('isfdyt_user');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.role) updateNavForRole(parsed.role);
    } catch (e) {
      sessionStorage.removeItem('isfdyt_user');
    }
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;
      const role = document.getElementById('role').value;

      // Buscar credencial simulada
      const user = USERS.find(u => u.username === username && u.password === password && u.role === role);
      if (user) {
        // Guardar sesión
        sessionStorage.setItem('isfdyt_user', JSON.stringify({ username: user.username, role: user.role }));
        updateNavForRole(user.role);
        // Cerrar modal
        if (loginModal) {
          // usar la función closeModal si está en el scope
          const closeBtn = loginModal.querySelector('.modal__close');
          if (closeBtn) closeBtn.click();
        }
        // Redirigir al área correspondiente
        if (user.role === 'alumno') {
          loadPage('/pages/alumno.html');
        } else if (user.role === 'profesor') {
          loadPage('/pages/profesor.html');
        }
      } else {
        alert('Credenciales inválidas. Para demo usa: alumno/alumno123 o profesor/profesor123 (y selecciona el tipo).');
      }
    });
  }

  // Manejo de cierre mediante evento personalizado (si closeModal no es accesible)
  if (loginModal) {
    loginModal.addEventListener('closeModalRequest', () => {
      // Intentar simular click en el close o cerrar con la función local
      const closeBtn = loginModal.querySelector('.modal__close');
      if (closeBtn) closeBtn.click();
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('isfdyt_user');
      clearNavAuth();
      // Volver a la página de inicio
      if (main) {
        loadPage('/pages/inicio.html');
      }
    });
  }
});
