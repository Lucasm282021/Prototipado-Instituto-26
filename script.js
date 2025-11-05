document.addEventListener("DOMContentLoaded", () => {
  const main = document.getElementById("main-content");
  let galleryWindowClickListener = null;

  // --- Definición de Rutas ---
  const routes = {
    "/": "/pages/inicio.html",
    "/inicio": "/pages/inicio.html",
    "/noticias": "/pages/noticias.html",
    "/institucional": "/pages/institucional.html",
    "/carreras": "/pages/carreras.html",
    "/ofertas-academicas": "/pages/ofertas-academicas.html",
    "/inscripcion": "/pages/inscripcion.html",
    "/clases-virtuales": "/pages/clases-virtuales.html",
    "/galeria": "/pages/galeria.html",
    "/alumno": "/pages/alumno.html",
    "/profesor": "/pages/profesor.html"
  };

  // --- Lógica de Carga de Página ---
  async function loadPage(path) {
    // Limpia listeners de la página anterior para evitar duplicados
    if (galleryWindowClickListener) {
      window.removeEventListener('click', galleryWindowClickListener);
      galleryWindowClickListener = null;
    }

    const contentFile = routes[path] || "/pages/construction.html"; // Página de fallback

    try {
      const response = await fetch(contentFile);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const html = await response.text();
      main.innerHTML = html;
      if (main.firstElementChild) {
        main.firstElementChild.classList.add("fade-in");
      }

      // Inicializa la lógica específica de la página cargada
      if (contentFile.includes("galeria.html")) {
        initGalleryPage();
      }

      // Mejora de accesibilidad: enfocar el nuevo contenido
      const newHeading = main.querySelector('h1, h2, h3');
      if (newHeading) {
        newHeading.setAttribute('tabindex', '-1');
        newHeading.focus();
      }
    } catch (error) {
      main.innerHTML = `<p>Error al cargar la sección: ${path}</p>`;
      console.error("Error al cargar contenido:", error);
    }
  }

  // --- Manejo de Navegación ---
  function navigate(path) {
    window.location.hash = path;
  }

  // Maneja la carga inicial y los cambios de hash
  function handleLocation() {
    const path = window.location.hash.substring(1) || "/";
    loadPage(path);
  }
  window.addEventListener('hashchange', handleLocation);


  // Intercepta todos los clics para manejar la navegación interna
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    // Ignora enlaces externos, anclas, o sin href
    if (!href || link.target === "_blank" || href.startsWith("#") || href.startsWith("mailto:")) {
      return;
    }

    event.preventDefault();
    const newPath = new URL(link.href).pathname.replace("/pages", "").replace(".html", "");
    navigate(newPath);
  });

  // --- Lógica de la Galería ---
  function initGalleryPage() {
    const galleryGrid = document.querySelector('.gallery-grid');
    const filterButtons = document.querySelectorAll('.filter-button');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!galleryGrid) return;

    function showModal(images, initialIndex) {
      let currentIndex = initialIndex;

      const modalBackdrop = document.createElement('div');
      modalBackdrop.style.position = 'fixed';
      modalBackdrop.style.top = '0';
      modalBackdrop.style.left = '0';
      modalBackdrop.style.width = '100%';
      modalBackdrop.style.height = '100%';
      modalBackdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
      modalBackdrop.style.display = 'flex';
      modalBackdrop.style.justifyContent = 'center';
      modalBackdrop.style.alignItems = 'center';
      modalBackdrop.style.zIndex = '2000';
      modalBackdrop.style.cursor = 'pointer';

      const modalContent = document.createElement('img');
      modalContent.style.maxWidth = '90vw'; /* Aumentado para dar más espacio a la imagen */
      modalContent.style.maxHeight = '90vh'; /* Aumentado para dar más espacio a la imagen */
      modalContent.style.objectFit = 'contain';
      modalContent.style.cursor = 'default';

      const closeButton = document.createElement('span');
      closeButton.textContent = '✕'; /* Usar un carácter 'X' más universal */
      closeButton.style.position = 'absolute';
      closeButton.style.top = '15px';
      closeButton.style.right = '35px';
      closeButton.style.color = '#fff';
      closeButton.style.fontSize = '40px';
      closeButton.style.fontWeight = 'bold';
      closeButton.style.cursor = 'pointer';

      const prevButton = document.createElement('button');
      prevButton.innerHTML = `<img src="/images/botones/boron-retroceder-white.png" alt="Anterior">`;
      prevButton.className = 'modal-nav-button modal-prev-button';

      const nextButton = document.createElement('button');
      nextButton.innerHTML = `<img src="/images/botones/boron-siguiente-white.png" alt="Siguiente">`;
      nextButton.className = 'modal-nav-button modal-next-button';

      function updateImage() {
        modalContent.src = images[currentIndex];
      }

      prevButton.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
        updateImage();
      });

      nextButton.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
        updateImage();
      });

      modalBackdrop.appendChild(prevButton);
      modalBackdrop.appendChild(modalContent);
      modalBackdrop.appendChild(nextButton);
      modalBackdrop.appendChild(closeButton);
      document.body.appendChild(modalBackdrop);

      updateImage();

      const closeModal = () => {
        document.body.removeChild(modalBackdrop);
      };

      closeButton.addEventListener('click', closeModal);
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
          closeModal();
        }
      });
    }

    galleryGrid.addEventListener('click', event => {
      const clickedItem = event.target.closest('.gallery-item');
      if (clickedItem) {
        const allVisibleItems = [...galleryItems].filter(item => item.style.display !== 'none');
        const images = allVisibleItems.map(item => item.querySelector('.gallery-item__image').src);
        const clickedImage = clickedItem.querySelector('.gallery-item__image');
        if (clickedImage) {
          const clickedIndex = images.findIndex(src => src === clickedImage.src);
          showModal(images, clickedIndex);
        }
      }
    });

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        galleryItems.forEach(item => {
          item.style.display = (filter === 'all' || item.getAttribute('data-category') === filter) ? 'block' : 'none';
        });
      });
    });
  }

  // ... (El resto del código para menú, login, etc., se mantiene igual) ...
  
  // Menú de hamburguesa para móvil
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const overlay = document.querySelector('.overlay');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('nav__list--visible');
      const isExpanded = navMenu.classList.contains('nav__list--visible');
      navToggle.setAttribute('aria-expanded', isExpanded);
      document.body.classList.toggle('body--sidebar-open', isExpanded);
      if (overlay) {
        overlay.classList.toggle('overlay--visible', isExpanded);
      }
      if (!isExpanded) {
        navMenu.classList.remove('nav__list--submenu-active');
      }
    });

    navMenu.addEventListener('click', (event) => {
        const link = event.target.closest('a');
        const submenuContainer = navMenu.querySelector('.nav__submenu-container');
        const isSubmenuLink = link && link.closest('.nav__submenu-container');
        const isMainMenuTrigger = link && link.closest('.nav__item--has-dropdown');

        if (link && !link.classList.contains('nav__dropdown-link--back') && (!isMainMenuTrigger || isSubmenuLink)) {
            navMenu.classList.remove('nav__list--visible');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('body--sidebar-open');
            if (overlay) {
              overlay.classList.remove('overlay--visible');
            }
            if (navMenu.classList.contains('nav__list--submenu-active')) {
                navMenu.classList.remove('nav__list--submenu-active');
                if (submenuContainer) submenuContainer.innerHTML = '';
            }
        }
    });
  }
    
  // Comportamiento desplegable
  const dropdownItems = document.querySelectorAll(".nav__item--has-dropdown");
  dropdownItems.forEach(item => {
    const trigger = item.querySelector('.nav__link');
    const submenu = item.querySelector('.nav__dropdown');
    if (trigger && submenu) {
      trigger.addEventListener("click", event => {
        event.preventDefault();
        if (window.innerWidth <= 768) {
          const submenuContainer = navMenu.querySelector('.nav__submenu-container');
          if (submenuContainer) {
            submenuContainer.innerHTML = submenu.innerHTML;
            navMenu.classList.add('nav__list--submenu-active');
            const newBackButton = submenuContainer.querySelector('.nav__dropdown-link--back');
            if (newBackButton) {
              newBackButton.addEventListener('click', (e) => {
                e.preventDefault();
                navMenu.classList.remove('nav__list--submenu-active');
                submenuContainer.innerHTML = '';
              });
            }
          }
        } else {
          const isVisible = submenu.classList.toggle("show");
          trigger.setAttribute("aria-expanded", isVisible.toString());
        }
      });
    }
  });

  // Limpiar estado del menú al redimensionar
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      if (navMenu && navMenu.classList.contains('nav__list--visible')) {
        navMenu.classList.remove('nav__list--visible');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('body--sidebar-open');
        if (overlay) overlay.classList.remove('overlay--visible');
        navMenu.classList.remove('nav__list--submenu-active');
        const submenuContainer = navMenu.querySelector('.nav__submenu-container');
        if (submenuContainer) submenuContainer.innerHTML = '';
      }
    }
  });

  // Cerrar dropdowns si se hace clic fuera
  document.addEventListener("click", event => {
    if (!event.target.closest(".nav__item--has-dropdown")) {
      document.querySelectorAll(".nav__dropdown.show").forEach(menu => {
        menu.classList.remove("show");
        const trigger = menu.previousElementSibling;
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      });
    }
  });

  // Modal de login
  const loginButton = document.getElementById('login-button');
  const loginButtonMobile = document.getElementById('login-button-mobile');
  const loginModal = document.getElementById('login-modal');
  const modalClose = document.querySelector('.modal__close');

  if (loginButton && loginModal) {
    // ... (lógica del modal de login sin cambios)
  }
  
  // Cierra el menú móvil al hacer clic en el overlay
  if (overlay) {
    overlay.addEventListener('click', () => {
      navMenu.classList.remove('nav__list--visible');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('body--sidebar-open');
      overlay.classList.remove('overlay--visible');
      navMenu.classList.remove('nav__list--submenu-active');
    });
  }

  // Simulación de autenticación
  // ... (lógica de autenticación sin cambios)

  // Carga inicial de la página
  handleLocation();
});

// Lógica de Acordeón para la página de Carreras
document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('main-content');
  mainContent.addEventListener('toggle', (event) => {
    if (event.target.matches('.carrera-item')) {
      if (event.target.open) {
        mainContent.querySelectorAll('.carrera-item').forEach((details) => {
          if (details !== event.target) {
            details.open = false;
          }
        });
        event.target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, true);
});
