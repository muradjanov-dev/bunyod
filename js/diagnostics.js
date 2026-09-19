// ==========================================================================
// BUNYOD PLATFORMASI - HAYOT BALANSI G'ILDIRAGI VA PSIXOLOGIK TEST
// ==========================================================================

import { multilingualLifeWheel, multilingualQuiz } from './data.js';
import { i18nManager } from './i18n.js';
import { authManager } from './auth.js';

class DiagnosticsManager {
  constructor() {
    this.quizAnswers = {};
    this.canvas = null;
    this.ctx = null;
    this.refreshLocalData();
  }

  refreshLocalData() {
    this.savedScores = authManager.getUserData('wheelScores', {}) || {};
  }

  getAreas() {
    this.refreshLocalData();
    const lang = i18nManager.getLang();
    const baseAreas = multilingualLifeWheel[lang] || multilingualLifeWheel.uz;
    return baseAreas.map(a => ({
      ...a,
      defaultScore: this.savedScores[a.id] !== undefined ? this.savedScores[a.id] : a.defaultScore
    }));
  }

  getQuizQuestions() {
    const lang = i18nManager.getLang();
    return multilingualQuiz[lang] || multilingualQuiz.uz;
  }

  init() {
    this.initWheel();
    this.initQuiz();

    i18nManager.onLanguageChange(() => {
      this.renderSliders();
      this.drawWheel();
      this.initQuiz();
    });

    window.onThemeChange = () => {
      this.drawWheel();
    };
  }

  initWheel() {
    this.canvas = document.getElementById('lifeWheelCanvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.renderSliders();
    this.drawWheel();
  }

  renderSliders() {
    const container = document.getElementById('wheelSlidersContainer');
    if (!container) return;

    const areas = this.getAreas();

    container.innerHTML = areas.map(area => `
      <div class="wheel-slider-row">
        <label>${area.name}</label>
        <input type="range" min="1" max="10" value="${area.defaultScore}" data-area-id="${area.id}">
        <span class="wheel-val-tag" id="val-${area.id}">${area.defaultScore}</span>
      </div>
    `).join('');

    container.querySelectorAll('input[type="range"]').forEach(input => {
      input.addEventListener('input', (e) => {
        const id = e.target.dataset.areaId;
        const val = parseInt(e.target.value);
        this.savedScores[id] = val;
        authManager.setUserData('wheelScores', this.savedScores);
        const valSpan = document.getElementById(`val-${id}`);
        if (valSpan) valSpan.textContent = val;
        this.drawWheel();
        this.updateBalanceAnalysis();
      });
    });

    this.updateBalanceAnalysis();
  }

  drawWheel() {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    const areas = this.getAreas();
    const numPoints = areas.length;
    const angleStep = (Math.PI * 2) / numPoints;

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let level = 2; level <= 10; level += 2) {
      const r = (radius / 10) * level;
      ctx.beginPath();
      for (let i = 0; i < numPoints; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
      ctx.stroke();
    }

    ctx.beginPath();
    areas.forEach((area, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (radius / 10) * area.defaultScore;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();

    const polyGradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radius);
    polyGradient.addColorStop(0, isLight ? 'rgba(180, 140, 45, 0.35)' : 'rgba(212, 175, 55, 0.35)');
    polyGradient.addColorStop(1, isLight ? 'rgba(61, 106, 69, 0.25)' : 'rgba(124, 169, 130, 0.25)');
    ctx.fillStyle = polyGradient;
    ctx.fill();

    ctx.strokeStyle = isLight ? '#9c7b22' : '#d4af37';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    areas.forEach((area, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (radius / 10) * area.defaultScore;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;

      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = isLight ? '#9c7b22' : '#d4af37';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  updateBalanceAnalysis() {
    const areas = this.getAreas();
    const scores = areas.map(a => a.defaultScore);
    const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);

    const sorted = [...areas].sort((a, b) => b.defaultScore - a.defaultScore);
    const topArea = sorted[0];
    const lowestArea = sorted[sorted.length - 1];

    const resultBox = document.getElementById('wheelAnalysisResult');
    if (resultBox) {
      const lang = i18nManager.getLang();
      const labels = {
        uz: { title: "Hayot balansi darajasi", harmony: "Yuqori Uyg'unlik", needsWork: "E'tibor talab", strength: "Eng kuchli tayanchingiz", grow: "Rivojlantirish tavsiya etiladigan soha" },
        uz_cyrl: { title: "Ҳаёт баланси даражаси", harmony: "Юқори Уйғунлик", needsWork: "Эътибор талаб", strength: "Энг кучли таянчингиз", grow: "Ривожлантириш тавсия этиладиган соҳа" },
        ru: { title: "Индекс жизненного баланса", harmony: "Высокая гармония", needsWork: "Требует внимания", strength: "Ваша главная опора", grow: "Зона для качественного роста" },
        en: { title: "Life Balance Score", harmony: "High Harmony", needsWork: "Needs Attention", strength: "Your strongest pillar", grow: "Area recommended for growth" }
      };
      const l = labels[lang] || labels.uz;

      resultBox.innerHTML = `
        <div style="text-align: left; padding: 18px; border-radius: 12px; background: var(--bg-card); border: 1px solid var(--border-hairline); margin-top: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <strong style="color: var(--text-pure); font-size: 15px;">${l.title}: ${avg} / 10</strong>
            <span style="color: var(--gold-champagne); font-weight: 600; font-size: 13px;">${avg >= 7 ? l.harmony : l.needsWork}</span>
          </div>
          <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 6px;">
            ${l.strength}: <strong style="color: var(--sage-accent);">${topArea.name} (${topArea.defaultScore})</strong>
          </p>
          <p style="font-size: 13px; color: var(--text-secondary);">
            ${l.grow}: <strong style="color: var(--gold-champagne);">${lowestArea.name} (${lowestArea.defaultScore})</strong>. 
            ${lowestArea.desc}.
          </p>
        </div>
      `;
    }
  }

  // --- STRESS QUIZ ---
  initQuiz() {
    const container = document.getElementById('stressQuizContainer');
    if (!container) return;

    const questions = this.getQuizQuestions();

    container.innerHTML = questions.map(q => `
      <div class="quiz-question-item" data-q-id="${q.id}">
        <h4>${q.id}. ${q.question}</h4>
        <div class="quiz-options-group">
          ${q.options.map(opt => {
            const isSelected = this.quizAnswers[q.id] === opt.score;
            return `
              <button class="quiz-option-btn ${isSelected ? 'selected' : ''}" data-score="${opt.score}">
                ${opt.text}
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `).join('') + `
      <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
        <button class="btn-gold-elegant" id="submitStressQuizBtn">${i18nManager.t('btn_calc_result')}</button>
      </div>
      <div class="quiz-result-card" id="quizResultDisplay"></div>
    `;

    container.querySelectorAll('.quiz-question-item').forEach(item => {
      const qId = item.dataset.qId;
      item.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          item.querySelectorAll('.quiz-option-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          this.quizAnswers[qId] = parseInt(btn.dataset.score);
        });
      });
    });

    const submitBtn = document.getElementById('submitStressQuizBtn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.calculateQuizResult());
    }
  }

  calculateQuizResult() {
    const questions = this.getQuizQuestions();
    const answeredCount = Object.keys(this.quizAnswers).length;
    if (answeredCount < questions.length) {
      window.showToast?.(i18nManager.t('toast_quiz_incomplete'));
      return;
    }

    let totalScore = 0;
    Object.values(this.quizAnswers).forEach(s => totalScore += s);

    const resultCard = document.getElementById('quizResultDisplay');
    if (!resultCard) return;

    const lang = i18nManager.getLang();
    const resData = {
      uz: {
        low: { title: "Xotirjam va Muvozanatli Holat", desc: "Ruhiyatingiz yaxshi tiklangan. Hissiy yuklamalar me'yorda va ichki resursingiz yetarli." },
        mid: { title: "O'rtacha Emotsional Yuklama", desc: "Kunlik stress va charchoq hissi mavjud. Miyangiz dam olishga va shovqindan uzoqlashishga muhtoj." },
        high: { title: "Yuqori Stress va Qayta Tiklanish Zarurati", desc: "Organizm va asab tizimi yuqori zo'riqish holatida. Zudlik bilan uyqu va dam olishni tiklang." },
        scoreLabel: "ball"
      },
      uz_cyrl: {
        low: { title: "Хотиржам ва Мувозанатли Ҳолат", desc: "Руҳиятингиз яхши тикланган. Ҳиссий юкламалар меъёрда ва ички ресурсингиз етарли." },
        mid: { title: "Ўртача Эмоционал Юклама", desc: "Кунлик стресс ва чарчоқ ҳисси мавжуд. Миянгиз дам олишга муҳтож." },
        high: { title: "Юқори Стресс ва Қайта Тикланиш Зарурати", desc: "Организм ва асаб тизими юқори зўриқиш ҳолатида. Зудлик билан дам олишни тикланг." },
        scoreLabel: "балл"
      },
      ru: {
        low: { title: "Спокойное и Сбалансированное Состояние", desc: "Нервная система в норме. Эмоциональные нагрузки под контролем, внутренние ресурсы восполнены." },
        mid: { title: "Умеренная Эмоциональная Нагрузка", desc: "Присутствует фоновый стресс и усталость. Мозгу требуется информационная разгрузка и глубокий отдых." },
        high: { title: "Высокий Стресс — Необходима Перезагрузка", desc: "Организм работает на пределе. Рекомендуется восстановить сон и регулярно практиковать дыхательные упражнения." },
        scoreLabel: "баллов"
      },
      en: {
        low: { title: "Calm and Balanced State", desc: "Your nervous system is well-regulated. Emotional load is within healthy ranges and mental resources are intact." },
        mid: { title: "Moderate Emotional Load", desc: "Noticeable baseline stress and fatigue. Your mind requires intentional downtime and restorative practice." },
        high: { title: "High Stress — Rejuvenation Required", desc: "Your autonomic nervous system is experiencing acute tension. Prioritize sleep hygiene and box breathing." },
        scoreLabel: "pts"
      }
    };

    const cur = resData[lang] || resData.uz;
    let chosen = cur.low;
    let badgeColor = "var(--sage-accent)";

    if (totalScore > 7) {
      chosen = cur.high;
      badgeColor = "#f43f5e";
    } else if (totalScore > 3) {
      chosen = cur.mid;
      badgeColor = "var(--gold-champagne)";
    }

    resultCard.classList.add('visible');
    resultCard.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h3 style="color: var(--text-pure); font-size: 17px;">${chosen.title}</h3>
        <span style="color: ${badgeColor}; font-weight: 700; font-size: 14px;">${totalScore} / 12 ${cur.scoreLabel}</span>
      </div>
      <p style="font-size: 13.5px; line-height: 1.6; color: var(--text-secondary);">${chosen.desc}</p>
      <div style="margin-top: 14px;">
        <button class="btn-outline-elegant" onclick="window.navigateTo('calm')">${i18nManager.t('btn_go_calm')}</button>
      </div>
    `;

    window.showToast?.(i18nManager.t('toast_quiz_done'));
    window.addXP?.(40);
  }
}

export const diagnosticsManager = new DiagnosticsManager();
