document.addEventListener("DOMContentLoaded", () => {
  const main = document.getElementById("main-content");
  let galleryWindowClickListener = null; // Variable to hold the gallery modal click listener

  // 🚀 Función reutilizable para cargar páginas dinámicamente
  async function loadPage(url) {
    // Limpiar el listener de la galería anterior para evitar duplicados
    if (galleryWindowClickListener) {
      window.removeEventListener('click', galleryWindowClickListener);
      galleryWindowClickListener = null;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const html = await response.text();
      main.innerHTML = html;
      if (main.firstElementChild) {
        main.firstElementChild.classList.add("fade-in");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Si la página cargada es la galería, inicializamos su lógica
      if (url.includes("galeria.html")) {
        initGalleryPage();
      }

      // ✨ Mejora de accesibilidad: Mover el foco al nuevo contenido
      // Esto ayuda a los usuarios de lectores de pantalla a saber que la página cambió.
      const newHeading = main.querySelector('h1, h2, h3');
      if (newHeading) {
        newHeading.setAttribute('tabindex', '-1'); // Hacerlo enfocable programáticamente
        newHeading.focus();
      }
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
  // Obtener el overlay
  const overlay = document.querySelector('.overlay');


  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('nav__list--visible');
      const isExpanded = navMenu.classList.contains('nav__list--visible');
      navToggle.setAttribute('aria-expanded', isExpanded);
      document.body.classList.toggle('body--sidebar-open', isExpanded); // Activa/desactiva el scroll del body y el overlay
      if (overlay) {
        overlay.classList.toggle('overlay--visible', isExpanded);
      }
      // Si el menú se está cerrando, asegúrate de que vuelva al estado principal
      if (!isExpanded) {
        navMenu.classList.remove('nav__list--submenu-active');
      }
    });

    // Cierra el menú móvil al hacer clic en un enlace
    navMenu.addEventListener('click', (event) => {
        const link = event.target.closest('a');
        const submenuContainer = navMenu.querySelector('.nav__submenu-container');

        // Cierra el menú si se hace clic en un enlace que no sea un activador de submenú,
        // o si es un enlace dentro del submenú ya abierto.
        const isSubmenuLink = link && link.closest('.nav__submenu-container');
        const isMainMenuTrigger = link && link.closest('.nav__item--has-dropdown');

        if (link && !link.classList.contains('nav__dropdown-link--back') && (!isMainMenuTrigger || isSubmenuLink)) {
            navMenu.classList.remove('nav__list--visible');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('body--sidebar-open');
            if (overlay) {
              overlay.classList.remove('overlay--visible');
            }

            // Si el submenú estaba activo, lo resetea
            if (navMenu.classList.contains('nav__list--submenu-active')) {
                navMenu.classList.remove('nav__list--submenu-active');
                if (submenuContainer) submenuContainer.innerHTML = '';
            }
        }
    });
    


  }

    
  // 🔽 Activar comportamiento desplegable en ítems con dropdown
  const dropdownItems = document.querySelectorAll(".nav__item--has-dropdown");

  dropdownItems.forEach(item => {
    const trigger = item.querySelector('.nav__link');
    const submenu = item.querySelector('.nav__dropdown');
    const backButton = submenu.querySelector('.nav__dropdown-link--back');
    const submenuContainer = navMenu.querySelector('.nav__submenu-container');

    if (trigger && submenu) {
      trigger.addEventListener("click", event => {
        event.preventDefault();

        // Comportamiento para móvil: inyectar submenú
        if (window.innerWidth <= 768) {
          if (submenuContainer) {
            // Clonar el submenú para no perder los listeners originales
            submenuContainer.innerHTML = submenu.innerHTML;
            navMenu.classList.add('nav__list--submenu-active');

            // El botón "Volver" ahora está dentro del container, hay que buscarlo ahí
            const newBackButton = submenuContainer.querySelector('.nav__dropdown-link--back');
            if (newBackButton) {
              newBackButton.addEventListener('click', (e) => {
                e.preventDefault();
                navMenu.classList.remove('nav__list--submenu-active');
                // Limpiar el contenedor para la próxima vez
                submenuContainer.innerHTML = '';
              });
            }
          }
        } else {
          // Comportamiento de escritorio: mostrar/ocultar dropdown
          const isVisible = submenu.classList.toggle("show");
          trigger.setAttribute("aria-expanded", isVisible.toString());
        }
      });
    }
  });



  // 🧹 Limpiar estado del menú móvil al cambiar a vista de escritorio
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      if (navMenu && navMenu.classList.contains('nav__list--visible')) {
        navMenu.classList.remove('nav__list--visible');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('body--sidebar-open');
        if (overlay) {
          overlay.classList.remove('overlay--visible');
        }
        navMenu.classList.remove('nav__list--submenu-active');
        const submenuContainer = navMenu.querySelector('.nav__submenu-container');
        if (submenuContainer) submenuContainer.innerHTML = '';
      }
    }
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

    // ✨ Mejora de UX: Cerrar cualquier dropdown de escritorio abierto después de la navegación.
    // Esto es para el caso en que se haga clic en un enlace dentro de un dropdown (ej. Educativo -> Carreras).
    if (window.innerWidth > 768) {
      document.querySelectorAll(".nav__dropdown.show").forEach(menu => {
        menu.classList.remove("show");
        const trigger = menu.previousElementSibling;
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      });
    }
  });

  // === Modal de login: abrir, cerrar y accesibilidad ===
  const loginButton = document.getElementById('login-button');
  const loginButtonMobile = document.getElementById('login-button-mobile');
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

    if (loginButtonMobile) {
      loginButtonMobile.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    }

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
  
  // Cierra el menú móvil al hacer clic en el overlay
  if (overlay) {
    overlay.addEventListener('click', () => {
      navMenu.classList.remove('nav__list--visible');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('body--sidebar-open');
      overlay.classList.remove('overlay--visible');
      navMenu.classList.remove('nav__list--submenu-active'); // Resetea al menú principal
    });
  }

  // === Simulación de autenticación: alumno / profesor ===
  const logoutButton = document.getElementById('logout-button');
  const logoutButtonMobile = document.getElementById('logout-button-mobile');

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
    if (logoutButtonMobile) logoutButtonMobile.hidden = false;

    if (loginButton) loginButton.parentElement.hidden = true; // Oculta el <li> del botón de login de escritorio
    if (loginButtonMobile) loginButtonMobile.parentElement.hidden = true; // Oculta el <li> del botón de login móvil
  }

  function clearNavAuth() {
    if (navAlumno) navAlumno.hidden = true;
    if (navProfesor) navProfesor.hidden = true;
    if (logoutButton) logoutButton.hidden = true;
    if (logoutButtonMobile) logoutButtonMobile.hidden = true;

    if (loginButton) loginButton.parentElement.hidden = false;
    if (loginButtonMobile) loginButtonMobile.parentElement.hidden = false;
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

  if (logoutButtonMobile) {
    logoutButtonMobile.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('isfdyt_user');
      clearNavAuth();
      if (main) {
        loadPage('/pages/inicio.html');
      }
    });
  }

  // === Lógica para la página de Galería ===
  function initGalleryPage() {
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-image');
    const span = document.getElementsByClassName('close')[0];
    const filterButtons = document.querySelectorAll('.filter-button');
    const galleryGrid = document.querySelector('.gallery-grid');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Salir si los elementos no existen para no causar errores en otras páginas
    if (!modal || !galleryGrid || !span) {
      return;
    }

    // Delegación de eventos para los clics en las imágenes de la galería (más robusto)
    galleryGrid.addEventListener('click', event => {
        const clickedItem = event.target.closest('.gallery-item');
        if (clickedItem) {
            const image = clickedItem.querySelector('.gallery-item__image');
            if (image) {
                modal.style.display = 'block';
                modalImg.src = image.src;
            }
        }
    });

    // Clic en el botón de cerrar (X)
    span.onclick = function() {
        modal.style.display = 'none';
    }

    // Clic fuera de la imagen para cerrar el modal (versión mejorada)
    galleryWindowClickListener = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
    window.addEventListener('click', galleryWindowClickListener);

    // Lógica para los botones de filtro
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            // Botón activo
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filtrar imágenes
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
  }
});

// === Lógica de Acordeón para la página de Carreras ===
document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('main-content');

  // Usamos delegación de eventos en el contenedor principal
  mainContent.addEventListener('toggle', (event) => {
    // Nos aseguramos de que el evento provenga de un <details> de carrera
    if (event.target.matches('.carrera-item')) {
      // Si el elemento se está abriendo...
      if (event.target.open) {
        // ...buscamos todos los acordeones de carrera
        mainContent.querySelectorAll('.carrera-item').forEach((details) => {
          // Y cerramos todos los que no sean el que se acaba de abrir
          if (details !== event.target) {
            details.open = false;
          }
        });

        // ✨ Mejora de UX: Hacer scroll suavemente hasta el elemento que se abrió
        // El 'scroll-margin-top' en el CSS se encarga del offset del header.
        event.target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, true); // Usar 'capturing' para que se ejecute antes de otros posibles 'toggle' listeners.
});