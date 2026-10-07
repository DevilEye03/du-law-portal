# 🧠 MAKE LAW EASY — AGENT DIRECTIVES & PROJECT BRAIN

> **PERMANENT WORKSPACE CONTEXT & OPERATIONAL GUARDRAILS**  
> Read `PROJECT_BRAIN.md` for the exhaustive 360° architectural and domain reference.

---

## 1. PROJECT QUICK REFERENCE
- **Domain**: [https://makelaweasy.in](https://makelaweasy.in) (Firebase: [https://make-law-easy.web.app](https://make-law-easy.web.app))
- **Repository**: `DevilEye03/du-law-portal` (Branch: `main`)
- **Domain Focus**: Non-commercial LL.B. educational study portal for Delhi University law students.
- **Tech Stack**: Pure Vanilla HTML5, CSS3, ES6+ JS, Three.js (r128), GSAP, Firebase Hosting. Zero build step.

---

## 2. CRITICAL RULES BEFORE EXECUTING ANY TASK

### Rule 1: Service Worker Cache Invalidation (`sw.js`)
Whenever modifying any asset in `css/`, `js/`, or HTML files (`index.html`, `terms.html`, `privacy.html`), you **MUST** increment `CACHE_NAME` in `sw.js` (e.g. from `du-law-portal-v24` to `du-law-portal-v25`). Without this, clients and PWAs will serve stale cached code.

### Rule 2: Preservation of `js/data.js` (~3.9MB)
Never replace or truncate `js/data.js`. To ingest or modify subject notes, use `node scripts/ingest_subject.js "<folder>"` or precise, targeted edits.

### Rule 3: Mobile Flexbox Overflow Prevention
When writing or modifying CSS for cards and headers:
- Always apply `min-width: 0;` and `overflow-wrap: break-word;` on flex child containers.
- Check viewports at 390px width to ensure zero horizontal scroll on mobile touchscreens.

### Rule 4: Legal & Regulatory Integrity
Never alter or omit substantive legal protections in `terms.html` (21 sections) and `privacy.html` (20 sections):
- Indian Copyright Act 1957 Section 52(1)(a)(i) Fair Dealing
- Bar Council of India Rule 36 Non-Solicitation Statement
- Digital Personal Data Protection Act, 2023 (DPDP Act)
- Grievance Redressal Officer contact (`ankur@makelaweasy.in`)

### Rule 5: Local Verification, Git Push & Live Deployment Workflow
Before finalizing any coding task:
1. Run local automated integrity tests: `node scripts/comprehensive_test.js`
2. Test locally in browser if needed: `node scripts/server.js` (http://localhost:3000)
3. Check git status: `git status`
4. Commit & push changes: `git add -A && git commit -m "..." && git push origin main`
5. Always deploy to Firebase Hosting: `firebase deploy --only hosting` (Per user directive: always deploy all changes to the live website so mobile/client devices receive fresh service worker updates).

### Rule 6: Website-Only Scope Policy (App Isolation)
All ongoing and future updates, UI tweaks, content additions, and feature enhancements must be made **exclusively on the website codebase** (`index.html`, `css/`, `js/`, notes, tools, etc.) and **NEVER in the mobile app** (`android-app/`, `dist-apk/`), unless the user explicitly asks to modify or rebuild the Android app. *(Note: Because the Android app loads `https://makelaweasy.in` directly inside its native wrapper, any website updates are automatically rendered in the app dynamically without requiring app rebuilds).*

---

*For full file maps, subject IDs, FIRAC case structures, and 3D visual system guidelines, consult `PROJECT_BRAIN.md`.*

