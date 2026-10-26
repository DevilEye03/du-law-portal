/**
 * MAKE LAW EASY — SAMSUNG S-PEN & NOTESHELF 3 ULTIMATE ENGINE (v1.4.0)
 * Zero-Lag Hardware Accelerated Viewport Architecture
 * - Desynchronized Low-Latency Inking (< 5ms response)
 * - 100% Native Finger Scrolling (pointer-events: none)
 * - Noteshelf 3 Pen Arsenal, Auto-Shapes, Photos, Sticky Notes & Hub
 */
(function () {
  'use strict';

  if (window.__SPEN_ENGINE_INITIALIZED__) return;
  window.__SPEN_ENGINE_INITIALIZED__ = true;

  console.log('[SPenEngine] Initializing Zero-Lag S-Pen Engine v1.4.0...');

  // Configuration & Engine State
  const state = {
    activeTool: 'fountain', // 'fountain' | 'ballpoint' | 'pencil' | 'highlighter' | 'marker' | 'eraser' | 'lasso' | 'sticky' | 'image'
    previousTool: 'fountain',
    penType: 'fountain', // 'fountain' | 'ballpoint' | 'pencil' | 'marker'
    activeShape: 'line', // 'line' | 'rect' | 'circle' | 'arrow' | 'triangle'
    shapeModeActive: false,
    penColor: '#0f172a', // Onyx Black
    penSize: 3.5,
    highlighterColor: 'rgba(250, 204, 21, 0.45)', // Neon Yellow
    highlighterSize: 24.0,
    eraserMode: 'stroke',
    eraserSize: 26.0,
    stylusOnlyMode: true, // TRUE PALM REJECTION: S-Pen draws, fingers scroll!
    markupVisible: true,
    holdToSnap: true,
    isDrawing: false,
    currentStroke: null,
    strokes: [], // Document strokes array: points in absolute document coordinates {docX, docY, pressure}
    undoStack: [],
    redoStack: [],
    stickyNotes: [],
    insertedImages: [],
    isSpenDetected: false,
    currentPageId: '',
    currentPageTitle: '',
    currentPageSubject: '',

    // Viewport-Fixed Canvas & Context
    canvas: null,
    ctx: null,
    dpr: Math.min(window.devicePixelRatio || 1, 2.0),
    activeWin: window,
    activeDoc: document,
    saveTimeout: null,
    scrollRaf: null,

    // Hold-to-snap timer & tracker
    holdTimer: null,
    lastHoldPoint: null,

    // S-Pen Hardware Barrel Button
    isBarrelButtonActive: false,

    // Lasso Tool State
    lasso: {
      isSelecting: false,
      loopPoints: [],
      selectedStrokes: [],
      boxEl: null,
    },
  };

  // Noteshelf 3 Legal Scholar & Pastel Palettes
  const PEN_COLORS = [
    { name: 'Onyx Black', value: '#0f172a' },
    { name: 'Court Navy', value: '#1e3a8a' },
    { name: 'Crimson Ratio', value: '#b91c1c' },
    { name: 'Emerald Act', value: '#047857' },
    { name: 'Legal Amber', value: '#d97706' },
    { name: 'Royal Purple', value: '#6b21a8' },
    { name: 'Graphite Lead', value: '#475569' },
  ];

  const HIGHLIGHTER_COLORS = [
    { name: 'Neon Yellow', value: 'rgba(250, 204, 21, 0.45)' },
    { name: 'Mint Precedent', value: 'rgba(52, 211, 153, 0.45)' },
    { name: 'Rose Doctrine', value: 'rgba(244, 114, 182, 0.45)' },
    { name: 'Sky Directive', value: 'rgba(56, 189, 248, 0.45)' },
    { name: 'Sunset Alert', value: 'rgba(251, 146, 60, 0.45)' },
  ];

  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return 'spen_' + Math.abs(hash).toString(36);
  }

  // =========================================================================
  // 1. NATIVE ANDROID BRIDGE & PERSISTENCE
  // =========================================================================
  const NativeBridge = {
    isAvailable: () => typeof window.AndroidApp !== 'undefined',

    save: (pageId, title, subject, data) => {
      const json = JSON.stringify(data);
      try {
        if (NativeBridge.isAvailable() && window.AndroidApp.saveAnnotations) {
          window.AndroidApp.saveAnnotations(pageId, title, subject, json);
        } else {
          localStorage.setItem('mle_notes_' + pageId, json);
          NativeBridge.updateLocalIndex(pageId, title, subject, data);
        }
      } catch (e) {
        console.warn('[SPenEngine] Save error:', e);
      }
    },

    load: (pageId) => {
      try {
        if (NativeBridge.isAvailable() && window.AndroidApp.loadAnnotations) {
          const raw = window.AndroidApp.loadAnnotations(pageId);
          if (raw && raw.length > 2) return JSON.parse(raw);
        }
        const local = localStorage.getItem('mle_notes_' + pageId);
        if (local) return JSON.parse(local);
      } catch (e) {
        console.warn('[SPenEngine] Load error:', e);
      }
      return null;
    },

    getAllIndex: () => {
      try {
        if (NativeBridge.isAvailable() && window.AndroidApp.getAllNotesIndex) {
          const raw = window.AndroidApp.getAllNotesIndex();
          if (raw && raw.length > 2) return JSON.parse(raw);
        }
        const localIdx = localStorage.getItem('mle_notes_master_index');
        if (localIdx) return JSON.parse(localIdx);
      } catch (e) {
        console.warn('[SPenEngine] GetIndex error:', e);
      }
      return [];
    },

    deleteNote: (pageId) => {
      try {
        if (NativeBridge.isAvailable() && window.AndroidApp.deleteAnnotations) {
          window.AndroidApp.deleteAnnotations(pageId);
        }
        localStorage.removeItem('mle_notes_' + pageId);
        const idx = NativeBridge.getAllIndex().filter((n) => n.pageId !== pageId);
        localStorage.setItem('mle_notes_master_index', JSON.stringify(idx));
      } catch (e) {
        console.warn('[SPenEngine] Delete error:', e);
      }
    },

    saveThumb: (pageId, base64Png) => {
      try {
        if (NativeBridge.isAvailable() && window.AndroidApp.saveThumbnail) {
          window.AndroidApp.saveThumbnail(pageId, base64Png);
        } else {
          try { sessionStorage.setItem('mle_thumb_' + pageId, base64Png); } catch (_) {}
        }
      } catch (_) {}
    },

    getThumb: (pageId) => {
      try {
        if (NativeBridge.isAvailable() && window.AndroidApp.getThumbnail) {
          const thumb = window.AndroidApp.getThumbnail(pageId);
          if (thumb && thumb.length > 10) return thumb;
        }
        return sessionStorage.getItem('mle_thumb_' + pageId) || '';
      } catch (_) {
        return '';
      }
    },

    updateLocalIndex: (pageId, title, subject, data) => {
      try {
        let idx = [];
        const raw = localStorage.getItem('mle_notes_master_index');
        if (raw) idx = JSON.parse(raw);
        idx = idx.filter((item) => item.pageId !== pageId);
        if (
          (data.strokes && data.strokes.length > 0) ||
          (data.stickyNotes && data.stickyNotes.length > 0) ||
          (data.insertedImages && data.insertedImages.length > 0)
        ) {
          idx.unshift({
            pageId,
            title: title || 'Comprehensive Study Notes',
            subject: subject || 'Law Subject',
            timestamp: Date.now(),
            strokeCount: data.strokes ? data.strokes.length : 0,
            stickyCount: (data.stickyNotes ? data.stickyNotes.length : 0) + (data.insertedImages ? data.insertedImages.length : 0),
          });
        }
        localStorage.setItem('mle_notes_master_index', JSON.stringify(idx));
      } catch (e) {}
    },

    vibrate: (type) => {
      try {
        if (NativeBridge.isAvailable() && window.AndroidApp.vibratePen) {
          window.AndroidApp.vibratePen(type || 1);
        } else if (navigator.vibrate) {
          navigator.vibrate(type === 2 ? 30 : 15);
        }
      } catch (e) {}
    },

    exportImage: (base64Png, title) => {
      try {
        if (NativeBridge.isAvailable() && window.AndroidApp.exportPageImage) {
          window.AndroidApp.exportPageImage(base64Png, title || 'MakeLawEasy_Notes');
        } else {
          const a = document.createElement('a');
          a.href = base64Png;
          a.download = (title || 'MakeLawEasy_Notes').replace(/[^a-zA-Z0-9_-]/g, '_') + '.png';
          a.click();
        }
      } catch (e) {
        console.warn('[SPenEngine] Export error:', e);
      }
    },

    printPdf: (title) => {
      try {
        if (NativeBridge.isAvailable() && window.AndroidApp.printOrSavePdf) {
          window.AndroidApp.printOrSavePdf(title || 'MakeLawEasy_StudyNotes');
        } else {
          window.print();
        }
      } catch (e) {
        window.print();
      }
    },

    exportBackup: () => {
      try {
        if (NativeBridge.isAvailable() && window.AndroidApp.exportMasterNotesBackup) {
          window.AndroidApp.exportMasterNotesBackup();
        } else {
          const master = {
            version: 4,
            exportTime: Date.now(),
            index: NativeBridge.getAllIndex(),
            pages: {},
          };
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith('mle_notes_') && k !== 'mle_notes_master_index') {
              master.pages[k.replace('mle_notes_', '')] = JSON.parse(localStorage.getItem(k));
            }
          }
          const blob = new Blob([JSON.stringify(master, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'MakeLawEasy_MasterNotes_Backup.mle-notes';
          a.click();
        }
      } catch (e) {
        showToast('Backup failed: ' + e.message);
      }
    },

    importBackup: (jsonStr) => {
      try {
        if (NativeBridge.isAvailable() && window.AndroidApp.importMasterNotesBackup) {
          const ok = window.AndroidApp.importMasterNotesBackup(jsonStr);
          if (ok) {
            showToast('Master notes restored successfully!');
            setTimeout(() => location.reload(), 1000);
            return;
          }
        }
        const root = JSON.parse(jsonStr);
        if (root.pages) {
          Object.keys(root.pages).forEach((k) => {
            localStorage.setItem('mle_notes_' + k, JSON.stringify(root.pages[k]));
          });
          if (root.index) {
            localStorage.setItem('mle_notes_master_index', JSON.stringify(root.index));
          }
          showToast('Master notes restored successfully!');
          setTimeout(() => location.reload(), 1000);
        }
      } catch (e) {
        showToast('Invalid backup file');
      }
    },
  };

  // =========================================================================
  // 2. HARDWARE S-PEN AIR VIEW & DETECTION
  // =========================================================================
  let hoverRingEl = null;

  function ensureHoverRing() {
    if (!hoverRingEl) {
      hoverRingEl = document.createElement('div');
      hoverRingEl.className = 'spen-hover-ring';
      document.body.appendChild(hoverRingEl);
    }
  }

  function updateHoverPosition(e) {
    if (!hoverRingEl) return;
    const size = Math.max(6, state.activeTool === 'highlighter' ? state.highlighterSize : state.penSize);
    hoverRingEl.style.width = size + 'px';
    hoverRingEl.style.height = size + 'px';
    hoverRingEl.style.left = e.clientX + 'px';
    hoverRingEl.style.top = e.clientY + 'px';
    hoverRingEl.classList.add('active');
  }

  function hideHover() {
    if (hoverRingEl) hoverRingEl.classList.remove('active');
  }

  function setSpenDetected(detected) {
    state.isSpenDetected = detected;
    const pill = document.getElementById('spenStatusPill');
    if (pill) {
      if (detected) {
        pill.className = 'spen-status-pill';
        pill.innerHTML = '<i class="fa-solid fa-pen-fancy"></i> <span>S-Pen</span>';
      } else {
        pill.className = 'spen-status-pill no-stylus';
        pill.innerHTML = '<i class="fa-solid fa-hand-pointer"></i> <span>Touch</span>';
      }
    }
  }

  function isSpenPointer(e) {
    return (
      e.pointerType === 'pen' ||
      e.pointerType === 'stylus' ||
      (e.pressure > 0 && e.pointerType !== 'mouse')
    );
  }

  // =========================================================================
  // 3. ZERO-LAG FIXED VIEWPORT CANVAS INITIALIZATION
  // =========================================================================
  function getActiveContext() {
    const readerModal = document.getElementById('readerModal');
    const iframe = document.getElementById('readerIframe');

    if (readerModal && readerModal.classList.contains('active') && iframe && iframe.contentDocument) {
      const doc = iframe.contentDocument;
      const targetBody = doc.body;
      const fileUrl = iframe.getAttribute('src') || '';
      const title = document.getElementById('readerModalTitle')?.textContent || 'Topic Notes';
      const subject = document.getElementById('readerModalSubBadge')?.textContent || 'Subject';

      return {
        isReader: true,
        doc: doc,
        win: iframe.contentWindow,
        container: targetBody,
        pageId: hashString(fileUrl),
        title: title,
        subject: subject,
      };
    }

    return {
      isReader: false,
      doc: document,
      win: window,
      container: document.body,
      pageId: hashString(location.pathname + location.search),
      title: document.title || 'Make Law Easy',
      subject: 'Portal',
    };
  }

  function attachCanvasToContext() {
    const ctxInfo = getActiveContext();
    if (!ctxInfo || !ctxInfo.container) return;

    if (state.canvas && state.currentPageId === ctxInfo.pageId) {
      return;
    }

    state.currentPageId = ctxInfo.pageId;
    state.currentPageTitle = ctxInfo.title;
    state.currentPageSubject = ctxInfo.subject;
    state.activeWin = ctxInfo.win;
    state.activeDoc = ctxInfo.doc;

    if (ctxInfo.isReader) {
      injectIframeStyles(ctxInfo.doc);
    }

    // Remove existing canvas if any
    let existingCanvas = ctxInfo.doc.querySelector('.spen-canvas-layer');
    if (existingCanvas) existingCanvas.remove();

    ctxInfo.doc.querySelectorAll('.spen-sticky-note').forEach((el) => el.remove());
    ctxInfo.doc.querySelectorAll('.spen-inserted-image').forEach((el) => el.remove());

    // Create Fixed Viewport Canvas
    const canvas = ctxInfo.doc.createElement('canvas');
    canvas.className = 'spen-canvas-layer';
    if (!state.markupVisible) canvas.classList.add('spen-hidden');
    if (!state.stylusOnlyMode) canvas.classList.add('finger-draw-mode');

    ctxInfo.doc.body.appendChild(canvas);
    state.canvas = canvas;

    // Use desynchronized: true for sub-5ms low latency front-buffer hardware rendering
    try {
      state.ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    } catch (_) {
      state.ctx = canvas.getContext('2d');
    }

    syncViewportCanvasSize();

    // Bind dual-touch capture events and scroll sync
    bindDualTouchEvents(ctxInfo.win, ctxInfo.doc);
    bindScrollSync(ctxInfo.win);

    loadPageData(state.currentPageId);

    ctxInfo.win.removeEventListener('resize', syncViewportCanvasSize);
    ctxInfo.win.addEventListener('resize', syncViewportCanvasSize);
  }

  function syncViewportCanvasSize() {
    if (!state.canvas) return;
    const dpr = state.dpr;
    const w = window.innerWidth;
    const h = window.innerHeight;

    state.canvas.width = Math.floor(w * dpr);
    state.canvas.height = Math.floor(h * dpr);

    if (state.ctx) {
      state.ctx.scale(dpr, dpr);
      state.ctx.lineCap = 'round';
      state.ctx.lineJoin = 'round';
    }

    redrawViewport();
  }

  function injectIframeStyles(doc) {
    if (!doc.head || doc.getElementById('spenIframeStyles')) return;
    const style = doc.createElement('style');
    style.id = 'spenIframeStyles';
    const mainStyle = document.getElementById('spenSuiteStyles');
    if (mainStyle) {
      style.textContent = mainStyle.textContent;
    }
    doc.head.appendChild(style);
  }

  // =========================================================================
  // 4. LOW-LATENCY DUAL-TOUCH ENGINE (FINGER SCROLLS vs S-PEN WRITES)
  // =========================================================================
  function bindDualTouchEvents(win, doc) {
    win.removeEventListener('pointerdown', onUniversalPointerDown, true);
    win.removeEventListener('pointermove', onUniversalPointerMove, true);
    win.removeEventListener('pointerup', onUniversalPointerUp, true);
    win.removeEventListener('pointercancel', onUniversalPointerUp, true);

    win.addEventListener('pointerdown', onUniversalPointerDown, true);
    win.addEventListener('pointermove', onUniversalPointerMove, true);
    win.addEventListener('pointerup', onUniversalPointerUp, true);
    win.addEventListener('pointercancel', onUniversalPointerUp, true);
  }

  function bindScrollSync(win) {
    win.removeEventListener('scroll', onScrollSync, { passive: true });
    win.addEventListener('scroll', onScrollSync, { passive: true });
  }

  function onScrollSync() {
    if (state.scrollRaf) cancelAnimationFrame(state.scrollRaf);
    state.scrollRaf = requestAnimationFrame(() => {
      redrawViewport();
    });
  }

  function getScrollOffset() {
    const win = state.activeWin || window;
    const doc = state.activeDoc || document;
    return {
      x: win.pageXOffset || doc.documentElement.scrollLeft || 0,
      y: win.pageYOffset || doc.documentElement.scrollTop || 0,
    };
  }

  function getPointData(e) {
    const scroll = getScrollOffset();
    return {
      docX: e.clientX + scroll.x,
      docY: e.clientY + scroll.y,
      screenX: e.clientX,
      screenY: e.clientY,
      pressure: e.pressure > 0 ? e.pressure : 0.5,
      isButton2: e.buttons === 2 || e.buttons === 32 || e.button === 2 || e.button === 5,
    };
  }

  function onUniversalPointerDown(e) {
    const isStylus = isSpenPointer(e);

    if (isStylus) {
      setSpenDetected(true);
    }

    // 1. Ignore if touching floating toolbar or interactive popovers
    const target = e.target;
    if (
      target.closest('#spenToolbarContainer') ||
      target.closest('.spen-popover') ||
      target.closest('.spen-hub-overlay') ||
      target.closest('.spen-sticky-note') ||
      target.closest('.spen-inserted-image') ||
      target.closest('.spen-toast') ||
      target.closest('.spen-lasso-toolbar')
    ) {
      return;
    }

    // 2. FINGER TOUCH: If Stylus-Only Mode is ON, DO NOTHING!
    // The touch passes straight through to native document for 120Hz smooth scrolling!
    if (!isStylus && state.stylusOnlyMode) {
      return;
    }

    // 3. S-PEN TOUCH: Prevent page scrolling & text selection while writing
    e.preventDefault();
    e.stopPropagation();

    const pt = getPointData(e);

    // Sticky Note Drop
    if (state.activeTool === 'sticky') {
      createStickyNote(pt.docX, pt.docY);
      setTool('fountain');
      return;
    }

    // Lasso Selection
    if (state.activeTool === 'lasso') {
      startLassoSelection(pt);
      return;
    }

    state.isDrawing = true;
    const isEraser = state.activeTool === 'eraser' || pt.isButton2 || state.isBarrelButtonActive;

    if (isEraser) {
      NativeBridge.vibrate(2);
      handleEraserAction(pt);
      return;
    }

    // Start New Stroke
    const isHighlighter = state.activeTool === 'highlighter';
    const isPencil = state.activeTool === 'pencil' || state.penType === 'pencil';
    const isFountain = state.activeTool === 'fountain' || state.penType === 'fountain';
    const isMarker = state.activeTool === 'marker' || state.penType === 'marker';

    let strokeType = 'ballpoint';
    if (isHighlighter) strokeType = 'highlighter';
    else if (isPencil) strokeType = 'pencil';
    else if (isFountain) strokeType = 'fountain';
    else if (isMarker) strokeType = 'marker';

    const baseWidth = isHighlighter ? state.highlighterSize : state.penSize;
    const color = isHighlighter ? state.highlighterColor : state.penColor;

    state.currentStroke = {
      id: 'stroke_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type: strokeType,
      color: color,
      baseWidth: baseWidth,
      points: [pt],
      timestamp: Date.now(),
      minX: pt.docX,
      maxX: pt.docX,
      minY: pt.docY,
      maxY: pt.docY,
    };

    drawInstantSegment(state.currentStroke, pt, pt);

    startHoldToSnapTimer(pt);
  }

  function onUniversalPointerMove(e) {
    if (isSpenPointer(e)) {
      updateHoverPosition(e);
    }

    if (state.activeTool === 'lasso' && state.lasso.isSelecting) {
      e.preventDefault();
      continueLassoSelection(getPointData(e));
      return;
    }

    if (!state.isDrawing) return;

    const isStylus = isSpenPointer(e);
    if (!isStylus && state.stylusOnlyMode) return;

    e.preventDefault();

    // S-Pen Coalesced high-frequency events (240Hz)
    const events = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : [e];

    for (let i = 0; i < events.length; i++) {
      const pt = getPointData(events[i]);
      const isEraser = state.activeTool === 'eraser' || pt.isButton2 || state.isBarrelButtonActive;

      if (isEraser) {
        handleEraserAction(pt);
        continue;
      }

      if (!state.currentStroke) continue;

      const pts = state.currentStroke.points;
      const prevPt = pts[pts.length - 1];

      const dx = pt.docX - prevPt.docX;
      const dy = pt.docY - prevPt.docY;
      if (dx * dx + dy * dy < 1.8) {
        continue;
      }

      startHoldToSnapTimer(pt);

      pts.push(pt);

      // Update stroke bounding box
      if (pt.docX < state.currentStroke.minX) state.currentStroke.minX = pt.docX;
      if (pt.docX > state.currentStroke.maxX) state.currentStroke.maxX = pt.docX;
      if (pt.docY < state.currentStroke.minY) state.currentStroke.minY = pt.docY;
      if (pt.docY > state.currentStroke.maxY) state.currentStroke.maxY = pt.docY;

      // INSTANT GPU INKING: Only draw this micro-segment! No full screen redraw!
      drawInstantSegment(state.currentStroke, prevPt, pt);
    }
  }

  function onUniversalPointerUp(e) {
    clearTimeout(state.holdTimer);

    if (state.activeTool === 'lasso' && state.lasso.isSelecting) {
      e.preventDefault();
      finishLassoSelection();
      return;
    }

    if (!state.isDrawing) return;
    state.isDrawing = false;

    if (state.currentStroke && state.currentStroke.points.length > 0) {
      if (state.shapeModeActive) {
        applyAutoShapeToStroke(state.currentStroke, state.activeShape);
      }

      state.strokes.push(state.currentStroke);
      state.undoStack.push({ type: 'add_stroke', stroke: state.currentStroke });
      state.redoStack = [];
      state.currentStroke = null;
      updateToolbarCounters();
      debounceSave();
      redrawViewport(); // Clean finalize render
    }
  }

  // =========================================================================
  // 5. INSTANT DIRECT-TO-GPU INKING (Zero-Latency)
  // =========================================================================
  function drawInstantSegment(stroke, p1, p2) {
    const ctx = state.ctx;
    if (!ctx) return;

    ctx.save();

    if (stroke.type === 'highlighter') {
      ctx.globalCompositeOperation = 'multiply';
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.baseWidth;
      ctx.lineCap = 'square';
    } else if (stroke.type === 'pencil') {
      ctx.globalCompositeOperation = 'source-over';
      const pressure = p2.pressure || 0.5;
      ctx.strokeStyle = stroke.color;
      ctx.globalAlpha = 0.4 + 0.5 * pressure;
      ctx.lineWidth = Math.max(1.0, stroke.baseWidth * (0.6 + 0.4 * pressure));
      ctx.lineCap = 'round';
    } else if (stroke.type === 'fountain') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = stroke.color;
      const pressureMultiplier = 0.2 + 1.1 * (p2.pressure || 0.5);
      ctx.lineWidth = Math.max(1.0, stroke.baseWidth * pressureMultiplier);
      ctx.lineCap = 'round';
    } else if (stroke.type === 'marker') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = stroke.color;
      ctx.globalAlpha = 0.88;
      ctx.lineWidth = stroke.baseWidth * 1.2;
      ctx.lineCap = 'round';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = stroke.color;
      const pressureMultiplier = 0.6 + 0.4 * (p2.pressure || 0.5);
      ctx.lineWidth = Math.max(1.0, stroke.baseWidth * pressureMultiplier);
      ctx.lineCap = 'round';
    }

    ctx.beginPath();
    ctx.moveTo(p1.screenX, p1.screenY);
    ctx.lineTo(p2.screenX, p2.screenY);
    ctx.stroke();

    ctx.restore();
  }

  // Redraw visible viewport strokes translated by scroll position (Fast GPU culling)
  function redrawViewport() {
    const ctx = state.ctx;
    const canvas = state.canvas;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!state.markupVisible) return;

    const scroll = getScrollOffset();
    const viewW = window.innerWidth;
    const viewH = window.innerHeight;

    for (let s = 0; s < state.strokes.length; s++) {
      const stroke = state.strokes[s];
      // Viewport AABB Culling: skip strokes outside current screen!
      if (
        stroke.maxX < scroll.x ||
        stroke.minX > scroll.x + viewW ||
        stroke.maxY < scroll.y ||
        stroke.minY > scroll.y + viewH
      ) {
        continue;
      }

      const pts = stroke.points;
      if (!pts || pts.length === 0) continue;

      ctx.save();

      if (stroke.type === 'highlighter') {
        ctx.globalCompositeOperation = 'multiply';
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.baseWidth;
        ctx.lineCap = 'square';
      } else if (stroke.type === 'pencil') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = stroke.color;
        ctx.globalAlpha = 0.7;
        ctx.lineCap = 'round';
      } else if (stroke.type === 'marker') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = stroke.color;
        ctx.globalAlpha = 0.88;
        ctx.lineWidth = stroke.baseWidth * 1.2;
        ctx.lineCap = 'round';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = stroke.color;
        ctx.lineCap = 'round';
      }

      ctx.lineJoin = 'round';

      if (pts.length === 1) {
        ctx.fillStyle = stroke.color;
        ctx.beginPath();
        ctx.arc(pts[0].docX - scroll.x, pts[0].docY - scroll.y, stroke.baseWidth / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        continue;
      }

      if (stroke.isStraightLine || stroke.isShape) {
        ctx.lineWidth = stroke.baseWidth;
        ctx.beginPath();
        ctx.moveTo(pts[0].docX - scroll.x, pts[0].docY - scroll.y);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i].docX - scroll.x, pts[i].docY - scroll.y);
        }
        ctx.stroke();
        ctx.restore();
        continue;
      }

      ctx.beginPath();
      ctx.moveTo(pts[0].docX - scroll.x, pts[0].docY - scroll.y);

      for (let i = 1; i < pts.length; i++) {
        const midX = (pts[i - 1].docX + pts[i].docX) / 2 - scroll.x;
        const midY = (pts[i - 1].docY + pts[i].docY) / 2 - scroll.y;

        if (stroke.type !== 'highlighter') {
          const pressure = pts[i].pressure || 0.5;
          let mult = 0.6 + 0.4 * pressure;
          if (stroke.type === 'fountain') mult = 0.2 + 1.1 * pressure;
          ctx.lineWidth = Math.max(1.0, stroke.baseWidth * mult);
        }

        ctx.quadraticCurveTo(
          pts[i - 1].docX - scroll.x,
          pts[i - 1].docY - scroll.y,
          midX,
          midY
        );
      }
      ctx.lineTo(pts[pts.length - 1].docX - scroll.x, pts[pts.length - 1].docY - scroll.y);
      ctx.stroke();

      ctx.restore();
    }
  }

  // =========================================================================
  // 6. HOLD-TO-SNAP SHAPES & RULER ENGINE
  // =========================================================================
  function startHoldToSnapTimer(pt) {
    clearTimeout(state.holdTimer);
    if (!state.holdToSnap || !state.currentStroke) return;

    state.lastHoldPoint = pt;

    state.holdTimer = setTimeout(() => {
      if (!state.isDrawing || !state.currentStroke) return;
      snapCurrentStroke();
    }, 450);
  }

  function snapCurrentStroke() {
    const stroke = state.currentStroke;
    if (!stroke || stroke.points.length < 4) return;

    const pts = stroke.points;
    const startPt = pts[0];
    const endPt = pts[pts.length - 1];

    const distSq = (endPt.docX - startPt.docX) ** 2 + (endPt.docY - startPt.docY) ** 2;
    const isClosedLoop = distSq < 1600 && pts.length > 8;

    if (isClosedLoop) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      pts.forEach((p) => {
        if (p.docX < minX) minX = p.docX;
        if (p.docY < minY) minY = p.docY;
        if (p.docX > maxX) maxX = p.docX;
        if (p.docY > maxY) maxY = p.docY;
      });

      stroke.points = [
        { docX: minX, docY: minY, pressure: 0.6 },
        { docX: maxX, docY: minY, pressure: 0.6 },
        { docX: maxX, docY: maxY, pressure: 0.6 },
        { docX: minX, docY: maxY, pressure: 0.6 },
        { docX: minX, docY: minY, pressure: 0.6 },
      ];
      stroke.isStraightLine = true;
      stroke.isShape = true;
      showToast('Snapped to Rectangle Box');
    } else {
      stroke.points = [startPt, endPt];
      stroke.isStraightLine = true;
      showToast('Snapped to Straight Line');
    }

    NativeBridge.vibrate(2);
    redrawViewport();
  }

  function applyAutoShapeToStroke(stroke, shapeName) {
    if (!stroke || stroke.points.length < 2) return;
    const startPt = stroke.points[0];
    const endPt = stroke.points[stroke.points.length - 1];

    if (shapeName === 'line') {
      stroke.points = [startPt, endPt];
      stroke.isStraightLine = true;
    } else if (shapeName === 'rect') {
      const minX = Math.min(startPt.docX, endPt.docX);
      const maxX = Math.max(startPt.docX, endPt.docX);
      const minY = Math.min(startPt.docY, endPt.docY);
      const maxY = Math.max(startPt.docY, endPt.docY);
      stroke.points = [
        { docX: minX, docY: minY },
        { docX: maxX, docY: minY },
        { docX: maxX, docY: maxY },
        { docX: minX, docY: maxY },
        { docX: minX, docY: minY },
      ];
      stroke.isShape = true;
    } else if (shapeName === 'arrow') {
      const dx = endPt.docX - startPt.docX;
      const dy = endPt.docY - startPt.docY;
      const angle = Math.atan2(dy, dx);
      const headLen = 18;
      const h1 = {
        docX: endPt.docX - headLen * Math.cos(angle - Math.PI / 6),
        docY: endPt.docY - headLen * Math.sin(angle - Math.PI / 6),
      };
      const h2 = {
        docX: endPt.docX - headLen * Math.cos(angle + Math.PI / 6),
        docY: endPt.docY - headLen * Math.sin(angle + Math.PI / 6),
      };
      stroke.points = [startPt, endPt, h1, endPt, h2];
      stroke.isShape = true;
    } else if (shapeName === 'triangle') {
      const midX = (startPt.docX + endPt.docX) / 2;
      const topY = Math.min(startPt.docY, endPt.docY);
      const botY = Math.max(startPt.docY, endPt.docY);
      stroke.points = [
        { docX: midX, docY: topY },
        { docX: endPt.docX, docY: botY },
        { docX: startPt.docX, docY: botY },
        { docX: midX, docY: topY },
      ];
      stroke.isShape = true;
    }
  }

  // =========================================================================
  // 7. ERASER ENGINE (Stroke & Area)
  // =========================================================================
  function handleEraserAction(pt) {
    const hitRadius = state.eraserSize;
    let erasedAny = false;

    for (let i = state.strokes.length - 1; i >= 0; i--) {
      const stroke = state.strokes[i];
      const pts = stroke.points;

      for (let j = 0; j < pts.length; j += 2) {
        const dx = pts[j].docX - pt.docX;
        const dy = pts[j].docY - pt.docY;
        if (dx * dx + dy * dy <= hitRadius * hitRadius) {
          const removed = state.strokes.splice(i, 1)[0];
          state.undoStack.push({ type: 'delete_stroke', stroke: removed });
          erasedAny = true;
          break;
        }
      }
    }

    if (erasedAny) {
      redrawViewport();
      updateToolbarCounters();
      debounceSave();
    }
  }

  function clearAllPageNotes() {
    if (confirm('Wipe all handwritten annotations, sticky notes and images on this page?')) {
      state.strokes = [];
      state.stickyNotes = [];
      state.insertedImages = [];
      const doc = state.activeDoc || document;
      doc.querySelectorAll('.spen-sticky-note').forEach((el) => el.remove());
      doc.querySelectorAll('.spen-inserted-image').forEach((el) => el.remove());
      redrawViewport();
      updateToolbarCounters();
      debounceSave();
      showToast('Page annotations cleared');
    }
  }

  // =========================================================================
  // 8. INSERT IMAGE (Noteshelf 3 Photo Feature)
  // =========================================================================
  function triggerImagePicker() {
    let input = document.getElementById('spenImagePickerInput');
    if (!input) {
      input = document.createElement('input');
      input.type = 'file';
      input.id = 'spenImagePickerInput';
      input.accept = 'image/*';
      input.style.display = 'none';
      document.body.appendChild(input);

      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const scroll = getScrollOffset();
          createInsertedImage(100 + scroll.x, 200 + scroll.y, 320, 240, ev.target.result);
          NativeBridge.vibrate(1);
          showToast('Image inserted! Drag & resize with your fingers');
        };
        reader.readAsDataURL(file);
      });
    }
    input.click();
  }

  function createInsertedImage(x, y, w, h, src, id) {
    const doc = state.activeDoc || document;
    const container = doc.body;
    if (!container) return;

    const imgId = id || 'img_' + Date.now();
    const card = doc.createElement('div');
    card.className = 'spen-inserted-image';
    card.id = imgId;
    card.style.left = (x || 50) + 'px';
    card.style.top = (y || 100) + 'px';
    card.style.width = (w || 300) + 'px';
    card.style.height = (h || 200) + 'px';

    card.innerHTML = `
      <div class="spen-image-header">
        <span style="font-size:11px;font-weight:700;"><i class="fa-solid fa-image"></i> Photo</span>
        <button type="button" class="spen-image-btn del" title="Delete Image"><i class="fa-solid fa-trash-can"></i></button>
      </div>
      <img src="${src}" class="spen-inserted-img-el" alt="Inserted Note Image">
      <div class="spen-image-resize-handle" title="Drag to Resize"></div>
    `;

    container.appendChild(card);

    const delBtn = card.querySelector('.del');
    const header = card.querySelector('.spen-image-header');
    const resizeHandle = card.querySelector('.spen-image-resize-handle');

    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      card.remove();
      syncImagesData();
      debounceSave();
      NativeBridge.vibrate(1);
    });

    makeDraggable(card, header, () => {
      syncImagesData();
      debounceSave();
    });

    makeResizable(card, resizeHandle, () => {
      syncImagesData();
      debounceSave();
    });

    syncImagesData();
    debounceSave();
  }

  function syncImagesData() {
    const doc = state.activeDoc || document;
    const imgs = [];
    doc.querySelectorAll('.spen-inserted-image').forEach((el) => {
      const img = el.querySelector('img');
      imgs.push({
        id: el.id,
        x: parseInt(el.style.left) || 0,
        y: parseInt(el.style.top) || 0,
        w: parseInt(el.style.width) || 300,
        h: parseInt(el.style.height) || 200,
        src: img ? img.src : '',
      });
    });
    state.insertedImages = imgs;
  }

  function makeResizable(element, handle, onEnd) {
    handle.onpointerdown = function (e) {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX;
      const startY = e.clientY;
      const startW = element.offsetWidth;
      const startH = element.offsetHeight;

      function onMove(ev) {
        ev.preventDefault();
        const nw = Math.max(100, startW + (ev.clientX - startX));
        const nh = Math.max(70, startH + (ev.clientY - startY));
        element.style.width = nw + 'px';
        element.style.height = nh + 'px';
      }

      function onUp() {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        if (onEnd) onEnd();
      }

      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    };
  }

  // =========================================================================
  // 9. LASSO SELECTION TOOL
  // =========================================================================
  function startLassoSelection(pt) {
    clearLassoSelection();
    state.lasso.isSelecting = true;
    state.lasso.loopPoints = [pt];
  }

  function continueLassoSelection(pt) {
    state.lasso.loopPoints.push(pt);
    drawLassoMarquee();
  }

  function drawLassoMarquee() {
    const ctx = state.ctx;
    if (!ctx) return;
    redrawViewport();

    const pts = state.lasso.loopPoints;
    if (pts.length < 2) return;

    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pts[0].screenX, pts[0].screenY);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].screenX, pts[i].screenY);
    }
    ctx.stroke();
    ctx.restore();
  }

  function finishLassoSelection() {
    state.lasso.isSelecting = false;
    const loop = state.lasso.loopPoints;
    if (loop.length < 4) {
      redrawViewport();
      return;
    }

    const selected = [];
    for (let s = 0; s < state.strokes.length; s++) {
      const stroke = state.strokes[s];
      const midPt = stroke.points[Math.floor(stroke.points.length / 2)];
      if (isPointInPolygon(midPt.docX, midPt.docY, loop)) {
        selected.push(stroke);
      }
    }

    if (selected.length === 0) {
      redrawViewport();
      showToast('No strokes selected');
      return;
    }

    state.lasso.selectedStrokes = selected;
    NativeBridge.vibrate(2);
    createLassoBox(selected);
  }

  function isPointInPolygon(x, y, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i].docX, yi = poly[i].docY;
      const xj = poly[j].docX, yj = poly[j].docY;
      const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function createLassoBox(strokes) {
    redrawViewport();
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    strokes.forEach((s) => {
      s.points.forEach((p) => {
        if (p.docX < minX) minX = p.docX;
        if (p.docY < minY) minY = p.docY;
        if (p.docX > maxX) maxX = p.docX;
        if (p.docY > maxY) maxY = p.docY;
      });
    });

    const doc = state.activeDoc || document;
    const pad = 12;
    const box = doc.createElement('div');
    box.className = 'spen-lasso-box';
    box.style.left = (minX - pad) + 'px';
    box.style.top = (minY - pad) + 'px';
    box.style.width = (maxX - minX + pad * 2) + 'px';
    box.style.height = (maxY - minY + pad * 2) + 'px';

    box.innerHTML = `
      <div class="spen-lasso-toolbar">
        <button type="button" class="spen-lasso-btn" id="spenLassoColor" title="Change Color"><i class="fa-solid fa-palette"></i></button>
        <button type="button" class="spen-lasso-btn del" id="spenLassoDel" title="Delete Selected"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    `;

    doc.body.appendChild(box);
    state.lasso.boxEl = box;

    box.querySelector('#spenLassoDel').addEventListener('click', (e) => {
      e.stopPropagation();
      strokes.forEach((s) => {
        const idx = state.strokes.indexOf(s);
        if (idx !== -1) state.strokes.splice(idx, 1);
      });
      clearLassoSelection();
      redrawViewport();
      debounceSave();
      showToast('Selected ink deleted');
    });

    box.querySelector('#spenLassoColor').addEventListener('click', (e) => {
      e.stopPropagation();
      strokes.forEach((s) => {
        s.color = state.penColor;
      });
      redrawViewport();
      debounceSave();
      showToast('Selected ink color updated');
    });

    makeLassoDraggable(box, strokes);
  }

  function makeLassoDraggable(box, strokes) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    box.onpointerdown = dragMouseDown;

    function dragMouseDown(e) {
      if (e.target.closest('button')) return;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onpointerup = closeDragElement;
      document.onpointermove = elementDrag;
    }

    function elementDrag(e) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      box.style.top = (box.offsetTop - pos2) + 'px';
      box.style.left = (box.offsetLeft - pos1) + 'px';

      strokes.forEach((s) => {
        s.points.forEach((p) => {
          p.docX -= pos1;
          p.docY -= pos2;
        });
        s.minX -= pos1;
        s.maxX -= pos1;
        s.minY -= pos2;
        s.maxY -= pos2;
      });
      redrawViewport();
    }

    function closeDragElement() {
      document.onpointerup = null;
      document.onpointermove = null;
      debounceSave();
    }
  }

  function clearLassoSelection() {
    if (state.lasso.boxEl) {
      state.lasso.boxEl.remove();
      state.lasso.boxEl = null;
    }
    state.lasso.selectedStrokes = [];
    state.lasso.loopPoints = [];
  }

  // =========================================================================
  // 10. STICKY NOTES ON PAGE (5 Noteshelf Pastel Colors)
  // =========================================================================
  function createStickyNote(x, y, text, id, colorClass) {
    const doc = state.activeDoc || document;
    const container = doc.body;
    if (!container) return;

    const colors = ['', 'color-pink', 'color-green', 'color-purple', 'color-blue'];
    const chosenColor = colorClass || colors[Math.floor(Math.random() * colors.length)];

    const noteId = id || 'sticky_' + Date.now();
    const noteEl = doc.createElement('div');
    noteEl.className = 'spen-sticky-note ' + chosenColor;
    noteEl.id = noteId;
    noteEl.style.left = Math.max(10, x - 20) + 'px';
    noteEl.style.top = Math.max(10, y - 20) + 'px';

    noteEl.innerHTML = `
      <div class="spen-sticky-header">
        <span class="spen-sticky-title"><i class="fa-solid fa-thumbtack"></i> Memo</span>
        <div class="spen-sticky-actions">
          <button type="button" class="spen-sticky-icon-btn spen-sticky-min" title="Collapse"><i class="fa-solid fa-compress"></i></button>
          <button type="button" class="spen-sticky-icon-btn spen-sticky-del" title="Delete"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </div>
      <textarea class="spen-sticky-textarea" placeholder="Write law memo with S-Pen or keyboard...">${text ? escapeHtml(text) : ''}</textarea>
    `;

    container.appendChild(noteEl);

    const textarea = noteEl.querySelector('.spen-sticky-textarea');
    const delBtn = noteEl.querySelector('.spen-sticky-del');
    const minBtn = noteEl.querySelector('.spen-sticky-min');
    const header = noteEl.querySelector('.spen-sticky-header');

    textarea.addEventListener('input', () => {
      syncStickyData();
      debounceSave();
    });

    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      noteEl.remove();
      syncStickyData();
      debounceSave();
      NativeBridge.vibrate(1);
    });

    minBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      noteEl.classList.toggle('collapsed');
      if (noteEl.classList.contains('collapsed')) {
        noteEl.innerHTML = '<i class="fa-solid fa-thumbtack"></i>';
      } else {
        noteEl.remove();
        createStickyNote(parseInt(noteEl.style.left), parseInt(noteEl.style.top), textarea.value, noteId, chosenColor);
      }
    });

    makeDraggable(noteEl, header, () => {
      syncStickyData();
      debounceSave();
    });

    syncStickyData();
    debounceSave();
  }

  function syncStickyData() {
    const doc = state.activeDoc || document;
    const notes = [];
    doc.querySelectorAll('.spen-sticky-note').forEach((el) => {
      const textarea = el.querySelector('.spen-sticky-textarea');
      let color = '';
      if (el.classList.contains('color-pink')) color = 'color-pink';
      if (el.classList.contains('color-green')) color = 'color-green';
      if (el.classList.contains('color-purple')) color = 'color-purple';
      if (el.classList.contains('color-blue')) color = 'color-blue';

      notes.push({
        id: el.id,
        x: parseInt(el.style.left) || 0,
        y: parseInt(el.style.top) || 0,
        text: textarea ? textarea.value : '',
        collapsed: el.classList.contains('collapsed'),
        color: color,
      });
    });
    state.stickyNotes = notes;
    updateToolbarCounters();
  }

  function makeDraggable(element, handle, onEnd) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    (handle || element).onpointerdown = dragMouseDown;

    function dragMouseDown(e) {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onpointerup = closeDragElement;
      document.onpointermove = elementDrag;
    }

    function elementDrag(e) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      element.style.top = Math.max(10, element.offsetTop - pos2) + 'px';
      element.style.left = Math.max(10, element.offsetLeft - pos1) + 'px';
    }

    function closeDragElement() {
      document.onpointerup = null;
      document.onpointermove = null;
      if (onEnd) onEnd();
    }
  }

  // =========================================================================
  // 11. SAVE & LOAD DATA & THUMBNAILS
  // =========================================================================
  function debounceSave() {
    clearTimeout(state.saveTimeout);
    state.saveTimeout = setTimeout(() => {
      savePageData();
    }, 600);
  }

  function savePageData() {
    if (!state.currentPageId) return;

    const data = {
      version: 4,
      pageId: state.currentPageId,
      title: state.currentPageTitle,
      subject: state.currentPageSubject,
      updatedAt: Date.now(),
      strokes: state.strokes,
      stickyNotes: state.stickyNotes,
      insertedImages: state.insertedImages,
    };

    NativeBridge.save(state.currentPageId, state.currentPageTitle, state.currentPageSubject, data);
    generateAndSaveThumbnail(state.currentPageId);
    console.log('[SPenEngine] Saved notes for:', state.currentPageTitle, `(${state.strokes.length} strokes)`);
  }

  function generateAndSaveThumbnail(pageId) {
    if (!state.canvas || state.strokes.length === 0) return;
    try {
      const thumbCanvas = document.createElement('canvas');
      thumbCanvas.width = 240;
      thumbCanvas.height = 120;
      const tCtx = thumbCanvas.getContext('2d');
      tCtx.fillStyle = '#0f172a';
      tCtx.fillRect(0, 0, 240, 120);

      tCtx.drawImage(state.canvas, 0, 0, state.canvas.width, state.canvas.height, 0, 0, 240, 120);

      const thumbUrl = thumbCanvas.toDataURL('image/jpeg', 0.6);
      NativeBridge.saveThumb(pageId, thumbUrl);
    } catch (_) {}
  }

  function loadPageData(pageId) {
    state.strokes = [];
    state.stickyNotes = [];
    state.insertedImages = [];
    state.undoStack = [];
    state.redoStack = [];

    const data = NativeBridge.load(pageId);
    if (data) {
      if (data.strokes && Array.isArray(data.strokes)) {
        state.strokes = data.strokes;
      }
      if (data.stickyNotes && Array.isArray(data.stickyNotes)) {
        data.stickyNotes.forEach((n) => createStickyNote(n.x, n.y, n.text, n.id, n.color));
      }
      if (data.insertedImages && Array.isArray(data.insertedImages)) {
        data.insertedImages.forEach((img) => createInsertedImage(img.x, img.y, img.w, img.h, img.src, img.id));
      }
      console.log('[SPenEngine] Loaded notes for:', pageId, `(${state.strokes.length} strokes)`);
    }

    redrawViewport();
    updateToolbarCounters();
  }

  // =========================================================================
  // 12. FLOATING SAMSUNG S-PEN TOOLBAR UI
  // =========================================================================
  function createToolbar() {
    if (document.getElementById('spenToolbarContainer')) return;

    const bar = document.createElement('div');
    bar.id = 'spenToolbarContainer';
    bar.className = 'spen-toolbar-container';

    bar.innerHTML = `
      <div class="spen-drag-handle" id="spenDragHandle" title="Drag Toolbar">
        <i class="fa-solid fa-grip-vertical"></i>
      </div>

      <div class="spen-status-pill no-stylus" id="spenStatusPill" title="Stylus Digitizer Status">
        <i class="fa-solid fa-hand-pointer"></i> <span>Touch</span>
      </div>

      <!-- Pen Arsenal Selector -->
      <button type="button" class="spen-btn active" id="spenToolPen" title="Pen & Pencil Styles (Noteshelf 3)">
        <i class="fa-solid fa-pen-nib" id="spenMainPenIcon"></i>
        <span class="spen-color-dot" id="spenPenDot" style="background:#0f172a;"></span>
      </button>

      <!-- Chisel Highlighter -->
      <button type="button" class="spen-btn" id="spenToolHighlighter" title="Chisel Highlighter">
        <i class="fa-solid fa-highlighter"></i>
        <span class="spen-color-dot" id="spenHighDot" style="background:#facc15;"></span>
      </button>

      <!-- Eraser Tool -->
      <button type="button" class="spen-btn" id="spenToolEraser" title="Stroke Eraser (Hold S-Pen button to erase)">
        <i class="fa-solid fa-eraser"></i>
      </button>

      <!-- Noteshelf Auto-Shapes -->
      <button type="button" class="spen-btn" id="spenToolShapes" title="Shapes Tool (Lines, Rectangles, Arrows)">
        <i class="fa-solid fa-shapes"></i>
      </button>

      <!-- Add Image / Photo -->
      <button type="button" class="spen-btn" id="spenToolAddImage" title="Insert Image / Diagram (Noteshelf 3)">
        <i class="fa-solid fa-image"></i>
      </button>

      <!-- Sticky Memo -->
      <button type="button" class="spen-btn" id="spenToolSticky" title="Add Sticky Memo">
        <i class="fa-solid fa-note-sticky"></i>
      </button>

      <!-- Lasso Selection Tool -->
      <button type="button" class="spen-btn" id="spenToolLasso" title="Lasso Selection (Circle notes to move/recolor)">
        <i class="fa-solid fa-wand-magic-sparkles"></i>
      </button>

      <div class="spen-divider"></div>

      <!-- Undo / Redo -->
      <button type="button" class="spen-btn" id="spenBtnUndo" title="Undo Stroke">
        <i class="fa-solid fa-rotate-left"></i>
      </button>
      <button type="button" class="spen-btn" id="spenBtnRedo" title="Redo Stroke">
        <i class="fa-solid fa-rotate-right"></i>
      </button>

      <!-- Palm Rejection Mode (Fingers Scroll vs Finger Draw) -->
      <button type="button" class="spen-btn active" id="spenBtnPalmRejection" title="Palm Rejection: ON (Fingers Scroll, ONLY S-Pen Draws)">
        <i class="fa-solid fa-hand"></i>
      </button>

      <!-- Hide/Show Markup Toggle -->
      <button type="button" class="spen-btn" id="spenBtnToggleEye" title="Show/Hide Handwritten Markup">
        <i class="fa-solid fa-eye" id="spenEyeIcon"></i>
      </button>

      <div class="spen-divider"></div>

      <!-- Consolidated Notes Hub (Master Law Hub) -->
      <button type="button" class="spen-btn" id="spenBtnNotesHub" title="My Consolidated Notes Hub" style="color:#f59e0b;">
        <i class="fa-solid fa-book-bookmark"></i>
      </button>

      <!-- Clear Page -->
      <button type="button" class="spen-btn" id="spenBtnClearPage" title="Clear Page Annotations">
        <i class="fa-solid fa-trash-can"></i>
      </button>

      <!-- Print / PDF -->
      <button type="button" class="spen-btn" id="spenBtnExport" title="Export or Print PDF">
        <i class="fa-solid fa-print"></i>
      </button>

      <!-- Minimize to bubble -->
      <button type="button" class="spen-btn" id="spenBtnMinimize" title="Minimize Toolbar">
        <i class="fa-solid fa-chevron-down"></i>
      </button>

      <!-- Pen Arsenal Popover -->
      <div class="spen-popover" id="spenPenPopover">
        <div class="spen-popover-title">Pen &amp; Pencil Arsenal</div>
        <div class="spen-pen-types-grid">
          <div class="spen-pen-type-card active" data-pen="fountain">
            <i class="fa-solid fa-pen-nib"></i>
            <span>Fountain</span>
          </div>
          <div class="spen-pen-type-card" data-pen="ballpoint">
            <i class="fa-solid fa-pen"></i>
            <span>Studio</span>
          </div>
          <div class="spen-pen-type-card" data-pen="pencil">
            <i class="fa-solid fa-pencil"></i>
            <span>Graphite</span>
          </div>
          <div class="spen-pen-type-card" data-pen="marker">
            <i class="fa-solid fa-marker"></i>
            <span>Felt Tip</span>
          </div>
        </div>

        <div class="spen-popover-title">Ink Colors</div>
        <div class="spen-colors-grid">
          ${PEN_COLORS.map(
            (c, i) =>
              `<div class="spen-color-swatch ${i === 0 ? 'active' : ''}" data-color="${c.value}" style="background:${c.value};" title="${c.name}"></div>`
          ).join('')}
        </div>
        <div class="spen-custom-color-wrap">
          <input type="color" class="spen-custom-color-input" id="spenCustomPenColor" value="#0f172a" title="Custom Color Wheel">
          <span style="font-size:11px;color:rgba(255,255,255,0.7);">Custom Ink Palette</span>
        </div>

        <div class="spen-popover-title" style="margin-top:10px;">Stroke Width</div>
        <div class="spen-sizes-grid">
          <div class="spen-size-btn" data-size="1.8" title="Fine"><div class="spen-size-preview-dot" style="width:3px;height:3px;"></div></div>
          <div class="spen-size-btn active" data-size="3.5" title="Medium"><div class="spen-size-preview-dot" style="width:6px;height:6px;"></div></div>
          <div class="spen-size-btn" data-size="6.0" title="Bold"><div class="spen-size-preview-dot" style="width:10px;height:10px;"></div></div>
          <div class="spen-size-btn" data-size="10.0" title="Heavy"><div class="spen-size-preview-dot" style="width:14px;height:14px;"></div></div>
        </div>
      </div>

      <!-- Highlighter Popover -->
      <div class="spen-popover" id="spenHighPopover">
        <div class="spen-popover-title">Chisel Highlighter Tones</div>
        <div class="spen-colors-grid">
          ${HIGHLIGHTER_COLORS.map(
            (c, i) =>
              `<div class="spen-color-swatch ${i === 0 ? 'active' : ''}" data-high-color="${c.value}" style="background:${c.value.replace('0.45', '1')};" title="${c.name}"></div>`
          ).join('')}
        </div>
        <div class="spen-popover-title" style="margin-top:8px;">Chisel Width</div>
        <div class="spen-sizes-grid">
          <div class="spen-size-btn" data-high-size="16" title="Single Line"><div class="spen-size-preview-dot" style="width:14px;height:6px;border-radius:2px;"></div></div>
          <div class="spen-size-btn active" data-high-size="24" title="Standard"><div class="spen-size-preview-dot" style="width:20px;height:10px;border-radius:2px;"></div></div>
          <div class="spen-size-btn" data-high-size="36" title="Header"><div class="spen-size-preview-dot" style="width:28px;height:14px;border-radius:2px;"></div></div>
        </div>
      </div>

      <!-- Shapes Popover -->
      <div class="spen-popover" id="spenShapesPopover">
        <div class="spen-popover-title">Auto-Shape Tools</div>
        <div class="spen-shapes-grid">
          <div class="spen-shape-btn active" data-shape="line" title="Straight Rule Line"><i class="fa-solid fa-minus"></i></div>
          <div class="spen-shape-btn" data-shape="rect" title="Rectangle Box"><i class="fa-regular fa-square"></i></div>
          <div class="spen-shape-btn" data-shape="circle" title="Circle / Oval"><i class="fa-regular fa-circle"></i></div>
          <div class="spen-shape-btn" data-shape="arrow" title="Arrow"><i class="fa-solid fa-arrow-right"></i></div>
          <div class="spen-shape-btn" data-shape="triangle" title="Triangle"><i class="fa-solid fa-play" style="transform:rotate(-90deg);"></i></div>
        </div>
      </div>
    `;

    document.body.appendChild(bar);
    setupToolbarEvents(bar);
  }

  function setupToolbarEvents(bar) {
    const btnPen = bar.querySelector('#spenToolPen');
    const btnHigh = bar.querySelector('#spenToolHighlighter');
    const btnEraser = bar.querySelector('#spenToolEraser');
    const btnShapes = bar.querySelector('#spenToolShapes');
    const btnAddImage = bar.querySelector('#spenToolAddImage');
    const btnSticky = bar.querySelector('#spenToolSticky');
    const btnLasso = bar.querySelector('#spenToolLasso');
    const btnUndo = bar.querySelector('#spenBtnUndo');
    const btnRedo = bar.querySelector('#spenBtnRedo');
    const btnPalm = bar.querySelector('#spenBtnPalmRejection');
    const btnEye = bar.querySelector('#spenBtnToggleEye');
    const btnHub = bar.querySelector('#spenBtnNotesHub');
    const btnClear = bar.querySelector('#spenBtnClearPage');
    const btnExport = bar.querySelector('#spenBtnExport');
    const btnMin = bar.querySelector('#spenBtnMinimize');

    const penPopover = bar.querySelector('#spenPenPopover');
    const highPopover = bar.querySelector('#spenHighPopover');
    const shapesPopover = bar.querySelector('#spenShapesPopover');

    btnPen.addEventListener('click', () => {
      NativeBridge.vibrate(1);
      if (state.activeTool === state.penType) {
        penPopover.classList.toggle('active');
        highPopover.classList.remove('active');
        shapesPopover.classList.remove('active');
      } else {
        setTool(state.penType || 'fountain');
        closeAllPopovers();
      }
    });

    btnHigh.addEventListener('click', () => {
      NativeBridge.vibrate(1);
      if (state.activeTool === 'highlighter') {
        highPopover.classList.toggle('active');
        penPopover.classList.remove('active');
        shapesPopover.classList.remove('active');
      } else {
        setTool('highlighter');
        closeAllPopovers();
      }
    });

    btnEraser.addEventListener('click', () => {
      NativeBridge.vibrate(1);
      setTool('eraser');
      closeAllPopovers();
    });

    btnShapes.addEventListener('click', () => {
      NativeBridge.vibrate(1);
      state.shapeModeActive = !state.shapeModeActive;
      if (state.shapeModeActive) {
        shapesPopover.classList.toggle('active');
        penPopover.classList.remove('active');
        highPopover.classList.remove('active');
        btnShapes.classList.add('active');
        showToast('Auto-Shape Mode: ON');
      } else {
        shapesPopover.classList.remove('active');
        btnShapes.classList.remove('active');
        showToast('Auto-Shape Mode: OFF');
      }
    });

    btnAddImage.addEventListener('click', () => {
      NativeBridge.vibrate(1);
      closeAllPopovers();
      triggerImagePicker();
    });

    btnSticky.addEventListener('click', () => {
      NativeBridge.vibrate(1);
      setTool('sticky');
      closeAllPopovers();
      showToast('Tap with S-Pen anywhere on page to drop a sticky note');
    });

    btnLasso.addEventListener('click', () => {
      NativeBridge.vibrate(1);
      setTool('lasso');
      closeAllPopovers();
      showToast('Lasso Tool: Circle notes with S-Pen to move or recolor');
    });

    btnUndo.addEventListener('click', handleUndo);
    btnRedo.addEventListener('click', handleRedo);

    btnPalm.addEventListener('click', () => {
      state.stylusOnlyMode = !state.stylusOnlyMode;
      if (state.stylusOnlyMode) {
        btnPalm.classList.add('active');
        if (state.canvas) state.canvas.classList.remove('finger-draw-mode');
        showToast('Palm Rejection: ON (Fingers scroll naturally, ONLY S-Pen writes)');
      } else {
        btnPalm.classList.remove('active');
        if (state.canvas) state.canvas.classList.add('finger-draw-mode');
        showToast('Finger Drawing: Enabled');
      }
      NativeBridge.vibrate(1);
    });

    btnEye.addEventListener('click', () => {
      state.markupVisible = !state.markupVisible;
      const eyeIcon = bar.querySelector('#spenEyeIcon');
      const doc = state.activeDoc || document;
      if (state.markupVisible) {
        eyeIcon.className = 'fa-solid fa-eye';
        btnEye.classList.remove('active');
        if (state.canvas) state.canvas.classList.remove('spen-hidden');
        doc.querySelectorAll('.spen-sticky-note').forEach((el) => (el.style.display = ''));
        doc.querySelectorAll('.spen-inserted-image').forEach((el) => (el.style.display = ''));
        redrawViewport();
        showToast('Annotations Visible');
      } else {
        eyeIcon.className = 'fa-solid fa-eye-slash';
        btnEye.classList.add('active');
        if (state.canvas) state.canvas.classList.add('spen-hidden');
        doc.querySelectorAll('.spen-sticky-note').forEach((el) => (el.style.display = 'none'));
        doc.querySelectorAll('.spen-inserted-image').forEach((el) => (el.style.display = 'none'));
        showToast('Annotations Hidden (Reading Mode)');
      }
      NativeBridge.vibrate(1);
    });

    btnHub.addEventListener('click', () => {
      NativeBridge.vibrate(1);
      closeAllPopovers();
      openConsolidatedNotesHub();
    });

    btnClear.addEventListener('click', () => {
      NativeBridge.vibrate(1);
      clearAllPageNotes();
    });

    btnExport.addEventListener('click', () => {
      NativeBridge.vibrate(1);
      NativeBridge.printPdf(state.currentPageTitle || 'MakeLawEasy_StudyNotes');
    });

    btnMin.addEventListener('click', minimizeToolbar);

    penPopover.querySelectorAll('.spen-pen-type-card').forEach((card) => {
      card.addEventListener('click', () => {
        penPopover.querySelectorAll('.spen-pen-type-card').forEach((c) => c.classList.remove('active'));
        card.classList.add('active');
        state.penType = card.getAttribute('data-pen');
        setTool(state.penType);

        const icon = bar.querySelector('#spenMainPenIcon');
        if (state.penType === 'fountain') icon.className = 'fa-solid fa-pen-nib';
        else if (state.penType === 'pencil') icon.className = 'fa-solid fa-pencil';
        else if (state.penType === 'marker') icon.className = 'fa-solid fa-marker';
        else icon.className = 'fa-solid fa-pen';

        NativeBridge.vibrate(1);
        closeAllPopovers();
        showToast(state.penType.toUpperCase() + ' Pen Selected');
      });
    });

    penPopover.querySelectorAll('.spen-color-swatch').forEach((swatch) => {
      swatch.addEventListener('click', () => {
        penPopover.querySelectorAll('.spen-color-swatch').forEach((s) => s.classList.remove('active'));
        swatch.classList.add('active');
        state.penColor = swatch.getAttribute('data-color');
        bar.querySelector('#spenPenDot').style.background = state.penColor;
        NativeBridge.vibrate(1);
      });
    });

    const customColor = penPopover.querySelector('#spenCustomPenColor');
    if (customColor) {
      customColor.addEventListener('input', (e) => {
        state.penColor = e.target.value;
        bar.querySelector('#spenPenDot').style.background = state.penColor;
      });
    }

    penPopover.querySelectorAll('.spen-size-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        penPopover.querySelectorAll('.spen-size-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.penSize = parseFloat(btn.getAttribute('data-size'));
        NativeBridge.vibrate(1);
      });
    });

    highPopover.querySelectorAll('.spen-color-swatch').forEach((swatch) => {
      swatch.addEventListener('click', () => {
        highPopover.querySelectorAll('.spen-color-swatch').forEach((s) => s.classList.remove('active'));
        swatch.classList.add('active');
        state.highlighterColor = swatch.getAttribute('data-high-color');
        bar.querySelector('#spenHighDot').style.background = swatch.style.background;
        NativeBridge.vibrate(1);
      });
    });

    highPopover.querySelectorAll('.spen-size-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        highPopover.querySelectorAll('.spen-size-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.highlighterSize = parseFloat(btn.getAttribute('data-high-size'));
        NativeBridge.vibrate(1);
      });
    });

    shapesPopover.querySelectorAll('.spen-shape-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        shapesPopover.querySelectorAll('.spen-shape-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeShape = btn.getAttribute('data-shape');
        state.shapeModeActive = true;
        bar.querySelector('#spenToolShapes').classList.add('active');
        NativeBridge.vibrate(1);
        closeAllPopovers();
        showToast('Auto-Shape: ' + state.activeShape.toUpperCase());
      });
    });

    makeDraggable(bar, bar.querySelector('#spenDragHandle'));
  }

  function setTool(toolName) {
    state.activeTool = toolName;
    const bar = document.getElementById('spenToolbarContainer');
    if (!bar) return;

    bar.querySelectorAll('.spen-btn').forEach((b) => b.classList.remove('active'));

    if (toolName === 'fountain' || toolName === 'ballpoint' || toolName === 'pencil' || toolName === 'marker') {
      bar.querySelector('#spenToolPen')?.classList.add('active');
    }
    if (toolName === 'highlighter') bar.querySelector('#spenToolHighlighter')?.classList.add('active');
    if (toolName === 'eraser') bar.querySelector('#spenToolEraser')?.classList.add('active');
    if (toolName === 'lasso') bar.querySelector('#spenToolLasso')?.classList.add('active');
    if (toolName === 'sticky') bar.querySelector('#spenToolSticky')?.classList.add('active');
  }

  function closeAllPopovers() {
    document.querySelectorAll('.spen-popover').forEach((p) => p.classList.remove('active'));
  }

  function minimizeToolbar() {
    const bar = document.getElementById('spenToolbarContainer');
    if (!bar) return;

    closeAllPopovers();
    bar.innerHTML = `
      <div class="spen-fab-btn" id="spenFabBtn" title="Open S-Pen Notes Suite">
        <i class="fa-solid fa-pen-nib"></i>
        <span class="spen-fab-badge" id="spenFabBadge">${state.strokes.length}</span>
      </div>
    `;
    bar.classList.add('is-minimized');

    bar.querySelector('#spenFabBtn').addEventListener('click', () => {
      NativeBridge.vibrate(1);
      bar.remove();
      createToolbar();
      updateToolbarCounters();
    });
  }

  function updateToolbarCounters() {
    const badge = document.getElementById('spenFabBadge');
    if (badge) {
      const total = state.strokes.length + state.stickyNotes.length + state.insertedImages.length;
      badge.textContent = total;
      badge.style.display = total > 0 ? 'block' : 'none';
    }
  }

  function handleUndo() {
    if (state.undoStack.length === 0) return;
    const action = state.undoStack.pop();
    state.redoStack.push(action);

    if (action.type === 'add_stroke') {
      const idx = state.strokes.indexOf(action.stroke);
      if (idx !== -1) state.strokes.splice(idx, 1);
    } else if (action.type === 'delete_stroke') {
      state.strokes.push(action.stroke);
    }

    NativeBridge.vibrate(1);
    redrawViewport();
    updateToolbarCounters();
    debounceSave();
  }

  function handleRedo() {
    if (state.redoStack.length === 0) return;
    const action = state.redoStack.pop();
    state.undoStack.push(action);

    if (action.type === 'add_stroke') {
      state.strokes.push(action.stroke);
    } else if (action.type === 'delete_stroke') {
      const idx = state.strokes.indexOf(action.stroke);
      if (idx !== -1) state.strokes.splice(idx, 1);
    }

    NativeBridge.vibrate(1);
    redrawViewport();
    updateToolbarCounters();
    debounceSave();
  }

  // =========================================================================
  // 13. CONSOLIDATED NOTES HUB 2.0 (Tablet Modal)
  // =========================================================================
  function openConsolidatedNotesHub() {
    let overlay = document.getElementById('spenHubOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'spenHubOverlay';
      overlay.className = 'spen-hub-overlay';
      document.body.appendChild(overlay);
    }

    const allNotes = NativeBridge.getAllIndex();
    const totalTopics = allNotes.length;
    let totalStrokes = 0;
    let totalStickies = 0;
    allNotes.forEach((n) => {
      totalStrokes += n.strokeCount || 0;
      totalStickies += n.stickyCount || 0;
    });

    const subjects = ['All'];
    allNotes.forEach((n) => {
      if (n.subject && !subjects.includes(n.subject)) subjects.push(n.subject);
    });

    overlay.innerHTML = `
      <div class="spen-hub-modal">
        <div class="spen-hub-header">
          <div class="spen-hub-title-group">
            <div class="spen-hub-crest"><i class="fa-solid fa-feather-pointed"></i></div>
            <div>
              <h2>Consolidated Notes Hub 2.0</h2>
              <p>Handwritten S-Pen annotations, diagrams &amp; memos consolidated across Delhi University LL.B.</p>
            </div>
          </div>
          <div class="spen-hub-header-actions">
            <button type="button" class="spen-hub-action-btn" id="spenHubBackupBtn" title="Backup all notes to .mle-notes file">
              <i class="fa-solid fa-download"></i> <span>Backup</span>
            </button>
            <button type="button" class="spen-hub-action-btn" id="spenHubRestoreBtn" title="Restore notes from file">
              <i class="fa-solid fa-upload"></i> <span>Restore</span>
            </button>
            <input type="file" id="spenBackupFileInput" accept=".mle-notes,.json" style="display:none;">
            <button type="button" class="spen-hub-close-btn" id="spenHubCloseBtn" title="Close (Esc)">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <div class="spen-hub-metrics">
          <div class="spen-metric-item">
            <i class="fa-solid fa-book-open-reader"></i>
            <div>
              <div class="spen-metric-num">${totalTopics}</div>
              <div class="spen-metric-lbl">Topics Annotated</div>
            </div>
          </div>
          <div class="spen-metric-item">
            <i class="fa-solid fa-signature"></i>
            <div>
              <div class="spen-metric-num">${totalStrokes}</div>
              <div class="spen-metric-lbl">S-Pen Strokes Written</div>
            </div>
          </div>
          <div class="spen-metric-item">
            <i class="fa-solid fa-note-sticky"></i>
            <div>
              <div class="spen-metric-num">${totalStickies}</div>
              <div class="spen-metric-lbl">Sticky Memos &amp; Photos</div>
            </div>
          </div>
          <div class="spen-metric-item">
            <i class="fa-solid fa-shield-halved"></i>
            <div>
              <div class="spen-metric-num">100%</div>
              <div class="spen-metric-lbl">Offline Secured</div>
            </div>
          </div>
        </div>

        <div class="spen-hub-controls">
          <div class="spen-hub-search-row">
            <div class="spen-hub-search-wrap">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" class="spen-hub-search-input" id="spenHubSearchInput" placeholder="Search annotated topics, subjects, or keywords...">
            </div>
          </div>
          <div class="spen-hub-filter-pills" id="spenHubFilterPills">
            ${subjects
              .map(
                (sub, i) =>
                  `<button type="button" class="spen-hub-pill ${i === 0 ? 'active' : ''}" data-sub="${escapeHtml(sub)}">${escapeHtml(sub)}</button>`
              )
              .join('')}
          </div>
        </div>

        <div class="spen-hub-content" id="spenHubCardsGrid">
          ${renderNotesListHtml(allNotes)}
        </div>
      </div>
    `;

    overlay.classList.add('active');

    overlay.querySelector('#spenHubCloseBtn').addEventListener('click', closeConsolidatedNotesHub);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeConsolidatedNotesHub();
    });

    overlay.querySelector('#spenHubBackupBtn').addEventListener('click', () => {
      NativeBridge.exportBackup();
    });

    const fileInput = overlay.querySelector('#spenBackupFileInput');
    overlay.querySelector('#spenHubRestoreBtn').addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        NativeBridge.importBackup(ev.target.result);
      };
      reader.readAsText(file);
    });

    let activeSubject = 'All';
    overlay.querySelectorAll('.spen-hub-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        overlay.querySelectorAll('.spen-hub-pill').forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        activeSubject = pill.getAttribute('data-sub');
        filterHubCards();
      });
    });

    const searchInput = overlay.querySelector('#spenHubSearchInput');
    searchInput.addEventListener('input', filterHubCards);

    function filterHubCards() {
      const q = searchInput.value.toLowerCase().trim();
      const filtered = allNotes.filter((n) => {
        const matchesSub = activeSubject === 'All' || n.subject === activeSubject;
        const matchesQ =
          !q ||
          (n.title && n.title.toLowerCase().includes(q)) ||
          (n.subject && n.subject.toLowerCase().includes(q));
        return matchesSub && matchesQ;
      });
      overlay.querySelector('#spenHubCardsGrid').innerHTML = renderNotesListHtml(filtered);
      attachCardActionEvents(overlay);
    }

    attachCardActionEvents(overlay);
  }

  function renderNotesListHtml(notes) {
    if (!notes || notes.length === 0) {
      return `
        <div class="spen-hub-empty">
          <i class="fa-solid fa-pen-ruler"></i>
          <h3>No Consolidated Notes Yet</h3>
          <p>Open any subject or unit from your syllabus, grab your Samsung Pencil, and start writing notes! All your handwriting, diagrams, and memos consolidate right here.</p>
        </div>
      `;
    }

    return notes
      .map((n) => {
        const thumb = NativeBridge.getThumb(n.pageId);
        const thumbHtml = thumb
          ? `<img src="${thumb}" class="spen-note-thumb-img" alt="Notes thumbnail">`
          : `<i class="fa-solid fa-signature spen-note-thumb-placeholder"></i>`;

        return `
      <div class="spen-note-card" data-page-id="${n.pageId}">
        <div class="spen-note-card-header">
          <span class="spen-note-sub-badge">${escapeHtml(n.subject || 'LL.B. Subject')}</span>
          <span class="spen-note-date">${formatRelativeTime(n.timestamp)}</span>
        </div>
        <h4 class="spen-note-card-title">${escapeHtml(n.title || 'Comprehensive Topic Notes')}</h4>
        
        <div class="spen-note-thumbnail-wrap">
          ${thumbHtml}
        </div>

        <div class="spen-note-stats">
          <span><i class="fa-solid fa-pen-fancy"></i> ${n.strokeCount || 0} strokes</span>
          <span><i class="fa-solid fa-note-sticky"></i> ${n.stickyCount || 0} items</span>
        </div>
        <div class="spen-note-card-footer">
          <button type="button" class="spen-card-open-btn" data-action="open" data-page-id="${n.pageId}">
            <i class="fa-solid fa-arrow-right-to-bracket"></i> <span>Open</span>
          </button>
          <button type="button" class="spen-card-icon-btn" data-action="export" data-page-id="${n.pageId}" title="Export Image">
            <i class="fa-solid fa-arrow-up-from-bracket"></i>
          </button>
          <button type="button" class="spen-card-icon-btn del" data-action="delete" data-page-id="${n.pageId}" title="Delete Notes">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
      })
      .join('');
  }

  function attachCardActionEvents(overlay) {
    overlay.querySelectorAll('.spen-note-card').forEach((card) => {
      const pageId = card.getAttribute('data-page-id');

      const openBtn = card.querySelector('[data-action="open"]');
      if (openBtn) {
        openBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          closeConsolidatedNotesHub();
          openTopicByPageId(pageId);
        });
      }

      const expBtn = card.querySelector('[data-action="export"]');
      if (expBtn) {
        expBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const thumb = NativeBridge.getThumb(pageId);
          if (thumb) {
            NativeBridge.exportImage(thumb, 'MakeLawEasy_AnnotatedNote_' + pageId);
          } else {
            showToast('Open the topic to export in full resolution');
          }
        });
      }

      const delBtn = card.querySelector('[data-action="delete"]');
      if (delBtn) {
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm('Delete all handwritten notes and annotations for this topic?')) {
            NativeBridge.deleteNote(pageId);
            card.remove();
            showToast('Topic annotations cleared');
            if (state.currentPageId === pageId) {
              state.strokes = [];
              state.stickyNotes = [];
              state.insertedImages = [];
              redrawViewport();
              updateToolbarCounters();
            }
          }
        });
      }
    });
  }

  function closeConsolidatedNotesHub() {
    const overlay = document.getElementById('spenHubOverlay');
    if (overlay) overlay.classList.remove('active');
  }

  function openTopicByPageId(pageId) {
    showToast('Loading topic annotations...');
    const allNotes = NativeBridge.getAllIndex();
    const target = allNotes.find((n) => n.pageId === pageId);
    if (target) {
      if (typeof window.openReader === 'function') {
        window.openReader(target.fileUrl || '', target.title, target.subject);
      } else {
        showToast('Topic ready: ' + target.title);
      }
    }
  }

  // =========================================================================
  // 14. TOAST NOTIFICATIONS
  // =========================================================================
  function showToast(msg) {
    let toast = document.getElementById('spenToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'spenToast';
      toast.className = 'spen-toast';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<i class="fa-solid fa-pen-nib"></i> <span>${escapeHtml(msg)}</span>`;
    toast.classList.add('active');

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('active');
    }, 2400);
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

  function formatRelativeTime(ts) {
    if (!ts) return '';
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return mins + 'm ago';
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + 'h ago';
    const days = Math.floor(hours / 24);
    if (days < 7) return days + 'd ago';
    return new Date(ts).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  }

  // =========================================================================
  // 15. LIFECYCLE INITIALIZATION
  // =========================================================================
  function initEngine() {
    createToolbar();
    ensureHoverRing();

    // Check active page/reader every 500ms without triggering DOM reflow
    setInterval(() => {
      attachCanvasToContext();
    }, 500);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllPopovers();
        closeConsolidatedNotesHub();
        clearLassoSelection();
      }
    });

    console.log('[SPenEngine] Samsung Zero-Lag Noteshelf 3 Suite ready.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEngine);
  } else {
    initEngine();
  }
})();
