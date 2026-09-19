// ==========================================================================
// BUNYOD PLATFORMASI - SHAXSIY KABINET VA PROFIL (DASHBOARD & USER PROFILE)
// ==========================================================================

import { multilingualCourses } from './data.js';
import { i18nManager } from './i18n.js';
import { authManager } from './auth.js';

class DashboardManager {
  constructor() {
    this.refreshLocalData();
  }

  refreshLocalData() {
    this.xp = authManager.getUserData('xp', 170);
    this.streak = authManager.getUserData('streak', 3);
  }

  init() {
    this.renderProfileCard();
    this.renderMetrics();
    this.renderBookOrders();

    i18nManager.onLanguageChange(() => {
      this.renderProfileCard();
      this.renderMetrics();
      this.renderBookOrders();
    });
  }

  addXP(amount) {
    this.xp += amount;
    authManager.setUserData('xp', this.xp);
    this.updateHeaderPills();
    this.renderMetrics();
  }

  updateHeaderPills() {
    const xpEl = document.getElementById('headerUserXP');
    const streakEl = document.getElementById('headerUserStreak');
    const unit = i18nManager.t('streak_unit');

    if (xpEl) xpEl.textContent = `${this.xp} XP`;
    if (streakEl) streakEl.textContent = `${this.streak} ${unit}`;
  }

  renderProfileCard() {
    const container = document.getElementById('dashboardProfileContainer');
    const bannerContainer = document.getElementById('guestBannerContainer');
    if (!container) return;

    const user = authManager.getUser();
    const isGuest = authManager.isGuest();

    // Mehmon banneri
    if (bannerContainer) {
      if (isGuest) {
        bannerContainer.style.display = 'block';
        bannerContainer.innerHTML = `
          <div class="guest-alert-banner">
            <div class="guest-alert-content">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <div>
                <h4>${i18nManager.t('guest_banner_title')}</h4>
                <p>${i18nManager.t('guest_banner_desc')}</p>
              </div>
            </div>
            <button class="btn-gold-elegant" onclick="window.openAuthModal('register')">
              ${i18nManager.t('guest_banner_cta')}
            </button>
          </div>
        `;
      } else {
        bannerContainer.style.display = 'none';
        bannerContainer.innerHTML = '';
      }
    }

    // Monogram
    const initials = user.name
      .split(' ')
      .map(w => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'M';

    container.innerHTML = `
      <div class="user-profile-header-card card-minimal">
        <div class="profile-identity-block">
          <div class="profile-large-avatar">${initials}</div>
          <div class="profile-identity-details">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 2px;">
              <h3>${user.name}</h3>
              <span class="profile-status-pill ${isGuest ? 'guest' : 'registered'}">
                ${isGuest ? i18nManager.t('profile_role_guest') : i18nManager.t('profile_role_registered')}
              </span>
            </div>
            <p>${user.email}</p>
            <small style="font-size: 12px; color: ${isGuest ? 'var(--earth-warm)' : 'var(--nature-green)'};">
              ${isGuest ? i18nManager.t('profile_guest_notice') : i18nManager.t('profile_save_notice')}
            </small>
          </div>
        </div>

        <div>
          ${isGuest ? `
            <button class="btn-gold-elegant" onclick="window.openAuthModal('login')">
              ${i18nManager.t('auth_login_btn')}
            </button>
          ` : `
            <button class="btn-outline-elegant" onclick="window.authManager.logout()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>${i18nManager.t('auth_logout_btn')}</span>
            </button>
          `}
        </div>
      </div>
    `;
  }

  renderMetrics() {
    this.refreshLocalData();
    this.updateHeaderPills();

    const lang = i18nManager.getLang();
    const courses = multilingualCourses[lang] || multilingualCourses.uz;

    const completedLessons = authManager.getUserData('completedLessons', []);
    let totalLessons = 0;
    courses.forEach(c => c.modules.forEach(m => totalLessons += m.lessons.length));

    const completedTasks = authManager.getUserData('completedTasks', {});
    const completedTasksCount = Object.keys(completedTasks).length;
    const unit = i18nManager.t('streak_unit');

    const dXp = document.getElementById('dashTotalXP');
    const dLessons = document.getElementById('dashCompletedLessons');
    const dTasks = document.getElementById('dashCompletedTasks');
    const dStreak = document.getElementById('dashCurrentStreak');

    if (dXp) dXp.textContent = `${this.xp} XP`;
    if (dLessons) dLessons.textContent = `${completedLessons.length} / ${totalLessons}`;
    if (dTasks) dTasks.textContent = `${completedTasksCount}`;
    if (dStreak) dStreak.textContent = `${this.streak} ${unit}`;

    this.renderBadges(completedLessons.length, completedTasksCount);
  }

  renderBadges(lessonsCount, tasksCount) {
    const badgesContainer = document.getElementById('dashboardBadgesContainer');
    if (!badgesContainer) return;

    const lang = i18nManager.getLang();
    const badgeNames = {
      uz: [
        { id: 'first-step', title: 'Ilk Qadam', desc: 'Birinchi darsni ko\'rish' },
        { id: 'calm-mind', title: 'Xotirjam Qalb', desc: 'Nafas mashqini bajarish' },
        { id: 'reflective-thinker', title: 'Ongli Refleksiya', desc: 'Amaliy vazifa topshirish' },
        { id: 'discipline-master', title: 'Intizom Ustasi', desc: '3 kunlik uzluksiz o\'qish' },
        { id: 'life-balance', title: 'Uyg\'un Shaxs', desc: 'Hayot g\'ildiragini to\'ldirish' }
      ],
      uz_cyrl: [
        { id: 'first-step', title: 'Илк Қадам', desc: 'Биринчи дарсни кўриш' },
        { id: 'calm-mind', title: 'Хотиржам Қалб', desc: 'Нафас машқини бажариш' },
        { id: 'reflective-thinker', title: 'Онгли Рефлексия', desc: 'Амалий вазифа топшириш' },
        { id: 'discipline-master', title: 'Интизом Устаси', desc: '3 кунлик узлуксиз ўқиш' },
        { id: 'life-balance', title: 'Уйғун Шахс', desc: 'Ҳаёт ғилдирагини тўлдириш' }
      ],
      ru: [
        { id: 'first-step', title: 'Первый Шаг', desc: 'Просмотр первого урока' },
        { id: 'calm-mind', title: 'Ясный Покой', desc: 'Дыхательная практика' },
        { id: 'reflective-thinker', title: 'Осознанность', desc: 'Сдача практического задания' },
        { id: 'discipline-master', title: 'Мастер Дисциплины', desc: '3 дня непрерывных занятий' },
        { id: 'life-balance', title: 'Гармония Жизни', desc: 'Анализ колеса баланса' }
      ],
      en: [
        { id: 'first-step', title: 'First Milestone', desc: 'Complete first lesson' },
        { id: 'calm-mind', title: 'Serene Spirit', desc: 'Finish breathing practice' },
        { id: 'reflective-thinker', title: 'Mindful Thinker', desc: 'Submit written reflection' },
        { id: 'discipline-master', title: 'Discipline Master', desc: '3-day continuous streak' },
        { id: 'life-balance', title: 'Balanced Soul', desc: 'Complete Life Wheel assessment' }
      ]
    };

    const curBadges = badgeNames[lang] || badgeNames.uz;

    const badges = [
      { ...curBadges[0], unlocked: lessonsCount >= 1 },
      { ...curBadges[1], unlocked: this.xp >= 150 },
      { ...curBadges[2], unlocked: tasksCount >= 1 },
      { ...curBadges[3], unlocked: this.streak >= 3 },
      { ...curBadges[4], unlocked: authManager.getUserData('wheelScores', null) !== null }
    ];

    badgesContainer.innerHTML = badges.map(b => `
      <div class="achievement-badge ${b.unlocked ? 'unlocked' : ''}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="${b.unlocked ? 'var(--nature-green)' : 'none'}" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="8" r="7"></circle>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
        </svg>
        <span>${b.title}</span>
      </div>
    `).join('');
  }

  renderBookOrders() {
    const ordersContainer = document.getElementById('dashboardOrdersContainer');
    if (!ordersContainer) return;

    const orders = authManager.getUserData('bookOrders', []);
    if (orders.length === 0) {
      ordersContainer.innerHTML = `
        <div style="text-align: center; padding: 24px 16px; color: var(--text-tertiary); font-size: 13.5px;">
          <div style="font-size: 28px; margin-bottom: 6px;">📦</div>
          <p>${i18nManager.t('dashboard_no_orders')}</p>
          <button class="btn-outline-elegant" style="margin-top: 12px; font-size: 13px;" onclick="window.navigateTo('books')">
            ${i18nManager.t('nav_books')}
          </button>
        </div>
      `;
      return;
    }

    ordersContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 12px;">
        ${orders.map(o => `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-radius: var(--radius-sm); background: var(--bg-canvas); border: 1px solid var(--border-hairline); flex-wrap: wrap; gap: 10px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <strong style="color: var(--text-pure); font-size: 15px;">${o.bookTitle}</strong>
                <span style="font-size: 11.5px; background: var(--nature-green-soft); color: var(--nature-green); padding: 2px 8px; border-radius: var(--radius-full); font-weight: 700;">${o.quantity} dona</span>
              </div>
              <p style="font-size: 12.5px; color: var(--text-secondary); margin: 2px 0 0;">Buyurtma: #${o.id} • ${o.date} • ${o.deliveryAddress}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 14px;">
              <strong style="color: var(--text-pure); font-size: 15px;">${o.totalPrice}</strong>
              <span style="font-size: 12px; padding: 4px 12px; border-radius: var(--radius-full); background: rgba(45, 106, 79, 0.15); color: var(--nature-green); font-weight: 700; border: 1px solid rgba(45, 106, 79, 0.3);">
                ${o.status}
              </span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderDashboard() {
    this.renderProfileCard();
    this.renderMetrics();
    this.renderBookOrders();
  }
}

export const dashboardManager = new DashboardManager();
window.addXP = (amt) => dashboardManager.addXP(amt);
window.refreshDashboard = () => {
  dashboardManager.renderDashboard();
};

