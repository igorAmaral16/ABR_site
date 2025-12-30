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
      titleElement.textContent = product.titlePt;
      titleElement.setAttribute('data-i18n', product.title);
      titleElement.setAttribute('data-i18n-pt', product.titlePt);
      titleElement.setAttribute('data-i18n-en', product.titleEn);
      titleElement.setAttribute('data-i18n-es', product.titleEs);
    }

    if (descriptionElement) {
      descriptionElement.textContent = product.descriptionPt;
      descriptionElement.setAttribute('data-i18n', product.description);
      descriptionElement.setAttribute('data-i18n-pt', product.descriptionPt);
      descriptionElement.setAttribute('data-i18n-en', product.descriptionEn);
      descriptionElement.setAttribute('data-i18n-es', product.descriptionEs);
    }

    if (imageElement) {
      imageElement.src = product.image;
      imageElement.alt = product.titlePt;
      imageElement.setAttribute('data-i18n-alt', product.title);
      imageElement.setAttribute('data-i18n-alt-pt', product.titlePt);
      imageElement.setAttribute('data-i18n-alt-en', product.titleEn);
      imageElement.setAttribute('data-i18n-alt-es', product.titleEs);
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
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        this.scrollToSection(targetId);
      });
    });

    // Botão de menu mobile
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', () => this.toggleMobileMenu());
    }
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

  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerHeight = document.querySelector('.header').offsetHeight;
      const offsetTop = section.offsetTop - headerHeight;

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }

  toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    const menuToggle = document.getElementById('menuToggle');

    if (nav && menuToggle) {
      nav.classList.toggle('mobile-open');
      menuToggle.classList.toggle('active');
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
    this.nav = document.querySelector('.nav');
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
    this.nav.classList.toggle('mobile-open');
    this.menuToggle.classList.toggle('active');

    // Atualizar aria-expanded
    const isOpen = this.nav.classList.contains('mobile-open');
    this.menuToggle.setAttribute('aria-expanded', isOpen);
  }

  closeMenuOnOutsideClick(e) {
    if (!this.menuToggle.contains(e.target) && !this.nav.contains(e.target)) {
      this.closeMenu();
    }
  }

  closeMenu() {
    this.nav.classList.remove('mobile-open');
    this.menuToggle.classList.remove('active');
    this.menuToggle.setAttribute('aria-expanded', 'false');
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

class LanguageManager {
  constructor() {
    this.currentLang = localStorage.getItem('language') || 'pt';
    this.translations = {};
    this.init();
  }

  init() {
    this.loadTranslations();
    this.setupEventListeners();
    this.applyLanguage();
  }

  loadTranslations() {
    // Carregar traduções dos elementos data-i18n
    this.translations = {
      pt: {},
      en: {},
      es: {}
    };
  }

  setupEventListeners() {
    // Toggle do dropdown de idioma
    const flagToggle = document.getElementById('flagToggle');
    const flagMenu = document.getElementById('flagMenu');

    if (flagToggle && flagMenu) {
      flagToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleDropdown();
      });

      // Fechar dropdown ao clicar fora
      document.addEventListener('click', (e) => {
        if (!flagToggle.contains(e.target) && !flagMenu.contains(e.target)) {
          this.closeDropdown();
        }
      });

      // Opções de idioma
      const flagOptions = flagMenu.querySelectorAll('.flag-option');
      flagOptions.forEach(option => {
        option.addEventListener('click', (e) => {
          const lang = e.currentTarget.getAttribute('data-lang');
          this.changeLanguage(lang);
          this.closeDropdown();
        });
      });
    }
  }

  toggleDropdown() {
    const flagMenu = document.getElementById('flagMenu');
    const flagToggle = document.getElementById('flagToggle');

    if (flagMenu && flagToggle) {
      const isOpen = flagMenu.classList.contains('show');
      if (isOpen) {
        this.closeDropdown();
      } else {
        this.openDropdown();
      }
    }
  }

  openDropdown() {
    const flagMenu = document.getElementById('flagMenu');
    const flagToggle = document.getElementById('flagToggle');

    if (flagMenu && flagToggle) {
      flagMenu.classList.remove('hidden');
      flagMenu.classList.add('show');
      flagToggle.setAttribute('aria-expanded', 'true');
      flagMenu.setAttribute('aria-hidden', 'false');
    }
  }

  closeDropdown() {
    const flagMenu = document.getElementById('flagMenu');
    const flagToggle = document.getElementById('flagToggle');

    if (flagMenu && flagToggle) {
      flagMenu.classList.remove('show');
      flagMenu.classList.add('hidden');
      flagToggle.setAttribute('aria-expanded', 'false');
      flagMenu.setAttribute('aria-hidden', 'true');
    }
  }

  changeLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('language', lang);
    this.applyLanguage();
    this.updateFlagIcon();
  }

  updateFlagIcon() {
    const flagToggle = document.getElementById('flagToggle');
    if (flagToggle) {
      const flagIcon = flagToggle.querySelector('.flag-icon');
      if (flagIcon) {
        // Remover todas as classes de bandeira
        flagIcon.className = 'flag-icon';

        // Adicionar a bandeira correta
        switch (this.currentLang) {
          case 'pt':
            flagIcon.classList.add('flag-icon-br');
            break;
          case 'en':
            flagIcon.classList.add('flag-icon-us');
            break;
          case 'es':
            flagIcon.classList.add('flag-icon-es');
            break;
        }
      }
    }
  }

  applyLanguage() {
    const elements = document.querySelectorAll('[data-i18n]');

    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (key) {
        const translation = element.getAttribute(`data-i18n-${this.currentLang}`);
        if (translation) {
          // Para elementos de texto simples
          if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = translation;
          } else if (element.tagName === 'IMG') {
            element.alt = translation;
          } else {
            element.textContent = translation;
          }
        }
      }

      // Traduzir atributos especiais
      this.translateAttributes(element);
    });

    // Atualizar título da página
    this.updatePageTitle();

    // Disparar evento de mudança de idioma
    document.dispatchEvent(new CustomEvent('languagechange', {
      detail: { language: this.currentLang }
    }));
  }

  translateAttributes(element) {
    // Traduzir aria-label
    const ariaLabel = element.getAttribute(`data-i18n-aria-label-${this.currentLang}`);
    if (ariaLabel) {
      element.setAttribute('aria-label', ariaLabel);
    }

    // Traduzir title
    const title = element.getAttribute(`data-i18n-title-${this.currentLang}`);
    if (title) {
      element.setAttribute('title', title);
    }

    // Traduzir alt de imagens
    const alt = element.getAttribute(`data-i18n-alt-${this.currentLang}`);
    if (alt) {
      element.setAttribute('alt', alt);
    }
  }

  updatePageTitle() {
    const titleElement = document.querySelector('title');
    if (titleElement) {
      const title = titleElement.getAttribute(`data-i18n-${this.currentLang}`) ||
        'ABR Indústria e Comércio de Auto Peças';
      document.title = title;
    }
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
        descriptionEs: 'Empaque de culata para motor X10, construido en acero multicapa, diseñado para sellar cámaras de combustión, conductos de aceite y canales de enfriamiento entre bloque y culata, soportando altas temperaturas y presión de trabalho.',
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
      titleElement.removeAttribute('data-i18n');
      titleElement.removeAttribute('data-i18n-pt');
      titleElement.removeAttribute('data-i18n-en');
      titleElement.removeAttribute('data-i18n-es');
    }

    if (descriptionElement) {
      descriptionElement.textContent = `A ABR ind. e Comércio é especialista em soluções de vedação automotiva de alta performance.
Desenvolvemos juntas de cabeçote, anéis O'ring e vedadores especiais para motores.
Nossos produtos garantem durabilidade, segurança e eficiência em todas as aplicações.
Atendemos montadoras, reposição e lojas de autopeças.`;
      descriptionElement.removeAttribute('data-i18n');
      descriptionElement.removeAttribute('data-i18n-pt');
      descriptionElement.removeAttribute('data-i18n-en');
      descriptionElement.removeAttribute('data-i18n-es');
    }

    if (imageElement) {
      imageElement.src = 'assets/logo_apresentacao.webp';
      imageElement.alt = 'ABR';
      imageElement.classList.add('abr-logo');
      imageElement.removeAttribute('data-i18n-alt');
      imageElement.removeAttribute('data-i18n-alt-pt');
      imageElement.removeAttribute('data-i18n-alt-en');
      imageElement.removeAttribute('data-i18n-alt-es');
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
        titleElement.textContent = product.titlePt;
        titleElement.setAttribute('data-i18n', product.title);
        titleElement.setAttribute('data-i18n-pt', product.titlePt);
        titleElement.setAttribute('data-i18n-en', product.titleEn);
        titleElement.setAttribute('data-i18n-es', product.titleEs);
      }

      if (descriptionElement) {
        descriptionElement.textContent = product.descriptionPt;
        descriptionElement.setAttribute('data-i18n', product.description);
        descriptionElement.setAttribute('data-i18n-pt', product.descriptionPt);
        descriptionElement.setAttribute('data-i18n-en', product.descriptionEn);
        descriptionElement.setAttribute('data-i18n-es', product.descriptionEs);
      }

      if (imageElement) {
        imageElement.src = product.image;
        imageElement.alt = product.titlePt;
        imageElement.classList.remove('abr-logo');
        imageElement.setAttribute('data-i18n-alt', product.title);
        imageElement.setAttribute('data-i18n-alt-pt', product.titlePt);
        imageElement.setAttribute('data-i18n-alt-en', product.titleEn);
        imageElement.setAttribute('data-i18n-alt-es', product.titleEs);
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

// ====================
// INICIALIZAÇÃO
// ====================

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar gerenciadores
  window.themeManager = new ThemeManager();
  window.productManager = new ProductManager();
  window.languageManager = new LanguageManager();
  window.searchManager = new SearchManager();
  window.navigationManager = new NavigationManager();
  window.catalogFeatures = new CatalogFeatures();
  window.aboutFeatures = new AboutFeatures();
  window.menuToggle = new MenuToggle();
  window.productCarousel = new ProductCarousel();
});

// ====================
// EXPORTAR CLASSES PARA USO GLOBAL (OPCIONAL)
// ====================

window.ThemeManager = ThemeManager;
window.ProductManager = ProductManager;
window.LanguageManager = LanguageManager;
window.SearchManager = SearchManager;
window.NavigationManager = NavigationManager;
window.CatalogFeatures = CatalogFeatures;
window.AboutFeatures = AboutFeatures;
window.MenuToggle = MenuToggle;
window.ProductCarousel = ProductCarousel;
