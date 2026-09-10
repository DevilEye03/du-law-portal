/**
 * DELHI UNIVERSITY LAW NOTES PORTAL — ENHANCED APPLICATION SCRIPT
 * Mobile-Reactive, Highly Interactive, with Study Progress Tracking & Quick Filters
 */

(function () {
  'use strict';

  // Application State
  const state = {
    currentSemester: null,
    currentSubject: null,
    currentTab: 'topics', // 'topics' | 'cases' | 'pyqs' | 'revision'
    searchQuery: '',
    selectedUnitFilter: 'all',
    activeQuickFilter: 'all',
    darkMode: localStorage.getItem('du_law_theme') === 'dark',
    starred: JSON.parse(localStorage.getItem('du_portal_starred') || '[]'),
    personalNotes: JSON.parse(localStorage.getItem('du_portal_notes') || '{}'),
    mockTimerSecs: 10800,
    mockTimerInterval: null,
    mockTimerRunning: false,
    mockSelectedQuestions: new Set(),
    audioSpeechRate: 1.0,
    audioUtterance: null,
    audioIsPlaying: false,
    completedUnits: JSON.parse(localStorage.getItem('du_law_completed_units') || '{}'),
    bookmarkedPyqs: JSON.parse(localStorage.getItem('du_law_bookmarked_pyqs') || '[]'),
    flashcards: {
      deck: [],
      currentIndex: 0,
      isFlipped: false,
      masteredIds: JSON.parse(localStorage.getItem('du_law_flashcard_mastery') || '[]')
    },
    bareActs: {
      activeAct: 'all',
      searchQuery: '',
      expandedId: null
    },
    subjectsViewMode: localStorage.getItem('du_subjects_view_mode') || 'books'
  };

  // DOM Elements Cache
  const elements = {
    // Header & Global
    headerMockExamBtn: document.getElementById('headerMockExamBtn'),
    headerBnsConverterBtn: document.getElementById('headerBnsConverterBtn'),
    headerBookmarksBtn: document.getElementById('headerBookmarksBtn'),
    headerStarBadge: document.getElementById('headerStarBadge'),
    heroExploreBtn: document.getElementById('heroExploreBtn'),
    heroMockBtn: document.getElementById('heroMockBtn'),
    heroBnsBtn: document.getElementById('heroBnsBtn'),
    bnsModalOverlay: document.getElementById('bnsModalOverlay'),
    bnsModal: document.getElementById('bnsModal'),
    bnsCloseBtn: document.getElementById('bnsCloseBtn'),
    bnsSearchInput: document.getElementById('bnsSearchInput'),
    bnsCategoryPills: document.getElementById('bnsCategoryPills'),
    bnsCardsContainer: document.getElementById('bnsCardsContainer'),
    mockModalOverlay: document.getElementById('mockModalOverlay'),
    mockModal: document.getElementById('mockModal'),
    mockCloseBtn: document.getElementById('mockCloseBtn'),
    mockSubjectSelect: document.getElementById('mockSubjectSelect'),
    mockSelectionCounter: document.getElementById('mockSelectionCounter'),
    mockSelectedCount: document.getElementById('mockSelectedCount'),
    btnGenMockPaper: document.getElementById('btnGenMockPaper'),
    btnEvaluateMock: document.getElementById('btnEvaluateMock'),
    btnPrintMock: document.getElementById('btnPrintMock'),
    mockPaperContent: document.getElementById('mockPaperContent'),
    mockQuestionsList: document.getElementById('mockQuestionsList'),
    mockTimerClock: document.getElementById('mockTimerClock'),
    mockTimerToggleBtn: document.getElementById('mockTimerToggleBtn'),
    mockTimerResetBtn: document.getElementById('mockTimerResetBtn'),
    bookmarksOverlay: document.getElementById('bookmarksOverlay'),
    bookmarksDrawer: document.getElementById('bookmarksDrawer'),
    bookmarksCloseBtn: document.getElementById('bookmarksCloseBtn'),
    bookmarksList: document.getElementById('bookmarksList'),
    floatingAudioBar: document.getElementById('floatingAudioBar'),
    audioPlayerTitle: document.getElementById('audioPlayerTitle'),
    audioPlayerSubtitle: document.getElementById('audioPlayerSubtitle'),
    audioPlayPauseBtn: document.getElementById('audioPlayPauseBtn'),
    audioPlayPauseIcon: document.getElementById('audioPlayPauseIcon'),
    audioStopBtn: document.getElementById('audioStopBtn'),
    audioSpeedBtn: document.getElementById('audioSpeedBtn'),
    headerSemesterBtn: document.getElementById('headerSemesterBtn'),
    headerSemText: document.getElementById('headerSemText'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    brandLogo: document.getElementById('brandLogo'),

    // Views
    semesterView: document.getElementById('semesterView'),
    subjectsView: document.getElementById('subjectsView'),
    subjectHubView: document.getElementById('subjectHubView'),

    // Semester View Elements
    semesterGrid: document.getElementById('semesterGrid'),

    // Subjects View Elements & 3D Books Showcase
    currentSemHeading: document.getElementById('currentSemHeading'),
    currentSemDesc: document.getElementById('currentSemDesc'),
    viewModeBooksBtn: document.getElementById('viewModeBooksBtn'),
    viewModeGridBtn: document.getElementById('viewModeGridBtn'),
    booksShowcaseWrap: document.getElementById('booksShowcaseWrap'),
    booksShowcaseContainer: document.getElementById('booksShowcaseContainer'),
    booksCanvas: document.getElementById('booksCanvas'),
    bsPrev: document.getElementById('bsPrev'),
    bsNext: document.getElementById('bsNext'),
    bsCloseBtn: document.getElementById('bsCloseBtn'),
    bsOpenSlip: document.getElementById('bsOpenSlip'),
    bsDetailPanel: document.getElementById('bsDetailPanel'),
    bsCodeBadge: document.getElementById('bsCodeBadge'),
    bsSemBadge: document.getElementById('bsSemBadge'),
    bsDetailTitle: document.getElementById('bsDetailTitle'),
    bsDetailDesc: document.getElementById('bsDetailDesc'),
    bsUnitsCount: document.getElementById('bsUnitsCount'),
    bsYear: document.getElementById('bsYear'),
    bsActionExplore: document.getElementById('bsActionExplore'),
    subjectsGrid: document.getElementById('subjectsGrid'),
    changeSemBtn: document.getElementById('changeSemBtn'),

    // Subject Hub Elements
    hubBreadcrumbSem: document.getElementById('hubBreadcrumbSem'),
    hubBreadcrumbSub: document.getElementById('hubBreadcrumbSub'),
    hubBackBtn: document.getElementById('hubBackBtn'),
    hubCodeTag: document.getElementById('hubCodeTag'),
    hubMottoTag: document.getElementById('hubMottoTag'),
    hubTitle: document.getElementById('hubTitle'),
    hubTagline: document.getElementById('hubTagline'),
    hubUnitsPill: document.getElementById('hubUnitsPill'),
    hubCasesPill: document.getElementById('hubCasesPill'),
    hubPyqsPill: document.getElementById('hubPyqsPill'),
    hubRevPill: document.getElementById('hubRevPill'),

    // Progress Tracker
    subjectProgressCount: document.getElementById('subjectProgressCount'),
    subjectProgressText: document.getElementById('subjectProgressText'),
    subjectProgressBar: document.getElementById('subjectProgressBar'),

    // Hub Tabs & Filter
    hubTabs: document.querySelectorAll('.hub-tab-btn'),
    tabContentPanes: document.querySelectorAll('.tab-content-pane'),
    hubSearchInput: document.getElementById('hubSearchInput'),
    searchClearBtn: document.getElementById('searchClearBtn'),
    unitFilterSelect: document.getElementById('unitFilterSelect'),
    quickFilterChips: document.getElementById('quickFilterChips'),

    // Tab Contents Containers
    topicsContainer: document.getElementById('topicsContainer'),
    casesContainer: document.getElementById('casesContainer'),
    pyqsContainer: document.getElementById('pyqsContainer'),
    revisionContainer: document.getElementById('revisionContainer'),

    // Reader Modal (Print PDF removed as requested)
    readerModal: document.getElementById('readerModal'),
    readerTitle: document.getElementById('readerTitle'),
    readerSubInfo: document.getElementById('readerSubInfo'),
    readerIframe: document.getElementById('readerIframe'),
    readerCloseBtn: document.getElementById('readerCloseBtn'),
    readerNewTabBtn: document.getElementById('readerNewTabBtn'),

    // Toast Notification & Floating Utilities
    toastNotification: document.getElementById('toastNotification'),
    toastMsg: document.getElementById('toastMsg'),
    scrollTopBtn: document.getElementById('scrollTopBtn'),
    mobileBottomNav: document.getElementById('mobileBottomNav'),
    mobileNavItems: document.querySelectorAll('.mobile-nav-item')
  };

  // =========================================================================
  // TOAST NOTIFICATION SYSTEM
  // =========================================================================
  let toastTimeout = null;
  function showToast(msg, icon = 'fa-circle-check') {
    if (!elements.toastNotification) return;
    elements.toastMsg.textContent = msg;
    const iconEl = elements.toastNotification.querySelector('i');
    if (iconEl) iconEl.className = `fa-solid ${icon}`;

    elements.toastNotification.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      elements.toastNotification.classList.remove('show');
    }, 2400);
  }

  // =========================================================================
  // MARKDOWN TO HTML PARSER (For Revision, Tables & Model Answers)
  // =========================================================================
  function renderMarkdown(md) {
    if (!md) return '';
    let html = md.trim();

    // Auto-hyperlink Statutory Section mentions to Quick Bare Act Drawer
    const secMentionRegex = /\b(?:Section|Sec\.?|S\.)\s*([0-9]+[A-Z]?(?:\([0-9a-zA-Z]+\))*)/gi;
    html = html.replace(secMentionRegex, (match, secNum) => {
      return `<a href="javascript:void(0)" class="bare-act-link" data-sec="${secNum}" title="Open Section ${secNum} in Bare Act Drawer"><i class="fa-solid fa-book-bookmark"></i> ${match}</a>`;
    });

    // Markdown Tables to responsive HTML tables
    const tableRegex = /\|(.+)\|[\r\n]+\|[-:| ]+\|[\r\n]+((?:\|.+[\|\r\n]+)+)/g;
    html = html.replace(tableRegex, (match, headerRow, bodyRows) => {
      const headers = headerRow.split('|').filter(h => h.trim()).map(h => `<th>${h.trim()}</th>`).join('');
      const rows = bodyRows.trim().split('\n').map(row => {
        const cols = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
        return cols ? `<tr>${cols}</tr>` : '';
      }).join('');
      return `<div style="overflow-x:auto; margin:14px 0; -webkit-overflow-scrolling:touch;"><table class="rev-table"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
    });

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h4 style="font-size:1.1rem; margin:16px 0 8px; color:var(--sub-primary);">$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3 style="font-size:1.25rem; margin:20px 0 10px; color:var(--text-main);">$1</h3>');

    // Bullet Lists (only markdown dash bullets, don't corrupt existing HTML <ol> or <ul>)
    html = html.replace(/^(\s*)-\s+(.*$)/gim, '<li class="md-bullet">$2</li>');
    html = html.replace(/((?:<li class="md-bullet">.*<\/li>[\r\n]*)+)/g, '<ul style="margin:8px 0 14px 18px; line-height:1.55;">$1</ul>');

    // Bold, Italic, Strikethrough
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Line breaks for plain markdown paragraphs (don't break already structured HTML blocks)
    if (!/<(?:p|div|table|h[1-6]|ul|ol|blockquote)[>\s]/i.test(html)) {
      html = html.replace(/\n\n+/g, '<br><br>').replace(/\n/g, '<br>');
    }

    return html;
  }

  // =========================================================================
  // THEME & COLOR SYSTEM
  // =========================================================================
  function applyTheme(isDark) {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      elements.themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      localStorage.setItem('du_law_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      elements.themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
      localStorage.setItem('du_law_theme', 'light');
    }
  }

  function applySubjectTheme(subTheme, subId) {
    if (!subTheme) return;
    const root = document.documentElement;
    root.style.setProperty('--sub-primary', subTheme.primary);
    root.style.setProperty('--sub-primary-dark', subTheme.primaryDark);
    root.style.setProperty('--sub-primary-light', subTheme.primaryLight);
    root.style.setProperty('--sub-accent', subTheme.accent);
    root.style.setProperty('--sub-accent-light', subTheme.accentLight);
    root.style.setProperty('--sub-bg-tint', subTheme.bgTint);
    root.style.setProperty('--sub-border', subTheme.border);
    root.style.setProperty('--sub-badge-bg', subTheme.badgeBg);
    root.style.setProperty('--sub-badge-color', subTheme.badgeColor);
    root.style.setProperty('--sub-gradient', subTheme.gradient);
    if (subId) {
      document.body.setAttribute('data-active-subject', subId);
    }
  }

  // =========================================================================
  // STUDY PROGRESS TRACKER
  // =========================================================================
  function getSubjectProgress(subId, totalUnits) {
    if (!totalUnits || totalUnits === 0) return { completed: 0, percent: 0 };
    const list = state.completedUnits[subId] || [];
    const completed = list.length;
    const percent = Math.min(100, Math.round((completed / totalUnits) * 100));
    return { completed, percent };
  }

  function toggleUnitCompleted(subId, unitNum) {
    if (!state.completedUnits[subId]) {
      state.completedUnits[subId] = [];
    }
    const list = state.completedUnits[subId];
    const idx = list.indexOf(unitNum);
    let isNowCompleted = false;

    if (idx === -1) {
      list.push(unitNum);
      isNowCompleted = true;
      showToast(`Unit ${unitNum} marked as Revised! 🎉`, 'fa-circle-check');
    } else {
      list.splice(idx, 1);
      isNowCompleted = false;
      showToast(`Unit ${unitNum} unmarked`, 'fa-circle-xmark');
    }

    localStorage.setItem('du_law_completed_units', JSON.stringify(state.completedUnits));
    updateProgressUI();
    renderTopicsTab(state.currentSubject);
    return isNowCompleted;
  }

  function updateProgressUI() {
    if (!state.currentSubject) return;
    const subId = state.currentSubject.id;
    const total = state.currentSubject.units ? state.currentSubject.units.length : 0;
    const { completed, percent } = getSubjectProgress(subId, total);

    if (elements.subjectProgressCount) elements.subjectProgressCount.textContent = `${completed} of ${total} topics`;
    if (elements.subjectProgressText) elements.subjectProgressText.textContent = `${percent}% Done`;
    if (elements.subjectProgressBar) elements.subjectProgressBar.style.width = `${percent}%`;
  }

  // =========================================================================
  // VIEW SWITCHING
  // =========================================================================
  function showView(viewName) {
    elements.semesterView.classList.remove('active');
    elements.subjectsView.classList.remove('active');
    elements.subjectHubView.classList.remove('active');
    if (elements.mobileBottomNav) elements.mobileBottomNav.classList.remove('active');

    if (viewName === 'semester') {
      document.body.removeAttribute('data-active-subject');
      elements.semesterView.classList.add('active');
      renderSemesterSelection();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'subjects') {
      document.body.removeAttribute('data-active-subject');
      elements.subjectsView.classList.add('active');
      renderSubjectsGrid();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'hub') {
      elements.subjectHubView.classList.add('active');
      if (elements.mobileBottomNav) elements.mobileBottomNav.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // =========================================================================
  // 1. SEMESTER SELECTION VIEW
  // =========================================================================
  function renderSemesterSelection() {
    const data = window.DU_LAW_PORTAL_DATA;
    if (!data) return;

    elements.semesterGrid.innerHTML = data.semesters.map(sem => {
      const isActive = sem.active;
      const romanNumerals = ['', 'I', 'II', 'III', 'IV', 'V', 'VI'];
      const roman = romanNumerals[sem.id] || sem.id;
      return `
        <div class="sem-card ${isActive ? 'active-sem' : 'coming-soon'}" data-sem-id="${sem.id}">
          <div class="sem-card-strip"></div>
          <div class="sem-card-inner">
            <div class="sem-card-top">
              <span class="sem-roman">${roman}</span>
              <span class="sem-status-badge ${isActive ? 'badge-active' : 'badge-upcoming'}">
                ${sem.badge}
              </span>
            </div>
            <h3>${sem.name}</h3>
            <div class="sem-term">${sem.term}</div>
            <p>${sem.description}</p>
            <button class="sem-btn ${isActive ? 'sem-btn-primary' : 'sem-btn-disabled'}" ${!isActive ? 'disabled' : ''}>
              ${isActive ? `Enter ${sem.name} Subjects <i class="fa-solid fa-arrow-right"></i>` : '<i class="fa-solid fa-clock"></i> Uploading in Few Days'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    elements.semesterGrid.querySelectorAll('.sem-card.active-sem').forEach(card => {
      card.addEventListener('click', () => {
        const semId = parseInt(card.dataset.semId, 10);
        selectSemester(semId);
      });
    });
  }

  function selectSemester(semId) {
    state.currentSemester = semId;
    localStorage.setItem('du_law_selected_semester', semId);
    elements.headerSemText.textContent = `Semester ${semId}`;
    showView('subjects');
  }

  // =========================================================================
  // 2. SUBJECTS SELECTION VIEW
  // =========================================================================
  function applySubjectsViewMode(mode) {
    state.subjectsViewMode = mode;
    localStorage.setItem('du_subjects_view_mode', mode);

    if (elements.subjectsView) {
      elements.subjectsView.classList.remove('mode-books', 'mode-grid');
      elements.subjectsView.classList.add(mode === 'grid' ? 'mode-grid' : 'mode-books');
    }

    if (elements.viewModeBooksBtn && elements.viewModeGridBtn) {
      elements.viewModeBooksBtn.classList.toggle('active', mode !== 'grid');
      elements.viewModeGridBtn.classList.toggle('active', mode === 'grid');
    }

    // If switching to books mode, ensure Three.js canvas resizes appropriately
    if (mode !== 'grid' && window.DUBooksShowcase) {
      window.dispatchEvent(new Event('resize'));
    }
  }

  function renderSubjectsGrid() {
    const data = window.DU_LAW_PORTAL_DATA;
    if (!data || !state.currentSemester) return;

    const currentSemObj = data.semesters.find(s => s.id === state.currentSemester);
    if (!currentSemObj) return;

    elements.currentSemHeading.textContent = `${currentSemObj.name} — Core Subjects`;
    elements.currentSemDesc.textContent = `${currentSemObj.term} • Select any subject treatise below to open syllabus, landmark cases, and PYQ dossier.`;

    // Apply active view mode (3D Books or Standard Grid)
    applySubjectsViewMode(state.subjectsViewMode || 'books');

    // Load current semester into 3D Books Showcase
    if (window.DUBooksShowcase) {
      window.DUBooksShowcase.loadSemester(state.currentSemester);
    }

    const subjectIds = currentSemObj.subjectIds;
    const subjectsList = subjectIds.map(id => data.subjects[id]).filter(Boolean);

    elements.subjectsGrid.innerHTML = subjectsList.map(sub => {
      const theme = sub.theme;
      const totalUnits = sub.units ? sub.units.length : 0;
      const { completed, percent } = getSubjectProgress(sub.id, totalUnits);

      return `
        <div class="subject-card fade-in" data-sub-id="${sub.id}" data-subject="${sub.id}" style="--card-accent: ${theme.primary};">
          <div class="sub-card-banner" style="background: ${theme.gradient};">
            <div class="sub-code-row">
              <span class="sub-code-badge">${sub.code}</span>
              <div class="sub-icon-box"><i class="fa-solid ${theme.icon}"></i></div>
            </div>
            <div class="sub-card-banner-content">
              ${theme.motto ? `<div class="sub-card-motto"><i class="fa-solid fa-scroll"></i> ${theme.motto}</div>` : ''}
              <h3>${sub.name}</h3>
              <p class="sub-tagline">${theme.tagline}</p>
            </div>
          </div>

          <div class="sub-card-body">
            <div class="sub-stats-row">
              <div class="stat-item">
                <div class="stat-value">${totalUnits}</div>
                <div class="stat-label">Units</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${sub.cases ? sub.cases.length : 0}</div>
                <div class="stat-label">Cases</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${sub.pyqs ? sub.pyqs.length : 0}</div>
                <div class="stat-label">PYQs</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${percent}%</div>
                <div class="stat-label">Revised</div>
              </div>
            </div>

            <div class="sub-open-btn">
              <div class="sub-open-btn-bg"></div>
              <span>Open Subject Hub</span>
              <i class="fa-solid fa-arrow-right"></i>
            </div>
          </div>
        </div>
      `;
    }).join('');

    elements.subjectsGrid.querySelectorAll('.subject-card').forEach(card => {
      card.addEventListener('click', () => {
        const subId = card.dataset.subId;
        openSubjectHub(subId);
      });
    });
  }

  // =========================================================================
  // 3. SUBJECT HUB VIEW & SPECIALIZED TABS
  // =========================================================================
  function openSubjectHub(subId) {
    const data = window.DU_LAW_PORTAL_DATA;
    const sub = data.subjects[subId];
    if (!sub) return;

    state.currentSubject = sub;
    state.currentTab = 'topics';
    state.searchQuery = '';
    state.selectedUnitFilter = 'all';
    state.activeQuickFilter = 'all';

    // Apply Subject Theme!
    applySubjectTheme(sub.theme, sub.id);

    // Update Hub Banner Header
    elements.hubBreadcrumbSem.textContent = `Semester ${state.currentSemester}`;
    elements.hubBreadcrumbSub.textContent = sub.shortName;
    elements.hubCodeTag.textContent = `${sub.code} • DU Case Material`;
    if (elements.hubMottoTag) {
      if (sub.theme.motto) {
        elements.hubMottoTag.textContent = sub.theme.motto;
        elements.hubMottoTag.style.display = 'inline-block';
      } else {
        elements.hubMottoTag.style.display = 'none';
      }
    }
    elements.hubTitle.textContent = sub.name;
    elements.hubTagline.textContent = sub.theme.tagline;

    // Update Metric Counter Pills
    elements.hubUnitsPill.innerHTML = `📚 <b>${sub.units.length}</b> Units / Topics`;
    elements.hubCasesPill.innerHTML = `⚖️ <b>${sub.cases.length}</b> Landmark Cases`;
    elements.hubPyqsPill.innerHTML = `📝 <b>${sub.pyqs.length}</b> DU PYQs with Answers`;
    elements.hubRevPill.innerHTML = `⚡ <b>${sub.revisions.length}</b> Topic Revision Capsules`;

    // Update Progress
    updateProgressUI();

    // Populate Unit Filter Select Dropdown
    elements.unitFilterSelect.innerHTML = '<option value="all">All Units / Topics</option>' +
      sub.units.map(u => `<option value="${u.number}">Unit ${u.number}: ${u.title}</option>`).join('');

    // Reset Search Input
    elements.hubSearchInput.value = '';
    if (elements.searchClearBtn) elements.searchClearBtn.style.display = 'none';

    // Switch to Hub View
    showView('hub');

    // Switch to Default Tab
    switchHubTab('topics');
  }

  function switchHubTab(tabName) {
    state.currentTab = tabName;
    state.activeQuickFilter = 'all';

    // Update Desktop Tabs
    elements.hubTabs.forEach(btn => {
      if (btn.dataset.tab === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Mobile Bottom Nav
    elements.mobileNavItems.forEach(item => {
      if (item.dataset.tab === tabName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Show corresponding tab pane
    elements.tabContentPanes.forEach(pane => {
      if (pane.id === `${tabName}TabPane`) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    // Render Quick Filter Chips for active tab
    renderQuickFilterChips();

    // Render active tab content
    renderActiveTabContent();
  }

  // -------------------------------------------------------------------------
  // QUICK FILTER CHIPS
  // -------------------------------------------------------------------------
  function renderQuickFilterChips() {
    if (!elements.quickFilterChips) return;
    let chips = [];

    if (state.currentTab === 'topics') {
      chips = [
        { id: 'all', label: 'All Units' },
        { id: 'completed', label: '✅ Revised' },
        { id: 'pending', label: '📖 To Revise' }
      ];
    } else if (state.currentTab === 'cases') {
      chips = [
        { id: 'all', label: 'All Cases' },
        { id: 'sc', label: 'Supreme Court of India' },
        { id: 'landmark', label: 'Landmark Precedents' }
      ];
    } else if (state.currentTab === 'pyqs') {
      chips = [
        { id: 'all', label: 'All PYQs' },
        { id: '20', label: '20 Marks (Essays)' },
        { id: '10', label: '10 Marks (Problems)' },
        { id: 'bookmarked', label: '★ Bookmarked' }
      ];
    } else if (state.currentTab === 'revision') {
      chips = [
        { id: 'all', label: 'All Topic Capsules' },
        { id: 'mustquote', label: '⭐ Must-Quote Lines & Tables' },
        { id: 'strategy', label: '💡 Exam Strategies' },
        { id: 'casemap', label: '⚖️ Case–Judge Maps' }
      ];
    }

    elements.quickFilterChips.innerHTML = chips.map(c => `
      <button class="filter-chip ${state.activeQuickFilter === c.id ? 'active' : ''}" data-chip-id="${c.id}">
        ${c.label}
      </button>
    `).join('');

    elements.quickFilterChips.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeQuickFilter = btn.dataset.chipId;
        renderQuickFilterChips();
        renderActiveTabContent();
      });
    });
  }

  function renderActiveTabContent() {
    const sub = state.currentSubject;
    if (!sub) return;

    if (state.currentTab === 'topics') {
      renderTopicsTab(sub);
    } else if (state.currentTab === 'cases') {
      renderCasesTab(sub);
    } else if (state.currentTab === 'pyqs') {
      renderPyqsTab(sub);
    } else if (state.currentTab === 'revision') {
      renderRevisionTab(sub);
    }
  }

  // -------------------------------------------------------------------------
  // TAB 1: ALL TOPICS / COMPREHENSIVE NOTES
  // -------------------------------------------------------------------------
  function renderTopicsTab(sub) {
    let units = sub.units || [];
    const completedList = state.completedUnits[sub.id] || [];

    // Filter by unit dropdown
    if (state.selectedUnitFilter !== 'all') {
      const uNum = parseInt(state.selectedUnitFilter, 10);
      units = units.filter(u => u.number === uNum);
    }

    // Filter by quick chips
    if (state.activeQuickFilter === 'completed') {
      units = units.filter(u => completedList.includes(u.number));
    } else if (state.activeQuickFilter === 'pending') {
      units = units.filter(u => !completedList.includes(u.number));
    }

    // Filter by search query
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      units = units.filter(u =>
        u.title.toLowerCase().includes(q) ||
        (u.subtitle && u.subtitle.toLowerCase().includes(q)) ||
        (u.statutes && u.statutes.toLowerCase().includes(q)) ||
        (u.topics && u.topics.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (units.length === 0) {
      elements.topicsContainer.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-magnifying-glass"></i>
          <h4>No units matched your filter</h4>
          <p>Try resetting filters or searching for another keyword.</p>
        </div>
      `;
      return;
    }

    elements.topicsContainer.innerHTML = `
      <div class="topics-grid">
        ${units.map(u => {
          const isDone = completedList.includes(u.number);
          return `
            <div class="unit-card fade-in ${isDone ? 'is-completed' : ''}" data-unit="${u.number}">
              <div>
                <div class="unit-card-header">
                  <div class="unit-badge-number">${u.number}</div>
                  <div class="unit-card-titles">
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:6px;">
                      <h4>${u.title}</h4>
                      <button class="unit-check-btn ${isDone ? 'checked' : ''}" data-unit="${u.number}" title="Toggle revision status">
                        <i class="fa-solid ${isDone ? 'fa-check' : 'fa-circle'}"></i>
                        <span>${isDone ? 'Revised' : 'Mark Done'}</span>
                      </button>
                    </div>
                    ${u.subtitle ? `<div class="unit-sub">${u.subtitle}</div>` : ''}
                  </div>
                </div>

                ${u.statutes ? `
                  <div class="unit-statutes">
                    <strong>📜 Bare Acts / Provisions:</strong> ${u.statutes}
                  </div>
                ` : ''}

                ${u.topics && u.topics.length ? `
                  <ul class="unit-topics-list">
                    ${u.topics.map(t => `<li>${t}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>

              <div class="unit-actions-row">
                <button class="btn-read-notes" data-file="${u.file}" data-title="${u.title}" data-unit="${u.number}">
                  <i class="fa-solid fa-book-open"></i> Read Full Notes
                </button>
                <button class="btn-open-newtab" data-file="${u.file}" title="Open standalone note in new window">
                  <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Attach listeners
    elements.topicsContainer.querySelectorAll('.unit-check-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const uNum = parseInt(btn.dataset.unit, 10);
        toggleUnitCompleted(sub.id, uNum);
      });
    });

    elements.topicsContainer.querySelectorAll('.btn-read-notes').forEach(btn => {
      btn.addEventListener('click', () => {
        const file = btn.dataset.file;
        const title = btn.dataset.title;
        const unit = btn.dataset.unit;
        openReader(file, `Unit ${unit}: ${title}`, `${sub.name} • DU Notes`);
      });
    });

    elements.topicsContainer.querySelectorAll('.btn-open-newtab').forEach(btn => {
      btn.addEventListener('click', () => {
        window.open(btn.dataset.file, '_blank');
      });
    });
  }

  // -------------------------------------------------------------------------
  // TAB 2: LANDMARK CASES (FIRAC CARDS) — TOPIC-WISE SEGREGATED
  // -------------------------------------------------------------------------
  function renderCasesTab(sub) {
    let cases = sub.cases || [];

    // Filter by unit dropdown
    if (state.selectedUnitFilter !== 'all') {
      const uNum = parseInt(state.selectedUnitFilter, 10);
      cases = cases.filter(c => c.unitNumber === uNum);
    }

    // Filter by quick chips
    if (state.activeQuickFilter === 'sc') {
      cases = cases.filter(c => (c.citation && c.citation.includes('SC')) || (c.name && c.name.includes('State of')));
    }

    // Filter by search query
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      cases = cases.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.citation && c.citation.toLowerCase().includes(q)) ||
        (c.facts && c.facts.toLowerCase().includes(q)) ||
        (c.ratio && c.ratio.toLowerCase().includes(q)) ||
        (c.unit && c.unit.toLowerCase().includes(q))
      );
    }

    if (cases.length === 0) {
      elements.casesContainer.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-scale-unbalanced"></i>
          <h4>No landmark cases found</h4>
          <p>Try searching for another case name or clearing filters.</p>
        </div>
      `;
      return;
    }

    // Group cases topic-wise by unitNumber
    const groups = {};
    cases.forEach(c => {
      const uNum = c.unitNumber || 1;
      if (!groups[uNum]) {
        groups[uNum] = {
          unitNumber: uNum,
          unitTitle: c.unit || `Topic / Unit ${uNum}`,
          items: []
        };
      }
      groups[uNum].items.push(c);
    });
    const sortedGroupKeys = Object.keys(groups).map(Number).sort((a, b) => a - b);

    elements.casesContainer.innerHTML = `
      <!-- Topic Jump & Filter Navigation Bar -->
      ${sortedGroupKeys.length > 1 ? `
        <div class="topic-jump-nav fade-in">
          <span class="jump-nav-title"><i class="fa-solid fa-scale-balanced"></i> Topic Filter / Jump:</span>
          <div class="jump-chips-wrap">
            <button class="jump-chip ${state.selectedUnitFilter === 'all' ? 'active' : ''}" data-target-unit="all">
              All Topics <span class="chip-count">${cases.length}</span>
            </button>
            ${sortedGroupKeys.map(k => `
              <button class="jump-chip ${state.selectedUnitFilter === String(k) ? 'active' : ''}" data-target-unit="${k}">
                Unit ${k} <span class="chip-count">${groups[k].items.length}</span>
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Topic-Wise Segregated Container -->
      <div class="topic-segregated-container">
        ${sortedGroupKeys.map(k => {
          const grp = groups[k];
          return `
            <div class="topic-group-section fade-in" id="cases-group-unit-${grp.unitNumber}">
              <div class="topic-group-header">
                <div class="topic-group-header-left">
                  <span class="topic-group-badge"><i class="fa-solid fa-folder-open"></i> Unit ${grp.unitNumber}</span>
                  <span class="topic-group-count"><i class="fa-solid fa-scale-balanced"></i> ${grp.items.length} ${grp.items.length === 1 ? 'Landmark Precedent' : 'Landmark Precedents'}</span>
                </div>
                <h3 class="topic-group-title">${grp.unitTitle}</h3>
              </div>

              <div class="cases-list">
                ${grp.items.map(c => `
                  <div class="case-card fade-in">
                    <div class="case-card-header">
                      <div class="case-title-area">
                        <h3>${c.name}</h3>
                        <div class="case-citation">${c.citation || 'Prescribed DU Case Material Precedent'}</div>
                      </div>
                      <div class="case-badge-actions">
                        <button class="btn-card-star ${state.starred.some(s => s.id === c.id) ? 'starred' : ''}" data-star-id="${c.id}" data-star-type="case" data-star-title="${encodeURIComponent(c.name)}" title="Star Precedent"><i class="fa-${state.starred.some(s => s.id === c.id) ? 'solid' : 'regular'} fa-star"></i></button><button class="btn-card-note ${state.personalNotes[c.id] ? 'has-note' : ''}" data-note-id="${c.id}" title="Personal Note"><i class="fa-regular fa-note-sticky"></i></button><button class="btn-copy-cite" data-cite="${c.name} ${c.citation ? '— ' + c.citation : ''}" title="Copy Citation">
                          <i class="fa-solid fa-copy"></i> Copy Citation
                        </button>
                        <span class="case-unit-tag">${c.unit}</span>
                      </div>
                    </div>

                    <div class="case-card-body">
                      <div class="firac-grid">
                        <div class="firac-box facts">
                          <span class="firac-label"><i class="fa-solid fa-book-open"></i> Essential Facts & Procedural History</span>
                          <div class="case-text-block">${c.facts}</div>
                        </div>
                        <div class="firac-box ratio">
                          <span class="firac-label"><i class="fa-solid fa-scale-balanced"></i> Ratio Decidendi & Legal Principles</span>
                          <div class="case-text-block">${c.ratio}</div>
                        </div>
                      </div>

                      ${c.issues ? `
                        <div class="case-extra-box issues-box">
                          <span class="extra-box-label"><i class="fa-solid fa-circle-question"></i> Key Legal Issues Framed</span>
                          <div class="case-text-block">${c.issues}</div>
                        </div>
                      ` : ''}

                      ${c.arguments ? `
                        <div class="case-extra-box args-box">
                          <span class="extra-box-label"><i class="fa-solid fa-comments"></i> Arguments of the Parties</span>
                          <div class="case-text-block">${c.arguments}</div>
                        </div>
                      ` : ''}

                      ${c.examTips ? `
                        <div class="case-extra-box tips-box">
                          <span class="extra-box-label"><i class="fa-solid fa-lightbulb"></i> DU Exam Application & Strategy</span>
                          <div class="case-text-block">${c.examTips}</div>
                        </div>
                      ` : ''}

                      <div class="case-footer-actions">
                        <button class="btn-case-reader" data-file="${c.file}" data-anchor="${c.anchorId || ''}" data-name="${c.name}">
                          <i class="fa-solid fa-file-lines"></i> View Complete Note & Precedent Analysis <i class="fa-solid fa-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Jump Chip click handlers
    elements.casesContainer.querySelectorAll('.jump-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const targetUnit = chip.dataset.targetUnit;
        if (elements.unitFilterSelect) {
          elements.unitFilterSelect.value = targetUnit;
        }
        state.selectedUnitFilter = targetUnit;
        renderCasesTab(sub);
        if (targetUnit !== 'all') {
          const targetEl = document.getElementById(`cases-group-unit-${targetUnit}`);
          if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Copy Citation buttons

    elements.casesContainer.querySelectorAll('.btn-card-star').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleStar({
          id: btn.dataset.starId,
          type: 'case',
          title: decodeURIComponent(btn.dataset.starTitle)
        });
      });
    });

    elements.casesContainer.querySelectorAll('.btn-card-note').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        promptNote(btn.dataset.noteId);
      });
    });

    elements.casesContainer.querySelectorAll('.btn-copy-cite').forEach(btn => {

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cite = btn.dataset.cite;
        navigator.clipboard.writeText(cite).then(() => {
          showToast('Citation copied to clipboard! 📋', 'fa-copy');
        }).catch(() => {
          showToast('Copied: ' + cite.slice(0, 30) + '...', 'fa-copy');
        });
      });
    });

    // View in Full Unit Notes
    elements.casesContainer.querySelectorAll('.btn-case-reader').forEach(btn => {
      btn.addEventListener('click', () => {
        const file = btn.dataset.file;
        const anchor = btn.dataset.anchor;
        const name = btn.dataset.name;
        const targetUrl = anchor ? `${file}#${anchor}` : file;
        openReader(targetUrl, name, `${sub.name} • Landmark Precedent`);
      });
    });
  }

  // -------------------------------------------------------------------------
  // TAB 3: PREVIOUS YEAR QUESTIONS (PYQS) & MODEL ANSWERS — TOPIC-WISE SEGREGATED
  // -------------------------------------------------------------------------
  function renderPyqsTab(sub) {
    let pyqs = sub.pyqs || [];

    // Filter by unit
    if (state.selectedUnitFilter !== 'all') {
      const uNum = parseInt(state.selectedUnitFilter, 10);
      pyqs = pyqs.filter(p => p.unitNumber === uNum);
    }

    // Filter by quick chips
    if (state.activeQuickFilter === '20') {
      pyqs = pyqs.filter(p => (p.marks && (p.marks.includes('20') || p.marks.includes('15'))));
    } else if (state.activeQuickFilter === '10') {
      pyqs = pyqs.filter(p => (p.marks && (p.marks.includes('10') || p.marks.includes('7'))));
    } else if (state.activeQuickFilter === 'bookmarked') {
      pyqs = pyqs.filter(p => state.bookmarkedPyqs.includes(p.id));
    }

    // Filter by search query
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      pyqs = pyqs.filter(p =>
        p.question.toLowerCase().includes(q) ||
        (p.modelAnswer && p.modelAnswer.toLowerCase().includes(q)) ||
        (p.unit && p.unit.toLowerCase().includes(q))
      );
    }

    if (pyqs.length === 0) {
      elements.pyqsContainer.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-file-circle-question"></i>
          <h4>No questions found</h4>
          <p>Try searching for a different question topic or reset filters.</p>
        </div>
      `;
      return;
    }

    // Group pyqs topic-wise by unitNumber
    const groups = {};
    pyqs.forEach(p => {
      const uNum = p.unitNumber || 1;
      if (!groups[uNum]) {
        groups[uNum] = {
          unitNumber: uNum,
          unitTitle: p.unit || `Topic / Unit ${uNum}`,
          items: []
        };
      }
      groups[uNum].items.push(p);
    });
    const sortedGroupKeys = Object.keys(groups).map(Number).sort((a, b) => a - b);

    elements.pyqsContainer.innerHTML = `
      <!-- Topic Jump & Filter Navigation Bar -->
      ${sortedGroupKeys.length > 1 ? `
        <div class="topic-jump-nav fade-in">
          <span class="jump-nav-title"><i class="fa-solid fa-book-bookmark"></i> Topic Filter / Jump:</span>
          <div class="jump-chips-wrap">
            <button class="jump-chip ${state.selectedUnitFilter === 'all' ? 'active' : ''}" data-target-unit="all">
              All Topics <span class="chip-count">${pyqs.length}</span>
            </button>
            ${sortedGroupKeys.map(k => `
              <button class="jump-chip ${state.selectedUnitFilter === String(k) ? 'active' : ''}" data-target-unit="${k}">
                Unit ${k} <span class="chip-count">${groups[k].items.length}</span>
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Topic-Wise Segregated Container -->
      <div class="topic-segregated-container">
        ${sortedGroupKeys.map(k => {
          const grp = groups[k];
          return `
            <div class="topic-group-section fade-in" id="pyq-group-unit-${grp.unitNumber}">
              <div class="topic-group-header">
                <div class="topic-group-header-left">
                  <span class="topic-group-badge"><i class="fa-solid fa-folder-open"></i> Unit ${grp.unitNumber}</span>
                  <span class="topic-group-count"><i class="fa-solid fa-clipboard-question"></i> ${grp.items.length} ${grp.items.length === 1 ? 'Question' : 'Questions'}</span>
                </div>
                <h3 class="topic-group-title">${grp.unitTitle}</h3>
              </div>

              <div class="pyq-list">
                ${grp.items.map((p, idx) => {
                  const isBookmarked = state.bookmarkedPyqs.includes(p.id);
                  return `
                    <div class="pyq-card fade-in" id="${p.id}">
                      <div class="pyq-header">
                        <div class="pyq-badge-group">
                          <span class="pyq-no-badge">${p.number || `Q${idx + 1}`}</span>
                          <span class="pyq-marks-badge">${p.marks || '20 Marks'}</span>
                          <button class="btn-bookmark-pyq ${isBookmarked ? 'bookmarked' : ''}" data-pyq-id="${p.id}" title="${isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}">
                            <i class="fa-${isBookmarked ? 'solid' : 'regular'} fa-bookmark"></i>
                          </button>
                        </div>
                        <span class="pyq-unit-label">${p.unit}</span>
                      </div>

                      <div class="pyq-body">
                        <div class="pyq-question-text">${p.question}</div>

                        <div class="model-ans-accordion">
                          <div class="model-ans-header">
                            <span><i class="fa-solid fa-lightbulb"></i> View High-Scoring Model Answer & Strategy</span>
                            <i class="fa-solid fa-chevron-down chevron-icon"></i>
                          </div>
                          <div class="model-ans-content" style="display: none;">
                            ${renderMarkdown(p.modelAnswer)}
                          </div>
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Jump Chip click handlers
    elements.pyqsContainer.querySelectorAll('.jump-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const targetUnit = chip.dataset.targetUnit;
        if (elements.unitFilterSelect) {
          elements.unitFilterSelect.value = targetUnit;
        }
        state.selectedUnitFilter = targetUnit;
        renderPyqsTab(sub);
        if (targetUnit !== 'all') {
          const targetEl = document.getElementById(`pyq-group-unit-${targetUnit}`);
          if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Accordion toggles with smooth transition & chevron flip
    elements.pyqsContainer.querySelectorAll('.model-ans-header').forEach(header => {
      header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const chevron = header.querySelector('.chevron-icon');
        const isClosed = (content.style.display === 'none' || content.style.display === '');

        if (isClosed) {
          content.style.display = 'block';
          if (chevron) chevron.style.transform = 'rotate(180deg)';
        } else {
          content.style.display = 'none';
          if (chevron) chevron.style.transform = 'rotate(0deg)';
        }
      });
    });

    // Bookmark buttons
    elements.pyqsContainer.querySelectorAll('.btn-bookmark-pyq').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pyqId = btn.dataset.pyqId;
        const idx = state.bookmarkedPyqs.indexOf(pyqId);
        if (idx === -1) {
          state.bookmarkedPyqs.push(pyqId);
          showToast('Question bookmarked! ★', 'fa-bookmark');
        } else {
          state.bookmarkedPyqs.splice(idx, 1);
          showToast('Bookmark removed', 'fa-bookmark');
        }
        localStorage.setItem('du_law_bookmarked_pyqs', JSON.stringify(state.bookmarkedPyqs));
        renderPyqsTab(sub);
      });
    });
  }

  // -------------------------------------------------------------------------
  // TAB 4: QUICK LAST-MINUTE REVISION (LMR)
  // -------------------------------------------------------------------------
  function renderRevisionTab(sub) {
    let revisions = sub.revisions || [];

    // Filter by unit dropdown
    if (state.selectedUnitFilter !== 'all') {
      const uNum = parseInt(state.selectedUnitFilter, 10);
      revisions = revisions.filter(r => r.unitNumber === uNum);
    }

    // Filter by quick chips
    if (state.activeQuickFilter === 'mustquote') {
      revisions = revisions.filter(r => r.table && r.table.rows && r.table.rows.length > 0);
    } else if (state.activeQuickFilter === 'strategy') {
      revisions = revisions.filter(r => !!r.examStrategy);
    } else if (state.activeQuickFilter === 'casemap') {
      revisions = revisions.filter(r => !!r.caseMap);
    }

    // Filter by search query
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      revisions = revisions.filter(r =>
        (r.unitTitle && r.unitTitle.toLowerCase().includes(q)) ||
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.badge && r.badge.toLowerCase().includes(q)) ||
        (r.examStrategy && r.examStrategy.toLowerCase().includes(q)) ||
        (r.caseMap && r.caseMap.toLowerCase().includes(q)) ||
        (r.table && r.table.rows && r.table.rows.some(row => row.some(cell => cell.toLowerCase().includes(q))))
      );
    }

    if (revisions.length === 0) {
      elements.revisionContainer.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-bolt"></i>
          <h4>No revision capsules match your filter</h4>
          <p>Try selecting 'All Units' from the dropdown or clear your search.</p>
        </div>
      `;
      return;
    }

    elements.revisionContainer.innerHTML = `
      <div class="revision-container">
        ${revisions.map(r => `
          <div class="rev-card fade-in" id="rev-unit-${r.unitNumber}">
            <div class="rev-card-header">
              <div class="rev-card-header-left">
                <span class="rev-unit-badge">Unit ${r.unitNumber}</span>
                <span class="rev-badge-pill">${r.badge}</span>
              </div>
              <div class="rev-card-header-right">
                <button class="btn-rev-reader" data-file="${r.file}" data-anchor="${r.anchorId || ''}" data-title="${r.unitTitle}">
                  <i class="fa-solid fa-book-open"></i> Read Full Notes <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </button>
              </div>
            </div>

            <div class="rev-card-title-area">
              <h3>${r.title}</h3>
              <div class="rev-unit-subtitle">${r.unitTitle}</div>
            </div>

            <div class="rev-content-body">
              ${r.table ? `
                <div class="rev-table-wrap">
                  <table class="rev-table">
                    <thead>
                      <tr>${r.table.headers.map(h => `<th>${h}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
                      ${r.table.rows.map(row => `
                        <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              ` : ''}

              ${r.examStrategy ? `
                <div class="rev-exam-strategy">
                  <div class="rev-callout-label"><i class="fa-solid fa-star"></i> Exam Strategy &amp; Scoring Tips</div>
                  <p>${r.examStrategy}</p>
                </div>
              ` : ''}

              ${r.caseMap ? `
                <div class="rev-case-map">
                  <div class="rev-callout-label"><i class="fa-solid fa-scale-balanced"></i> Case–Judge–Court Map</div>
                  <p>${r.caseMap}</p>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Attach reader click listeners
    elements.revisionContainer.querySelectorAll('.btn-rev-reader').forEach(btn => {
      btn.addEventListener('click', () => {
        const file = btn.dataset.file;
        const anchor = btn.dataset.anchor;
        const title = btn.dataset.title;
        const url = anchor ? `${file}#${anchor}` : file;
        openReader(url, `${title} • Revision Capsule`, `${sub.name} • Last-Minute Revision`);
      });
    });
  }

  // =========================================================================
  // 4. EMBEDDED FULL NOTES READER MODAL (Print PDF removed)
  // =========================================================================
  function openReader(fileUrl, title, subInfo) {
    elements.readerTitle.textContent = title || 'Comprehensive DU Study Notes';
    elements.readerSubInfo.textContent = subInfo || 'Faculty of Law, University of Delhi';
    elements.readerIframe.src = fileUrl;
    elements.readerModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // New Tab button
    elements.readerNewTabBtn.onclick = () => window.open(fileUrl, '_blank');
  }

  function closeReader() {
    elements.readerModal.classList.remove('active');
    elements.readerIframe.src = 'about:blank';
    document.body.style.overflow = '';
  }

  // =========================================================================
  // INITIALIZATION & EVENT LISTENERS
  // =========================================================================
  
  // =========================================================================
  // 5. PRECEDENT RECALL FLASHCARDS CONTROLLER (3D Flip Deck)
  // =========================================================================
  function openFlashcardsModal(subjectId, filterUnit) {
    const data = window.DU_LAW_PORTAL_DATA;
    if (!data) return;

    const subId = subjectId || state.currentSubject || 'contract';
    const sub = data.subjects[subId];
    if (!sub || !sub.cases || sub.cases.length === 0) {
      showToast('No landmark cases available for flashcards in this subject.');
      return;
    }

    let deck = [...sub.cases];
    if (filterUnit && filterUnit !== 'all') {
      const uNum = parseInt(filterUnit, 10);
      const filtered = deck.filter(c => c.unitNumber === uNum);
      if (filtered.length > 0) deck = filtered;
    }

    state.flashcards.deck = deck;
    state.flashcards.currentIndex = 0;
    state.flashcards.isFlipped = false;

    // Update Header info
    if (elements.fcSubjectTitle) elements.fcSubjectTitle.textContent = `${sub.name} — Precedent Recall`;
    if (elements.fcDeckInfo) elements.fcDeckInfo.textContent = `Active Deck: ${deck.length} Landmark Authorities`;

    renderFlashcardCard();

    if (elements.flashcardsModal) elements.flashcardsModal.classList.add('active');
    document.body.classList.add('modal-open');

    // Attach keyboard listener
    document.addEventListener('keydown', handleFlashcardKeydown);
  }

  function closeFlashcardsModal() {
    if (elements.flashcardsModal) elements.flashcardsModal.classList.remove('active');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', handleFlashcardKeydown);
  }

  function renderFlashcardCard() {
    const fcState = state.flashcards;
    if (!fcState.deck || fcState.deck.length === 0) return;

    const currentCard = fcState.deck[fcState.currentIndex];
    const total = fcState.deck.length;
    const currentNum = fcState.currentIndex + 1;

    // Reset flip
    fcState.isFlipped = false;
    if (elements.activeFlashcard) elements.activeFlashcard.classList.remove('is-flipped');

    // Progress bar and counter
    if (elements.fcCounterText) elements.fcCounterText.textContent = `Card ${currentNum} of ${total}`;
    if (elements.fcProgressFill) elements.fcProgressFill.style.width = `${(currentNum / total) * 100}%`;

    // Calculate mastered count for current deck
    const masteredCount = fcState.deck.filter(c => fcState.masteredIds.includes(c.name)).length;
    if (elements.fcMasteryStats) elements.fcMasteryStats.textContent = `${masteredCount} of ${total} Mastered`;

    // Front Face (Prompt / Dilemma)
    if (elements.fcFrontUnit) elements.fcFrontUnit.textContent = currentCard.unit || 'Landmark Precedent';
    if (elements.fcFrontFacts) elements.fcFrontFacts.textContent = currentCard.facts || 'Material facts as recorded in DU Case Material.';
    if (elements.fcFrontIssue) elements.fcFrontIssue.textContent = currentCard.issues || 'Core legal issue examined by the bench.';

    // Back Face (Precedent / Ratio)
    if (elements.fcBackUnit) elements.fcBackUnit.textContent = currentCard.unit || 'Precedent Revealed';
    if (elements.fcBackCite) elements.fcBackCite.textContent = currentCard.citation || 'DU Case Material';
    if (elements.fcBackCaseName) elements.fcBackCaseName.textContent = currentCard.name;
    if (elements.fcBackRatio) elements.fcBackRatio.textContent = currentCard.ratio || 'Established doctrine and judicial ratio.';

    if (elements.fcBackTip && elements.fcBackTipBox) {
      if (currentCard.examTips) {
        elements.fcBackTip.textContent = currentCard.examTips;
        elements.fcBackTipBox.style.display = 'block';
      } else {
        elements.fcBackTipBox.style.display = 'none';
      }
    }

    // Update mastery buttons active style
    const isMastered = fcState.masteredIds.includes(currentCard.name);
    if (elements.fcBtnMastered) elements.fcBtnMastered.classList.toggle('active', isMastered);
    if (elements.fcBtnReview) elements.fcBtnReview.classList.toggle('active', !isMastered);
  }

  function flipFlashcard() {
    state.flashcards.isFlipped = !state.flashcards.isFlipped;
    if (elements.activeFlashcard) {
      elements.activeFlashcard.classList.toggle('is-flipped', state.flashcards.isFlipped);
    }
  }

  function nextFlashcard() {
    if (state.flashcards.deck.length === 0) return;
    if (state.flashcards.currentIndex < state.flashcards.deck.length - 1) {
      state.flashcards.currentIndex++;
    } else {
      state.flashcards.currentIndex = 0; // wrap around
    }
    renderFlashcardCard();
  }

  function prevFlashcard() {
    if (state.flashcards.deck.length === 0) return;
    if (state.flashcards.currentIndex > 0) {
      state.flashcards.currentIndex--;
    } else {
      state.flashcards.currentIndex = state.flashcards.deck.length - 1; // wrap around
    }
    renderFlashcardCard();
  }

  function shuffleFlashcards() {
    const deck = state.flashcards.deck;
    if (!deck || deck.length <= 1) return;

    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    state.flashcards.currentIndex = 0;
    renderFlashcardCard();
    showToast('Flashcard deck shuffled! 🔀');
  }

  function markFlashcardMastery(isMastered) {
    const fcState = state.flashcards;
    if (!fcState.deck || fcState.deck.length === 0) return;
    const currentCard = fcState.deck[fcState.currentIndex];

    if (isMastered) {
      if (!fcState.masteredIds.includes(currentCard.name)) {
        fcState.masteredIds.push(currentCard.name);
      }
      showToast(`Mastered: ${currentCard.name} 🎉`);
    } else {
      fcState.masteredIds = fcState.masteredIds.filter(name => name !== currentCard.name);
      showToast(`Queued for Review: ${currentCard.name}`);
    }

    localStorage.setItem('du_law_flashcard_mastery', JSON.stringify(fcState.masteredIds));
    renderFlashcardCard();

    // Auto-advance after brief pause
    setTimeout(() => {
      nextFlashcard();
    }, 380);
  }

  function handleFlashcardKeydown(e) {
    if (!elements.flashcardsModal || !elements.flashcardsModal.classList.contains('active')) return;

    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      flipFlashcard();
    } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      e.preventDefault();
      nextFlashcard();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      prevFlashcard();
    } else if (e.key === '1') {
      e.preventDefault();
      markFlashcardMastery(false);
    } else if (e.key === '2') {
      e.preventDefault();
      markFlashcardMastery(true);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeFlashcardsModal();
    }
  }

  // =========================================================================
  // 6. QUICK BARE ACT DRAWER CONTROLLER
  // =========================================================================
  function openBareActDrawer(searchSec, filterAct) {
    if (!elements.bareActDrawer) return;

    // Detect appropriate act from current subject if not explicitly given
    let targetAct = filterAct || state.bareActs.activeAct;
    if (!filterAct && state.currentSubject) {
      const subActMap = {
        contract: 'ica',
        bns: 'bns',
        family: 'hma',
        torts: 'cpa',
        company: 'ca',
        juris: 'all'
      };
      if (subActMap[state.currentSubject]) {
        targetAct = subActMap[state.currentSubject];
      }
    }

    state.bareActs.activeAct = targetAct || 'all';

    // Set search query if passed
    if (searchSec) {
      state.bareActs.searchQuery = String(searchSec).trim();
      if (elements.bareActSearchInput) {
        elements.bareActSearchInput.value = state.bareActs.searchQuery;
      }
      if (elements.bareActClearSearch) elements.bareActClearSearch.style.display = 'block';
    }

    // Update tab styles
    const tabs = elements.badActTabs ? elements.badActTabs.querySelectorAll('.bad-tab') : [];
    tabs.forEach(t => {
      t.classList.toggle('active', t.dataset.act === state.bareActs.activeAct);
    });

    elements.bareActDrawer.classList.add('open');
    if (elements.bareActOverlay) elements.bareActOverlay.classList.add('open');
    document.body.classList.add('drawer-open');

    renderBareActList();

    // If searchSec specified, scroll to matching card
    if (searchSec) {
      setTimeout(() => {
        const targetCard = elements.bareActList ? elements.bareActList.querySelector('.bad-section-card') : null;
        if (targetCard) {
          targetCard.classList.add('open', 'highlighted');
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  }

  function closeBareActDrawer() {
    if (elements.bareActDrawer) elements.bareActDrawer.classList.remove('open');
    if (elements.bareActOverlay) elements.bareActOverlay.classList.remove('open');
    document.body.classList.remove('drawer-open');
  }

  function renderBareActList() {
    if (!elements.bareActList) return;
    if (!window.BARE_ACTS_DB || !window.BARE_ACTS_DB.search) {
      elements.bareActList.innerHTML = `<div class="empty-state"><p>Bare Act database loading...</p></div>`;
      return;
    }

    const sections = window.BARE_ACTS_DB.search(state.bareActs.searchQuery, state.bareActs.activeAct);

    if (sections.length === 0) {
      elements.bareActList.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-book-open"></i>
          <h4>No statutory provisions found</h4>
          <p>Try searching for another section number, keyword, or clear search.</p>
          <button class="btn-clear-search" onclick="document.getElementById('bareActClearSearch').click()">Clear Search</button>
        </div>
      `;
      return;
    }

    elements.bareActList.innerHTML = sections.map(s => {
      const actObj = window.BARE_ACTS_DB.acts.find(a => a.id === s.actId) || { short: s.act, badge: 'Statute' };
      const isOpen = s.id === state.bareActs.expandedId || sections.length === 1;

      return `
        <article class="bad-section-card ${isOpen ? 'open' : ''}" data-id="${s.id}">
          <header class="bad-card-header">
            <div class="bad-card-header-left">
              <div class="bad-act-tag">${actObj.short}</div>
              <h4 class="bad-sec-title">Section ${s.sec}: <span>${s.title}</span></h4>
            </div>
            <div class="bad-card-header-right">
              <i class="fa-solid fa-chevron-down bad-chevron"></i>
            </div>
          </header>
          <div class="bad-card-body">
            <div class="bad-statutory-box">
              <div class="bad-box-label"><i class="fa-solid fa-scale-balanced"></i> Verbatim Statutory Text</div>
              <pre class="bad-statutory-text">${escapeHtml(s.text)}</pre>
            </div>
            ${s.analysis ? `
              <div class="bad-analysis-box">
                <div class="bad-box-label"><i class="fa-solid fa-lightbulb"></i> DU Exam Analysis &amp; Precedent Links</div>
                <p class="bad-analysis-text">${escapeHtml(s.analysis)}</p>
              </div>
            ` : ''}
            <div class="bad-card-actions">
              <button class="bad-btn-action copy-sec-btn" data-text="${encodeURIComponent('Section ' + s.sec + ' — ' + s.title + '\n' + s.text)}">
                <i class="fa-solid fa-copy"></i> <span>Copy Statutory Text</span>
              </button>
              <button class="bad-btn-action cite-sec-btn" data-cite="${encodeURIComponent('Section ' + s.sec + ', ' + s.act)}">
                <i class="fa-solid fa-quote-left"></i> <span>Quick Citation</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach accordion expand/collapse listeners
    elements.bareActList.querySelectorAll('.bad-card-header').forEach(header => {
      header.addEventListener('click', () => {
        const card = header.closest('.bad-section-card');
        card.classList.toggle('open');
      });
    });

    // Copy text listeners
    elements.bareActList.querySelectorAll('.copy-sec-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = decodeURIComponent(btn.dataset.text);
        navigator.clipboard.writeText(text).then(() => {
          showToast('Statutory text copied to clipboard! 📋');
        }).catch(() => {
          showToast('Copied to clipboard');
        });
      });
    });

    // Cite text listeners
    elements.bareActList.querySelectorAll('.cite-sec-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cite = decodeURIComponent(btn.dataset.cite);
        navigator.clipboard.writeText(cite).then(() => {
          showToast(`Citation copied: ${cite}`);
        });
      });
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  
  // ===================================================================
  // FEATURE 1: AUDIO READ-ALOUD (Metro Mode - Disabled)
  // ===================================================================
  function initAudioPlayer() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  function playAudio(title, text) {
    // Disabled for now
  }

  function toggleAudioPlayback() {}
  function stopAudioPlayback() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    state.audioIsPlaying = false;
    state.audioUtterance = null;
  }
  function cycleAudioSpeed() {}

  // ===================================================================
  // FEATURE 2: STARRED PRECEDENTS & PERSONAL NOTES
  // ===================================================================
  function updateStarBadge() {
    if (elements.headerStarBadge) {
      elements.headerStarBadge.textContent = state.starred.length;
      elements.headerStarBadge.style.display = state.starred.length > 0 ? 'inline-block' : 'none';
    }
  }

  function toggleStar(item) {
    const idx = state.starred.findIndex(s => s.id === item.id);
    if (idx >= 0) {
      state.starred.splice(idx, 1);
      showToast('Removed from Starred Precedents');
    } else {
      state.starred.push({ id: item.id, title: item.title, type: item.type });
      showToast('Added to Starred Precedents! ⭐');
    }
    localStorage.setItem('du_portal_starred', JSON.stringify(state.starred));
    updateStarBadge();
    renderActiveTabContent();
    if (elements.bookmarksDrawer && elements.bookmarksDrawer.classList.contains('active')) renderBookmarksList();
  }

  function promptNote(itemId) {
    const existing = state.personalNotes[itemId] || '';
    const note = window.prompt('Enter personal note or mnemonic for this card:', existing);
    if (note !== null) {
      if (note.trim()) {
        state.personalNotes[itemId] = note.trim();
        showToast('Personal note saved! 📌');
      } else {
        delete state.personalNotes[itemId];
        showToast('Note deleted');
      }
      localStorage.setItem('du_portal_notes', JSON.stringify(state.personalNotes));
      renderActiveTabContent();
    }
  }

  function openBookmarksDrawer() {
    if (elements.bookmarksDrawer) {
      elements.bookmarksDrawer.classList.add('active');
      if (elements.bookmarksOverlay) elements.bookmarksOverlay.classList.add('active');
      renderBookmarksList();
    }
  }

  function closeBookmarksDrawer() {
    if (elements.bookmarksDrawer) elements.bookmarksDrawer.classList.remove('active');
    if (elements.bookmarksOverlay) elements.bookmarksOverlay.classList.remove('active');
  }

  function renderBookmarksList() {
    if (!elements.bookmarksList) return;
    if (state.starred.length === 0) {
      elements.bookmarksList.innerHTML = '<div style="text-align:center;padding:40px 20px;color:var(--text-muted);"><i class="fa-regular fa-star" style="font-size:2.5rem;color:#cbd5e1;margin-bottom:12px;"></i><h4 style="margin:0;font-size:1rem;color:var(--text-color);">No starred items yet</h4><p style="font-size:0.8rem;margin:6px 0 0;">Click the star on any Case or PYQ card to save it here for rapid exam revision.</p></div>';
      return;
    }
    elements.bookmarksList.innerHTML = state.starred.map(item => {
      const hasNote = state.personalNotes[item.id];
      return '<div class="bm-item-card" data-id="' + item.id + '"><div class="bm-item-title">' + item.title + '</div><div class="bm-item-meta"><span><i class="fa-solid fa-tag"></i> ' + (item.type === 'case' ? 'Landmark Precedent' : 'PYQ Model Answer') + '</span><button class="btn-delete-note" data-remove-star="' + item.id + '" style="color:#ef4444;"><i class="fa-solid fa-trash-can"></i></button></div>' + (hasNote ? '<div class="personal-card-note" style="margin-top:4px;"><span><i class="fa-solid fa-thumbtack"></i> ' + hasNote + '</span></div>' : '') + '</div>';
    }).join('');

    elements.bookmarksList.querySelectorAll('[data-remove-star]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.removeStar;
        const idx = state.starred.findIndex(s => s.id === id);
        if (idx >= 0) {
          state.starred.splice(idx, 1);
          localStorage.setItem('du_portal_starred', JSON.stringify(state.starred));
          updateStarBadge();
          renderBookmarksList();
          renderActiveTabContent();
        }
      });
    });
  }

  // ===================================================================
  // FEATURE 3: BNS 2023 ↔ IPC 1860 CONVERTER
  // ===================================================================
  function openBnsConverter() {
    if (elements.bnsModal && elements.bnsModalOverlay) {
      elements.bnsModal.classList.add('active');
      elements.bnsModalOverlay.classList.add('active');
      renderBnsConverterCards('all', '');
      if (elements.bnsSearchInput) elements.bnsSearchInput.focus();
    }
  }

  function closeBnsConverter() {
    if (elements.bnsModal && elements.bnsModalOverlay) {
      elements.bnsModal.classList.remove('active');
      elements.bnsModalOverlay.classList.remove('active');
    }
  }

  function renderBnsConverterCards(cat, query) {
    if (!elements.bnsCardsContainer) return;
    const db = window.BNS_CONVERTER_DB;
    if (!db || !db.sections) {
      elements.bnsCardsContainer.innerHTML = '<p style="padding:20px;">Converter database loading...</p>';
      return;
    }

    let items = db.sections;
    if (cat && cat !== 'all') {
      items = items.filter(s => (s.chapter && s.chapter.includes(cat)) || (s.offense && s.offense.includes(cat)));
    }

    if (query) {
      const q = query.toLowerCase();
      items = items.filter(s =>
        s.bns.toLowerCase().includes(q) ||
        s.ipc.toLowerCase().includes(q) ||
        s.offense.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        (s.cases && s.cases.some(c => c.toLowerCase().includes(q)))
      );
    }

    if (items.length === 0) {
      elements.bnsCardsContainer.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);"><i class="fa-solid fa-magnifying-glass" style="font-size:2rem;color:#cbd5e1;margin-bottom:10px;"></i><h4>No penal section match found</h4><p>Try searching for section numbers (e.g. 302, 103, 34, 498A) or offence names.</p></div>';
      return;
    }

    elements.bnsCardsContainer.innerHTML = items.map(s => {
      return '<div class="bns-comp-card fade-in"><div class="bns-comp-header"><div class="bns-comp-offense"><i class="fa-solid fa-gavel" style="color:#ca8a04;margin-right:6px;"></i> ' + s.offense + '</div><span class="bns-comp-badge ' + (s.ipc === '[NEW IN BNS]' ? 'new-prov' : '') + '">' + (s.ipc === '[NEW IN BNS]' ? '★ Brand New in BNS' : 'Key Substitution') + '</span></div><div class="bns-comp-body"><div class="bns-section-box bns-side"><div class="bns-sec-tag">NEW STATUTE: BNS 2023</div><div class="bns-sec-num">' + s.bns + '</div><p style="font-size:0.84rem;margin:6px 0 0;color:var(--text-color);">' + s.summary + '</p></div><div class="bns-section-box ipc-side"><div class="bns-sec-tag">OLD STATUTE: IPC 1860</div><div class="bns-sec-num">' + s.ipc + '</div><p style="font-size:0.84rem;margin:6px 0 0;color:var(--text-muted);">' + (s.chapter || 'Indian Penal Code 1860 Reference') + '</p></div></div><div class="bns-comp-footer"><div class="bns-changes-text"><b>Legislative Transition:</b> ' + s.changes + '</div>' + (s.cases && s.cases.length > 0 ? '<div class="bns-precedents-row"><span><b>Landmark Cases:</b></span> ' + s.cases.map(c => '<span class="bns-case-tag">' + c + '</span>').join('') + '</div>' : '') + (s.duExamTip ? '<div class="bns-exam-tip"><i class="fa-solid fa-lightbulb" style="margin-right:4px;"></i> <b>DU Exam Tip:</b> ' + s.duExamTip + '</div>' : '') + '</div></div>';
    }).join('');
  }

  // ===================================================================
  // FEATURE 4: DU MOCK EXAM SIMULATOR ("5 OUT OF 8" EXAM HALL)
  // ===================================================================
  function openMockExam() {
    if (elements.mockModal && elements.mockModalOverlay) {
      elements.mockModal.classList.add('active');
      elements.mockModalOverlay.classList.add('active');
      generateMockPaper();
    }
  }

  function closeMockExam() {
    if (elements.mockModal && elements.mockModalOverlay) {
      elements.mockModal.classList.remove('active');
      elements.mockModalOverlay.classList.remove('active');
      pauseMockTimer();
    }
  }

  function startMockTimer() {
    if (state.mockTimerRunning) return;
    state.mockTimerRunning = true;
    if (elements.mockTimerToggleBtn) elements.mockTimerToggleBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    state.mockTimerInterval = setInterval(() => {
      if (state.mockTimerSecs > 0) {
        state.mockTimerSecs--;
        updateMockTimerDisplay();
      } else {
        pauseMockTimer();
        showToast('Time is up! 3 Hours completed.');
      }
    }, 1000);
  }

  function pauseMockTimer() {
    state.mockTimerRunning = false;
    clearInterval(state.mockTimerInterval);
    if (elements.mockTimerToggleBtn) elements.mockTimerToggleBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  }

  function resetMockTimer() {
    pauseMockTimer();
    state.mockTimerSecs = 10800; // 3 hours
    updateMockTimerDisplay();
  }

  function updateMockTimerDisplay() {
    if (!elements.mockTimerClock) return;
    const h = Math.floor(state.mockTimerSecs / 3600);
    const m = Math.floor((state.mockTimerSecs % 3600) / 60);
    const s = state.mockTimerSecs % 60;
    const str = [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
    elements.mockTimerClock.textContent = str;

    if (state.mockTimerSecs < 900) {
      elements.mockTimerClock.classList.add('warning');
    } else {
      elements.mockTimerClock.classList.remove('warning');
    }
  }

  function generateMockPaper() {
    if (!elements.mockQuestionsList) return;
    const subjId = elements.mockSubjectSelect ? elements.mockSubjectSelect.value : 'all';

    let pool = [];
    const subjects = window.DU_LAW_PORTAL_DATA.subjects;

    if (subjId === 'all') {
      Object.keys(subjects).forEach(sid => {
        if (subjects[sid] && subjects[sid].pyqs) {
          pool.push(...subjects[sid].pyqs.map(q => ({ ...q, subjectName: subjects[sid].name })));
        }
      });
    } else if (subjects[subjId] && subjects[subjId].pyqs) {
      pool = subjects[subjId].pyqs.map(q => ({ ...q, subjectName: subjects[subjId].name }));
    }

    if (pool.length === 0) {
      elements.mockQuestionsList.innerHTML = '<p style="padding:20px;">No questions found for this subject.</p>';
      return;
    }

    // Shuffle and pick 8 realistic exam questions
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected8 = shuffled.slice(0, 8);

    state.mockSelectedQuestions.clear();
    updateMockSelectionCounter();
    resetMockTimer();
    startMockTimer();

    elements.mockQuestionsList.innerHTML = selected8.map((q, idx) => {
      const qNum = idx + 1;
      return '<div class="mock-question-card fade-in" id="mock-q-' + qNum + '">' +
        '<div class="mock-q-header">' +
          '<div class="mock-q-meta">' +
            '<span class="mock-q-num">Q.' + qNum + '</span>' +
            '<span class="mock-q-marks">[20 Marks]</span>' +
            '<span class="mock-q-source"><i class="fa-solid fa-graduation-cap"></i> ' + (q.subjectName || '') + ' &bull; ' + (q.year || 'DU LL.B. Term Exam') + '</span>' +
          '</div>' +
          '<label class="mock-q-select-label">' +
            '<input type="checkbox" class="mock-q-checkbox" data-q="' + qNum + '"> ' +
            '<span>Attempt this Question</span>' +
          '</label>' +
        '</div>' +
        '<div class="mock-q-text">' + q.question + '</div>' +
        '<div class="mock-scratchpad">' +
          '<label><i class="fa-solid fa-pencil"></i> Student Rough Outline &amp; Issue Spotting Scratchpad (Auto-saved):</label>' +
          '<textarea placeholder="Type your 4-step IRAC outline, issues, sections to cite, and case names here..."></textarea>' +
        '</div>' +
        '<div class="mock-evaluated-answer" id="eval-ans-' + qNum + '">' +
          '<div class="eval-rubric-grid">' +
            '<div class="rubric-cell"><div class="rubric-label">Issue Spotting &amp; Facts</div><div class="rubric-pts">4 Marks</div></div>' +
            '<div class="rubric-cell"><div class="rubric-label">Statutory Provisions Cited</div><div class="rubric-pts">5 Marks</div></div>' +
            '<div class="rubric-cell"><div class="rubric-label">Landmark Precedents &amp; Ratios</div><div class="rubric-pts">7 Marks</div></div>' +
            '<div class="rubric-cell"><div class="rubric-label">Logical Reasoning &amp; Conclusion</div><div class="rubric-pts">4 Marks</div></div>' +
          '</div>' +
          '<div style="background:var(--bg-tint);padding:16px;border-radius:8px;font-size:0.9rem;line-height:1.6;">' +
            '<h4 style="margin:0 0 10px;color:var(--primary);"><i class="fa-solid fa-award"></i> DU Faculty Model Answer:</h4>' +
            (q.modelAnswer ? renderMarkdown(q.modelAnswer) : (q.answer ? q.answer : '<p>Consult the primary unit notes for detailed case ratios.</p>')) +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    elements.mockQuestionsList.querySelectorAll('.mock-q-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const qNum = cb.dataset.q;
        const card = document.getElementById('mock-q-' + qNum);
        if (cb.checked) {
          if (state.mockSelectedQuestions.size >= 5) {
            cb.checked = false;
            showToast('DU Exam Rule: Maximum 5 questions can be attempted!');
            return;
          }
          state.mockSelectedQuestions.add(qNum);
          if (card) card.classList.add('selected-question');
        } else {
          state.mockSelectedQuestions.delete(qNum);
          if (card) card.classList.remove('selected-question');
        }
        updateMockSelectionCounter();
      });
    });
  }

  function updateMockSelectionCounter() {
    const cnt = state.mockSelectedQuestions.size;
    if (elements.mockSelectedCount) elements.mockSelectedCount.textContent = cnt;
    if (elements.mockSelectionCounter) {
      if (cnt === 5) {
        elements.mockSelectionCounter.className = 'mock-selection-counter ready';
        elements.mockSelectionCounter.innerHTML = '<i class="fa-solid fa-circle-check"></i> Perfect! Exactly 5 Questions Selected';
      } else {
        elements.mockSelectionCounter.className = 'mock-selection-counter';
        elements.mockSelectionCounter.innerHTML = 'Attempting: <b>' + cnt + '</b> / 5 Questions Chosen';
      }
    }
  }

  function evaluateMockExam() {
    if (state.mockSelectedQuestions.size === 0) {
      showToast('Please select the questions you attempted before evaluating!');
      return;
    }
    pauseMockTimer();
    document.querySelectorAll('.mock-evaluated-answer').forEach(el => el.classList.add('revealed'));
    showToast('Exam Completed! All Model Answers & Evaluation Rubrics Unfolded. 🎉');
    if (elements.mockPaperContent) elements.mockPaperContent.scrollTo({ top: 0, behavior: 'smooth' });
  }


  function init() {
    // Theme setup
    applyTheme(state.darkMode);
    initAudioPlayer();
    updateStarBadge();

    // Hero Action Buttons
    if (elements.heroExploreBtn) {
      elements.heroExploreBtn.addEventListener('click', () => {
        const semSec = document.querySelector('.sem-selection-section');
        if (semSec) semSec.scrollIntoView({ behavior: 'smooth' });
      });
    }
    if (elements.heroMockBtn) {
      elements.heroMockBtn.addEventListener('click', openMockExam);
    }
    if (elements.heroBnsBtn) {
      elements.heroBnsBtn.addEventListener('click', openBnsConverter);
    }

    // BNS Converter Modal
    if (elements.headerBnsConverterBtn) {
      elements.headerBnsConverterBtn.addEventListener('click', openBnsConverter);
    }
    if (elements.bnsCloseBtn) elements.bnsCloseBtn.addEventListener('click', closeBnsConverter);
    if (elements.bnsModalOverlay) elements.bnsModalOverlay.addEventListener('click', closeBnsConverter);
    if (elements.bnsSearchInput) {
      elements.bnsSearchInput.addEventListener('input', (e) => {
        const cat = elements.bnsCategoryPills ? elements.bnsCategoryPills.querySelector('.bns-pill.active').dataset.cat : 'all';
        renderBnsConverterCards(cat, e.target.value);
      });
    }
    if (elements.bnsCategoryPills) {
      elements.bnsCategoryPills.querySelectorAll('.bns-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          elements.bnsCategoryPills.querySelectorAll('.bns-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          const q = elements.bnsSearchInput ? elements.bnsSearchInput.value : '';
          renderBnsConverterCards(pill.dataset.cat, q);
        });
      });
    }

    // DU Mock Exam Simulator
    if (elements.headerMockExamBtn) {
      elements.headerMockExamBtn.addEventListener('click', openMockExam);
    }
    if (elements.mockCloseBtn) elements.mockCloseBtn.addEventListener('click', closeMockExam);
    if (elements.mockModalOverlay) elements.mockModalOverlay.addEventListener('click', closeMockExam);
    if (elements.btnGenMockPaper) elements.btnGenMockPaper.addEventListener('click', generateMockPaper);
    if (elements.btnEvaluateMock) elements.btnEvaluateMock.addEventListener('click', evaluateMockExam);
    if (elements.btnPrintMock) elements.btnPrintMock.addEventListener('click', () => window.print());
    if (elements.mockTimerToggleBtn) {
      elements.mockTimerToggleBtn.addEventListener('click', () => {
        if (state.mockTimerRunning) pauseMockTimer();
        else startMockTimer();
      });
    }
    if (elements.mockTimerResetBtn) elements.mockTimerResetBtn.addEventListener('click', resetMockTimer);
    if (elements.mockSubjectSelect) elements.mockSubjectSelect.addEventListener('change', generateMockPaper);

    // Bookmarks Drawer
    if (elements.headerBookmarksBtn) {
      elements.headerBookmarksBtn.addEventListener('click', openBookmarksDrawer);
    }
    if (elements.bookmarksCloseBtn) elements.bookmarksCloseBtn.addEventListener('click', closeBookmarksDrawer);
    if (elements.bookmarksOverlay) elements.bookmarksOverlay.addEventListener('click', closeBookmarksDrawer);

    
    // Precedent Flashcards & Bare Act Header / Hub Launchers
    if (elements.headerBareActBtn) {
      elements.headerBareActBtn.addEventListener('click', () => openBareActDrawer());
    }
    if (elements.headerFlashcardBtn) {
      elements.headerFlashcardBtn.addEventListener('click', () => openFlashcardsModal());
    }
    if (elements.hubStartFlashcardsBtn) {
      elements.hubStartFlashcardsBtn.addEventListener('click', () => openFlashcardsModal());
    }
    if (elements.hubOpenBareActBtn) {
      elements.hubOpenBareActBtn.addEventListener('click', () => openBareActDrawer());
    }

    // Flashcard Modal Controls
    if (elements.fcCloseBtn) elements.fcCloseBtn.addEventListener('click', closeFlashcardsModal);
    if (elements.activeFlashcard) elements.activeFlashcard.addEventListener('click', flipFlashcard);
    if (elements.fcPrevBtn) elements.fcPrevBtn.addEventListener('click', prevFlashcard);
    if (elements.fcNextBtn) elements.fcNextBtn.addEventListener('click', nextFlashcard);
    if (elements.fcShuffleBtn) elements.fcShuffleBtn.addEventListener('click', shuffleFlashcards);
    if (elements.fcBtnReview) elements.fcBtnReview.addEventListener('click', () => markFlashcardMastery(false));
    if (elements.fcBtnMastered) elements.fcBtnMastered.addEventListener('click', () => markFlashcardMastery(true));

    // Bare Act Drawer Controls
    if (elements.bareActCloseBtn) elements.bareActCloseBtn.addEventListener('click', closeBareActDrawer);
    if (elements.bareActOverlay) elements.bareActOverlay.addEventListener('click', closeBareActDrawer);

    if (elements.badActTabs) {
      elements.badActTabs.querySelectorAll('.bad-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          elements.badActTabs.querySelectorAll('.bad-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          state.bareActs.activeAct = tab.dataset.act;
          renderBareActList();
        });
      });
    }

    if (elements.bareActSearchInput) {
      elements.bareActSearchInput.addEventListener('input', (e) => {
        state.bareActs.searchQuery = e.target.value.trim();
        if (elements.bareActClearSearch) {
          elements.bareActClearSearch.style.display = state.bareActs.searchQuery ? 'block' : 'none';
        }
        renderBareActList();
      });
    }

    if (elements.bareActClearSearch) {
      elements.bareActClearSearch.addEventListener('click', () => {
        state.bareActs.searchQuery = '';
        if (elements.bareActSearchInput) elements.bareActSearchInput.value = '';
        elements.bareActClearSearch.style.display = 'none';
        renderBareActList();
      });
    }

    // Global Event Delegation for Bare Act Section Hyperlinks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('.bare-act-link');
      if (link) {
        e.preventDefault();
        const sec = link.dataset.sec;
        openBareActDrawer(sec);
      }
    });

    elements.themeToggleBtn.addEventListener('click', () => {
      state.darkMode = !state.darkMode;
      applyTheme(state.darkMode);
    });

    // Brand click returns to Subjects view
    elements.brandLogo.addEventListener('click', () => {
      if (state.currentSemester) {
        showView('subjects');
      } else {
        showView('semester');
      }
    });

    // Semester Switcher in Header
    elements.headerSemesterBtn.addEventListener('click', () => {
      showView('semester');
    });

    // Change Semester Button in Subjects View
    if (elements.changeSemBtn) {
      elements.changeSemBtn.addEventListener('click', () => {
        showView('semester');
      });
    }

    // Back to Subjects button in Hub Banner
    elements.hubBackBtn.addEventListener('click', () => {
      showView('subjects');
    });

    // Desktop Hub Tab switching
    elements.hubTabs.forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        const targetTab = tabBtn.dataset.tab;
        switchHubTab(targetTab);
      });
    });

    // Mobile Bottom Navigation Bar buttons
    elements.mobileNavItems.forEach(item => {
      item.addEventListener('click', () => {
        const action = item.dataset.action;
        if (action === 'back-subjects') {
          showView('subjects');
        } else {
          const tab = item.dataset.tab;
          if (tab) switchHubTab(tab);
        }
      });
    });

    // Search input in Hub
    elements.hubSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim();
      if (elements.searchClearBtn) {
        elements.searchClearBtn.style.display = state.searchQuery ? 'flex' : 'none';
      }
      renderActiveTabContent();
    });

    // Clear search button
    if (elements.searchClearBtn) {
      elements.searchClearBtn.addEventListener('click', () => {
        elements.hubSearchInput.value = '';
        state.searchQuery = '';
        elements.searchClearBtn.style.display = 'none';
        renderActiveTabContent();
        elements.hubSearchInput.focus();
      });
    }

    // Unit filter in Hub
    elements.unitFilterSelect.addEventListener('change', (e) => {
      state.selectedUnitFilter = e.target.value;
      renderActiveTabContent();
    });

    // Reader Modal close
    elements.readerCloseBtn.addEventListener('click', closeReader);
    elements.readerModal.addEventListener('click', (e) => {
      if (e.target === elements.readerModal) closeReader();
    });

    // Keyboard ESC to close reader
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && elements.readerModal.classList.contains('active')) {
        closeReader();
      }
    });

    // Floating Scroll to Top button
    window.addEventListener('scroll', () => {
      if (window.scrollY > 240) {
        elements.scrollTopBtn.classList.add('visible');
      } else {
        elements.scrollTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    elements.scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Liquid Metal Header Tabs: Dynamic Specular Reflection
    document.querySelectorAll('.header-actions .liquid-metal-btn, .header-actions .header-action-btn, .header-actions .semester-badge-btn, .header-actions .theme-toggle-btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        btn.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        btn.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });
    });

    // Initialize 3D Books Showcase Engine
    if (window.DUBooksShowcase && elements.booksShowcaseContainer && elements.booksCanvas) {
      window.DUBooksShowcase.init({
        container: elements.booksShowcaseContainer,
        canvas: elements.booksCanvas,
        prevBtn: elements.bsPrev,
        nextBtn: elements.bsNext,
        closeBtn: elements.bsCloseBtn,
        openSlip: elements.bsOpenSlip,
        detailPanel: elements.bsDetailPanel,
        codeBadge: elements.bsCodeBadge,
        semBadge: elements.bsSemBadge,
        detailTitle: elements.bsDetailTitle,
        detailDesc: elements.bsDetailDesc,
        unitsCount: elements.bsUnitsCount,
        yearBadge: elements.bsYear,
        actionBtn: elements.bsActionExplore,
        onExploreSubject: (book) => {
          if (book && book.id) {
            openSubjectHub(book.id);
          }
        }
      });
    }

    // View Mode Toggle Listeners (3D Books vs Grid)
    if (elements.viewModeBooksBtn) {
      elements.viewModeBooksBtn.addEventListener('click', () => {
        applySubjectsViewMode('books');
      });
    }
    if (elements.viewModeGridBtn) {
      elements.viewModeGridBtn.addEventListener('click', () => {
        applySubjectsViewMode('grid');
      });
    }

    // Initial Routing: Check URL query parameters, then saved semester in localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const querySem = urlParams.get('sem');
    const queryView = urlParams.get('view');

    if (querySem) {
      selectSemester(parseInt(querySem, 10) || 1);
    } else if (queryView === 'subjects') {
      const savedSem = localStorage.getItem('du_law_selected_semester');
      selectSemester(savedSem ? parseInt(savedSem, 10) : 1);
    } else {
      const savedSem = localStorage.getItem('du_law_selected_semester');
      if (savedSem) {
        selectSemester(parseInt(savedSem, 10));
      } else {
        showView('semester');
      }
    }

    const queryOpen = urlParams.get('open');
    if (queryOpen !== null && window.DUBooksShowcase) {
      setTimeout(() => {
        window.DUBooksShowcase.openBookByIndex(parseInt(queryOpen, 10) || 0);
      }, 450);
    }
  }

  // Boot on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
