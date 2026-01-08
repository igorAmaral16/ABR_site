// ====================
// SISTEMA DE TEMA AVANÇADO
// ====================

class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || this.getSystemPreference();
    this.transitionDuration = 300;
    this.init();
  }

  init() {
    this.applyTheme();
    this.setupEventListeners();
    this.setupTransition();
    this.setupThemePreferences();
    this.addDarkModeUtilities();
    this.monitorThemePerformance();
  }

  getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  applyTheme() {
    const startTime = Date.now();

    // Adicionar classe de carregamento
    document.body.classList.add('theme-loading');

    // Remover ambas as classes primeiro
    document.body.classList.remove('light-mode', 'dark-mode');

    // Adicionar classe do tema atual
    if (this.theme === 'dark') {
      document.body.classList.add('dark-mode');
      document.body.style.setProperty('--theme-transition', `${this.transitionDuration}ms`);
    } else {
      document.body.classList.add('light-mode');
    }

    // Atualizar ícone
    this.updateIcon();

    // Ajustar imagens para o tema
    this.adjustImagesForTheme();

    // Salvar preferência
    localStorage.setItem('theme', this.theme);

    // Disparar evento customizado
    document.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme: this.theme }
    }));

    // Remover classe de carregamento
    setTimeout(() => {
      document.body.classList.remove('theme-loading');
    }, this.transitionDuration);

    // Log de performance
    const elapsed = Date.now() - startTime;
    if (elapsed > 50) {
      console.warn(`Aplicação do tema levou ${elapsed}ms`);
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme();

    // Feedback tátil
    this.provideHapticFeedback();

    // Análise de uso
    this.trackThemeUsage();
  }

  updateIcon() {
    const toggleBtn = document.getElementById('darkModeToggle');
    if (!toggleBtn) return;

    if (this.theme === 'dark') {
      toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      toggleBtn.setAttribute('aria-label', 'Alternar para modo claro');
      toggleBtn.setAttribute('title', 'Modo claro');
      toggleBtn.setAttribute('aria-pressed', 'true');
    } else {
      toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
      toggleBtn.setAttribute('aria-label', 'Alternar para modo escuro');
      toggleBtn.setAttribute('title', 'Modo escuro');
      toggleBtn.setAttribute('aria-pressed', 'false');
    }
  }

  adjustImagesForTheme() {
    const images = document.querySelectorAll('.product-image, .product-card img');
    images.forEach(img => {
      if (this.theme === 'dark') {
        // Ajustar contraste para modo escuro
        img.style.filter = 'brightness(0.9) contrast(1.1)';
      } else {
        img.style.filter = 'none';
      }
    });
  }

  setupEventListeners() {
    // Botão de toggle do tema
    const toggleBtn = document.getElementById('darkModeToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Listener para mudanças na preferência do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.theme = e.matches ? 'dark' : 'light';
        this.applyTheme();
      }
    });
  }

  setupTransition() {
    const style = document.createElement('style');
    style.textContent = `
      .theme-loading * {
        transition: background-color var(--theme-transition, 300ms) ease,
                    color var(--theme-transition, 300ms) ease,
                    border-color var(--theme-transition, 300ms) ease,
                    box-shadow var(--theme-transition, 300ms) ease !important;
      }
    `;
    document.head.appendChild(style);
  }

  setupThemePreferences() {
    // Aplicar tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.theme = savedTheme;
      this.applyTheme();
    }
  }

  addDarkModeUtilities() {
    // Adicionar utilitários CSS para modo escuro
    const style = document.createElement('style');
    style.textContent = `
      [data-theme="dark"] {
        --bg-primary: var(--dark-bg-primary);
        --bg-secondary: var(--dark-bg-secondary);
        --bg-tertiary: var(--dark-bg-tertiary);
        --surface: var(--dark-surface);
        --surface-hover: var(--dark-surface-hover);
        --border: var(--dark-border);
        --border-light: var(--dark-border-light);
        --text-primary: var(--dark-text-primary);
        --text-secondary: var(--dark-text-secondary);
        --text-muted: var(--dark-text-muted);
        --primary: var(--dark-primary);
        --primary-hover: var(--dark-primary-hover);
        --accent: var(--dark-accent);
        --success: var(--dark-success);
        --warning: var(--dark-warning);
        --shadow-sm: var(--dark-shadow-sm);
        --shadow-md: var(--dark-shadow-md);
        --shadow-lg: var(--dark-shadow-lg);
        --shadow-xl: var(--dark-shadow-xl);
        --shadow-blue: var(--dark-shadow-blue);
      }
    `;
    document.head.appendChild(style);
  }

  monitorThemePerformance() {
    // Monitorar performance das mudanças de tema
    let themeChangeCount = 0;
    const originalApplyTheme = this.applyTheme;
    this.applyTheme = function () {
      themeChangeCount++;
      const startTime = Date.now();
      originalApplyTheme.call(this);
      const duration = Date.now() - startTime;
      console.log(`Tema alterado ${themeChangeCount} vezes. Duração: ${duration}ms`);
    };
  }

  provideHapticFeedback() {
    // Feedback tátil se disponível
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  trackThemeUsage() {
    // Rastrear uso do tema para analytics
    const themeUsage = JSON.parse(localStorage.getItem('themeUsage') || '{}');
    themeUsage[this.theme] = (themeUsage[this.theme] || 0) + 1;
    localStorage.setItem('themeUsage', JSON.stringify(themeUsage));
  }
}

// ====================
// GERENCIADOR DE PRODUTOS
// ====================

class ProductManager {
  constructor() {
    this.products = [
      {
        id: 'oring',
        title: 'Anéis O\'Ring',
        titlePt: 'Anéis O\'Ring',
        titleEn: 'O-Ring Seals',
        titleEs: 'Anillos O-Ring',
        description: 'Vedação circular em elastômero para aplicações diversas em sistemas hidráulicos e pneumáticos.',
        descriptionPt: 'Vedação circular em elastômero para aplicações diversas em sistemas hidráulicos e pneumáticos.',
        descriptionEn: 'Circular seal made of elastomer for various applications in hydraulic and pneumatic systems.',
        descriptionEs: 'Sello circular fabricado en elastómero para diversas aplicaciones en sistemas hidráulicos y neumáticos.',
        image: 'assets/ANEL_ORING.webp',
        category: 'Vedadores Especiais',
        categoryPt: 'Vedadores Especiais',
        categoryEn: 'Special Seals',
        categoryEs: 'Sellos Especiales'
      },
      {
        id: 'd229',
        title: 'Junta do Cabeçote D229',
        titlePt: 'Junta do Cabeçote D229',
        titleEn: 'Cylinder Head Gasket D229',
        titleEs: 'Empaque de Culata D229',
        description: 'Junta de cabeçote para motor D229, construída em aço multicamadas, projetada para vedar câmaras de combustão, dutos de óleo e canais de arrefecimento entre bloco e cabeçote, suportando altas temperaturas e pressão de trabalho.',
        descriptionPt: 'Junta de cabeçote para motor D229, construída em aço multicamadas, projetada para vedar câmaras de combustão, dutos de óleo e canais de arrefecimento entre bloco e cabeçote, suportando altas temperaturas e pressão de trabalho.',
        descriptionEn: 'Cylinder head gasket for D229 engine, constructed of multi-layered steel, designed to seal combustion chambers, oil ducts and cooling channels between block and cylinder head, withstanding high temperatures and working pressure.',
        descriptionEs: 'Empaque de culata para motor D229, construido en acero multicapa, diseñado para sellar cámaras de combustión, conductos de aceite y canales de enfriamiento entre bloque y culata, soportando altas temperaturas y presión de trabajo.',
        image: 'assets/D229.webp',
        category: 'Junta do Cabeçote',
        categoryPt: 'Junta do Cabeçote',
        categoryEn: 'Cylinder Head Gasket',
        categoryEs: 'Empaque de Culata'
      },
      {
        id: 'x10',
        title: 'Junta do Cabeçote X10',
        titlePt: 'Junta do Cabeçote X10',
        titleEn: 'Cylinder Head Gasket X10',
        titleEs: 'Empaque de Culata X10',
        description: 'Junta de cabeçote para motor X10, construída em aço multicamadas, projetada para vedar câmaras de combustão, dutos de óleo e canais de arrefecimento entre bloco e cabeçote, suportando altas temperaturas e pressão de trabalho.',
        descriptionPt: 'Junta de cabeçote para motor X10, construída em aço multicamadas, projetada para vedar câmaras de combustão, dutos de óleo e canais de arrefecimento entre bloco e cabeçote, suportando altas temperaturas e pressão de trabalho.',
        descriptionEn: 'Cylinder head gasket for X10 engine, constructed of multi-layered steel, designed to seal combustion chambers, oil ducts and cooling channels between block and cylinder head, withstanding high temperatures and working pressure.',
        descriptionEs: 'Empaque de culata para motor X10, construido en acero multicapa, diseñado para sellar cámaras de combustión, conductos de aceite y canales de enfriamiento entre bloque y culata, soportando altas temperaturas y presión de trabajo.',
        image: 'assets/x10.webp',
        category: 'Junta do Cabeçote',
        categoryPt: 'Junta do Cabeçote',
        categoryEn: 'Cylinder Head Gasket',
        categoryEs: 'Empaque de Culata'
      },
      {
        id: 'x12',
        title: 'Vedador X12',
        titlePt: 'Vedador X12',
        titleEn: 'Seal X12',
        titleEs: 'Sello X12',
        description: 'Vedador do conjunto X12 em elastômero, destinado à vedação de óleo/fluido em eixo ou alojamento, resistente a variações térmicas e à ação de derivados de petróleo, evitando vazamentos e contaminação do sistema.',
        descriptionPt: 'Vedador do conjunto X12 em elastômero, destinado à vedação de óleo/fluido em eixo ou alojamento, resistente a variações térmicas e à ação de derivados de petróleo, evitando vazamentos e contaminação do sistema.',
        descriptionEn: 'X12 assembly seal made of elastomer, designed for sealing oil or fluid in shafts or housings. Resistant to thermal variations and petroleum derivatives, preventing leaks and system contamination.',
        descriptionEs: 'Sello del conjunto X12 fabricado en elastómero, destinado a la estanqueidad de aceite o fluido en ejes o alojamientos. Resistente a variaciones térmicas y a derivados del petróleo, evitando fugas y contaminación del sistema.',
        image: 'assets/VEDADOR_X12.webp',
        category: 'Vedadores Especiais',
        categoryPt: 'Vedadores Especiais',
        categoryEn: 'Special Seals',
        categoryEs: 'Sellos Especiales'
      }
    ];

    this.currentProductIndex = 0;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateProductDisplay();
  }

  setupEventListeners() {
    // Botões de navegação de produtos
    const prevBtn = document.getElementById('prevProduct');
    const nextBtn = document.getElementById('nextProduct');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.showPreviousProduct());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.showNextProduct());
    }

    // Indicadores de produto
    const indicators = document.querySelectorAll('.product-indicator');
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.showProduct(index));
    });
  }

  showProduct(index) {
    this.currentProductIndex = index;
    this.updateProductDisplay();
  }

  showNextProduct() {
    this.currentProductIndex = (this.currentProductIndex + 1) % this.products.length;
    this.updateProductDisplay();
  }

  showPreviousProduct() {
    this.currentProductIndex = (this.currentProductIndex - 1 + this.products.length) % this.products.length;
    this.updateProductDisplay();
  }

  updateProductDisplay() {
    const product = this.products[this.currentProductIndex];
    const titleElement = document.getElementById('productTitle');
    const descriptionElement = document.getElementById('productDescription');
    const imageElement = document.getElementById('productImage');

    if (titleElement) {
      titleElement.textContent = product.title;
    }

    if (descriptionElement) {
      descriptionElement.textContent = product.description;
    }

    if (imageElement) {
      imageElement.src = product.image;
      imageElement.alt = product.title;
    }

    // Atualizar indicadores
    this.updateIndicators();
  }

  updateIndicators() {
    const indicators = document.querySelectorAll('.product-indicator');
    indicators.forEach((indicator, index) => {
      if (index === this.currentProductIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  getCurrentProduct() {
    return this.products[this.currentProductIndex];
  }
}

// ====================
// SISTEMA DE BUSCA
// ====================

class SearchManager {
  constructor() {
    this.searchInput = document.getElementById('searchInput');
    this.searchResults = document.getElementById('searchResults');
    this.searchTimeout = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
      this.searchInput.addEventListener('focus', () => this.showSearchResults());
      this.searchInput.addEventListener('blur', () => setTimeout(() => this.hideSearchResults(), 200));
    }
  }

  handleSearch(query) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      if (query.length > 2) {
        this.performSearch(query);
      } else {
        this.clearSearchResults();
      }
    }, 300);
  }

  performSearch(query) {
    const results = this.searchContent(query);
    this.displaySearchResults(results);
  }

  searchContent(query) {
    const results = [];
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(section => {
      const title = section.querySelector('h2, h3');
      const content = section.textContent.toLowerCase();
      const searchTerm = query.toLowerCase();

      if (content.includes(searchTerm)) {
        results.push({
          id: section.id,
          title: title ? title.textContent : section.id,
          snippet: this.getSnippet(content, searchTerm)
        });
      }
    });

    return results;
  }

  getSnippet(text, searchTerm) {
    const index = text.indexOf(searchTerm);
    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + searchTerm.length + 50);
    let snippet = text.substring(start, end);

    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';

    return snippet;
  }

  displaySearchResults(results) {
    if (!this.searchResults) return;

    if (results.length === 0) {
      this.searchResults.innerHTML = '<div class="search-no-results">Nenhum resultado encontrado</div>';
    } else {
      const html = results.map(result => `
        <div class="search-result-item" data-section="${result.id}">
          <h4>${result.title}</h4>
          <p>${result.snippet}</p>
        </div>
      `).join('');

      this.searchResults.innerHTML = html;

      // Adicionar event listeners para os resultados
      this.searchResults.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const sectionId = item.getAttribute('data-section');
          this.scrollToSection(sectionId);
          this.hideSearchResults();
        });
      });
    }

    this.showSearchResults();
  }

  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  clearSearchResults() {
    if (this.searchResults) {
      this.searchResults.innerHTML = '';
    }
  }

  showSearchResults() {
    if (this.searchResults) {
      this.searchResults.style.display = 'block';
    }
  }

  hideSearchResults() {
    if (this.searchResults) {
      this.searchResults.style.display = 'none';
    }
  }
}

// ====================
// SISTEMA DE NAVEGAÇÃO
// ====================

class NavigationManager {
  constructor() {
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section[id]');
    this.currentSection = '';
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupScrollSpy();
    this.handleInitialHash();
  }

  setupEventListeners() {
    // Links de navegação
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        // Somente interceptar hashes locais (começam com '#')
        if (!href || href.charAt(0) !== '#') return;

        e.preventDefault();
        const targetId = href.substring(1);
        if (!targetId) return;

        // Navegar para a seção e atualizar hash/history
        this.scrollToSection(targetId, true);

        // Fechar menu mobile após navegação
        const nav = document.querySelector('.menu');
        const menuToggle = document.getElementById('menuToggle');
        if (nav && menuToggle && nav.classList.contains('active')) {
          nav.classList.remove('active');
          menuToggle.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');

          // Disparar evento para notificar que o menu foi fechado
          document.dispatchEvent(new CustomEvent('menuchange', { detail: { open: false } }));
        }

        // Atualizar link ativo imediatamente para feedback
        this.updateActiveNavLink(targetId);
      });
    });

    // Clique no logo leva para 'home'
    const logo = document.querySelector('.logo-container');
    if (logo) {
      logo.style.cursor = 'pointer';
      logo.addEventListener('click', (e) => {
        e.preventDefault();
        this.scrollToSection('home', true);
      });
    }

    // Menu mobile: o clique é gerenciado pela classe MenuToggle para evitar handlers duplicados

    // Responder ao histórico (back/forward)
    window.addEventListener('popstate', () => {
      const hash = window.location.hash ? window.location.hash.substring(1) : '';
      if (hash) this.scrollToSection(hash, false);
    });
  }

  setupScrollSpy() {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.updateActiveNavLink(entry.target.id);
        }
      });
    }, observerOptions);

    this.sections.forEach(section => {
      observer.observe(section);
    });
  }

  updateActiveNavLink(sectionId) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add('active');
      }
    });
    this.currentSection = sectionId;
  }

  scrollToSection(sectionId, pushHistory = false) {
    const section = document.getElementById(sectionId);
    if (section) {
      // Get header height dynamically
      const headerEl = document.querySelector('.header');
      const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 0;

      // Calculate target using bounding rect to be robust against nested sections and margins
      const rect = section.getBoundingClientRect();
      const target = Math.max(0, window.scrollY + rect.top - headerHeight - 8);

      // Smooth scroll
      window.scrollTo({ top: target, behavior: 'smooth' });

      // Set focus for accessibility after a short delay
      setTimeout(() => {
        section.setAttribute('tabindex', '-1');
        section.focus({ preventScroll: true });
      }, 250);

      // Atualizar o hash na URL para permitir histórico e compartilhamento
      if (pushHistory) {
        try {
          history.pushState(null, '', `#${sectionId}`);
        } catch (err) {
          // fallback
          window.location.hash = `#${sectionId}`;
        }
      }

      // Atualizar o estado do link ativo (imediato)
      this.updateActiveNavLink(sectionId);
    }
  }

  toggleMobileMenu() {
    const nav = document.querySelector('.menu');
    const menuToggle = document.getElementById('menuToggle');

    if (nav && menuToggle) {
      nav.classList.toggle('active');
      menuToggle.classList.toggle('active');

      // Atualizar aria-expanded corretamente como string
      const isOpen = nav.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
  }

  handleInitialHash() {
    if (window.location.hash) {
      const sectionId = window.location.hash.substring(1);
      setTimeout(() => this.scrollToSection(sectionId), 100);
    }
  }

  getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().split('.')[0];
    return page || 'index';
  }
}

// ====================
// RECURSOS DO CATÁLOGO
// ====================

class CatalogFeatures {
  constructor() {
    this.init();
  }

  init() {
    this.setupFilters();
    this.setupProductCards();
  }

  setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        this.filterProducts(filter);
        this.updateActiveFilter(button);
      });
    });
  }

  filterProducts(filter) {
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
      if (filter === 'all' || product.getAttribute('data-category') === filter) {
        product.style.display = 'block';
      } else {
        product.style.display = 'none';
      }
    });
  }

  updateActiveFilter(activeButton) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
      button.classList.remove('active');
    });
    activeButton.classList.add('active');
  }

  setupProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
      card.addEventListener('click', () => {
        const productId = card.getAttribute('data-product');
        this.showProductModal(productId);
      });
    });
  }

  showProductModal(productId) {
    // Implementar modal de produto
    console.log('Mostrar modal para produto:', productId);
  }
}

// ====================
// RECURSOS DA PÁGINA SOBRE
// ====================

class AboutFeatures {
  constructor() {
    this.init();
  }

  init() {
    this.setupTimeline();
    this.setupStats();
  }

  setupTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    });

    timelineItems.forEach(item => {
      observer.observe(item);
    });
  }

  setupStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateNumber(entry.target);
        }
      });
    });

    statNumbers.forEach(stat => {
      observer.observe(stat);
    });
  }

  animateNumber(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 16);
  }
}

// ====================
// TOGGLE DO MENU MOBILE
// ====================

class MenuToggle {
  constructor() {
    this.menuToggle = document.getElementById('menuToggle');
    this.nav = document.querySelector('.menu');
    this.init();
  }

  init() {
    if (this.menuToggle && this.nav) {
      this.setupEventListeners();
    }
  }

  setupEventListeners() {
    this.menuToggle.addEventListener('click', () => this.toggleMenu());
    document.addEventListener('click', (e) => this.closeMenuOnOutsideClick(e));
    window.addEventListener('resize', () => this.handleResize());
  }

  toggleMenu() {
    this.nav.classList.toggle('active');
    this.menuToggle.classList.toggle('active');

    // Atualizar aria-expanded (string)
    const isOpen = this.nav.classList.contains('active');
    this.menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    // Notificar outras partes do sistema (ex.: header) que o menu mudou
    document.dispatchEvent(new CustomEvent('menuchange', { detail: { open: isOpen } }));
  }

  closeMenuOnOutsideClick(e) {
    if (!this.menuToggle.contains(e.target) && (!this.nav || !this.nav.contains(e.target))) {
      this.closeMenu();
    }
  }

  closeMenu() {
    this.nav.classList.remove('active');
    this.menuToggle.classList.remove('active');
    this.menuToggle.setAttribute('aria-expanded', 'false');

    // Disparar evento para notificar fechamento
    document.dispatchEvent(new CustomEvent('menuchange', { detail: { open: false } }));
  }

  handleResize() {
    if (window.innerWidth > 768) {
      this.closeMenu();
    }
  }
}

// ====================
// SISTEMA DE IDIOMA
// ====================

class ScrollManager {
  constructor() {
    this.header = document.querySelector('.header');
    this.backToTop = document.getElementById('backToTop');
    this.lastScroll = window.scrollY || 0;
    this.ticking = false;
    this.init();
  }

  init() {
    // Criar botão se não existir
    if (!this.backToTop) {
      const btn = document.createElement('button');
      btn.id = 'backToTop';
      btn.className = 'back-to-top';
      btn.setAttribute('aria-label', 'Voltar ao topo');
      btn.setAttribute('aria-hidden', 'true');
      btn.innerHTML = '<i class="fa-solid fa-chevron-up" aria-hidden="true"></i>';
      document.body.appendChild(btn);
      this.backToTop = btn;
    }

    this.backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    window.addEventListener('resize', () => this.onScroll());

    this.onScroll();
  }

  onScroll() {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      const current = window.scrollY || 0;

      // Esconder header ao rolar para baixo, mostrar ao subir
      if (this.header) {
        const nav = document.querySelector('.menu');
        // se o menu mobile estiver aberto, manter o header visível
        if (nav && nav.classList.contains('active')) {
          this.header.classList.remove('hidden');
        } else if (current > this.lastScroll && current > 100) {
          this.header.classList.add('hidden');
        } else {
          this.header.classList.remove('hidden');
        }
      }

      // Mostrar botão voltar ao topo quando passar de 400px
      if (this.backToTop) {
        if (current > 400) {
          this.backToTop.classList.add('visible');
          this.backToTop.setAttribute('aria-hidden', 'false');
        } else {
          this.backToTop.classList.remove('visible');
          this.backToTop.setAttribute('aria-hidden', 'true');
        }
      }

      this.lastScroll = current;
      this.ticking = false;
    });
  }
}

// ====================
// CARROSSEL DE PRODUTOS (APENAS ROTACÃO AUTOMÁTICA)
// ====================

class ProductCarousel {
  constructor() {
    this.products = [
      {
        id: 'oring',
        title: 'Anéis O\'Ring',
        description: 'Vedação circular em elastômero para aplicações diversas em sistemas hidráulicos e pneumáticos.',
        image: 'assets/ANEL_ORING.webp',
        category: 'Vedadores Especiais'
      },
      {
        id: 'd229',
        title: 'Junta do Cabeçote D229',
        description: 'Junta de cabeçote para motor D229, construída em aço multicamadas, projetada para vedar câmaras de combustão, dutos de óleo e canais de arrefecimento entre bloco e cabeçote, suportando altas temperaturas e pressão de trabalho.',
        image: 'assets/D229.webp',
        category: 'Junta do Cabeçote'
      },
      {
        id: 'x10',
        title: 'Junta do Cabeçote X10',
        description: 'Junta de cabeçote para motor X10, construída em aço multicamadas, projetada para vedar câmaras de combustão, dutos de óleo e canais de arrefecimento entre bloco e cabeçote, suportando altas temperaturas e pressão de trabalho.',
        image: 'assets/x10.webp',
        category: 'Junta do Cabeçote'
      },
      {
        id: 'x12',
        title: 'Vedador X12',
        description: 'Vedador do conjunto X12 em elastômero, destinado à vedação de óleo/fluido em eixo ou alojamento, resistente a variações térmicas e à ação de derivados de petróleo, evitando vazamentos e contaminação do sistema.',
        image: 'assets/VEDADOR_X12.webp',
        category: 'Vedadores Especiais'
      }
    ];

    this.currentIndex = -1; // Começar com -1 para mostrar a intro primeiro
    this.autoPlayInterval = null;
    this.autoPlayDelay = 13000; // 13 segundos entre produtos
    this.introShown = false;
    this.init();
  }

  init() {
    this.setupProductCardListeners();
    this.showSplashScreen();
  }

  setupProductCardListeners() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
      card.addEventListener('click', () => {
        const productId = card.getAttribute('data-id');
        if (productId) {
          this.goToProduct(productId);
        }
      });
    });
  }

  showSplashScreen() {
    const productPanel = document.querySelector('.product-panel');
    const titleElement = document.getElementById('productTitle');
    const descriptionElement = document.getElementById('productDescription');
    const imageElement = document.getElementById('productImage');

    if (productPanel) {
      productPanel.classList.add('abr-intro');
    }

    if (titleElement) {
      titleElement.textContent = 'ABR Ind. e Com. de Auto Peças';
    }

    if (descriptionElement) {
      descriptionElement.textContent = `A ABR ind. e Comércio é especialista em soluções de vedação automotiva de alta performance.
Desenvolvemos juntas de cabeçote, anéis O'ring e vedadores especiais para motores.
Nossos produtos garantem durabilidade, segurança e eficiência em todas as aplicações.
Atendemos montadoras, reposição e lojas de autopeças.`;
    }

    if (imageElement) {
      imageElement.src = 'assets/logo_apresentacao.webp';
      imageElement.alt = 'ABR';
      imageElement.classList.add('abr-logo');
    }

    setTimeout(() => {
      this.startCarousel();
    }, 20000); // 20 segundos para a tela inicial
  }

  startCarousel() {
    this.introShown = true;
    this.currentIndex = 0; // Começar com o primeiro produto
    this.updateProduct();
    this.startAutoPlay();
  }

  updateProduct(direction = 'none') {
    const productPanel = document.querySelector('.product-panel');
    if (!productPanel) return;

    // Remover classe de intro se ainda estiver presente
    productPanel.classList.remove('abr-intro');

    const product = this.products[this.currentIndex];
    const titleElement = document.getElementById('productTitle');
    const descriptionElement = document.getElementById('productDescription');
    const imageElement = document.getElementById('productImage');

    // Aplicar efeito de fade-out baseado na direção
    if (direction === 'down') {
      productPanel.classList.add('fade-out-down');
    } else if (direction === 'up') {
      productPanel.classList.add('fade-out-up');
    } else {
      productPanel.classList.add('fade-out');
    }

    // Aguardar o fade-out completar antes de atualizar o conteúdo
    setTimeout(() => {
      if (titleElement) {
        titleElement.textContent = product.title;
      }

      if (descriptionElement) {
        descriptionElement.textContent = product.description;
      }

      if (imageElement) {
        imageElement.src = product.image;
        imageElement.alt = product.title;
        imageElement.classList.remove('abr-logo');
      }

      // Remover fade-out e aplicar fade-in
      productPanel.classList.remove('fade-out-up', 'fade-out-down', 'fade-out');
      if (direction === 'down') {
        productPanel.classList.add('fade-in-down');
      } else if (direction === 'up') {
        productPanel.classList.add('fade-in-up');
      } else {
        productPanel.classList.add('fade-in');
      }

      // Limpar a classe fade-in após a transição
      setTimeout(() => {
        productPanel.classList.remove('fade-in-down', 'fade-in-up', 'fade-in');
      }, 600);
    }, 300);
  }

  nextProduct() {
    const previousIndex = this.currentIndex;
    this.currentIndex = (this.currentIndex + 1) % this.products.length;

    // Determinar direção baseada na posição no array
    let direction = 'none';
    if (previousIndex !== -1) {
      if (this.currentIndex > previousIndex) {
        direction = 'down'; // Indo para baixo no array
      } else if (this.currentIndex < previousIndex) {
        direction = 'up'; // Indo para cima (loop)
      }
    }

    this.updateProduct(direction);
  }

  previousProduct() {
    this.currentIndex = this.currentIndex === 0 ? this.products.length - 1 : this.currentIndex - 1;
    this.updateProduct('prev');
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.nextProduct();
    }, this.autoPlayDelay);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  goToProduct(productId) {
    const index = this.products.findIndex(product => product.id === productId);
    if (index !== -1) {
      if (!this.introShown) {
        this.introShown = true;
      }
      this.currentIndex = index;
      this.updateProduct();
      // Restart autoplay from this product
      this.startAutoPlay();
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  const formId = 'xaqygwgr'; // Substitua pelo seu Form ID

  // Elementos
  const nome = document.getElementById('nome');
  const email = document.getElementById('email');
  const telefone = document.getElementById('telefone');
  const assunto = document.getElementById('assunto');
  const mensagem = document.getElementById('mensagem');
  const charCount = document.getElementById('charCount');
  const charWarning = document.getElementById('charWarning');
  const privacy = document.getElementById('privacy');
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const sending = document.getElementById('sending');
  const clearBtn = document.getElementById('clearBtn');
  const formSuccess = document.getElementById('formSuccess');
  const formError = document.getElementById('formError');
  const errorMessage = document.getElementById('errorMessage');
  const replyTo = document.getElementById('replyTo');
  const timestamp = document.getElementById('timestamp');

  // Inicialização
  updateCharCount();
  timestamp.value = new Date().toISOString();

  // Event Listeners
  mensagem.addEventListener('input', updateCharCount);
  telefone.addEventListener('input', formatPhone);
  clearBtn.addEventListener('click', clearForm);
  form.addEventListener('submit', handleSubmit);

  // Validação em tempo real
  [nome, email, assunto, mensagem].forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => clearFieldError(field));
  });

  privacy.addEventListener('change', () => clearFieldError(privacy));

  // Funções
  function updateCharCount() {
    const count = mensagem.value.length;
    charCount.textContent = count;

    if (count > 1800) {
      charCount.style.color = '#dc3545';
      charCount.style.fontWeight = 'bold';
      charWarning.style.display = 'inline';
    } else if (count > 1500) {
      charCount.style.color = '#ffc107';
      charCount.style.fontWeight = 'bold';
      charWarning.style.display = 'none';
    } else {
      charCount.style.color = 'var(--text-muted)';
      charCount.style.fontWeight = 'normal';
      charWarning.style.display = 'none';
    }
  }

  function formatPhone(e) {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else if (value.length > 0) {
      value = value.replace(/^(\d{0,2})/, '($1');
    }

    e.target.value = value;
  }

  function validateField(field) {
    let isValid = true;
    let error = '';

    if (field === privacy) {
      if (!field.checked) {
        error = 'É necessário aceitar a política de privacidade';
        isValid = false;
      }
    } else if (field.value.trim() === '') {
      error = 'Este campo é obrigatório';
      isValid = false;
    } else if (field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        error = 'Por favor, digite um e-mail válido';
        isValid = false;
      }
    } else if (field === nome && field.value.length < 2) {
      error = 'O nome deve ter pelo menos 2 caracteres';
      isValid = false;
    } else if (field === mensagem && field.value.length < 10) {
      error = 'A mensagem deve ter pelo menos 10 caracteres';
      isValid = false;
    }

    if (!isValid) {
      showFieldError(field, error);
    } else {
      clearFieldError(field);
    }

    return isValid;
  }

  function showFieldError(field, message) {
    const errorId = field.id + '-error';
    const errorElement = document.getElementById(errorId);

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      field.style.borderColor = '#dc3545';
    }
  }

  function clearFieldError(field) {
    const errorId = field.id + '-error';
    const errorElement = document.getElementById(errorId);

    if (errorElement) {
      errorElement.style.display = 'none';
      field.style.borderColor = '';
    }
  }

  function validateForm() {
    let isValid = true;

    [nome, email, assunto, mensagem].forEach(field => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    if (!validateField(privacy)) {
      isValid = false;
    }

    return isValid;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Resetar mensagens
    hideMessages();

    // Validar formulário
    if (!validateForm()) {
      showError('Por favor, corrija os erros no formulário.');
      return;
    }

    // Preparar para envio
    replyTo.value = email.value;
    timestamp.value = new Date().toISOString();

    // Atualizar estado do botão
    setLoadingState(true);

    try {
      // Enviar via Formspree
      const formData = new FormData(form);

      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess();
        clearForm();

        // Tracking de sucesso (opcional)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'contact_form_submit', {
            'event_category': 'Contact',
            'event_label': 'Form Submitted'
          });
        }
      } else {
        throw new Error(result.error || 'Erro ao enviar formulário');
      }
    } catch (error) {
      console.error('Erro no envio:', error);

      // Tentar fallback se for erro de CORS
      if (error.name === 'TypeError') {
        showError('Erro de conexão. Tente novamente mais tarde.');
      } else {
        showError(error.message || 'Ocorreu um erro ao enviar sua mensagem.');
      }
    } finally {
      setLoadingState(false);
    }
  }

  function setLoadingState(isLoading) {
    if (isLoading) {
      submitBtn.disabled = true;
      submitText.style.display = 'none';
      sending.style.display = 'flex';
    } else {
      submitBtn.disabled = false;
      submitText.style.display = 'inline';
      sending.style.display = 'none';
    }
  }

  function showSuccess() {
    formSuccess.style.display = 'flex';
    formError.style.display = 'none';

    // Scroll para a mensagem
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Auto-ocultar após 10 segundos
    setTimeout(() => {
      formSuccess.style.display = 'none';
    }, 10000);
  }

  function showError(message) {
    formSuccess.style.display = 'none';
    formError.style.display = 'flex';
    errorMessage.textContent = message;

    // Scroll para o erro
    formError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideMessages() {
    formSuccess.style.display = 'none';
    formError.style.display = 'none';
  }

  function clearForm() {
    form.reset();
    updateCharCount();
    hideMessages();

    // Limpar erros
    [nome, email, telefone, assunto, mensagem, privacy].forEach(clearFieldError);

    // Resetar cores
    [nome, email, telefone, assunto, mensagem].forEach(field => {
      field.style.borderColor = '';
    });
  }

  // Inicializar máscaras e validações
  function initForm() {
    // Adicionar máscara para telefone
    if (window.IMask) {
      new IMask(telefone, {
        mask: '(00) 00000-0000'
      });
    }

    // Preencher automaticamente se houver dados na URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('nome')) {
      nome.value = urlParams.get('nome');
    }
    if (urlParams.has('email')) {
      email.value = urlParams.get('email');
    }
    if (urlParams.has('assunto')) {
      assunto.value = urlParams.get('assunto');
    }
  }

  initForm();
});



// ====================
// INICIALIZAÇÃO
// ====================

// Arrays de opções de PDF
const leveOptions = [
  { label: 'Catálogo Completo Linha Leve', url: 'https://abr.ind.br/catalogos/pb/ABR%20Catalogo%20LINHA%20LEVE.pdf' },
  { label: 'Linha FIAT', url: 'https://abr.ind.br/catalogos/pb/2%20-%20FIAT%202019.pdf' },
  { label: 'Linha FORD', url: 'https://abr.ind.br/catalogos/pb/3%20-%20FORD%202019%20site.pdf' },
  { label: 'Linha GM', url: 'https://abr.ind.br/catalogos/pb/4%20-%20GM%202019.pdf' },
  { label: 'Linha Honda', url: 'https://abr.ind.br/catalogos/pb/5%20-%20HONDA%202019.pdf' },
  { label: 'Linha HYNDAI / MITSUBISHI', url: 'https://abr.ind.br/catalogos/pb/6%20-%20HYUNDAI-MITSUBISHI%202019.pdf' },
  { label: 'Linha ASIA-KIA', url: 'https://abr.ind.br/catalogos/pb/7%20-%20ASIA-KIA%202019.pdf' },
  { label: 'Linha NISSAN', url: 'https://abr.ind.br/catalogos/pb/8%20-%20NISSAN%202019.pdf' },
  { label: 'Linha PEUGEOT / CITROEN', url: 'https://abr.ind.br/catalogos/pb/9%20-%20PEUGEOT-CITROEN%202019.pdf' },
  { label: 'Linha RENAULT', url: 'https://abr.ind.br/catalogos/pb/10%20-%20RENAULT%202019.pdf' },
  { label: 'Linha SUZUKI', url: 'https://abr.ind.br/catalogos/pb/11%20-%20SUZUKI%202019.pdf' },
  { label: 'Linha TOYOTA', url: 'https://abr.ind.br/catalogos/pb/12%20-%20TOYOTA%202019.pdf' },
  { label: 'Linha VOLKSWAGEN', url: 'https://abr.ind.br/catalogos/pb/13%20-%20VOLKSWAGEN%202019.pdf' }
];

const pesadaOptions = [
  { label: 'Catálogo Completo Linha Pesada', url: 'https://abr.ind.br/catalogos/pb/ABR%20Catalogo%20LINHA%20PESADA.pdf' },
  { label: 'Linha CUMMINS', url: 'https://abr.ind.br/catalogos/pb/1%20-%20ABR%20Catalogo%20CUMMINS.pdf' },
  { label: 'Linha Mercedes', url: 'https://abr.ind.br/catalogos/pb/2%20-%20ABR%20Catalogo%20MERCEDES.pdf' },
  { label: 'Linha MWM', url: 'https://abr.ind.br/catalogos/pb/3%20-%20ABR%20Catalogo%20MWM.pdf' },
  { label: 'Linha MAXION / PERKINS', url: 'https://abr.ind.br/catalogos/pb/4%20-%20ABR%20Catalogo%20MAXION%20PERKINS.pdf' },
  { label: 'Linha IVECO', url: 'https://abr.ind.br/catalogos/pb/5%20-%20ABR%20Catalogo%20IVECO.pdf' },
  { label: 'Linha SCANIA', url: 'https://abr.ind.br/catalogos/pb/6%20-%20ABR%20Catalogo%20SCANIA.pdf' },
  { label: 'Linha JOHN DEERE', url: 'https://abr.ind.br/catalogos/pb/7%20-%20ABR%20Catalogo%20JOHN%20DEERE.pdf' },
  { label: 'Linha FORD', url: 'https://abr.ind.br/catalogos/pb/8%20-%20ABR%20Catalogo%20FORD.pdf' },
  { label: 'Linha VALTRA', url: 'https://abr.ind.br/catalogos/pb/9%20-%20ABR%20Catalogo%20VALTRA.pdf' }
];

// ====================
// GERENCIADOR DO MODAL DE PDF
// ====================

class PDFModalManager {
  constructor() {
    this.modal = document.getElementById('pdfModal');
    this.closeBtn = document.getElementById('closeModal');
    this.downloadBtn = document.getElementById('downloadPdfBtn');
    this.tabButtons = document.querySelectorAll('.tab-button');
    this.tabContents = document.querySelectorAll('.tab-content');
    this.isOpen = false;
    this.touchStartY = 0;
    this.touchStartX = 0;
    this.init();
  }

  init() {
    if (this.downloadBtn) {
      this.downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal();
      });
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeModal());
      this.closeBtn.addEventListener('touchstart', () => this.provideHapticFeedback());
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.closeModal();
        }
      });

      // Touch events for mobile swipe to close
      this.modal.addEventListener('touchstart', (e) => {
        this.touchStartY = e.touches[0].clientY;
        this.touchStartX = e.touches[0].clientX;
      }, { passive: true });

      this.modal.addEventListener('touchmove', (e) => {
        if (!this.isOpen) return;

        const touchY = e.touches[0].clientY;
        const touchX = e.touches[0].clientX;
        const deltaY = touchY - this.touchStartY;
        const deltaX = Math.abs(touchX - this.touchStartX);

        // Only allow swipe down if it's mostly vertical and from top area
        if (deltaY > 50 && deltaX < 30 && this.touchStartY < 100) {
          this.closeModal();
        }
      }, { passive: true });
    }

    // Tab switching with haptic feedback
    this.tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tab = button.getAttribute('data-tab');
        this.switchTab(tab);
        this.provideHapticFeedback();
      });

      button.addEventListener('touchstart', () => this.provideHapticFeedback(), { passive: true });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;

      if (e.key === 'Escape') {
        this.closeModal();
      } else if (e.key === 'ArrowLeft') {
        this.switchToPreviousTab();
      } else if (e.key === 'ArrowRight') {
        this.switchToNextTab();
      }
    });

    // Populate lists with enhanced links
    this.populatePDFLists();

    // Prevent body scroll when modal is open
    this.setupScrollPrevention();
  }

  setupScrollPrevention() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const display = this.modal.style.display;
          if (display === 'block' && !this.isOpen) {
            this.isOpen = true;
            document.body.style.overflow = 'hidden';
            this.focusTrap();
          } else if (display === 'none' && this.isOpen) {
            this.isOpen = false;
            document.body.style.overflow = '';
          }
        }
      });
    });

    observer.observe(this.modal, {
      attributes: true,
      attributeFilter: ['style']
    });
  }

  focusTrap() {
    const focusableElements = this.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    this.modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });

    // Focus first element when modal opens
    setTimeout(() => {
      if (firstElement) firstElement.focus();
    }, 100);
  }

  openModal() {
    if (this.modal) {
      this.modal.style.display = 'block';
      this.provideHapticFeedback();
      // Announce to screen readers
      this.announceToScreenReader('Modal de download de PDFs aberto');
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.style.display = 'none';
      this.provideHapticFeedback();
      // Return focus to trigger button
      if (this.downloadBtn) this.downloadBtn.focus();
      // Announce to screen readers
      this.announceToScreenReader('Modal de download de PDFs fechado');
    }
  }

  switchTab(tab) {
    // Update tab buttons
    this.tabButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-tab') === tab) {
        btn.classList.add('active');
      }
    });

    // Update tab contents with animation
    this.tabContents.forEach(content => {
      if (content.id === `${tab}-tab`) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });

    // Announce tab change to screen readers
    const tabName = tab === 'leve' ? 'Linha Leve' : 'Linha Pesada';
    this.announceToScreenReader(`Aba ${tabName} selecionada`);
  }

  switchToPreviousTab() {
    const activeTab = document.querySelector('.tab-button.active');
    if (activeTab) {
      const currentTab = activeTab.getAttribute('data-tab');
      const tabs = ['leve', 'pesada'];
      const currentIndex = tabs.indexOf(currentTab);
      const previousIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
      this.switchTab(tabs[previousIndex]);
    }
  }

  switchToNextTab() {
    const activeTab = document.querySelector('.tab-button.active');
    if (activeTab) {
      const currentTab = activeTab.getAttribute('data-tab');
      const tabs = ['leve', 'pesada'];
      const currentIndex = tabs.indexOf(currentTab);
      const nextIndex = (currentIndex + 1) % tabs.length;
      this.switchTab(tabs[nextIndex]);
    }
  }

  populatePDFLists() {
    // Populate leve tab
    const leveList = document.querySelector('#leve-tab .pdf-list');
    if (leveList) {
      leveOptions.forEach((option, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = option.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', `Baixar ${option.label} (abre em nova aba)`);

        // Create icon element
        const iconSpan = document.createElement('span');
        iconSpan.className = 'pdf-icon';
        iconSpan.innerHTML = '<i class="fa-solid fa-file-pdf" aria-hidden="true"></i>';

        // Create text span
        const textSpan = document.createElement('span');
        textSpan.className = 'pdf-text';
        textSpan.textContent = option.label;

        // Create download icon
        const downloadSpan = document.createElement('span');
        downloadSpan.className = 'download-icon';
        downloadSpan.innerHTML = '<i class="fa-solid fa-download" aria-hidden="true"></i>';

        // Assemble link
        a.appendChild(iconSpan);
        a.appendChild(textSpan);
        a.appendChild(downloadSpan);

        // Add click tracking and loading state
        a.addEventListener('click', (e) => {
          this.handlePDFClick(e, option.label);
        });

        a.addEventListener('touchstart', () => this.provideHapticFeedback(), { passive: true });

        li.appendChild(a);
        leveList.appendChild(li);
      });
    }

    // Populate pesada tab
    const pesadaList = document.querySelector('#pesada-tab .pdf-list');
    if (pesadaList) {
      pesadaOptions.forEach((option, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = option.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', `Baixar ${option.label} (abre em nova aba)`);

        // Create icon element
        const iconSpan = document.createElement('span');
        iconSpan.className = 'pdf-icon';
        iconSpan.innerHTML = '<i class="fa-solid fa-file-pdf" aria-hidden="true"></i>';

        // Create text span
        const textSpan = document.createElement('span');
        textSpan.className = 'pdf-text';
        textSpan.textContent = option.label;

        // Create download icon
        const downloadSpan = document.createElement('span');
        downloadSpan.className = 'download-icon';
        downloadSpan.innerHTML = '<i class="fa-solid fa-download" aria-hidden="true"></i>';

        // Assemble link
        a.appendChild(iconSpan);
        a.appendChild(textSpan);
        a.appendChild(downloadSpan);

        // Add click tracking and loading state
        a.addEventListener('click', (e) => {
          this.handlePDFClick(e, option.label);
        });

        a.addEventListener('touchstart', () => this.provideHapticFeedback(), { passive: true });

        li.appendChild(a);
        pesadaList.appendChild(li);
      });
    }
  }

  handlePDFClick(e, label) {
    // Provide feedback
    this.provideHapticFeedback();

    // Visual feedback
    const link = e.target;
    link.style.transform = 'scale(0.98)';
    setTimeout(() => {
      link.style.transform = '';
    }, 150);

    // Track download (optional analytics)
    console.log(`PDF download initiated: ${label}`);

    // Announce to screen readers
    this.announceToScreenReader(`Iniciando download de ${label}`);
  }

  provideHapticFeedback() {
    // Provide tactile feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  announceToScreenReader(message) {
    // Create temporary element for screen reader announcement
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';

    announcement.textContent = message;
    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar gerenciadores
  window.themeManager = new ThemeManager();
  window.productManager = new ProductManager();
  window.searchManager = new SearchManager();
  window.navigationManager = new NavigationManager();
  window.catalogFeatures = new CatalogFeatures();
  window.aboutFeatures = new AboutFeatures();
  window.menuToggle = new MenuToggle();
  window.scrollManager = new ScrollManager();
  window.productCarousel = new ProductCarousel();
  window.pdfModalManager = new PDFModalManager();
});

// ====================
// EXPORTAR CLASSES PARA USO GLOBAL (OPCIONAL)
// ====================

window.ThemeManager = ThemeManager;
window.ProductManager = ProductManager;
window.SearchManager = SearchManager;
window.NavigationManager = NavigationManager;
window.CatalogFeatures = CatalogFeatures;
window.AboutFeatures = AboutFeatures;
window.MenuToggle = MenuToggle;
window.ProductCarousel = ProductCarousel;
window.PDFModalManager = PDFModalManager;
