document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  const heroTitle = document.getElementById('hero-title');
  const heroSubtitle = document.getElementById('hero-subtitle');
  const nosotrosTitulo = document.getElementById('nosotros-titulo');
  const nosotrosDesc1 = document.getElementById('nosotros-desc-1');
  const nosotrosDesc2 = document.getElementById('nosotros-desc-2');
  const portfolioGrid = document.getElementById('portfolio-grid');
  const servicesGrid = document.getElementById('services-grid');
  
  const whatsappLinks = document.querySelectorAll('.js-whatsapp-link');
  const instagramLink = document.getElementById('js-instagram-link');
  const emailLink = document.getElementById('js-email-link');

  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.setAttribute('data-lucide', 'x');
      } else {
        icon.setAttribute('data-lucide', 'menu');
      }
      lucide.createIcons();
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
    
    window.addEventListener('scroll', () => {
      if (navMenu.classList.contains('active')) closeMenu();
    });

    function closeMenu() {
      navMenu.classList.remove('active');
      menuToggle.querySelector('i').setAttribute('data-lucide', 'menu');
      lucide.createIcons();
    }
  }

  // Carga de Datos desde datos.json
  fetch('datos.json')
    .then(response => {
      if (!response.ok) throw new Error('Error al cargar la base de datos local');
      return response.json();
    })
    .then(data => {
      // 1. Textos Generales
      if (heroTitle) heroTitle.textContent = data.textos.hero_titulo;
      if (heroSubtitle) heroSubtitle.textContent = data.textos.hero_subtitulo;
      if (nosotrosTitulo) nosotrosTitulo.textContent = data.textos.nosotros_titulo;
      if (nosotrosDesc1) nosotrosDesc1.textContent = data.textos.nosotros_descripcion_1;
      if (nosotrosDesc2) nosotrosDesc2.textContent = data.textos.nosotros_descripcion_2;

      // 2. Links de Contacto
      const telefono = data.contacto.telefono;
      const instagramUser = data.contacto.instagram;
      const correo = data.contacto.email;

      const msjWa = encodeURIComponent("Hola EcoBoost Móvil, necesito una cotización para mi vehículo.");
      
      whatsappLinks.forEach(link => {
        link.href = `https://wa.me/${telefono}?text=${msjWa}`;
      });

      if (instagramLink) instagramLink.href = `https://instagram.com/${instagramUser}`;
      if (emailLink) emailLink.href = `mailto:${correo}?subject=Cotización%20Mecánica%20a%20Domicilio`;

      // Renderizar Servicios
      if (servicesGrid && data.servicios) {
  servicesGrid.innerHTML = '';
  
  data.servicios.forEach(servicio => {
    const highlightClass = servicio.destacado ? 'highlight-card' : '';
    const colorClass = servicio.color_clase || 'green';
    const iconName = servicio.icono || 'wrench';

    // Generar la lista con el checkmark verde (check-circle2)
    const itemsHtml = servicio.items.map(item => `
      <li>
        <i data-lucide="check-circle-2"></i>
        <span>${item}</span>
      </li>
    `).join('');

    const serviceCard = `
      <div class="service-category-card ${highlightClass}">
        <div class="category-header">
          <div class="category-icon ${colorClass}">
            <i data-lucide="${iconName}"></i>
          </div>
          <h3>${servicio.titulo}</h3>
        </div>
        <ul class="service-list">
          ${itemsHtml}
        </ul>
      </div>
    `;
    servicesGrid.insertAdjacentHTML('beforeend', serviceCard);
  });

  // RE-INICIALIZACIÓN OBLIGATORIA DE LUCIDE ICONS TRAS INYECTAR HTML
  if (window.lucide) {
    lucide.createIcons();
  }
}

      // 4. Renderizar Portafolio Dinámico
      if (portfolioGrid && data.trabajos) {
        portfolioGrid.innerHTML = '';
        
        data.trabajos.forEach(trabajo => {
          const cardHtml = `
            <article class="portfolio-card">
              <div class="card-img-wrapper">
                <span class="card-tag">${trabajo.categoria}</span>
                <img src="${trabajo.imagen}" alt="${trabajo.titulo}" class="card-img" loading="lazy">
              </div>
              <div class="card-content">
                <h3 class="card-title">${trabajo.titulo}</h3>
                <p class="card-desc">${trabajo.descripcion}</p>
              </div>
            </article>
          `;
          portfolioGrid.insertAdjacentHTML('beforeend', cardHtml);
        });
      }

      // IMPORTANTE: Volver a compilar los iconos de Lucide cargados dinámicamente
      if (window.lucide) {
        lucide.createIcons();
      }
    })
    .catch(error => {
      console.error('Error inyectando datos dinámicos:', error);
      if (heroTitle) heroTitle.textContent = "La solución que potencia tu motor";
    });
});

if (window.netlifyIdentity) {
  window.netlifyIdentity.on("init", user => {
    if (!user) {
      window.netlifyIdentity.on("login", () => {
        document.location.href = "/admin/";
      });
    }
  });
}