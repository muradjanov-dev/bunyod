// ==========================================================================
// BUNYOD PLATFORMASI - KITOB SOTIB OLISH VA KUTUBXONA TIZIMI (BOOKS STORE)
// To'q yashil, oq va qora ranglar uyg'unligidagi kitoblar do'koni
// ==========================================================================

import { multilingualBooks } from './data.js';
import { i18nManager } from './i18n.js';
import { authManager } from './auth.js';

class BooksManager {
  constructor() {
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.activeBookForOrder = null;
    this.orderQuantity = 1;
    this.selectedPaymentMethod = 'payme';
  }

  init() {
    this.bindEvents();
    this.renderBooks();
    
    // Til o'zgarganda qayta chizish
    i18nManager.onLanguageChange(() => {
      this.renderBooks();
      this.updateModalsText();
    });
  }

  getBooks() {
    const lang = i18nManager.getLang();
    return multilingualBooks[lang] || multilingualBooks.uz;
  }

  bindEvents() {
    // Kategoriya filter tugmalari
    const filterContainer = document.getElementById('bookCategoryFilters');
    if (filterContainer) {
      filterContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.book-filter-btn');
        if (!btn) return;
        
        filterContainer.querySelectorAll('.book-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategory = btn.dataset.category || 'all';
        this.renderBooks();
      });
    }

    // Qidiruv maydoni
    const searchInput = document.getElementById('bookSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.renderBooks();
      });
    }

    // Modalni yopish hodisalari
    document.querySelectorAll('.close-book-modal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeAllModals();
      });
    });

    // Modal orqa fonini bosganda yopish
    ['bookPreviewModal', 'bookOrderModal'].forEach(id => {
      const modal = document.getElementById(id);
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            this.closeAllModals();
          }
        });
      }
    });

    // Buyurtma formasi yuborilishi
    const orderForm = document.getElementById('bookOrderForm');
    if (orderForm) {
      orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitOrder();
      });
    }

    // To'lov turi tanlovi
    const paymentPills = document.querySelectorAll('.payment-pill-btn');
    paymentPills.forEach(pill => {
      pill.addEventListener('click', () => {
        paymentPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.selectedPaymentMethod = pill.dataset.payment;
      });
    });

    // Miqdor o'zgartirgichlar
    const qtyMinus = document.getElementById('bookQtyMinus');
    const qtyPlus = document.getElementById('bookQtyPlus');
    if (qtyMinus && qtyPlus) {
      qtyMinus.addEventListener('click', () => {
        if (this.orderQuantity > 1) {
          this.orderQuantity--;
          this.updateOrderSummary();
        }
      });
      qtyPlus.addEventListener('click', () => {
        if (this.orderQuantity < 10) {
          this.orderQuantity++;
          this.updateOrderSummary();
        }
      });
    }
  }

  renderBooks() {
    const grid = document.getElementById('booksGridContainer');
    if (!grid) return;

    let books = this.getBooks();

    // Kategoriya filtri
    if (this.currentCategory !== 'all') {
      books = books.filter(b => b.category === this.currentCategory);
    }

    // Qidiruv filtri
    if (this.searchQuery) {
      books = books.filter(b => 
        b.title.toLowerCase().includes(this.searchQuery) ||
        b.subtitle.toLowerCase().includes(this.searchQuery) ||
        b.author.toLowerCase().includes(this.searchQuery)
      );
    }

    if (books.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-hairline);">
          <div style="font-size: 38px; margin-bottom: 12px; opacity: 0.7;">📚</div>
          <h4 style="color: var(--text-pure); margin-bottom: 6px;">Hech qanday kitob topilmadi</h4>
          <p style="color: var(--text-secondary); font-size: 14px;">Qidiruv so'zini o'zgartirib ko'ring yoki boshqa toifani tanlang.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = books.map(book => this.renderBookCard(book)).join('');
  }

  renderBookCard(book) {
    const isTop = book.isTop;
    const coverSvg = this.getCoverSvg(book.coverIcon);

    return `
      <div class="book-card card-minimal ${isTop ? 'top-featured-book' : ''}" data-id="${book.id}">
        ${isTop ? `
          <div class="book-top-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>${book.badge}</span>
          </div>
        ` : ''}

        <div class="book-cover-wrapper" style="background: ${book.coverBg};">
          <div class="book-spine-effect"></div>
          <div class="book-cover-content">
            <div class="book-cover-icon">${coverSvg}</div>
            <h4 class="book-cover-title">${book.title}</h4>
            <p class="book-cover-author">${book.author}</p>
          </div>
          <div class="book-pages-badge">${book.pages} bet</div>
        </div>

        <div class="book-card-body">
          <div class="book-meta-top">
            <span class="book-category-tag">${book.categoryLabel}</span>
            <div class="book-rating-box">
              <span class="star-icon">★</span>
              <span class="rating-value">${book.rating}</span>
              <span class="reviews-count">(${book.reviewsCount})</span>
            </div>
          </div>

          <h3 class="book-title">${book.title}</h3>
          <p class="book-subtitle">${book.subtitle}</p>

          <div class="book-price-row">
            <div class="price-stack">
              <span class="current-price">${book.priceFormatted}</span>
              ${book.oldPrice ? `<span class="old-price">${book.oldPrice}</span>` : ''}
            </div>
            <span class="delivery-pill">O'zbekiston bo'ylab</span>
          </div>

          <div class="book-actions-group">
            <button class="btn-outline-elegant book-preview-btn" onclick="window.booksManager.openPreviewModal('${book.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              <span>${i18nManager.t('btn_preview_book')}</span>
            </button>

            <button class="btn-gold-elegant book-order-btn" onclick="window.booksManager.openOrderModal('${book.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span>${i18nManager.t('btn_buy_book')}</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  getCoverSvg(icon) {
    switch (icon) {
      case 'compass':
        return `
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="rgba(255,255,255,0.2)"></polygon>
          </svg>
        `;
      case 'mountain':
        return `
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2">
            <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
          </svg>
        `;
      case 'heart':
        return `
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        `;
      case 'repeat':
        return `
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2">
            <polyline points="17 1 21 5 17 9"></polyline>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
            <polyline points="7 23 3 19 7 15"></polyline>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
          </svg>
        `;
      case 'target':
        return `
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="6"></circle>
            <circle cx="12" cy="12" r="2"></circle>
          </svg>
        `;
      case 'moon':
        return `
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        `;
      default:
        return `
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        `;
    }
  }

  openPreviewModal(bookId) {
    const books = this.getBooks();
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const modal = document.getElementById('bookPreviewModal');
    const content = document.getElementById('bookPreviewModalContent');
    if (!modal || !content) return;

    const coverSvg = this.getCoverSvg(book.coverIcon);

    content.innerHTML = `
      <div class="book-preview-grid">
        <div class="preview-cover-col">
          <div class="book-cover-wrapper" style="background: ${book.coverBg}; min-height: 280px;">
            <div class="book-spine-effect"></div>
            <div class="book-cover-content">
              <div class="book-cover-icon">${coverSvg}</div>
              <h4 class="book-cover-title" style="font-size: 19px;">${book.title}</h4>
              <p class="book-cover-author">${book.author}</p>
            </div>
            <div class="book-pages-badge">${book.pages} bet</div>
          </div>

          <div style="margin-top: 18px; text-align: center;">
            <div style="font-size: 21px; font-weight: 800; color: var(--text-pure); margin-bottom: 4px;">
              ${book.priceFormatted}
            </div>
            <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 14px;">Yetkazib berish xizmati mavjud</p>
            <button class="btn-gold-elegant" style="width: 100%;" onclick="window.booksManager.openOrderModal('${book.id}');">
              ${i18nManager.t('btn_buy_book')}
            </button>
          </div>
        </div>

        <div class="preview-info-col">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span class="book-category-tag">${book.categoryLabel}</span>
            ${book.isTop ? `<span class="book-top-badge" style="position: static; transform: none;">★ ${book.badge}</span>` : ''}
          </div>

          <h2 style="color: var(--text-pure); font-size: 24px; font-weight: 800; margin-bottom: 6px;">${book.title}</h2>
          <p style="font-size: 15px; color: var(--nature-green); font-weight: 600; margin-bottom: 16px;">${book.subtitle}</p>

          <div style="background: var(--nature-green-soft); border-left: 3px solid var(--nature-green); padding: 12px 16px; border-radius: 6px; margin-bottom: 18px;">
            <p style="font-size: 13.5px; color: var(--text-primary); font-style: italic; margin: 0;">
              "${book.quote}"
            </p>
          </div>

          <h4 style="color: var(--text-pure); font-size: 15px; font-weight: 700; margin-bottom: 8px;">Asar haqida</h4>
          <p style="color: var(--text-secondary); font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            ${book.desc}
          </p>

          <h4 style="color: var(--text-pure); font-size: 15px; font-weight: 700; margin-bottom: 10px;">Mundarija (Asosiy boblar)</h4>
          <ul class="preview-chapters-list">
            ${book.chapters.map(ch => `
              <li>
                <span class="chapter-bullet">✦</span>
                <span>${ch}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;

    modal.classList.add('visible');
  }

  openOrderModal(bookId) {
    this.closeAllModals();
    const books = this.getBooks();
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    this.activeBookForOrder = book;
    this.orderQuantity = 1;

    const modal = document.getElementById('bookOrderModal');
    if (!modal) return;

    // To'ldirish
    document.getElementById('orderBookTitle').textContent = book.title;
    document.getElementById('orderBookAuthor').textContent = book.author;
    document.getElementById('orderBookPrice').textContent = book.priceFormatted;
    document.getElementById('orderQtyDisplay').textContent = this.orderQuantity;

    // Agar foydalanuvchi tizimga kirgan bo'lsa, ism va telefonini avtomatik qo'yish
    const user = authManager.getUser();
    const nameInput = document.getElementById('orderCustomerName');
    const phoneInput = document.getElementById('orderCustomerPhone');
    if (nameInput && user && user.name && !user.isGuest) {
      nameInput.value = user.name;
    }
    if (phoneInput && !phoneInput.value) {
      phoneInput.value = '+998 ';
    }

    this.updateOrderSummary();
    modal.classList.add('visible');
  }

  updateOrderSummary() {
    if (!this.activeBookForOrder) return;
    
    document.getElementById('orderQtyDisplay').textContent = this.orderQuantity;
    const totalAmount = this.activeBookForOrder.price * this.orderQuantity;
    const formatted = new Intl.NumberFormat('uz-UZ').format(totalAmount) + " so'm";
    
    const totalEl = document.getElementById('orderTotalAmount');
    if (totalEl) {
      totalEl.textContent = formatted;
    }
  }

  submitOrder() {
    if (!this.activeBookForOrder) return;

    const nameInput = document.getElementById('orderCustomerName');
    const phoneInput = document.getElementById('orderCustomerPhone');
    const addressInput = document.getElementById('orderCustomerAddress');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const address = addressInput ? addressInput.value.trim() : '';

    if (!name || !phone || !address) {
      if (window.showToast) {
        window.showToast("Iltimos, ismingiz, telefoningiz va manzilingizni to'liq kiriting!");
      }
      return;
    }

    const orderId = 'BUN-' + Math.floor(100000 + Math.random() * 900000);
    const totalAmount = this.activeBookForOrder.price * this.orderQuantity;
    const formattedTotal = new Intl.NumberFormat('uz-UZ').format(totalAmount) + " so'm";

    const newOrder = {
      id: orderId,
      bookId: this.activeBookForOrder.id,
      bookTitle: this.activeBookForOrder.title,
      author: this.activeBookForOrder.author,
      quantity: this.orderQuantity,
      totalPrice: formattedTotal,
      customerName: name,
      customerPhone: phone,
      deliveryAddress: address,
      paymentMethod: this.selectedPaymentMethod,
      date: new Date().toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Qabul qilindi (Kuryerda)'
    };

    // Foydalanuvchi profiliga saqlash
    const existingOrders = authManager.getUserData('bookOrders', []);
    existingOrders.unshift(newOrder);
    authManager.setUserData('bookOrders', existingOrders);

    // Xarid uchun rag'batlantiruvchi XP berish (+30 XP)
    authManager.addXP(30);

    this.closeAllModals();

    if (window.showToast) {
      window.showToast(`${i18nManager.t('book_order_success')} (Buyurtma #${orderId})`);
    }

    // Agar foydalanuvchi dashboardda bo'lsa yangilash
    if (window.dashboardManager && typeof window.dashboardManager.renderDashboard === 'function') {
      window.dashboardManager.renderDashboard();
    }
  }

  closeAllModals() {
    ['bookPreviewModal', 'bookOrderModal'].forEach(id => {
      const modal = document.getElementById(id);
      if (modal) {
        modal.classList.remove('visible');
      }
    });
  }

  updateModalsText() {
    // Til o'zgarganda matnlarni yangilash
  }
}

export const booksManager = new BooksManager();
window.booksManager = booksManager;
