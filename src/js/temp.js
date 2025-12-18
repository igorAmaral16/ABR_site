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
        img.style.filter = 'brightness(0.95) contrast(1.05)';
      } else {
        // Remover ajustes no modo claro
        img.style.filter = 'none';
      }
    });
  }

  setupEventListeners() {
    const toggleBtn = document.getElementById('darkModeToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleTheme());

      // Tooltip avançado
      toggleBtn.addEventListener('mouseenter', () => {
        this.showThemeTooltip(toggleBtn);
      });

      toggleBtn.addEventListener('mouseleave', () => {
        this.hideThemeTooltip(toggleBtn);
      });
    }

    // Ouvir mudanças do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.theme = e.matches ? 'dark' : 'light';
        this.applyTheme();
      }
    });

    // Atalho de teclado
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.altKey && e.key === 'T') {
        e.preventDefault();
        this.toggleTheme();
        this.showThemeChangeFeedback();
      }
    });
  }

  setupTransition() {
    // As transições já estão definidas no CSS através da variável --theme-transition
    // Este método garante que a variável esteja definida
    document.documentElement.style.setProperty('--theme-transition', `${this.transitionDuration}ms`);
  }

  provideHapticFeedback() {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    const toggleBtn = document.getElementById('darkModeToggle');
    if (toggleBtn) {
      toggleBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        toggleBtn.style.transform = '';
      }, 150);
    }
  }

  trackThemeUsage() {
    console.log(`Tema alterado para: ${this.theme}`);
    // Implemente sua análise de uso aqui
  }

  setupThemePreferences() {
    const savedPreferences = JSON.parse(localStorage.getItem('themePreferences') || '{}');
    const preferences = {
      autoSwitch: true,
      schedule: null,
      contrast: 'normal',
      reducedMotion: false,
      ...savedPreferences
    };

    if (preferences.reducedMotion) {
      document.documentElement.style.setProperty('--theme-transition', '0ms');
    }

    if (preferences.contrast === 'high') {
      document.body.classList.add('high-contrast');
    }

    document.addEventListener('themechange', (e) => {
      preferences.lastTheme = e.detail.theme;
      localStorage.setItem('themePreferences', JSON.stringify(preferences));
    });
  }

  addDarkModeUtilities() {
    // Utilitários já estão no CSS
    console.log('Utilitários de tema carregados');
  }

  monitorThemePerformance() {
    let themeChangeStart = 0;

    document.addEventListener('themechange', () => {
      const changeTime = Date.now() - themeChangeStart;
      if (changeTime > 100) {
        console.warn(`Troca de tema pode estar lenta: ${changeTime}ms`);
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.id === 'darkModeToggle' || e.target.closest('#darkModeToggle')) {
        themeChangeStart = Date.now();
      }
    });
  }

  showThemeTooltip(button) {
    const tooltip = document.createElement('div');
    tooltip.className = 'theme-tooltip';
    tooltip.textContent = this.theme === 'dark'
      ? 'Clique para modo claro'
      : 'Clique para modo escuro';
    tooltip.style.cssText = `
      position: absolute;
      top: -40px;
      left: 50%;
      transform: translateX(-50%);
      background: ${this.theme === 'dark' ? 'var(--dark-surface)' : 'var(--bg-white)'};
      color: ${this.theme === 'dark' ? 'var(--dark-text-primary)' : 'var(--text-primary)'};
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 1000;
      box-shadow: ${this.theme === 'dark' ? 'var(--dark-shadow-md)' : 'var(--shadow-md)'};
      border: 1px solid ${this.theme === 'dark' ? 'var(--dark-border)' : 'var(--border-light)'};
    `;
    button.appendChild(tooltip);
  }

  hideThemeTooltip(button) {
    const tooltip = button.querySelector('.theme-tooltip');
    if (tooltip) tooltip.remove();
  }

  showThemeChangeFeedback() {
    document.body.style.boxShadow = '0 0 0 3px var(--primary)';
    setTimeout(() => {
      document.body.style.boxShadow = '';
    }, 300);
  }

  getCurrentTheme() {
    return this.theme;
  }

  setTheme(theme) {
    if (['light', 'dark'].includes(theme)) {
      this.theme = theme;
      this.applyTheme();
    }
  }
}

// ====================
// SISTEMA DE PRODUTOS
// ====================

class ProductManager {
  constructor() {
    this.productCards = document.querySelectorAll('.product-card');
    this.productImage = document.getElementById('productImage');
    this.titleEl = document.getElementById('productTitle');
    this.descEl = document.getElementById('productDescription');
    this.currentProductId = 'd229';
    this.animationInProgress = false;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupProductObservers();
  }

  setupEventListeners() {
    this.productCards.forEach(card => {
      card.addEventListener('click', () => this.switchProduct(card));

      card.addEventListener('mouseenter', () => {
        if (!card.classList.contains('active')) {
          card.style.transform = 'translateY(-4px)';
        }
      });

      card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('active')) {
          card.style.transform = '';
        }
      });
    });

    // Botões de ação
    document.querySelector('.btn-primary')?.addEventListener('click', () => {
      this.showQuoteModal();
    });

    document.querySelector('.btn-secondary')?.addEventListener('click', () => {
      this.downloadSpecSheet();
    });

    // Controles de imagem
    document.querySelectorAll('.image-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const action = this.querySelector('i').className;
        if (action.includes('magnifying-glass-plus')) {
          this.handleZoom();
        } else if (action.includes('rotate-right')) {
          this.handleRotate();
        } else if (action.includes('cube')) {
          this.show3DView();
        }
      }.bind(this));
    });
  }

  async switchProduct(card) {
    if (this.animationInProgress) return;

    const productId = card.dataset.id;
    if (productId === this.currentProductId) return;

    this.animationInProgress = true;

    // Remover estado ativo anterior
    document.querySelector('.product-card.active')?.classList.remove('active');

    // Adicionar estado ativo ao novo card
    card.classList.add('active');

    // Buscar idioma atual
    let lang = 'pt';
    if (window.languageManager && window.languageManager.currentLanguage) {
      lang = window.languageManager.currentLanguage;
    } else if (typeof languageManager !== 'undefined' && languageManager.currentLanguage) {
      lang = languageManager.currentLanguage;
    } else {
      lang = document.documentElement.getAttribute('lang') || 'pt';
    }

    // Buscar descrição correta do card
    let description = card.getAttribute('data-i18n-' + lang) || card.dataset.description || '';
    let title = card.getAttribute('data-title-' + lang) || card.dataset.title || '';
    let img = card.dataset.img || '';

    // Animação de saída
    this.titleEl.classList.add('text-transition-out');
    this.descEl.classList.add('text-transition-out');
    this.productImage.classList.add('img-fade-out');

    // Esperar animação de saída
    await new Promise(resolve => setTimeout(resolve, 300));

    // Atualizar conteúdo
    this.productImage.src = img;
    this.productImage.alt = title;
    this.titleEl.textContent = title;
    this.descEl.textContent = description;

    // Animação de entrada
    this.titleEl.classList.remove('text-transition-out');
    this.descEl.classList.remove('text-transition-out');
    this.productImage.classList.remove('img-fade-out');

    this.titleEl.classList.add('text-transition-in');
    this.descEl.classList.add('text-transition-in');
    this.productImage.classList.add('img-fade-in');

    // Atualizar estado
    this.currentProductId = productId;

    // Ajustar imagem para o tema atual
    if (themeManager.getCurrentTheme() === 'dark') {
      this.productImage.style.filter = 'brightness(0.95) contrast(1.05)';
    }

    // Remover classes de animação após conclusão
    setTimeout(() => {
      this.titleEl.classList.remove('text-transition-in');
      this.descEl.classList.remove('text-transition-in');
      this.productImage.classList.remove('img-fade-in');
      this.animationInProgress = false;
    }, 500);

    // Feedback visual
    card.style.transform = 'scale(0.98)';
    setTimeout(() => {
      card.style.transform = '';
    }, 200);
  }

  handleZoom() {
    this.productImage.style.transform = this.productImage.style.transform === 'scale(1.5)'
      ? 'scale(1)'
      : 'scale(1.5)';
  }

  handleRotate() {
    const currentRotate = parseInt(this.productImage.style.transform.replace(/[^0-9]/g, '')) || 0;
    this.productImage.style.transform = `rotate(${currentRotate + 90}deg)`;
  }

  show3DView() {
    this.showNotification('Visualização 3D em desenvolvimento');
  }

  showQuoteModal() {
    let lang = 'pt';
    if (window.languageManager && window.languageManager.currentLanguage) {
      lang = window.languageManager.currentLanguage;
    } else if (typeof languageManager !== 'undefined' && languageManager.currentLanguage) {
      lang = languageManager.currentLanguage;
    }

    const translations = {
      pt: { title: 'Solicitar Orçamento', message: 'Formulário de orçamento será aberto em breve.', close: 'Fechar' },
      en: { title: 'Request Quote', message: 'Quote form will open soon.', close: 'Close' },
      es: { title: 'Solicitar Presupuesto', message: 'El formulario de presupuesto se abrirá pronto.', close: 'Cerrar' }
    };

    const t = translations[lang] || translations.pt;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>${t.title}</h3>
        <p>${t.message}</p>
        <button type="button" class="btn btn-primary close-modal">${t.close}</button>
      </div>
    `;

    const closeModal = () => {
      modal.remove();
      document.removeEventListener('keydown', handleEscape);
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    modal.querySelector('.close-modal').addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });

    modal.addEventListener('click', (e) => {
      if (!e.target.closest('.modal-content')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', handleEscape);

    document.body.appendChild(modal);
  }

  downloadSpecSheet() {
    let lang = 'pt';
    if (window.languageManager && window.languageManager.currentLanguage) {
      lang = window.languageManager.currentLanguage;
    } else if (typeof languageManager !== 'undefined' && languageManager.currentLanguage) {
      lang = languageManager.currentLanguage;
    }

    const translations = {
      pt: 'Ficha técnica sendo baixada...',
      en: 'Technical sheet being downloaded...',
      es: 'Ficha técnica siendo descargada...'
    };

    const message = translations[lang] || translations.pt;
    this.showNotification(message);
  }

  setupProductObservers() {
    // Observar mudanças no DOM para aplicar tema a novos elementos
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          // Reconfigurar event listeners para novos elementos
          this.setupEventListeners();
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 32px;
      background: ${themeManager.getCurrentTheme() === 'dark' ? 'var(--dark-surface)' : 'var(--primary)'};
      color: ${themeManager.getCurrentTheme() === 'dark' ? 'var(--dark-text-primary)' : 'white'};
      padding: 16px 24px;
      border-radius: var(--radius-lg);
      box-shadow: ${themeManager.getCurrentTheme() === 'dark' ? 'var(--dark-shadow-lg)' : 'var(--shadow-lg)'};
      z-index: 2000;
      animation: slideInRight 0.3s ease-out;
      border: 1px solid ${themeManager.getCurrentTheme() === 'dark' ? 'var(--dark-border)' : 'transparent'};
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// ====================
// SISTEMA DE IDIOMA
// ====================

class LanguageManager {
  constructor() {
    this.flagToggle = document.getElementById('flagToggle');
    this.flagMenu = document.getElementById('flagMenu');

    // idiomas que você suporta
    this.supportedLanguages = ['pt', 'en', 'es'];
    this.currentLanguage = 'pt';



    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadSavedLanguage();         // define this.currentLanguage
    this.applyLanguage(this.currentLanguage); // aplica textos na página
  }

  setupEventListeners() {
    this.flagToggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleFlagMenu();
    });

    // Usar delegação de eventos para .flag-option — mais robusto caso o DOM mude
    document.addEventListener('click', (e) => {
      const opt = e.target.closest && e.target.closest('.flag-option');
      if (opt) {
        e.stopPropagation();
        this.selectLanguage(opt);
        return;
      }

      // fechamento do menu ao clicar fora
      this.closeFlagMenu(e);
    });
  }

  toggleFlagMenu() {
    const expanded = this.flagToggle.getAttribute('aria-expanded') === 'true';
    this.flagMenu.classList.toggle('hidden');
    this.flagToggle.setAttribute('aria-expanded', String(!expanded));
    this.flagMenu.setAttribute('aria-hidden', String(expanded));
  }

  selectLanguage(button) {
    const lang = button.dataset.lang || 'pt';
    const langText = button.textContent.trim();

    this.currentLanguage = lang;

    // Atualizar botão de bandeira
    this.updateFlagButton(lang, langText);

    // Fechar menu
    this.flagMenu.classList.add('hidden');
    this.flagToggle.setAttribute('aria-expanded', 'false');
    this.flagMenu.setAttribute('aria-hidden', 'true');

    // Aplicar linguagem na página
    this.applyLanguage(lang);

    // Feedback
    this.showNotification(this.getLanguageChangeMessage(lang, langText));

    // Salvar preferência
    localStorage.setItem('language', lang);
  }

  updateFlagButton(lang, langText) {
    if (!this.flagToggle) return;

    // Mapa correto: idioma → código de bandeira da flag-icon-css
    const flagMap = {
      pt: 'br', // português → Brasil
      en: 'us', // inglês → EUA
      es: 'es', // espanhol → Espanha (ou troca se quiser outro país)
    };

    const flagCode = flagMap[lang] || 'br'; // fallback pra BR se vier algo estranho
    const shortLabel = (langText || '').trim().split(' ')[0];

    this.flagToggle.innerHTML = `
    <span class="flag-icon flag-icon-${flagCode}"></span>
    ${shortLabel}
    <i class="fa-solid fa-chevron-down"></i>
  `;
  }


  closeFlagMenu(e) {
    if (
      !this.flagMenu.classList.contains('hidden') &&
      !this.flagToggle.contains(e.target) &&
      !this.flagMenu.contains(e.target)
    ) {
      this.flagMenu.classList.add('hidden');
      this.flagToggle.setAttribute('aria-expanded', 'false');
      this.flagMenu.setAttribute('aria-hidden', 'true');
    }
  }

  loadSavedLanguage() {
    const savedLanguage = localStorage.getItem('language');

    if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
      this.currentLanguage = savedLanguage;
    } else {
      this.currentLanguage = 'pt';
    }

    const flagOption = document.querySelector(
      `[data-lang="${this.currentLanguage}"]`
    );

    if (flagOption) {
      const langText = flagOption.textContent.trim();
      this.updateFlagButton(this.currentLanguage, langText);
    } else {
      // fallback hardcoded se der ruim
      this.updateFlagButton('pt', 'Português');
    }
  }


  applyLanguage(lang) {
    // <html lang="pt">
    document.documentElement.setAttribute('lang', lang);

    // Textos/HTML: elementos com data-i18n + data-i18n-pt / data-i18n-en / etc.
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const attrName = `data-i18n-${lang}`;
      const translation = el.getAttribute(attrName);

      if (!translation) return;

      const tag = el.tagName.toLowerCase();

      if (tag === 'input' || tag === 'textarea') {
        // placeholder ou valor
        if (el.hasAttribute('placeholder')) {
          el.placeholder = translation;
        } else {
          el.value = translation;
        }
      } else if (tag === 'p') {
        // Para parágrafos, usar textContent para preservar apenas o texto
        el.textContent = translation;
      } else {
        el.innerHTML = translation;
      }
    });

    // title: elementos com data-i18n-title / data-i18n-title-pt / data-i18n-title-en
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const attrName = `data-i18n-title-${lang}`;
      const translation = el.getAttribute(attrName);
      if (translation) el.title = translation;
    });

    // aria-label: elementos com data-i18n-aria-label / data-i18n-aria-label-pt / etc.
    document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
      const attrName = `data-i18n-aria-label-${lang}`;
      const translation = el.getAttribute(attrName);
      if (translation) el.setAttribute('aria-label', translation);
    });
  }

  getLanguageChangeMessage(lang, langText) {
    const map = {
      pt: `Idioma alterado para ${langText}`,
      en: `Language changed to ${langText}`,
      es: `Idioma cambiado a ${langText}`,
    };
    return map[lang] || map.pt;
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    const isDark =
      typeof themeManager !== 'undefined' &&
      themeManager.getCurrentTheme &&
      themeManager.getCurrentTheme() === 'dark';

    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 32px;
      background: ${isDark ? 'var(--dark-surface)' : 'var(--primary)'};
      color: ${isDark ? 'var(--dark-text-primary)' : 'white'};
      padding: 16px 24px;
      border-radius: var(--radius-lg);
      box-shadow: ${isDark ? 'var(--dark-shadow-lg)' : 'var(--shadow-lg)'};
      z-index: 2000;
      animation: slideInRight 0.3s ease-out;
      border: 1px solid ${isDark ? 'var(--dark-border)' : 'transparent'};
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// ====================
// INICIALIZAÇÃO (variáveis globais de instância)
// ====================

let themeManager, productManager, languageManager, searchManager;

// ====================
// SISTEMA DE NAVEGAÇÃO ENTRE PÁGINAS
// ====================

class NavigationManager {
  constructor() {
    this.currentPage = this.getCurrentPage();
    this.init();
  }

  init() {
    this.highlightCurrentPage();
    this.setupNavigation();
  }

  getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('catalog.html')) return 'catalog';
    if (path.includes('sobre.html')) return 'sobre';
    if (path.includes('imprensa.html')) return 'imprensa';
    if (path.includes('contato.html')) return 'contato';
    return 'index';
  }

  highlightCurrentPage() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.classList.remove('active');

      const href = link.getAttribute('href');
      if (!href) return;

      if ((this.currentPage === 'index' && href.includes('index.html')) ||
        (this.currentPage === 'catalog' && href.includes('catalog.html')) ||
        (this.currentPage === 'sobre' && href.includes('sobre.html')) ||
        (this.currentPage === 'imprensa' && href.includes('imprensa.html')) ||
        (this.currentPage === 'contato' && href.includes('contato.html'))) {
        link.classList.add('active');
      }
    });
  }

  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#')) {
          // Se não for link externo, permitir navegação normal
          if (!href.includes('http') && !href.includes('www.')) {
            e.preventDefault();
            window.location.href = href;
          }
        }
      });
    });
  }
}

// ====================
// FUNCIONALIDADES ESPECÍFICAS DO CATÁLOGO
// ====================

class CatalogFeatures {
  constructor() {
    if (document.querySelector('.catalog-container')) {
      this.init();
    }
  }

  init() {
    this.setupDownloadButtons();
    this.setupCopyLinks();
    this.setupCatalogSearch();
  }

  setupDownloadButtons() {
    const downloadButtons = document.querySelectorAll('[href*="download"]');
    downloadButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        if (!button.href.includes('http')) {
          e.preventDefault();
          this.showDownloadModal();
        }
      });
    });
  }

  setupCopyLinks() {
    const copyButtons = document.querySelectorAll('.action-link a');
    copyButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        if (!button.href.includes('http')) {
          e.preventDefault();
          const textToCopy = button.querySelector('span')?.textContent || button.textContent;
          this.copyToClipboard(textToCopy);
        }
      });
    });
  }

  setupCatalogSearch() {
    const searchInput = document.getElementById('catalogSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filterCatalogItems(e.target.value);
      });
    }
  }

  showDownloadModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>Download do Catálogo</h3>
        <p>O download do catálogo em PDF será iniciado automaticamente.</p>
        <p>Tamanho do arquivo: 45 MB</p>
        <div class="modal-actions">
          <button type="button" class="btn btn-primary download-confirm">Continuar Download</button>
          <button type="button" class="btn btn-secondary cancel-download">Cancelar</button>
        </div>
      </div>
    `;

    const closeModal = () => {
      modal.remove();
      document.removeEventListener('keydown', handleEscape);
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    modal.querySelector('.download-confirm').addEventListener('click', () => {
      this.simulateDownload();
      closeModal();
    });

    modal.querySelector('.cancel-download').addEventListener('click', () => {
      closeModal();
    });

    modal.addEventListener('click', (e) => {
      if (!e.target.closest('.modal-content')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', handleEscape);

    document.body.appendChild(modal);
  }

  simulateDownload() {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = 'Download iniciado! O arquivo será salvo em seu dispositivo.';
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 32px;
      background: ${themeManager?.getCurrentTheme() === 'dark' ? 'var(--dark-surface)' : 'var(--primary)'};
      color: ${themeManager?.getCurrentTheme() === 'dark' ? 'var(--dark-text-primary)' : 'white'};
      padding: 16px 24px;
      border-radius: var(--radius-lg);
      box-shadow: ${themeManager?.getCurrentTheme() === 'dark' ? 'var(--dark-shadow-lg)' : 'var(--shadow-lg)'};
      z-index: 2000;
      animation: slideInRight 0.3s ease-out;
      border: 1px solid ${themeManager?.getCurrentTheme() === 'dark' ? 'var(--dark-border)' : 'transparent'};
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      this.showNotification('Link copiado para a área de transferência!');
    }).catch(err => {
      console.error('Erro ao copiar: ', err);
      this.showNotification('Erro ao copiar o link.');
    });
  }

  filterCatalogItems(searchTerm) {
    const items = document.querySelectorAll('.format-card, .product-card-large');
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(searchTerm.toLowerCase())) {
        item.style.display = 'block';
        item.style.animation = 'fadeIn 0.3s ease';
      } else {
        item.style.display = 'none';
      }
    });
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 32px;
      background: ${themeManager?.getCurrentTheme() === 'dark' ? 'var(--dark-surface)' : 'var(--primary)'};
      color: ${themeManager?.getCurrentTheme() === 'dark' ? 'var(--dark-text-primary)' : 'white'};
      padding: 16px 24px;
      border-radius: var(--radius-lg);
      box-shadow: ${themeManager?.getCurrentTheme() === 'dark' ? 'var(--dark-shadow-lg)' : 'var(--shadow-lg)'};
      z-index: 2000;
      animation: slideInRight 0.3s ease-out;
      border: 1px solid ${themeManager?.getCurrentTheme() === 'dark' ? 'var(--dark-border)' : 'transparent'};
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// ====================
// FUNCIONALIDADES ESPECÍFICAS DA PÁGINA SOBRE
// ====================

class AboutFeatures {
  constructor() {
    if (document.querySelector('.about-container')) {
      this.init();
    }
  }

  init() {
    this.setupTimelineAnimation();
    this.setupTeamCards();
    this.setupCertificationModal();
  }

  setupTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }
      });
    }, { threshold: 0.5 });

    timelineItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-20px)';
      item.style.transition = `opacity 0.5s ease ${index * 0.2}s, transform 0.5s ease ${index * 0.2}s`;
      observer.observe(item);
    });
  }

  setupTeamCards() {
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.05)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  setupCertificationModal() {
    const certificationItems = document.querySelectorAll('.certification-list li');
    certificationItems.forEach(item => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => {
        this.showCertificationDetails(item.textContent);
      });
    });
  }

  showCertificationDetails(certification) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>${certification}</h3>
        <p>Esta certificação garante que nossos processos atendem aos mais altos padrões internacionais de qualidade.</p>
        <p><strong>Validade:</strong> Perpétua (com auditorias anuais)</p>
        <p><strong>Escopo:</strong> Desenvolvimento e fabricação de sistemas de vedação</p>
        <button type="button" class="btn btn-primary close-modal">Fechar</button>
      </div>
    `;

    const closeModal = () => {
      modal.remove();
      document.removeEventListener('keydown', handleEscape);
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    modal.querySelector('.close-modal').addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });

    modal.addEventListener('click', (e) => {
      if (!e.target.closest('.modal-content')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', handleEscape);

    document.body.appendChild(modal);
  }
}

// ====================
// FUNÇÕES GLOBAIS ADICIONAIS
// ====================

// Adicionar estilos dinâmicos para novas funcionalidades
function addAdditionalStyles(currentPage) {
  const style = document.createElement('style');
  style.textContent = `
    .modal-actions {
      display: flex;
      gap: 15px;
      margin-top: 25px;
      flex-wrap: wrap;
    }
    
    .modal-actions .btn {
      flex: 1;
      min-width: 140px;
    }
    
    .team-card {
      transition: all 0.3s ease;
      cursor: pointer;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    
    /* Estilos para página específica */
    .page-indicator {
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: var(--primary);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      z-index: 100;
    }
    
    body.dark-mode .page-indicator {
      background: var(--dark-primary);
    }
  `;
  document.head.appendChild(style);

  // Adicionar indicador de página (apenas para desenvolvimento)
  // (Removed page indicator insertion - no visual dev balloon shown)
}

// Adicionar estilos dinâmicos
function addDynamicStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes slideOutRight {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(100%);
      }
    }
    
    /* Modal styles moved to CSS file (src/styles/index.css) to support dynamic theme changes */
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    
    .search-highlight {
      background: ${themeManager?.getCurrentTheme() === 'dark' ? 'rgba(255, 204, 0, 0.3)' : 'rgba(255, 204, 0, 0.5)'};
      padding: 1px 3px;
      border-radius: 2px;
      font-weight: bold;
    }
    
    /* Efeito de transição suave para todo o site */
    .theme-transition {
      transition: all 0.3s ease !important;
    }
  `;
  document.head.appendChild(style);
}

// ====================
// MENU HAMBURGUER
// ====================

class MenuToggle {
  constructor() {
    this.menuToggle = document.getElementById('menuToggle');
    this.navMenu = document.getElementById('navMenu');
    this.init();
  }

  init() {
    if (!this.menuToggle || !this.navMenu) return;

    this.setupEventListeners();
    this.closeMenuOnResize();
  }

  setupEventListeners() {
    // Clicar no botão hamburguer
    this.menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });

    // Clicar em um link do menu
    this.navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });

    // Clicar fora do menu para fechar
    document.addEventListener('click', (e) => {
      if (!this.menuToggle.contains(e.target) && !this.navMenu.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Fechar ao pressionar ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    const isActive = this.navMenu.classList.contains('active');
    if (isActive) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.navMenu.classList.add('active');
    this.menuToggle.classList.add('active');
    this.menuToggle.setAttribute('aria-expanded', 'true');
  }

  closeMenu() {
    this.navMenu.classList.remove('active');
    this.menuToggle.classList.remove('active');
    this.menuToggle.setAttribute('aria-expanded', 'false');
  }

  closeMenuOnResize() {
    window.addEventListener('resize', () => {
      // Fechar menu quando sair do modo mobile
      if (window.innerWidth > 768) {
        this.closeMenu();
      }
    });
  }
}

// ====================
// INICIALIZAÇÃO COMPLETA
// ====================

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar gerenciador de tema
  themeManager = new ThemeManager();

  // Inicializar menu hamburguer
  const menuToggle = new MenuToggle();

  // Inicializar navegação
  const navigationManager = new NavigationManager();
  const currentPage = navigationManager.getCurrentPage();
  // Inicializar recursos específicos por página
  // Garantir LanguageManager em todas as páginas (replicar comportamento das páginas que funcionam)
  if (!languageManager) {
    languageManager = new LanguageManager();
  }

  // Inicializar recursos específicos por página
  if (currentPage === 'index') {
    productManager = new ProductManager();
    searchManager = new SearchManager();
  } else if (currentPage === 'catalog') {
    const catalogFeatures = new CatalogFeatures();
    searchManager = new SearchManager();
  } else if (currentPage === 'sobre') {
    const aboutFeatures = new AboutFeatures();
  }

  // Inicializar sistema de busca global
  if (searchManager && !window.searchManager) {
    window.searchManager = searchManager;
  }

  // Estilos dinâmicos (agora que themeManager existe)
  addDynamicStyles();
  addAdditionalStyles(currentPage);

  // Exportar instâncias globais, se for usar em outro script
  window.themeManager = themeManager;
  window.productManager = productManager;
  window.languageManager = languageManager;

  // Inicializar form de contato
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const sending = document.getElementById('sending');
  const alertEl = document.getElementById('formAlert');
  const errorEl = document.getElementById('formError');
  const charCount = document.getElementById('charCount');
  const mensagem = document.getElementById('mensagem');

  // Verificar se voltou da página de sucesso do FormSubmit
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('enviado') === '1') {
    alertEl.textContent = 'Mensagem enviada com sucesso! Obrigado pelo contato.';
    alertEl.style.display = 'block';
    // Limpar a URL
    window.history.replaceState(null, null, window.location.pathname);
  }

  if (mensagem) {
    mensagem.addEventListener('input', () => {
      charCount.textContent = `${mensagem.value.length} / 3000`;
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      alertEl.style.display = 'none';
      errorEl.style.display = 'none';

      const formData = new FormData(form);
      if (formData.get('website')) { // honeypot
        e.preventDefault();
        return;
      }

      if (!form.checkValidity()) {
        e.preventDefault();
        form.reportValidity();
        return;
      }

      // Validação passou, permitir envio para FormSubmit.co
      submitBtn.disabled = true;
      sending.style.display = 'block';
      // Não chamar e.preventDefault() para permitir o submit
    });
  }

  // Verificar se voltou da página de sucesso do FormSubmit
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('enviado') === '1') {
    alertEl.textContent = 'Mensagem enviada com sucesso! Obrigado pelo contato.';
    alertEl.style.display = 'block';
    // Limpar a URL
