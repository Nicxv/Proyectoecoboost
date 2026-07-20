document.addEventListener('DOMContentLoaded', () => {
  // Inicializamos librería de iconos Lucide
  if (window.lucide) {
    lucide.createIcons();
  }

  // Elementos del DOM a inyectar
  const heroTitle = document.getElementById('hero-title');
  const heroSubtitle = document.getElementById('hero-subtitle');
  const nosotrosTitulo = document.getElementById('nosotros-titulo');
  const nosotrosDesc1 = document.getElementById('nosotros-desc-1');
  const nosotrosDesc2 = document.getElementById('nosotros-desc-2');
  const portfolioGrid = document.getElementById('portfolio-grid');
  
  // Elementos de Links Dinámicos
  const whatsappLinks = document.querySelectorAll('.js-whatsapp-link');
  const instagramLink = document.getElementById('js-instagram-link');
  const emailLink = document.getElementById('js-email-link');

  // Funciones del Menú Mobile
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

    // Cerrar menú al hacer click en un link móvil
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
    
    // Cerrar menú si el usuario hace scroll
    window.addEventListener('scroll', () => {
      if (navMenu.classList.contains('active')) {
        closeMenu();
      }
    });

    function closeMenu() {
        navMenu.classList.remove('active');
        menuToggle.querySelector('i').setAttribute('data-lucide', 'menu');
        lucide.createIcons();
    }
  }

  // Fetch de Datos Dinámicos
  fetch('datos.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al cargar la base de datos local');
      }
      return response.json();
    })
    .then(data => {
      // 1. Inyectar Textos Generales
      if (heroTitle) heroTitle.textContent = data.textos.hero_titulo;
      if (heroSubtitle) heroSubtitle.textContent = data.textos.hero_subtitulo;
      if (nosotrosTitulo) nosotrosTitulo.textContent = data.textos.nosotros_titulo;
      if (nosotrosDesc1) nosotrosDesc1.textContent = data.textos.nosotros_descripcion_1;
      if (nosotrosDesc2) nosotrosDesc2.textContent = data.textos.nosotros_descripcion_2;

      // 2. Configurar Links Inteligentes
      const telefono = data.contacto.telefono;
      const instagramUser = data.contacto.instagram;
      const correo = data.contacto.email;

      // CAMBIO AQUÍ: Nombre actualizado a EcoBoost Móvil sin mención a DPF
      const msjWa = encodeURIComponent("Hola EcoBoost Móvil, necesito una cotización para mi vehículo.");
      
      whatsappLinks.forEach(link => {
        link.href = `https://wa.me/${telefono}?text=${msjWa}`;
      });

      if (instagramLink) {
        instagramLink.href = `https://instagram.com/${instagramUser}`;
      }

      if (emailLink) {
        emailLink.href = `mailto:${correo}?subject=Cotización%20Mecánica%20a%20Domicilio`;
      }

      // 3. Renderizar Portafolio Dinámico
      if (portfolioGrid && data.trabajos) {
        portfolioGrid.innerHTML = ''; // Limpiar cargando original
        
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
    })
    .catch(error => {
      console.error('Error inyectando datos dinámicos:', error);
      if (heroTitle) heroTitle.textContent = "La solución que potencia tu motor";
    });
});

// ==========================================
// REDIRECCIÓN DE NETLIFY IDENTITY PARA EL CMS
// ==========================================
if (window.netlifyIdentity) {
  window.netlifyIdentity.on("init", user => {
    if (!user) {
      window.netlifyIdentity.on("login", () => {
        document.location.href = "/admin/";
      });
    }
  });
}