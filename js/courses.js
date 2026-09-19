// ==========================================================================
// BUNYOD PLATFORMASI - MODULLI DARSLAR VA VIDEO PLEYER (COURSES & PLAYER)
// ==========================================================================

import { multilingualCourses } from './data.js';
import { i18nManager } from './i18n.js';
import { authManager } from './auth.js';

class CoursesManager {
  constructor() {
    this.currentCourseId = 'course-eq';
    this.currentLessonId = 'les-101';
    this.refreshLocalData();
  }

  refreshLocalData() {
    this.completedLessons = authManager.getUserData('completedLessons', []);
    this.notes = authManager.getUserData('notes', {});
  }

  getCourses() {
    const lang = i18nManager.getLang();
    return multilingualCourses[lang] || multilingualCourses.uz;
  }

  init() {
    this.refreshLocalData();
    this.renderCourseTabs();
    this.renderCurrentCourse();
    this.bindPlayerControls();
    this.bindSubTabs();

    i18nManager.onLanguageChange(() => {
      this.renderCourseTabs();
      this.renderCurrentCourse();
    });
  }

  getCurrentCourse() {
    const courses = this.getCourses();
    return courses.find(c => c.id === this.currentCourseId) || courses[0];
  }

  getCurrentLesson() {
    const course = this.getCurrentCourse();
    for (const mod of course.modules) {
      const les = mod.lessons.find(l => l.id === this.currentLessonId);
      if (les) return les;
    }
    return course.modules[0].lessons[0];
  }

  renderCourseTabs() {
    const container = document.getElementById('courseTabsContainer');
    if (!container) return;

    const courses = this.getCourses();
    container.innerHTML = courses.map(c => `
      <button class="course-tab-btn ${c.id === this.currentCourseId ? 'active' : ''}" data-course-id="${c.id}">
        ${c.title}
      </button>
    `).join('');

    container.querySelectorAll('.course-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentCourseId = btn.dataset.courseId;
        const course = this.getCurrentCourse();
        this.currentLessonId = course.modules[0].lessons[0].id;
        this.renderCourseTabs();
        this.renderCurrentCourse();
      });
    });
  }

  renderCurrentCourse() {
    this.refreshLocalData();
    const course = this.getCurrentCourse();
    const currentLesson = this.getCurrentLesson();

    const titleEl = document.getElementById('currentLessonTitle');
    const descEl = document.getElementById('currentLessonDesc');
    const videoEl = document.getElementById('mainVideoElement');

    if (titleEl) titleEl.textContent = currentLesson.title;
    if (descEl) descEl.textContent = currentLesson.summary;

    if (videoEl && currentLesson.videoUrl) {
      if (videoEl.src !== currentLesson.videoUrl) {
        videoEl.src = currentLesson.videoUrl;
      }
    }

    this.updateCompleteButtonState();
    this.renderSyllabus();
    this.loadSubTabContent(currentLesson);
  }

  renderSyllabus() {
    this.refreshLocalData();
    const course = this.getCurrentCourse();
    const syllabusList = document.getElementById('syllabusModulesList');
    const progressFill = document.getElementById('courseProgressFill');
    const progressPercent = document.getElementById('courseProgressPercent');

    if (!syllabusList) return;

    let allLessonsCount = 0;
    let completedInCourseCount = 0;

    course.modules.forEach(mod => {
      mod.lessons.forEach(l => {
        allLessonsCount++;
        if (this.completedLessons.includes(l.id)) {
          completedInCourseCount++;
        }
      });
    });

    const percent = allLessonsCount > 0 ? Math.round((completedInCourseCount / allLessonsCount) * 100) : 0;
    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressPercent) progressPercent.textContent = `${percent}%`;

    syllabusList.innerHTML = course.modules.map((mod, idx) => {
      const containsActive = mod.lessons.some(l => l.id === this.currentLessonId);
      const isOpen = containsActive || idx === 0;

      return `
        <div class="module-accordion-item ${isOpen ? 'open' : ''}" data-mod-id="${mod.id}">
          <button class="module-title-header">
            <span>${mod.title}</span>
            <svg class="module-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="module-lesson-list">
            ${mod.lessons.map(les => {
              const isActive = les.id === this.currentLessonId;
              const isDone = this.completedLessons.includes(les.id);

              return `
                <div class="lesson-list-item ${isActive ? 'active' : ''}" data-lesson-id="${les.id}">
                  <div class="lesson-title-meta">
                    <span class="lesson-state-icon ${isDone ? 'completed' : ''}">
                      ${isDone ? `
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ` : ''}
                    </span>
                    <span>${les.title}</span>
                  </div>
                  <span class="lesson-duration-badge">${les.duration}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');

    syllabusList.querySelectorAll('.module-title-header').forEach(header => {
      header.addEventListener('click', (e) => {
        const item = e.currentTarget.closest('.module-accordion-item');
        item.classList.toggle('open');
      });
    });

    syllabusList.querySelectorAll('.lesson-list-item').forEach(item => {
      item.addEventListener('click', () => {
        this.currentLessonId = item.dataset.lessonId;
        this.renderCurrentCourse();
      });
    });
  }

  updateCompleteButtonState() {
    const btn = document.getElementById('completeLessonBtn');
    if (!btn) return;

    const isDone = this.completedLessons.includes(this.currentLessonId);
    if (isDone) {
      btn.classList.add('completed');
      btn.innerHTML = `
        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>${i18nManager.t('btn_lesson_completed')}</span>
      `;
    } else {
      btn.classList.remove('completed');
      btn.innerHTML = `
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span>${i18nManager.t('btn_complete_lesson')}</span>
      `;
    }
  }

  toggleLessonCompletion() {
    this.refreshLocalData();
    const isDone = this.completedLessons.includes(this.currentLessonId);
    if (isDone) {
      this.completedLessons = this.completedLessons.filter(id => id !== this.currentLessonId);
      window.showToast?.(i18nManager.t('toast_lesson_reset'));
    } else {
      this.completedLessons.push(this.currentLessonId);
      window.addXP?.(50);
      window.showToast?.(i18nManager.t('toast_lesson_done'));
    }

    authManager.setUserData('completedLessons', this.completedLessons);
    this.updateCompleteButtonState();
    this.renderSyllabus();
    window.refreshDashboard?.();
  }

  bindPlayerControls() {
    const video = document.getElementById('mainVideoElement');
    const playBtn = document.getElementById('playPauseBtn');
    const completeBtn = document.getElementById('completeLessonBtn');
    const speedSelect = document.getElementById('videoSpeedSelect');

    if (playBtn && video) {
      playBtn.addEventListener('click', () => {
        if (video.paused) {
          video.play();
          playBtn.innerHTML = `<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
        } else {
          video.pause();
          playBtn.innerHTML = `<svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
        }
      });
    }

    if (speedSelect && video) {
      speedSelect.addEventListener('change', (e) => {
        video.playbackRate = parseFloat(e.target.value);
      });
    }

    if (completeBtn) {
      completeBtn.addEventListener('click', () => this.toggleLessonCompletion());
    }
  }

  bindSubTabs() {
    const tabs = document.querySelectorAll('.sub-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const target = tab.dataset.subtab;
        document.querySelectorAll('.sub-content-panel').forEach(p => p.style.display = 'none');
        const activePanel = document.getElementById(`subPanel-${target}`);
        if (activePanel) activePanel.style.display = 'block';
      });
    });

    const notesArea = document.getElementById('lessonNotesArea');
    if (notesArea) {
      notesArea.addEventListener('input', (e) => {
        this.notes[this.currentLessonId] = e.target.value;
        authManager.setUserData('notes', this.notes);
        const status = document.getElementById('notesSaveStatus');
        if (status) status.textContent = i18nManager.t('notes_saved') + ' • ' + new Date().toLocaleTimeString();
      });
    }
  }

  loadSubTabContent(lesson) {
    const notesArea = document.getElementById('lessonNotesArea');
    if (notesArea) {
      notesArea.value = this.notes[lesson.id] || '';
    }

    const resContainer = document.getElementById('lessonResourcesContainer');
    if (resContainer && lesson.resources) {
      resContainer.innerHTML = lesson.resources.map(res => `
        <div class="resource-download-row">
          <div class="resource-info">
            <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            <span>${res.name}<small>${res.size}</small></span>
          </div>
          <button class="btn-outline-elegant" onclick="window.showToast('Material downloaded!')">${i18nManager.t('btn_download')}</button>
        </div>
      `).join('');
    }

    const taskContainer = document.getElementById('currentLessonTaskPreview');
    if (taskContainer && lesson.task) {
      taskContainer.innerHTML = `
        <div class="task-card card-minimal">
          <div class="task-card-header">
            <span class="task-origin-badge">${i18nManager.t('task_origin')}</span>
          </div>
          <h3 style="font-size: 17px; color: var(--text-pure);">${lesson.task.title}</h3>
          <p class="task-prompt-text">${lesson.task.prompt}</p>
          <button class="btn-gold-elegant" onclick="window.navigateTo('tasks')">${i18nManager.t('btn_do_task')}</button>
        </div>
      `;
    }
  }
}

export const coursesManager = new CoursesManager();
