# 🧠 MAKE LAW EASY (DU LAW NOTES PORTAL) — MASTER PROJECT BRAIN

> **AUTHORITATIVE REPOSITORY INTELLIGENCE DOSSIER & CONTEXT BIBLE**  
> **Target Audience**: AI Agents (Antigravity, Gemini, Claude, Cursor, Copilot) & Developers.  
> **Scope**: **CONSULT THIS FILE BEFORE INITIATING ANY TASK ON THIS CODEBASE.**  
> **Location**: Saved locally in workspace root (`PROJECT_BRAIN.md`). Zero external dependencies required.

---

## 1. EXECUTIVE SUMMARY & IDENTITY

| Attribute | Specification |
| :--- | :--- |
| **Project Name** | **Make Law Easy** (Delhi University Law Notes Portal) |
| **Primary Domain** | [https://makelaweasy.in](https://makelaweasy.in) (Custom Apex Domain) |
| **Firebase Domain**| [https://make-law-easy.web.app](https://make-law-easy.web.app) / [https://make-law-easy.firebaseapp.com](https://make-law-easy.firebaseapp.com) |
| **GitHub Repository** | `DevilEye03/du-law-portal` (Primary branch: `main`) |
| **Core Mission** | Free, zero-friction, open-access legal education platform designed for LL.B. students (primarily Faculty of Law, University of Delhi — Campus Law Centre, Law Centre-I, Law Centre-II) and law students across India. |
| **Ethical & Legal Basis** | Non-commercial educational initiative compliant with **Section 52(1)(a)(i)** of the Indian Copyright Act 1957 (Fair Dealing for private study/research), **Bar Council of India Rule 36** (Non-Solicitation), and the **Digital Personal Data Protection Act, 2023 (DPDP Act)**. |
| **Core Philosophy** | Zero paywalls, zero mandatory registrations/passwords, instantaneous load times, rich 3D interactive visualizations, and complete alignment with official DU syllabus, case materials, and examination patterns. |

---

## 2. ARCHITECTURE & TECHNOLOGY STACK

Make Law Easy is deliberately built as an **ultra-fast, zero-build, pure vanilla web application**. There are no heavy frameworks (no React runtime overhead, no Next.js SSR servers, no Webpack/Vite bundlers).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                                  │
│  ┌──────────────────────┬──────────────────────┬────────────────────┐  │
│  │   Presentation UI    │  3D Canvas Shaders   │  Service Worker    │  │
│  │ HTML5 / Modern CSS3  │ Three.js r128 / GSAP │  sw.js (PWA Shell) │  │
│  └──────────┬───────────┴──────────┬───────────┴─────────┬──────────┘  │
└─────────────┼──────────────────────┼─────────────────────┼─────────────┘
              ▼                      ▼                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     CORE LOGIC & STATIC DATA STORE                     │
│  ┌─────────────────────────────────┬────────────────────────────────┐  │
│  │ js/app.js (Controller & Router) │ js/data.js (~3.9MB Data Store) │  │
│  ├─────────────────────────────────┼────────────────────────────────┤  │
│  │ js/bare_acts.js (Statutory DB)  │ js/bns_converter.js (IPC-BNS)  │  │
│  └─────────────────────────────────┴────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     INFRASTRUCTURE & ENVIRONMENT                       │
│  • Local Environment: node scripts/server.js (Zero build step, pure)   │
│  • Version Control: Git repository DevilEye03/du-law-portal (main)     │
│  • Optional Hosting: Firebase Hosting (make-law-easy)                  │
│  • Google Tag Manager (GTM-NNW78WFV) & GA4 (G-8ZG7VS1G45)              │
└────────────────────────────────────────────────────────────────────────┘
```

### Technology Details:
1. **Frontend Core**:
   - Pure HTML5 with semantic tags (`<main>`, `<header>`, `<section>`, `<article>`, `<aside>`, `<nav>`, `<footer>`).
   - Modern CSS3: CSS custom properties (variables), Glassmorphism, CSS Grid, Flexbox, 3D CSS transforms (`perspective: 1000px`, `transform-style: preserve-3d`).
   - Vanilla ES6+ JavaScript: Modular object-oriented and functional programming with event delegation, zero external DOM dependencies.
2. **3D & Canvas Graphics Engines**:
   - **Three.js (r128)**: Utilized in `js/books_showcase.js` for interactive 3D books carousel and subject inspection.
   - **GSAP (GreenSock 3.12.2)**: Orchestrates smooth camera tweens, book open/close rotations, card flip animations, and UI state transitions.
   - Custom 2D/3D Canvas Pipelines:
     - `js/wave_grid_background.js`: Procedural perspective sine-wave grid canvas.
     - `js/interactive_particles.js`: GPU-accelerated interactive particle stage rendering `"Make Law Easy."`.
3. **Progressive Web App (PWA)**:
   - `manifest.json`: Standalone PWA installation support, theme color `#183059`.
   - `sw.js`: Service worker with aggressive cache-first strategy for app shell assets and stale-while-revalidate for dynamic content.
   - **CRITICAL VERSIONING RULE**: Whenever editing CSS, JS, or core pages, you MUST increment `CACHE_NAME = "du-law-portal-vXX"` in `sw.js`!
4. **Analytics & Tag Management**:
   - Google Tag Manager container: `GTM-NNW78WFV`.
   - Google Analytics 4 stream: `G-8ZG7VS1G45` (configured with IP anonymization for DPDP Act compliance).

---

## 3. DIRECTORY HIERARCHY & REPOSITORY MAP

```
d:\law notes/
├── .firebaserc                     # Firebase project alias ("make-law-easy")
├── firebase.json                   # Firebase hosting rules, cleanUrls, cache headers
├── CNAME                           # GitHub Pages custom domain (makelaweasy.in)
├── package.json                    # Minimal package descriptor & metadata
├── robots.txt                      # Search engine crawlers policy (Allow: /)
├── sitemap.xml                     # Search engine index sitemap
├── manifest.json                   # PWA web app manifest
├── favicon.svg                     # Vector scales of justice logo
├── particles.png                   # Particle text font alpha mask
│
├── index.html                      # Primary Single Page Application (All views & modals)
├── terms.html                      # Executive Legal Documentation: Terms & Disclaimer (21 clauses)
├── privacy.html                    # Executive Legal Documentation: Privacy & DPDP (20 clauses)
├── about.html                      # Editorial mission, faculty alignment, and author credits
├── sw.js                           # PWA Service Worker (Cache versioning du-law-portal-vXX)
├── PROJECT_BRAIN.md                # THIS FILE: Master 360° Repository Knowledge Bible
├── GEMINI.md                       # Antigravity/Gemini permanent system rulefile
├── AGENTS.md                       # Universal agent instruction directives
│
├── js/                             # CORE JAVASCRIPT ENGINES
│   ├── app.js                      # Main SPA application logic, routing, view rendering, modals
│   ├── data.js                     # Master DB (~3.9MB): window.DU_LAW_PORTAL_DATA (Semesters, Notes, Cases, PYQs)
│   ├── bare_acts.js                # Verbatim Bare Act statutory database: window.BARE_ACTS_DB
│   ├── bns_converter.js            # BNS 2023 ↔ IPC 1860 comparative mapping & search engine
│   ├── books_showcase.js           # Three.js 3D interactive subject book showcase & carousel
│   ├── wave_grid_background.js     # Hero 3D undulating perspective wave grid background
│   └── interactive_particles.js    # Interactive particle text physics canvas
│
├── css/                            # APPLICATION STYLES
│   └── styles.css                  # Master CSS (~192KB): Theme tokens, layouts, modals, responsive breakpoints
│
├── components/ui/                  # Reference TypeScript/React prototypes (Ported to Vanilla JS in js/)
│   ├── books-showcase.tsx          # Prototype for 3D books carousel
│   ├── wave-grid-background.tsx    # Prototype for 3D wave grid
│   └── interactive-particles.tsx   # Prototype for particle physics
│
├── scripts/                        # AUTOMATION, INGESTION & TESTING UTILITIES
│   ├── ingest_subject.js           # Automatic parser: converts raw notes HTML into js/data.js entries
│   ├── comprehensive_test.js       # Integrity & schema test suite (Run: node scripts/comprehensive_test.js)
│   ├── update_bare_acts.js         # Bare Act sections injection utility
│   └── server.js                   # Lightweight local static HTTP testing server (port 3000)
│
├── sem 1/                          # (Root subject folders hold Semester 1 data)
│   ├── Contract/                   # LB-102: Law of Contract (12 HTML Dossiers)
│   ├── Family/                     # LB-104: Family Law-I (Hindu & Muslim Law Dossiers)
│   ├── Juris/                      # LB-101/106: Jurisprudence-I (Legal Theory Dossiers)
│   ├── Torts/                      # LB-105: Law of Torts & Consumer Protection Dossiers
│   └── BNS/                        # LB-103: Law of Crimes-I (Bharatiya Nyaya Sanhita 2023)
│
├── sem 2/                          # SEMESTER 2 CONTENT
│   ├── BSA/                        # LB-201: Bharatiya Sakshya Adhiniyam, 2023 (6 Unit Dossiers)
│   ├── PIL/                        # LB-205: Public International Law (7 Unit Dossiers)
│   └── PROPERTY LAW/               # LB-204: Property Law & TPA 1882 (12 Unit Dossiers)
│
└── sem 3/                          # SEMESTER 3 CONTENT
    ├── company/                    # LB-303: Company Law (10 Unit Dossiers)
    ├── cpc/                        # LB-301: Civil Procedure Code & Limitation (11 Unit Dossiers)
    ├── wcc/                        # LB-3037: White Collar Crimes (6 Unit Dossiers)
    └── Media/                      # Media and the Law
```

---

## 4. CORE FEATURES & SUBSYSTEMS

### 4.1. Three-Tier SPA Router (in `index.html` & `js/app.js`)
The application operates as a hashless/query-driven SPA with 3 primary views:
1. **View 1: Semester View (`#semesterView` / `showView('semester')`)**:
   - Cinematic 3D Wave Grid Hero canvas + Interactive Particle stage.
   - Semester selector cards (Semester I, Semester II, and Semester III currently active).
2. **View 2: Subjects Selection Dashboard (`#subjectsView` / `showView('subjects')`)**:
   - Dual-mode subject explorer:
     - **3D Books Showcase**: Realistic 3D hardbound book models with book spines, covers, open animation, and drag-to-rotate carousel.
     - **Standard Grid View**: Responsive card grid fallback.
3. **View 3: Subject Study Hub (`#subjectHubView` / `showView('hub')`)**:
   - 4 Specialized Study Tabs:
     - **Tab 1: All Topics & Notes**: Syllabus unit cards with topic links that open the embedded iframe reader.
     - **Tab 2: Landmark Cases**: Exhaustive FIRAC briefs with search, tags, and bookmarking.
     - **Tab 3: PYQs & Model Answers**: Past 10+ years DU examination questions with comprehensive model answers.
     - **Tab 4: Last-Minute Revision**: High-yield revision capsules, mnemonics, and comparative tables.

### 4.2. Embedded Notes Reader Modal (`#readerModal`)
- Fullscreen/modal iframe viewer that loads comprehensive standalone HTML study dossiers seamlessly from disk without navigating away from the application state.

### 4.3. 3D Precedent Recall Flashcards (`#flashcardsModal`)
- 3D perspective flip-card drill engine.
- Front Face: Case Dilemma & Facts prompt.
- Back Face: Landmark Authority name, citation, Ratio Decidendi, and DU Semester Exam Application Rule.
- Keyboard navigation: `Space` (Flip), `←` / `→` (Navigate), `1` (Needs Review), `2` (Mastered), `Esc` (Close).

### 4.4. Quick Bare Act Drawer (`#bareActDrawer`)
- Slide-over off-canvas drawer accessible from the top navigation bar.
- Tabbed statutory coverage: ICA 1872, SRA 1963, BSA 2023, TPA 1882, BNS 2023, HMA 1955, HAMA 1956, HMGA 1956, CPA 2019, CA 2013, CPC 1908, Limitation Act 1963, PC Act 1988, PMLA 2002.
- Features real-time keyword search, section jump ribbon, and verbatim statutory texts.

### 4.5. BNS 2023 ↔ IPC 1860 Live Section Converter (`#bnsModal`)
- Comparative search tool mapping old Indian Penal Code (IPC 1860) sections to new Bharatiya Nyaya Sanhita (BNS 2023) sections.
- Highlights statutory modifications, changes in punishment, and new criminal offenses (e.g., organized crime, terrorism, snatching, mob lynching).

### 4.6. DU Examination Hall Simulator (`#mockModal`)
- Generates realistic "5 out of 8" DU LL.B. semester examination papers.
- Integrated 3-hour exam timer clock with play/pause/reset.
- Answer reveal mode with model evaluation rubrics and print-to-PDF formatting.

### 4.7. Starred Revision Vault & Bookmarking (`#bookmarksDrawer`)
- Client-side persistent bookmarking system powered by `localStorage`.
- Allows students to star landmark cases, tricky questions, and revision capsules for quick review before walking into the examination hall.

---

## 5. DATA STRUCTURES & CONTRACTS

### 5.1. `window.DU_LAW_PORTAL_DATA` in `js/data.js`
```javascript
window.DU_LAW_PORTAL_DATA = {
  semesters: [
    {
      id: 1,
      title: "Semester I",
      desc: "Foundational legal curriculum...",
      active: true,
      subjectsCount: 5
    },
    {
      id: 3,
      title: "Semester III",
      desc: "Procedural, corporate & specialized criminal laws...",
      active: true,
      subjectsCount: 3
    }
  ],
  subjects: {
    "juris": {
      id: "juris",
      code: "LB-106",
      name: "Jurisprudence–I",
      subtitle: "Legal Method & Indian Legal System",
      semester: 1,
      units: [
        {
          unitNumber: 1,
          title: "Concept of Law & Justice",
          file: "Juris/DU_LB106_Topic1.html",
          desc: "Analytical, historical, and sociological perspectives..."
        }
      ],
      cases: [
        {
          id: "juris-c1",
          name: "Kesavananda Bharati v. State of Kerala",
          citation: "(1973) 4 SCC 225",
          court: "Supreme Court of India",
          bench: "13-Judge Bench",
          unitNumber: 1,
          facts: "Summary of factual matrix...",
          issue: "Can Parliament amend the Basic Structure?",
          arguments: "Petitioner argued... Respondent contended...",
          ratio: "Basic Structure Doctrine established...",
          examTip: "Always cite in questions dealing with judicial review...",
          tags: ["Basic Structure", "Constitutionalism"]
        }
      ],
      pyqs: [
        {
          id: "juris-p1",
          year: "2023",
          term: "Term-1",
          questionNumber: 1,
          unitNumber: 1,
          question: "Examine John Austin's command theory of law...",
          answer: "Detailed model answer formatted with IRAC...",
          keyPoints: ["Command", "Sovereign", "Sanction"]
        }
      ],
      revisions: [
        {
          unitNumber: 1,
          unitTitle: "Concept of Law",
          summary: "Condensed high-yield revision bullet points...",
          keyDoctrines: ["Analytical Positivism", "Grundnorm"],
          mnemonics: "C-S-S (Command, Sovereign, Sanction)",
          quickTable: [ /* comparative table rows */ ]
        }
      ]
    }
  }
};
```

### 5.2. Active Subject Codes & IDs:
- **Semester 1**:
  - `juris` (LB-106 / LB-101): Jurisprudence-I
  - `contract` (LB-102): Law of Contract
  - `bns` (LB-103): Law of Crimes-I (Bharatiya Nyaya Sanhita, 2023)
  - `family` (LB-104): Family Law-I
  - `torts` (LB-105): Law of Torts & Consumer Protection Act, 2019
- **Semester 3**:
  - `cpc` (LB-301): Code of Civil Procedure, 1908 & Limitation Act, 1963
  - `company` (LB-303): Company Law (Companies Act, 2013)
  - `wcc` (LB-3037): White Collar Crimes (PC Act, PMLA, FSSA, NDPS)

---

## 6. DESIGN SYSTEM & VISUAL TOKENS

The portal adheres to a **Dark Luxury Legal / Judicial Editorial Design System** evoking the prestige of the Supreme Court, Harvard/Oxford Law libraries, and Stripe/GitHub docs.

### Color Tokens:
| Variable | Value | Role |
| :--- | :--- | :--- |
| `--bg-canvas` | `#080d1a` | Deepest midnight navy base canvas |
| `--bg-surface` | `#0f172a` | Primary card background |
| `--bg-card` | `#131f38` | Elevated card background |
| `--bg-card-hover`| `#182747` | Card hover state highlight |
| `--bg-glass` | `rgba(15, 23, 42, 0.88)` | Frosted glassmorphism background |
| `--gold-primary` | `#c9a84c` | Supreme Court gold / prestige accent |
| `--gold-light` | `#fde68a` | Light gold text highlight / badges |
| `--gold-glow` | `rgba(201, 168, 76, 0.18)`| Ambient gold box-shadow glow |
| `--cyan-accent` | `#38bdf8` | Cyan interactive links & active states |
| `--border-subtle`| `rgba(148, 163, 184, 0.12)`| Standard structural divider |
| `--border-accent`| `rgba(201, 168, 76, 0.38)`| Gold emphasis border |
| `--text-primary` | `#f8fafc` | Crisp white primary text |
| `--text-secondary`|`#cbd5e1`| Muted slate readable body text |
| `--text-muted` | `#94a3b8` | Dimmed metadata / captions |

### Typography Guidelines:
- **Display Headings & Prestige Titles**: `'Playfair Display', Georgia, serif`
- **Statutory Provisions, Case Ratios, Latin Maxims**: `'EB Garamond', serif`
- **Interface, Buttons, Metadata, Body Text**: `'Inter', sans-serif`
- **Section Numbers, Citations, Code**: `ui-monospace, monospace`

### Mobile Responsiveness Rules:
- Viewport baseline: 360px to 430px (iPhone & Android mobile screens).
- **CRITICAL CSS OVERFLOW RULE**: Any flex child containing text (like `<h2>`, `<h3>`, `.legal-section`) MUST have `min-width: 0;` and `overflow-wrap: break-word;` to prevent horizontal canvas blowout.
- Touch target minimum: `44px × 44px`.
- All off-canvas drawers (`#bareActDrawer`, `#bookmarksDrawer`, `#mobileToolsDrawer`) use full-width or `90vw` presentation on mobile with tap-outside dismissals.

---

## 7. STANDARD OPERATING PROCEDURES (SOPs)

### SOP 1: Ingesting or Updating a Subject
1. Place the clean HTML notes dossiers into the designated semester/subject directory (e.g., `sem 3/company/`).
2. Run the ingestion script:
   ```powershell
   node scripts/ingest_subject.js "sem 3/company"
   ```
3. The script automatically extracts syllabus topics, FIRAC case briefs, PYQs with model answers, and revision capsules, injecting them into `js/data.js`.
4. Validate data integrity:
   ```powershell
   node scripts/comprehensive_test.js
   ```

### SOP 2: Modifying Frontend Code (HTML, CSS, JS)
1. Make surgical edits to the target files (`index.html`, `css/styles.css`, or `js/*.js`).
2. **SERVICE WORKER CACHE BUMP (MANDATORY)**:
   - Open `sw.js`.
   - Increment the cache version:
     ```javascript
     const CACHE_NAME = "du-law-portal-v25"; // e.g. bump v24 -> v25
     ```
3. If modifying `terms.html` or `privacy.html`, ensure both desktop (>=1024px) and mobile (<=640px) styles remain pixel-perfect and no substantive clauses are lost.

### SOP 3: Running Tests & Local Verification
1. Run the local automated test suite:
   ```powershell
   node scripts/comprehensive_test.js
   ```
2. To test in a local browser:
   ```powershell
   node scripts/server.js
   # Open http://localhost:3000
   ```

### SOP 4: Git Commit & Version Control
1. Verify clean git state:
   ```powershell
   git status
   ```
2. Stage and commit:
   ```powershell
   git add -A
   git commit -m "Your descriptive commit message"
   ```
*(Optional: Push to origin/main or deploy to hosting only when requested by user).*

---

## 8. COMPONENT & DOM HIERARCHY REFERENCE

### 8.1. Main Views
- `#semesterView`: Landing hero stage with wave grid canvas, particle stage, and semester cards.
- `#subjectsView`: Subject selection screen with 3D Three.js book carousel (`#booksShowcaseWrap`) and fallback grid (`#subjectsGrid`).
- `#subjectHubView`: Active subject study hub containing breadcrumbs, banner, and 4 tab content panes:
  - `#topicsTabPane` & `#topicsContainer`
  - `#casesTabPane` & `#casesContainer`
  - `#pyqsTabPane` & `#pyqsContainer`
  - `#revisionTabPane` & `#revisionContainer`

### 8.2. Modals & Off-Canvas Drawers
- `#readerModal`: Full-screen iframe study dossier viewer (`#readerIframe`, `#readerTitle`, `#readerCloseBtn`).
- `#flashcardsModal`: 3D flip card deck modal (`#activeFlashcard`, `#fcPrevBtn`, `#fcNextBtn`, `#fcShuffleBtn`).
- `#bareActDrawer`: Statutory reference drawer (`#badActTabs`, `#bareActSearchInput`, `#bareActList`).
- `#bnsModal`: BNS 2023 ↔ IPC 1860 live section converter (`#bnsSearchInput`, `#bnsCardsContainer`).
- `#mockModal`: DU examination hall paper generator & timer (`#mockSubjectSelect`, `#mockTimerClock`, `#mockQuestionsList`).
- `#bookmarksDrawer`: Starred precedents & revision vault drawer (`#bookmarksList`).
- `#mobileToolsDrawer`: Bottom action sheet with quick study tool shortcuts for mobile devices.
- `#contactModal`: Contact & community popup dialog (Telegram, Email).

---

## 9. APPLICATION STATE & ROUTER CONTROLLER (`js/app.js`)

`js/app.js` manages the entire lifecycle of the portal via a centralized `state` object:

```javascript
const state = {
  currentSemester: null,           // e.g. 1 or 3
  currentSubject: null,            // e.g. DU_LAW_PORTAL_DATA.subjects['company']
  currentTab: 'topics',            // 'topics' | 'cases' | 'pyqs' | 'revision'
  searchQuery: '',                 // Active keyword filter in Subject Hub
  selectedUnitFilter: 'all',       // Dropdown unit filter ('all' | 1 | 2 ...)
  activeQuickFilter: 'all',        // Quick filter pill
  darkMode: true,                  // Theme state
  starred: [],                     // Array of saved item IDs (localStorage: 'du_portal_starred')
  personalNotes: {},               // User note annotations (localStorage: 'du_portal_notes')
  mockTimerSecs: 10800,            // 3-hour exam timer (seconds)
  flashcards: {
    deck: [],                      // Active case cards
    currentIndex: 0,
    isFlipped: false,
    masteredIds: []                // localStorage: 'du_law_flashcard_mastery'
  },
  bareActs: {
    activeAct: 'all',
    searchQuery: '',
    expandedId: null
  },
  subjectsViewMode: 'books'        // 'books' (3D) or 'grid'
};
```

### Key Controller Functions in `app.js`:
- `showView(viewName)`: Switches between `'semester'`, `'subjects'`, and `'hub'`.
- `navigateToSemester(semId)`: Loads semester subjects and opens 3D books showcase.
- `navigateToSubject(subId)`: Sets up subject theme, header breadcrumbs, and renders active tab.
- `switchTab(tabName)`: Renders topics, landmark cases, PYQs, or revision capsules with search filters.
- `openReaderModal(fileUrl, title)`: Loads raw HTML notes dossiers into the iframe overlay.
- `openFlashcards(subId)`: Initializes 3D flip card deck and attaches keyboard listeners.
- `openBareActDrawer(actId, secNum)`: Opens statutory reference drawer filtered to a specific section.
- `openBnsModal(searchQuery)`: Launches the BNS ↔ IPC converter with optional search pre-fill.
- `generateMockPaper(subId)`: Constructs an 8-question exam paper strictly following DU examination patterns.

---

## 10. FUTURE DEVELOPMENT ROADMAP

When adding features to Make Law Easy, follow these exact patterns:
1. **Adding New Semesters (e.g. Semester 2, 4, 5, 6)**:
   - Add entry to `DU_LAW_PORTAL_DATA.semesters` in `js/data.js`.
   - Add semester subjects into `DU_LAW_PORTAL_DATA.subjects`.
   - Place HTML dossiers into `sem [N]/[subject]/`.
   - Run `node scripts/ingest_subject.js "sem [N]/[subject]"`.
   - Run `node scripts/comprehensive_test.js`.
2. **Adding New Bare Acts**:
   - Register act metadata into `window.BARE_ACTS_DB.acts` in `js/bare_acts.js`.
   - Add sections to `window.BARE_ACTS_DB.sections` with `{ id, actId, sec, title, text, tags }`.
   - Add corresponding tab in `index.html` inside `#badActTabs`.
3. **Adding Audio / Podcast Summaries**:
   - `js/app.js` already has state variables (`audioSpeechRate`, `audioUtterance`, `audioIsPlaying`) and UI elements (`#floatingAudioBar`). Connect with Web Speech API `window.speechSynthesis`.

---

## 11. ABSOLUTE GUARDRAILS & COMMON PITFALLS

1. ❌ **NEVER blindly overwrite `js/data.js`**:
   `js/data.js` is nearly 4MB and contains hundreds of curated case briefs and model answers. Always make targeted changes or use `scripts/ingest_subject.js`.
2. ❌ **NEVER forget to bump `sw.js`**:
   Because the service worker caches the app shell, users will continue seeing stale assets unless `CACHE_NAME` is incremented.
3. ❌ **NEVER delete substantive legal clauses**:
   Both `terms.html` (21 sections) and `privacy.html` (20 sections) contain legally binding, statutory Fair Dealing (Section 52), BCI Rule 36, and DPDP Act provisions. Never delete or compress these into generic placeholder text.
4. ❌ **NEVER add heavy frontend build systems**:
   Keep the project vanilla, lightweight, and directly executable without npm build pipelines.
5. ❌ **AVOID CSS flex child overflow**:
   Always pair `flex: 1` with `min-width: 0` and `overflow-wrap: break-word` when handling long headings.

---

*This Project Brain is maintained as the single source of truth for Make Law Easy. Keep this file updated whenever new semesters, subjects, or architectures are introduced.*
