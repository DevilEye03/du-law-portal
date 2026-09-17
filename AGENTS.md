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

### Rule 5: Verification & Deployment Workflow
Before finalizing any coding task:
1. Run local tests: `node scripts/comprehensive_test.js`
2. Check git status: `git status`
3. Commit and push: `git add -A && git commit -m "..." && git push origin main`
4. Deploy to Firebase: `firebase deploy --only hosting`

---

*For full file maps, subject IDs, FIRAC case structures, and 3D visual system guidelines, consult `PROJECT_BRAIN.md`.*
