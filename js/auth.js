// ==========================================================================
// BUNYOD PLATFORMASI - FOYDALANUVCHILAR VA AUTH TIZIMI (AUTH & SESSIONS)
// Ro'yxatdan o'tgan foydalanuvchilar: doimiy saqlanadi (localStorage)
// Mehmon rejimi (Guest): vaqtinchalik sessiya (sessionStorage), sahifa yopilganda o'chadi
// ==========================================================================

import { i18nManager } from './i18n.js';

class AuthManager {
  constructor() {
    this.users = JSON.parse(localStorage.getItem('bunyod_registered_users') || '[]');
    this.currentUser = JSON.parse(sessionStorage.getItem('bunyod_active_session') || 'null');
    
    // Agar sessiya bo'lmasa, localStorage'dagi eslab qolingan akkauntni tekshiramiz
    if (!this.currentUser) {
      const rememberedEmail = localStorage.getItem('bunyod_current_user_email');
      if (rememberedEmail) {
        const found = this.users.find(u => u.email === rememberedEmail);
        if (found) {
          this.currentUser = found;
          sessionStorage.setItem('bunyod_active_session', JSON.stringify(found));
        }
      }
    }

    // Agar hamon foydalanuvchi bo'lmasa -> Mehmon (Guest) rejimi
    if (!this.currentUser) {
      this.initGuestSession();
    }
  }

  initGuestSession() {
    this.currentUser = {
      id: 'guest_' + Date.now(),
      name: 'Mehmon O\'quvchi',
      email: 'guest@bunyod.local',
      isGuest: true,
      createdAt: new Date().toISOString()
    };
    sessionStorage.setItem('bunyod_active_session', JSON.stringify(this.currentUser));
  }

  isGuest() {
    return !!this.currentUser?.isGuest;
  }

  getUser() {
    return this.currentUser;
  }

  // --- RO'YXATDAN O'TISH (SIGN UP) ---
  register(name, email, password) {
    if (!name || !email || !password) {
      return { success: false, error: 'Barcha maydonlarni to\'ldiring' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Email formati noto\'g\'ri' };
    }

    if (password.length < 4) {
      return { success: false, error: 'Parol kamida 4 ta belgidan iborat bo\'lishi kerak' };
    }

    const existing = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, error: 'Ushbu email bilan akkaunt allaqachon mavjud' };
    }

    // Agar mehmon holatidagi natijalar bo'lsa, ularni ko'chirib olamiz
    const guestData = this.getGuestTempData();

    const newUser = {
      id: 'user_' + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password, // prototip uchun
      isGuest: false,
      createdAt: new Date().toLocaleDateString(),
      xp: guestData.xp || 170,
      streak: guestData.streak || 3,
      completedLessons: guestData.completedLessons || [],
      completedTasks: guestData.completedTasks || {},
      notes: guestData.notes || {},
      wheelScores: guestData.wheelScores || null
    };

    this.users.push(newUser);
    this.saveUsersToStorage();

    // Faol foydalanuvchi sifatida o'rnatish
    this.setCurrentUserSession(newUser);
    this.clearGuestTempData();

    return { success: true, user: newUser };
  }

  // --- TIZIMGA KIRISH (SIGN IN) ---
  login(email, password) {
    const found = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { success: false, error: 'Email yoki parol noto\'g\'ri' };
    }

    if (found.password !== password) {
      return { success: false, error: 'Parol noto\'g\'ri' };
    }

    this.setCurrentUserSession(found);
    return { success: true, user: found };
  }

  // --- TIZIMDAN CHIQISH (LOGOUT) ---
  logout() {
    localStorage.removeItem('bunyod_current_user_email');
    sessionStorage.removeItem('bunyod_active_session');
    
    // Mehmon rejimiga o'tish va mehmon ma'lumotlarini tozalash
    this.clearGuestTempData();
    this.initGuestSession();

    window.location.reload();
  }

  // --- MEHMON SIFATIDA DAVOM ETISH ---
  continueAsGuest() {
    this.clearGuestTempData();
    this.initGuestSession();
    localStorage.removeItem('bunyod_current_user_email');
    window.location.reload();
  }

  setCurrentUserSession(user) {
    this.currentUser = user;
    sessionStorage.setItem('bunyod_active_session', JSON.stringify(user));
    if (!user.isGuest) {
      localStorage.setItem('bunyod_current_user_email', user.email);
    }
  }

  saveUsersToStorage() {
    localStorage.setItem('bunyod_registered_users', JSON.stringify(this.users));
  }

  // --- FOYDALANUVCHI MA'LUMOTLARINI SAQLASH / YUKLASH ---
  getUserData(key, defaultVal) {
    if (this.isGuest()) {
      // Mehmon uchun faqat sessionStorage
      const s = sessionStorage.getItem(`bunyod_guest_${key}`);
      return s ? JSON.parse(s) : defaultVal;
    } else {
      // Ro'yxatdan o'tgan foydalanuvchi uchun alohida user-scoped localStorage
      const user = this.users.find(u => u.id === this.currentUser.id);
      if (user && user[key] !== undefined) {
        return user[key];
      }
      return defaultVal;
    }
  }

  setUserData(key, val) {
    if (this.isGuest()) {
      sessionStorage.setItem(`bunyod_guest_${key}`, JSON.stringify(val));
    } else {
      const user = this.users.find(u => u.id === this.currentUser.id);
      if (user) {
        user[key] = val;
        this.saveUsersToStorage();
        this.currentUser[key] = val;
        sessionStorage.setItem('bunyod_active_session', JSON.stringify(this.currentUser));
      }
    }
  }

  saveUserData(key, val) {
    this.setUserData(key, val);
  }

  addXP(amount) {
    const current = this.getUserData('xp', 170);
    const updated = current + amount;
    this.setUserData('xp', updated);
    if (window.refreshDashboard) {
      window.refreshDashboard();
    }
  }

  getGuestTempData() {
    return {
      xp: JSON.parse(sessionStorage.getItem('bunyod_guest_xp') || '170'),
      streak: JSON.parse(sessionStorage.getItem('bunyod_guest_streak') || '3'),
      completedLessons: JSON.parse(sessionStorage.getItem('bunyod_guest_completedLessons') || '[]'),
      completedTasks: JSON.parse(sessionStorage.getItem('bunyod_guest_completedTasks') || '{}'),
      notes: JSON.parse(sessionStorage.getItem('bunyod_guest_notes') || '{}'),
      wheelScores: JSON.parse(sessionStorage.getItem('bunyod_guest_wheelScores') || 'null')
    };
  }

  clearGuestTempData() {
    sessionStorage.removeItem('bunyod_guest_xp');
    sessionStorage.removeItem('bunyod_guest_streak');
    sessionStorage.removeItem('bunyod_guest_completedLessons');
    sessionStorage.removeItem('bunyod_guest_completedTasks');
    sessionStorage.removeItem('bunyod_guest_notes');
    sessionStorage.removeItem('bunyod_guest_wheelScores');
  }
}

export const authManager = new AuthManager();
window.authManager = authManager;
