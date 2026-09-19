// ==========================================================================
// BUNYOD PLATFORMASI - AMALIY TOPSHIRIQLAR VA VAZIFALAR (TASKS & REFLECTIONS)
// ==========================================================================

import { multilingualCourses } from './data.js';
import { i18nManager } from './i18n.js';
import { authManager } from './auth.js';

class TasksManager {
  constructor() {
    this.refreshLocalData();
  }

  refreshLocalData() {
    this.completedTasks = authManager.getUserData('completedTasks', {});
  }

  init() {
    this.refreshLocalData();
    this.renderTasks();

    i18nManager.onLanguageChange(() => {
      this.renderTasks();
    });
  }

  getAllTasks() {
    const list = [];
    const lang = i18nManager.getLang();
    const courses = multilingualCourses[lang] || multilingualCourses.uz;

    courses.forEach(course => {
      course.modules.forEach(mod => {
        mod.lessons.forEach(les => {
          if (les.task) {
            list.push({
              ...les.task,
              courseTitle: course.title,
              lessonTitle: les.title
            });
          }
        });
      });
    });
    return list;
  }

  renderTasks() {
    this.refreshLocalData();
    const container = document.getElementById('tasksGridContainer');
    if (!container) return;

    const allTasks = this.getAllTasks();

    container.innerHTML = allTasks.map(task => {
      const savedData = this.completedTasks[task.id];
      const isDone = !!savedData;
      const userText = savedData?.userText || '';
      const feedback = savedData?.feedback || '';

      return `
        <div class="task-card card-minimal" data-task-id="${task.id}">
          <div>
            <div class="task-card-header">
              <span class="task-origin-badge">${task.lessonTitle}</span>
              <span class="task-status-tag ${isDone ? 'done' : 'pending'}">
                ${isDone ? i18nManager.t('status_done') : i18nManager.t('status_pending')}
              </span>
            </div>
            <h3 style="font-size: 17px; margin: 12px 0 6px; color: var(--text-pure);">${task.title}</h3>
            <p class="task-prompt-text">${task.prompt}</p>
          </div>

          <div class="task-form-block">
            <textarea class="task-input-area" placeholder="${i18nManager.t('task_placeholder')}" ${isDone ? 'disabled' : ''}>${userText}</textarea>
            
            <div class="task-feedback-box ${isDone ? 'visible' : ''}">
              <strong>${i18nManager.t('task_feedback_label')}</strong>
              <p style="margin-top: 4px;">${feedback || "Ajoyib refleksiya! Har bir his va xatti-harakatni ongli anglash ichki erkinlikning eng muhim fundamentidir."}</p>
            </div>

            <div style="margin-top: 14px; display: flex; justify-content: flex-end;">
              ${isDone ? `
                <button class="btn-outline-elegant" onclick="window.tasksManager.resetTask('${task.id}')">${i18nManager.t('btn_edit_task')}</button>
              ` : `
                <button class="btn-gold-elegant" onclick="window.tasksManager.submitTask('${task.id}')">${i18nManager.t('btn_submit_task')}</button>
              `}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  submitTask(taskId) {
    this.refreshLocalData();
    const card = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
    if (!card) return;

    const textarea = card.querySelector('textarea');
    const val = textarea.value.trim();

    if (!val || val.length < 10) {
      window.showToast?.(i18nManager.t('toast_task_min'));
      return;
    }

    const lang = i18nManager.getLang();
    const feedbacks = {
      uz: [
        "Samimiy yondashuvingiz tahsinga loyiq. O'z his-tuyg'ularini qabul qilib, ularga baho bermasdan qarash - hissiy intellektning oliy darajasidir.",
        "Ajoyib amaliy qadam! Kichik odatlarni hayotga tatbiq etish miyada mustahkam neyron aloqalarini shakllantiradi."
      ],
      uz_cyrl: [
        "Самимий ёндашувингиз таҳсинга лойиқ. Ўз ҳис-туйғуларини қабул қилиб, уларга баҳо бермасдан қараш - ҳиссий интеллектнинг олий даражасидир.",
        "Ажойиб амалий қадам! Кичик одатларни ҳаётга татбиқ этиш мияда мустаҳкам нейрон алоқаларини шакллантиради."
      ],
      ru: [
        "Ваша искренность заслуживает глубокого уважения. Осознание своих чувств без самоосуждения — основа зрелого эмоционального интеллекта.",
        "Превосходный практический шаг! Регулярная рефлексия формирует прочные нейронные связи."
      ],
      en: [
        "Your authentic reflection is truly commendable. Observing emotions without judgment is the core foundation of high emotional intelligence.",
        "An inspiring step forward! Embedding intentional habits actively rewires your neural pathways for resilience."
      ]
    };

    const currentFeedbacks = feedbacks[lang] || feedbacks.uz;
    const randomFeedback = currentFeedbacks[Math.floor(Math.random() * currentFeedbacks.length)];

    this.completedTasks[taskId] = {
      userText: val,
      feedback: randomFeedback,
      date: new Date().toLocaleDateString()
    };

    authManager.setUserData('completedTasks', this.completedTasks);
    window.addXP?.(70);
    window.showToast?.(i18nManager.t('toast_task_done'));

    this.renderTasks();
    window.refreshDashboard?.();
  }

  resetTask(taskId) {
    this.refreshLocalData();
    delete this.completedTasks[taskId];
    authManager.setUserData('completedTasks', this.completedTasks);
    window.showToast?.("Vazifa tahrirlash uchun ochildi");
    this.renderTasks();
    window.refreshDashboard?.();
  }
}

export const tasksManager = new TasksManager();
window.tasksManager = tasksManager;
