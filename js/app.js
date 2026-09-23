// ==========================================================================
// BUNYOD PLATFORMASI - ASOSIY ILOVA (APP ROUTER & CONTROLLER)
// ==========================================================================

import { i18nManager } from './i18n.js';
import { authManager } from './auth.js';
import { quotesManager } from './quotes.js';
import { coursesManager } from './courses.js';
import { tasksManager } from './tasks.js';
import { diagnosticsManager } from './diagnostics.js';
import { breathingManager } from './breathing.js';
import { dashboardManager } from './dashboard.js';
import { booksManager } from './books.js';
import { passportManager } from './passport.js';

class BunyodApp {
  constructor() {
    this.currentView = 'home';
    this.authMode = 'login'; // 'login' or 'register'
  }

  init() {
    // 1. Til va Mavzuni ishga tushirish
    i18nManager.init();

    this.bindNavigation();
    this.initToastSystem();
    this.bindAuthModal();
    this.updateHeaderProfileBadge();

    // 2. Qolgan modullarni ishga tushirish
    quotesManager.init();
    coursesManager.init();
    tasksManager.init();
    diagnosticsManager.init();
    breathingManager.init();
    dashboardManager.init();
    booksManager.init();
    passportManager.init();

    // Hash orqali navigatsiya
    const hash = window.location.hash.replace('#', '');
    if (hash && ['home', 'passport', 'courses', 'books', 'tasks', 'diagnostics', 'calm', 'dashboard'].includes(hash)) {
      this.navigateTo(hash);
    } else {
      this.navigateTo('home');
    }

    // Oyna o'lchami o'zgarganda g'ildirakni qayta chizish
    window.addEventListener('resize', () => {
      diagnosticsManager.drawWheel();
    });

    i18nManager.onLanguageChange(() => {
      this.updateHeaderProfileBadge();
      this.updateAuthModalUI();
    });
  }

  bindNavigation() {
    document.querySelectorAll('.nav-link-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        this.navigateTo(view);
      });
    });

    window.navigateTo = (view) => this.navigateTo(view);
  }

  navigateTo(viewName) {
    this.currentView = viewName;
    window.location.hash = viewName;

    // Nav tugmalarini faollashtirish
    document.querySelectorAll('.nav-link-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    // Bo'limlarni ko'rsatish/yashirish
    document.querySelectorAll('.view-panel').forEach(panel => {
      panel.classList.remove('active');
    });

    const activePanel = document.getElementById(`view-${viewName}`);
    if (activePanel) {
      activePanel.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (viewName === 'diagnostics') {
        setTimeout(() => diagnosticsManager.drawWheel(), 50);
      }
      if (viewName === 'passport') {
        passportManager.renderNavigationStepper();
        passportManager.renderPersonas();
      }
      if (viewName === 'books') {
        booksManager.renderBooks();
      }
      if (viewName === 'dashboard') {
        dashboardManager.renderDashboard();
      }
    }
  }

  updateHeaderProfileBadge() {
    const avatarEl = document.getElementById('headerUserAvatarMonogram');
    const user = authManager.getUser();
    if (avatarEl && user) {
      const initial = user.name[0]?.toUpperCase() || 'M';
      avatarEl.textContent = initial;
    }
  }

  // --- AUTH MODAL BOSHQARUVI ---
  bindAuthModal() {
    const overlay = document.getElementById('authModalOverlay');
    const closeBtn = document.getElementById('closeAuthModalBtn');
    const tabLogin = document.getElementById('tabAuthLogin');
    const tabRegister = document.getElementById('tabAuthRegister');
    const form = document.getElementById('authForm');
    const guestBtn = document.getElementById('authGuestBtn');

    window.openAuthModal = (mode = 'login') => {
      this.authMode = mode;
      this.updateAuthModalUI();
      if (overlay) overlay.classList.add('visible');
    };

    window.closeAuthModal = () => {
      if (overlay) overlay.classList.remove('visible');
    };

    window.handleHeaderProfileClick = () => {
      if (authManager.isGuest()) {
        window.openAuthModal('login');
      } else {
        this.navigateTo('dashboard');
      }
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', () => window.closeAuthModal());
    }

    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) window.closeAuthModal();
      });
    }

    if (tabLogin) {
      tabLogin.addEventListener('click', (e) => {
        e.preventDefault();
        this.authMode = 'login';
        this.updateAuthModalUI();
      });
    }

    if (tabRegister) {
      tabRegister.addEventListener('click', (e) => {
        e.preventDefault();
        this.authMode = 'register';
        this.updateAuthModalUI();
      });
    }

    if (guestBtn) {
      guestBtn.addEventListener('click', () => {
        authManager.continueAsGuest();
        window.closeAuthModal();
        window.showToast?.("Mehmon rejimida davom etilmoqda");
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAuthSubmit();
      });
    }
  }

  updateAuthModalUI() {
    const tabLogin = document.getElementById('tabAuthLogin');
    const tabRegister = document.getElementById('tabAuthRegister');
    const nameField = document.getElementById('authNameField');
    const submitBtn = document.getElementById('authSubmitBtn');
    const errorBox = document.getElementById('authErrorMsg');

    if (errorBox) {
      errorBox.classList.remove('visible');
      errorBox.textContent = '';
    }

    if (this.authMode === 'register') {
      if (tabLogin) tabLogin.classList.remove('active');
      if (tabRegister) tabRegister.classList.add('active');
      if (nameField) nameField.style.display = 'flex';
      if (submitBtn) submitBtn.textContent = i18nManager.t('auth_submit_register');
    } else {
      if (tabLogin) tabLogin.classList.add('active');
      if (tabRegister) tabRegister.classList.remove('active');
      if (nameField) nameField.style.display = 'none';
      if (submitBtn) submitBtn.textContent = i18nManager.t('auth_submit_login');
    }
  }

  handleAuthSubmit() {
    const nameInput = document.getElementById('authNameInput');
    const emailInput = document.getElementById('authEmailInput');
    const passInput = document.getElementById('authPasswordInput');
    const errorBox = document.getElementById('authErrorMsg');

    const email = emailInput?.value?.trim() || '';
    const pass = passInput?.value || '';
    const name = nameInput?.value?.trim() || '';

    let res;
    if (this.authMode === 'register') {
      res = authManager.register(name, email, pass);
    } else {
      res = authManager.login(email, pass);
    }

    if (!res.success) {
      if (errorBox) {
        errorBox.textContent = res.error;
        errorBox.classList.add('visible');
      }
      return;
    }

    window.closeAuthModal();
    this.updateHeaderProfileBadge();
    window.showToast?.(i18nManager.t('toast_auth_success'));

    // Sahifani qayta chizish
    coursesManager.init();
    tasksManager.init();
    diagnosticsManager.init();
    dashboardManager.init();

    this.navigateTo('dashboard');
  }

  initToastSystem() {
    let toastContainer = document.getElementById('toastNotificationBox');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toastNotificationBox';
      toastContainer.style.cssText = `
        position: fixed;
        bottom: 28px;
        right: 28px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      `;
      document.body.appendChild(toastContainer);
    }

    window.showToast = (msg, duration = 3200) => {
      const toast = document.createElement('div');
      toast.style.cssText = `
        background: var(--bg-elevated);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid var(--border-hover);
        color: var(--text-pure);
        padding: 12px 22px;
        border-radius: 9999px;
        font-size: 13.5px;
        font-weight: 500;
        box-shadow: var(--shadow-elevated);
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: auto;
      `;
      toast.innerHTML = `
        <span style="color: var(--trust-blue);">✦</span>
        <span>${msg}</span>
      `;
      toastContainer.appendChild(toast);

      requestAnimationFrame(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
      });

      setTimeout(() => {
        toast.style.transform = 'translateY(15px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new BunyodApp();
  app.init();
});
