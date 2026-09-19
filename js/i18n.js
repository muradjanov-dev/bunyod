// ==========================================================================
// BUNYOD PLATFORMASI - TILLAR VA REJIMLAR BOSHQARUVCHISI (I18N & THEME)
// ==========================================================================

import { translations } from './translations.js';

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem('bunyod_lang') || 'uz';
    this.currentTheme = localStorage.getItem('bunyod_theme') || 'dark';
    this.listeners = [];
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.bindThemeToggle();
    this.bindLangDropdown();
    this.applyTranslations();
  }

  getLang() {
    return this.currentLang;
  }

  t(key) {
    const langDict = translations[this.currentLang] || translations.uz;
    return langDict[key] || translations.uz[key] || key;
  }

  setLang(lang) {
    if (!['uz', 'uz_cyrl', 'ru', 'en'].includes(lang)) return;
    this.currentLang = lang;
    localStorage.setItem('bunyod_lang', lang);
    this.applyTranslations();
    this.updateLangUI();
    this.notifyListeners();
  }

  onLanguageChange(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    this.listeners.forEach(cb => {
      try {
        cb(this.currentLang);
      } catch (e) {
        console.error("I18n listener error:", e);
      }
    });
  }

  applyTranslations() {
    const dict = translations[this.currentLang] || translations.uz;

    // data-i18n tegiga ega barcha elementlarni yangilash
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.placeholder = dict[key];
      }
    });

    // data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (dict[key]) {
        el.title = dict[key];
      }
    });
  }

  bindLangDropdown() {
    const btn = document.getElementById('langSelectBtn');
    const menu = document.getElementById('langDropdownMenu');

    if (!btn || !menu) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('visible');
    });

    document.addEventListener('click', () => {
      menu.classList.remove('visible');
    });

    menu.querySelectorAll('.lang-item-btn').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedLang = item.dataset.lang;
        this.setLang(selectedLang);
        menu.classList.remove('visible');
      });
    });

    this.updateLangUI();
  }

  updateLangUI() {
    const labelEl = document.getElementById('currentLangLabel');
    const langNames = {
      uz: "O'zbek",
      uz_cyrl: "Ўзбек",
      ru: "Русский",
      en: "English"
    };

    if (labelEl) {
      labelEl.textContent = langNames[this.currentLang] || "O'zbek";
    }

    document.querySelectorAll('.lang-item-btn').forEach(item => {
      item.classList.toggle('active', item.dataset.lang === this.currentLang);
    });
  }

  // --- THEME (KUNDUZGI / TUNGI) ---
  applyTheme(theme) {
    this.currentTheme = theme;
    localStorage.setItem('bunyod_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
      if (theme === 'light') {
        // Quyosh/Oy ikonkasi
        btn.innerHTML = `
          <svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        `;
        btn.title = this.t('theme_dark');
      } else {
        btn.innerHTML = `
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        `;
        btn.title = this.t('theme_light');
      }
    }

    window.onThemeChange?.(theme);
  }

  bindThemeToggle() {
    const btn = document.getElementById('themeToggleBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.applyTheme(nextTheme);
      window.showToast?.(nextTheme === 'light' ? "Kunduzgi rejim yoqildi" : "Tungi rejim yoqildi");
    });
  }
}

export const i18nManager = new I18nManager();
