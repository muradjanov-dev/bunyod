// ==========================================================================
// BUNYOD PLATFORMASI - DONISHMANDLIK IQTIBOSLARI (QUOTES ROTATOR)
// ==========================================================================

import { multilingualQuotes } from './data.js';
import { i18nManager } from './i18n.js';

class QuotesManager {
  constructor() {
    this.currentIndex = 0;
    this.autoRotateInterval = null;
    this.progressInterval = null;
    this.duration = 7500; // 7.5 soniya
    this.progress = 0;
    this.isPaused = false;
  }

  getQuotes() {
    const lang = i18nManager.getLang();
    return multilingualQuotes[lang] || multilingualQuotes.uz;
  }

  init() {
    this.quoteCard = document.getElementById('quoteCard');
    this.quoteText = document.getElementById('quoteText');
    this.quoteAuthor = document.getElementById('quoteAuthor');
    this.quoteSource = document.getElementById('quoteSource');
    this.quoteCategory = document.getElementById('quoteCategory');
    this.authorMonogram = document.getElementById('authorMonogram');
    this.progressBar = document.getElementById('quoteProgressBar');
    this.prevBtn = document.getElementById('prevQuoteBtn');
    this.nextBtn = document.getElementById('nextQuoteBtn');
    this.copyBtn = document.getElementById('copyQuoteBtn');

    if (!this.quoteText) return;

    this.renderCurrentQuote();
    this.startAutoRotate();
    this.bindEvents();

    i18nManager.onLanguageChange(() => {
      this.renderCurrentQuote();
    });
  }

  bindEvents() {
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.nextQuote();
        this.resetTimer();
      });
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prevQuote();
        this.resetTimer();
      });
    }

    if (this.copyBtn) {
      this.copyBtn.addEventListener('click', () => this.copyQuote());
    }

    if (this.quoteCard) {
      this.quoteCard.addEventListener('mouseenter', () => {
        this.isPaused = true;
      });
      this.quoteCard.addEventListener('mouseleave', () => {
        this.isPaused = false;
      });
    }
  }

  renderCurrentQuote() {
    const quotes = this.getQuotes();
    const q = quotes[this.currentIndex] || quotes[0];
    if (!q) return;

    this.quoteText.style.opacity = '0';
    this.quoteText.style.transform = 'translateY(6px)';

    setTimeout(() => {
      this.quoteText.textContent = `«${q.text}»`;
      this.quoteAuthor.textContent = q.author;
      this.quoteSource.textContent = q.source;
      this.quoteCategory.textContent = q.category;
      
      const initials = q.author.split(' ').map(w => w[0]).slice(0, 2).join('');
      this.authorMonogram.textContent = initials || 'B';

      this.quoteText.style.opacity = '1';
      this.quoteText.style.transform = 'translateY(0)';
    }, 180);
  }

  nextQuote() {
    const quotes = this.getQuotes();
    this.currentIndex = (this.currentIndex + 1) % quotes.length;
    this.renderCurrentQuote();
  }

  prevQuote() {
    const quotes = this.getQuotes();
    this.currentIndex = (this.currentIndex - 1 + quotes.length) % quotes.length;
    this.renderCurrentQuote();
  }

  startAutoRotate() {
    const stepTime = 50;
    const stepInc = (stepTime / this.duration) * 100;

    this.progressInterval = setInterval(() => {
      if (!this.isPaused) {
        this.progress += stepInc;
        if (this.progressBar) {
          this.progressBar.style.width = `${Math.min(this.progress, 100)}%`;
        }

        if (this.progress >= 100) {
          this.progress = 0;
          this.nextQuote();
        }
      }
    }, stepTime);
  }

  resetTimer() {
    this.progress = 0;
    if (this.progressBar) {
      this.progressBar.style.width = '0%';
    }
  }

  copyQuote() {
    const quotes = this.getQuotes();
    const q = quotes[this.currentIndex] || quotes[0];
    const textToCopy = `"${q.text}" — ${q.author} (${q.source})\n\nBunyod Platform`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      window.showToast?.(i18nManager.t('toast_copied'));
    });
  }
}

export const quotesManager = new QuotesManager();
