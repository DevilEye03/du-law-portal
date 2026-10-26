/**
 * MAKE LAW EASY — SAMSUNG S-PEN & STYLUS ULTIMATE ENGINE (v1.2.0)
 * Best-in-class Samsung Notes-grade handwritten notes, strict palm rejection,
 * hold-to-snap shapes, lasso selection, split legal margin pad, air hover & consolidated hub.
 */
(function () {
  'use strict';

  if (window.__SPEN_ENGINE_INITIALIZED__) return;
  window.__SPEN_ENGINE_INITIALIZED__ = true;

  console.log('[SPenEngine] Initializing Ultimate S-Pen & Notes Suite v1.2.0...');

  // Configuration & Engine State
  const state = {
    activeTool: 'pen', // 'pen' | 'fountain' | 'highlighter' | 'eraser' | 'lasso' | 'sticky' | 'nav'
    previousTool: 'pen',
    penType: 'ballpoint', // 'ballpoint' | 'fountain'
    penColor: '#0f172a', // Onyx Black
    penSize: 3.0,
    highlighterColor: 'rgba(250, 204, 21, 0.45)', // Neon Yellow
    highlighterSize: 22.0,
    eraserMode: 'stroke', // 'stroke' | 'pixel'
    eraserSize: 24.0,
    stylusOnlyMode: true, // Palm Rejection: true = ONLY stylus writes, fingers scroll!
    markupVisible: true,
    holdToSnap: true, // Hold pen still at stroke end to snap into straight line / box
    isDrawing: false,
    currentStroke: null,
    strokes: [], // Canvas strokes array
    undoStack: [],
    redoStack: [],
    stickyNotes: [],
    isSpenDetected: false,
    currentPageId: '',
    currentPageTitle: '',
    currentPageSubject: '',
    canvas: null,
    ctx: null,
    canvasContainer: null,
    saveTimeout: null,

    // Hold-to-snap timer & tracker
    holdTimer: null,
    lastHoldPoint: null,

    // S-Pen Hardware Barrel Button
    isBarrelButtonActive: false,

    // Lasso Tool State
    lasso: {
      active: false,
      isSelecting: false,
      loopPoints: [],
      selectedStrokes: [],
      boxEl: null,
      startX: 0,
      startY: 0,
      origPositions: [],
    },

    // Split Legal Margin Notepad Drawer
    marginPad: {
      open: false,
      paperStyle: 'ruled', // 'ruled' | 'white' | 'grid' | 'dark'
      canvas: null,
      ctx: null,
      strokes: [],
      isDrawing: false,
      currentStroke: null,
    },
  };

  // Pre-configured Legal Scholar Ink Palettes
  const PEN_COLORS = [
    { name: 'Onyx Black', value: '#0f172a' },
    { name: 'Court Navy', value: '#1e3a8a' },
    { name: 'Crimson Ratio', value: '#b91c1c' },
    { name: 'Emerald Act', value: '#047857' },
    { name: 'Legal Amber', value: '#d97706' },
    { name: 'Royal Purple', value: '#6b21a8' },
    { name: 'Chalk White', value: '#f8fafc' },
  ];

  const HIGHLIGHTER_COLORS = [
    { name: 'Neon Yellow', value: 'rgba(250, 204, 21, 0.45)' },
    { name: 'Mint Precedent', value: 'rgba(52, 211, 153, 0.45)' },
    { name: 'Rose Doctrine', value: 'rgba(244, 114, 182, 0.45)' },
    { name: 'Sky Directive', value: 'rgba(56, 189, 248, 0.45)' },
    { name: 'Sunset Alert', value: 'rgba(251, 146, 60, 0.45)' },
  ];

  // Helper: MD5-like deterministic hash for page IDs
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
          (data.marginStrokes && data.marginStrokes.length > 0)
        ) {
          idx.unshift({
            pageId,
            title: title || 'Comprehensive Study Notes',
            subject: subject || 'Law Subject',
            timestamp: Date.now(),
            strokeCount: (data.strokes ? data.strokes.length : 0) + (data.marginStrokes ? data.marginStrokes.length : 0),
            stickyCount: data.stickyNotes ? data.stickyNotes.length : 0,
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
            version: 2,
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
  // 2. HARDWARE S-PEN & DIGITIZER HOVER ENGINE
  // =========================================================================
  let hoverRingEl = null;

  function ensureHoverRing() {
    if (!hoverRingEl) {
      hoverRingEl = document.createElement('div');
      hoverRingEl.className = 'spen-hover-ring';
      document.body.appendChild(hoverRingEl);
    }
  }

  // Hook for Native Android generic motion hover
  window.__onSpenHover = function (x, y, isButtonPressed) {
    setSpenDetected(true);
    ensureHoverRing();
    const size = Math.max(6, state.activeTool === 'highlighter' ? state.highlighterSize : state.penSize);
    hoverRingEl.style.width = size + 'px';
    hoverRingEl.style.height = size + 'px';
    hoverRingEl.style.left = x + 'px';
    hoverRingEl.style.top = y + 'px';
    hoverRingEl.classList.add('active');

    // Handle Barrel button state during hover
    if (isButtonPressed && !state.isBarrelButtonActive) {
      handleBarrelButtonDown();
    } else if (!isButtonPressed && state.isBarrelButtonActive) {
      handleBarrelButtonUp();
    }
  };

  window.__onSpenHoverExit = function () {
    if (hoverRingEl) hoverRingEl.classList.remove('active');
  };

  // Hook for Native Android touch stylus button
  window.__onSpenButtonState = function (isPressed) {
    if (isPressed && !state.isBarrelButtonActive) {
      handleBarrelButtonDown();
    } else if (!isPressed && state.isBarrelButtonActive) {
      handleBarrelButtonUp();
    }
  };

  function handleBarrelButtonDown() {
    state.isBarrelButtonActive = true;
    state.previousTool = state.activeTool;
    setTool('eraser');
    NativeBridge.vibrate(2);
    showToast('S-Pen Button: Eraser Active');
  }

  function handleBarrelButtonUp() {
    state.isBarrelButtonActive = false;
    setTool(state.previousTool || 'pen');
    NativeBridge.vibrate(1);
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

  // =========================================================================
  // 3. TARGET CONTEXT & CANVAS ATTACHMENT
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

    let existingCanvas = ctxInfo.container.querySelector('.spen-canvas-layer');
    if (existingCanvas && state.currentPageId === ctxInfo.pageId) {
      return;
    }

    state.currentPageId = ctxInfo.pageId;
    state.currentPageTitle = ctxInfo.title;
    state.currentPageSubject = ctxInfo.subject;

    if (ctxInfo.isReader) {
      injectIframeStyles(ctxInfo.doc);
    }

    if (existingCanvas) {
      existingCanvas.remove();
    }
    ctxInfo.container.querySelectorAll('.spen-sticky-note').forEach((el) => el.remove());

    const canvas = ctxInfo.doc.createElement('canvas');
    canvas.className = 'spen-canvas-layer';
    if (!state.markupVisible) canvas.classList.add('spen-hidden');
    if (state.activeTool === 'nav') canvas.classList.add('spen-nav-mode');

    if (getComputedStyle(ctxInfo.container).position === 'static') {
      ctxInfo.container.style.position = 'relative';
    }

    ctxInfo.container.appendChild(canvas);
    state.canvas = canvas;
    state.ctx = canvas.getContext('2d', { willReadFrequently: true });
    state.canvasContainer = ctxInfo.container;

    syncCanvasSize(canvas, ctxInfo.container, ctxInfo.doc);
    bindCanvasEvents(canvas, ctxInfo.win);
    loadPageData(state.currentPageId);

    ctxInfo.win.removeEventListener('resize', handleContextResize);
    ctxInfo.win.addEventListener('resize', handleContextResize);
  }

  function handleContextResize() {
    if (!state.canvas || !state.canvasContainer) return;
    const ctxInfo = getActiveContext();
    syncCanvasSize(state.canvas, state.canvasContainer, ctxInfo.doc);
    redrawAllStrokes();
  }

  function syncCanvasSize(canvas, container, doc) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5); // High-res Samsung AMOLED rendering
    const width = Math.max(container.scrollWidth, doc.documentElement.scrollWidth, window.innerWidth);
    const height = Math.max(container.scrollHeight, doc.documentElement.scrollHeight, window.innerHeight);

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    if (state.ctx) {
      state.ctx.scale(dpr, dpr);
      state.ctx.lineCap = 'round';
      state.ctx.lineJoin = 'round';
    }
  }

  function injectIframeStyles(doc) {
    if (!doc.head || doc.getElementById('spenIframeStyles')) return;
    const link = doc.createElement('link');
    link.id = 'spenIframeStyles';
    link.rel = 'stylesheet';
    link.href = '/css/spen_notes.css?v=' + Date.now();
    doc.head.appendChild(link);
  }

  // =========================================================================
  // 4. S-PEN POINTER & DRAWING ENGINE
  // =========================================================================
  function bindCanvasEvents(canvas, win) {
    canvas.addEventListener('pointerdown', onPointerDown, { passive: false });
    canvas.addEventListener('pointermove', onPointerMove, { passive: false });
    canvas.addEventListener('pointerup', onPointerUp, { passive: false });
    canvas.addEventListener('pointercancel', onPointerUp, { passive: false });

    canvas.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'pen') setSpenDetected(true);
    });
  }

  function getCanvasCoords(e) {
    const canvas = state.canvas;
    const rect = canvas.getBoundingClientRect();
    const scrollX = canvas.ownerDocument.defaultView.pageXOffset || canvas.ownerDocument.documentElement.scrollLeft || 0;
    const scrollY = canvas.ownerDocument.defaultView.pageYOffset || canvas.ownerDocument.documentElement.scrollTop || 0;

    return {
      x: e.clientX - rect.left + scrollX,
      y: e.clientY - rect.top + scrollY,
      pressure: e.pressure > 0 ? e.pressure : 0.5,
      pointerType: e.pointerType,
      isButton2: e.buttons === 2 || e.buttons === 32 || e.button === 2 || e.button === 5,
      time: Date.now(),
    };
  }

  function onPointerDown(e) {
    // Palm Rejection: If Stylus-only mode is ON, reject finger touches completely!
    if (state.stylusOnlyMode && e.pointerType === 'touch') {
      return;
    }

    if (state.activeTool === 'nav') return;

    if (e.pointerType === 'pen') {
      setSpenDetected(true);
    }

    // Sticky Note creation
    if (state.activeTool === 'sticky') {
      e.preventDefault();
      const pt = getCanvasCoords(e);
      createStickyNote(pt.x, pt.y);
      setTool('pen');
      return;
    }

    // Lasso Selection mode
    if (state.activeTool === 'lasso') {
      e.preventDefault();
      startLassoSelection(getCanvasCoords(e));
      return;
    }

    e.preventDefault();
    state.isDrawing = true;

    const pt = getCanvasCoords(e);
    const isEraser = state.activeTool === 'eraser' || pt.isButton2 || state.isBarrelButtonActive;

    if (isEraser) {
      NativeBridge.vibrate(2);
      handleEraserAction(pt);
      return;
    }

    // Start New Stroke
    const isHighlighter = state.activeTool === 'highlighter';
    const isFountain = state.penType === 'fountain';
    const baseWidth = isHighlighter ? state.highlighterSize : state.penSize;
    const color = isHighlighter ? state.highlighterColor : state.penColor;

    state.currentStroke = {
      id: 'stroke_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type: isHighlighter ? 'highlighter' : isFountain ? 'fountain' : 'pen',
      color: color,
      baseWidth: baseWidth,
      points: [pt],
      timestamp: Date.now(),
      isStraightLine: false,
    };

    drawStrokeSegment(state.currentStroke, pt, pt);

    // Setup Hold-to-Snap Ruler Timer (450ms)
    startHoldToSnapTimer(pt);
  }

  function onPointerMove(e) {
    if (state.activeTool === 'lasso' && state.lasso.isSelecting) {
      e.preventDefault();
      continueLassoSelection(getCanvasCoords(e));
      return;
    }

    if (!state.isDrawing) return;
    if (state.stylusOnlyMode && e.pointerType === 'touch') return;

    e.preventDefault();

    const events = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : [e];

    for (let i = 0; i < events.length; i++) {
      const pt = getCanvasCoords(events[i]);
      const isEraser = state.activeTool === 'eraser' || pt.isButton2 || state.isBarrelButtonActive;

      if (isEraser) {
        handleEraserAction(pt);
        continue;
      }

      if (!state.currentStroke) continue;

      const pts = state.currentStroke.points;
      const prevPt = pts[pts.length - 1];

      const dx = pt.x - prevPt.x;
      const dy = pt.y - prevPt.y;
      if (dx * dx + dy * dy < 2.0) {
        // Pen is resting or moving very slowly -> check hold to snap
        continue;
      }

      // Reset hold timer on significant movement
      startHoldToSnapTimer(pt);

      pts.push(pt);
      drawStrokeSegment(state.currentStroke, prevPt, pt);
    }
  }

  function onPointerUp(e) {
    clearTimeout(state.holdTimer);

    if (state.activeTool === 'lasso' && state.lasso.isSelecting) {
      e.preventDefault();
      finishLassoSelection();
      return;
    }

    if (!state.isDrawing) return;
    state.isDrawing = false;

    if (state.currentStroke && state.currentStroke.points.length > 0) {
      state.strokes.push(state.currentStroke);
      state.undoStack.push({ type: 'add_stroke', stroke: state.currentStroke });
      state.redoStack = [];
      state.currentStroke = null;
      updateToolbarCounters();
      debounceSave();
    }
  }

  // =========================================================================
  // 5. HOLD-TO-SNAP SHAPES & RULER ENGINE (Samsung Notes feature)
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

    // Check if loop is closed (Rectangle / Circle box detection)
    const distSq = (endPt.x - startPt.x) ** 2 + (endPt.y - startPt.y) ** 2;
    const isClosedLoop = distSq < 1600 && pts.length > 8; // start and end within 40px

    if (isClosedLoop) {
      // Find bounding box and snap to perfect clean rectangle!
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      pts.forEach((p) => {
        if (p.x < minX) minX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.x > maxX) maxX = p.x;
        if (p.y > maxY) maxY = p.y;
      });

      stroke.points = [
        { x: minX, y: minY, pressure: 0.6 },
        { x: maxX, y: minY, pressure: 0.6 },
        { x: maxX, y: maxY, pressure: 0.6 },
        { x: minX, y: maxY, pressure: 0.6 },
        { x: minX, y: minY, pressure: 0.6 },
      ];
      stroke.isStraightLine = true;
      showToast('Snapped to Rectangle Box');
    } else {
      // Snap to perfect straight rule line
      stroke.points = [startPt, endPt];
      stroke.isStraightLine = true;
      showToast('Snapped to Straight Line');
    }

    NativeBridge.vibrate(2);
    redrawAllStrokes();
  }

  // =========================================================================
  // 6. DRAWING SEGMENT & RENDERING
  // =========================================================================
  function drawStrokeSegment(stroke, p1, p2) {
    const ctx = state.ctx;
    if (!ctx) return;

    ctx.save();

    if (stroke.type === 'highlighter') {
      ctx.globalCompositeOperation = 'multiply';
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.baseWidth;
      ctx.lineCap = 'round';
    } else if (stroke.type === 'fountain') {
      // Fountain / Calligraphy pressure dynamics
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = stroke.color;
      const pressureMultiplier = 0.2 + 0.9 * (p2.pressure || 0.5);
      ctx.lineWidth = Math.max(1.0, stroke.baseWidth * pressureMultiplier);
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = stroke.color;
      const pressureMultiplier = 0.5 + 0.5 * (p2.pressure || 0.5);
      ctx.lineWidth = Math.max(1.0, stroke.baseWidth * pressureMultiplier);
    }

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    ctx.restore();
  }

  function redrawAllStrokes() {
    const ctx = state.ctx;
    const canvas = state.canvas;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!state.markupVisible) return;

    for (let s = 0; s < state.strokes.length; s++) {
      const stroke = state.strokes[s];
      const pts = stroke.points;
      if (!pts || pts.length === 0) continue;

      ctx.save();

      if (stroke.type === 'highlighter') {
        ctx.globalCompositeOperation = 'multiply';
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.baseWidth;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = stroke.color;
      }

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (pts.length === 1) {
        ctx.fillStyle = stroke.color;
        ctx.beginPath();
        ctx.arc(pts[0].x, pts[0].y, stroke.baseWidth / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        continue;
      }

      if (stroke.isStraightLine) {
        ctx.lineWidth = stroke.baseWidth;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i].x, pts[i].y);
        }
        ctx.stroke();
        ctx.restore();
        continue;
      }

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);

      for (let i = 1; i < pts.length; i++) {
        const midX = (pts[i - 1].x + pts[i].x) / 2;
        const midY = (pts[i - 1].y + pts[i].y) / 2;

        if (stroke.type !== 'highlighter') {
          const pressure = pts[i].pressure || 0.5;
          const mult = stroke.type === 'fountain' ? 0.2 + 0.9 * pressure : 0.5 + 0.5 * pressure;
          ctx.lineWidth = Math.max(1.0, stroke.baseWidth * mult);
        }

        ctx.quadraticCurveTo(pts[i - 1].x, pts[i - 1].y, midX, midY);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.stroke();

      ctx.restore();
    }
  }

  // =========================================================================
  // 7. ERASER ENGINE (Samsung Notes Stroke Eraser)
  // =========================================================================
  function handleEraserAction(pt) {
    const hitRadius = state.eraserSize;
    let erasedAny = false;

    for (let i = state.strokes.length - 1; i >= 0; i--) {
      const stroke = state.strokes[i];
      const pts = stroke.points;

      for (let j = 0; j < pts.length; j += 2) {
        const dx = pts[j].x - pt.x;
        const dy = pts[j].y - pt.y;
        if (dx * dx + dy * dy <= hitRadius * hitRadius) {
          const removed = state.strokes.splice(i, 1)[0];
          state.undoStack.push({ type: 'delete_stroke', stroke: removed });
          erasedAny = true;
          break;
        }
      }
    }

    if (erasedAny) {
      redrawAllStrokes();
      updateToolbarCounters();
      debounceSave();
    }
  }

  // =========================================================================
  // 8. LASSO SELECTION TOOL (Samsung Notes Specialty)
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
    redrawAllStrokes();

    const pts = state.lasso.loopPoints;
    if (pts.length < 2) return;

    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function finishLassoSelection() {
    state.lasso.isSelecting = false;
    const loop = state.lasso.loopPoints;
    if (loop.length < 4) {
      redrawAllStrokes();
      return;
    }

    // Find enclosed strokes using ray-casting point-in-polygon
    const selected = [];
    for (let s = 0; s < state.strokes.length; s++) {
      const stroke = state.strokes[s];
      const midPt = stroke.points[Math.floor(stroke.points.length / 2)];
      if (isPointInPolygon(midPt, loop)) {
        selected.push(stroke);
      }
    }

    if (selected.length === 0) {
      redrawAllStrokes();
      showToast('No strokes selected');
      return;
    }

    state.lasso.selectedStrokes = selected;
    NativeBridge.vibrate(2);
    createLassoBox(selected);
  }

  function isPointInPolygon(pt, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i].x, yi = poly[i].y;
      const xj = poly[j].x, yj = poly[j].y;
      const intersect = ((yi > pt.y) !== (yj > pt.y)) && (pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function createLassoBox(strokes) {
    redrawAllStrokes();
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    strokes.forEach((s) => {
      s.points.forEach((p) => {
        if (p.x < minX) minX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.x > maxX) maxX = p.x;
        if (p.y > maxY) maxY = p.y;
      });
    });

    const pad = 12;
    const box = document.createElement('div');
    box.className = 'spen-lasso-box';
    box.style.left = (minX - pad) + 'px';
    box.style.top = (minY - pad) + 'px';
    box.style.width = (maxX - minX + pad * 2) + 'px';
    box.style.height = (maxY - minY + pad * 2) + 'px';

    box.innerHTML = `
      <div class="spen-lasso-toolbar">
        <button type="button" class="spen-lasso-btn" id="spenLassoMove" title="Move Ink"><i class="fa-solid fa-up-down-left-right"></i></button>
        <button type="button" class="spen-lasso-btn" id="spenLassoColor" title="Change Color"><i class="fa-solid fa-palette"></i></button>
        <button type="button" class="spen-lasso-btn del" id="spenLassoDel" title="Delete Selected"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    `;

    state.canvasContainer.appendChild(box);
    state.lasso.boxEl = box;

    // Actions
    box.querySelector('#spenLassoDel').addEventListener('click', (e) => {
      e.stopPropagation();
      strokes.forEach((s) => {
        const idx = state.strokes.indexOf(s);
        if (idx !== -1) state.strokes.splice(idx, 1);
      });
      clearLassoSelection();
      redrawAllStrokes();
      debounceSave();
      showToast('Selected ink deleted');
    });

    box.querySelector('#spenLassoColor').addEventListener('click', (e) => {
      e.stopPropagation();
      strokes.forEach((s) => {
        s.color = state.penColor;
      });
      redrawAllStrokes();
      debounceSave();
      showToast('Selected ink color updated');
    });

    // Make lasso box draggable
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

      // Move strokes points simultaneously!
      strokes.forEach((s) => {
        s.points.forEach((p) => {
          p.x -= pos1;
          p.y -= pos2;
        });
      });
      redrawAllStrokes();
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
  // 9. SPLIT LEGAL MARGIN NOTEPAD (Slide-out Notebook Drawer)
  // =========================================================================
  function toggleMarginPad() {
    let drawer = document.getElementById('spenMarginDrawer');
    if (!drawer) {
      drawer = createMarginPadDrawer();
    }

    state.marginPad.open = !state.marginPad.open;
    if (state.marginPad.open) {
      drawer.classList.add('open');
      initMarginCanvas();
      NativeBridge.vibrate(1);
      showToast('Legal Margin Notepad Opened');
    } else {
      drawer.classList.remove('open');
    }
  }

  function createMarginPadDrawer() {
    const drawer = document.createElement('div');
    drawer.id = 'spenMarginDrawer';
    drawer.className = 'spen-margin-pad-drawer';

    drawer.innerHTML = `
      <div class="spen-margin-header">
        <div class="spen-margin-title">
          <i class="fa-solid fa-book-journal-whills" style="color:#d97706;"></i>
          <span>Legal Margin Notepad</span>
        </div>
        <div class="spen-margin-actions">
          <button type="button" class="spen-margin-btn" id="spenMarginPaperBtn" title="Switch Paper Style"><i class="fa-solid fa-scroll"></i></button>
          <button type="button" class="spen-margin-btn" id="spenMarginClearBtn" title="Clear Pad"><i class="fa-solid fa-trash-can"></i></button>
          <button type="button" class="spen-margin-btn" id="spenMarginCloseBtn" title="Close Pad"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </div>
      <div class="spen-margin-canvas-container" id="spenMarginCanvasContainer">
        <canvas class="spen-margin-canvas" id="spenMarginCanvas"></canvas>
      </div>
    `;

    document.body.appendChild(drawer);

    drawer.querySelector('#spenMarginCloseBtn').addEventListener('click', toggleMarginPad);

    drawer.querySelector('#spenMarginClearBtn').addEventListener('click', () => {
      if (confirm('Clear all handwritten notes on this margin notepad?')) {
        state.marginPad.strokes = [];
        redrawMarginStrokes();
        debounceSave();
      }
    });

    const styles = ['ruled', 'paper-white', 'paper-grid', 'paper-dark'];
    let curStyleIdx = 0;
    drawer.querySelector('#spenMarginPaperBtn').addEventListener('click', () => {
      curStyleIdx = (curStyleIdx + 1) % styles.length;
      drawer.className = 'spen-margin-pad-drawer open ' + (styles[curStyleIdx] === 'ruled' ? '' : styles[curStyleIdx]);
      redrawMarginStrokes();
    });

    return drawer;
  }

  function initMarginCanvas() {
    const canvas = document.getElementById('spenMarginCanvas');
    const container = document.getElementById('spenMarginCanvasContainer');
    if (!canvas || !container) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const w = container.clientWidth;
    const h = container.clientHeight;

    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    state.marginPad.canvas = canvas;
    state.marginPad.ctx = ctx;

    // Bind pointer events on margin pad
    canvas.onpointerdown = (e) => {
      if (state.stylusOnlyMode && e.pointerType === 'touch') return;
      e.preventDefault();
      state.marginPad.isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      const pt = { x: e.clientX - rect.left, y: e.clientY - rect.top, pressure: e.pressure || 0.5 };
      state.marginPad.currentStroke = {
        color: state.penColor,
        baseWidth: state.penSize,
        points: [pt],
      };
    };

    canvas.onpointermove = (e) => {
      if (!state.marginPad.isDrawing || !state.marginPad.currentStroke) return;
      if (state.stylusOnlyMode && e.pointerType === 'touch') return;
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const pt = { x: e.clientX - rect.left, y: e.clientY - rect.top, pressure: e.pressure || 0.5 };
      const pts = state.marginPad.currentStroke.points;
      const prev = pts[pts.length - 1];
      pts.push(pt);

      ctx.save();
      ctx.strokeStyle = state.penColor;
      ctx.lineWidth = Math.max(1.0, state.penSize * (0.4 + 0.6 * pt.pressure));
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
      ctx.restore();
    };

    canvas.onpointerup = () => {
      if (!state.marginPad.isDrawing) return;
      state.marginPad.isDrawing = false;
      if (state.marginPad.currentStroke) {
        state.marginPad.strokes.push(state.marginPad.currentStroke);
        state.marginPad.currentStroke = null;
        debounceSave();
      }
    };

    redrawMarginStrokes();
  }

  function redrawMarginStrokes() {
    const ctx = state.marginPad.ctx;
    const canvas = state.marginPad.canvas;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let s = 0; s < state.marginPad.strokes.length; s++) {
      const stroke = state.marginPad.strokes[s];
      const pts = stroke.points;
      if (!pts || pts.length < 2) continue;

      ctx.save();
      ctx.strokeStyle = stroke.color;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);

      for (let i = 1; i < pts.length; i++) {
        const midX = (pts[i - 1].x + pts[i].x) / 2;
        const midY = (pts[i - 1].y + pts[i].y) / 2;
        ctx.lineWidth = Math.max(1.0, stroke.baseWidth * (0.4 + 0.6 * (pts[i].pressure || 0.5)));
        ctx.quadraticCurveTo(pts[i - 1].x, pts[i - 1].y, midX, midY);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.stroke();
      ctx.restore();
    }
  }

  // =========================================================================
  // 10. STICKY NOTES ON PAGE
  // =========================================================================
  function createStickyNote(x, y, text, id) {
    const container = state.canvasContainer;
    if (!container) return;

    const noteId = id || 'sticky_' + Date.now();
    const noteEl = document.createElement('div');
    noteEl.className = 'spen-sticky-note';
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
        noteEl.innerHTML = '<i class="fa-solid fa-thumbtack" style="color:#854d0e;"></i>';
      } else {
        noteEl.remove();
        createStickyNote(parseInt(noteEl.style.left), parseInt(noteEl.style.top), textarea.value, noteId);
      }
    });

    makeDraggable(noteEl, header);
    syncStickyData();
    debounceSave();
  }

  function syncStickyData() {
    const notes = [];
    if (!state.canvasContainer) return;
    state.canvasContainer.querySelectorAll('.spen-sticky-note').forEach((el) => {
      const textarea = el.querySelector('.spen-sticky-textarea');
      notes.push({
        id: el.id,
        x: parseInt(el.style.left) || 0,
        y: parseInt(el.style.top) || 0,
        text: textarea ? textarea.value : '',
        collapsed: el.classList.contains('collapsed'),
      });
    });
    state.stickyNotes = notes;
    updateToolbarCounters();
  }

  function makeDraggable(element, handle) {
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
      syncStickyData();
      debounceSave();
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
      version: 2,
      pageId: state.currentPageId,
      title: state.currentPageTitle,
      subject: state.currentPageSubject,
      updatedAt: Date.now(),
      strokes: state.strokes,
      stickyNotes: state.stickyNotes,
      marginStrokes: state.marginPad.strokes,
    };

    NativeBridge.save(state.currentPageId, state.currentPageTitle, state.currentPageSubject, data);

    // Generate small thumbnail for Consolidated Notes Hub card
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

      const srcW = state.canvas.width;
      const srcH = Math.min(state.canvas.height, srcW * 0.6);
      tCtx.drawImage(state.canvas, 0, 0, srcW, srcH, 0, 0, 240, 120);

      const thumbUrl = thumbCanvas.toDataURL('image/jpeg', 0.6);
      NativeBridge.saveThumb(pageId, thumbUrl);
    } catch (_) {}
  }

  function loadPageData(pageId) {
    state.strokes = [];
    state.stickyNotes = [];
    state.marginPad.strokes = [];
    state.undoStack = [];
    state.redoStack = [];

    const data = NativeBridge.load(pageId);
    if (data) {
      if (data.strokes && Array.isArray(data.strokes)) {
        state.strokes = data.strokes;
      }
      if (data.stickyNotes && Array.isArray(data.stickyNotes) && state.canvasContainer) {
        data.stickyNotes.forEach((n) => createStickyNote(n.x, n.y, n.text, n.id));
      }
      if (data.marginStrokes && Array.isArray(data.marginStrokes)) {
        state.marginPad.strokes = data.marginStrokes;
        if (state.marginPad.open) redrawMarginStrokes();
      }
      console.log('[SPenEngine] Loaded notes for:', pageId, `(${state.strokes.length} strokes)`);
    }

    redrawAllStrokes();
    updateToolbarCounters();
  }

  // =========================================================================
  // 12. FLOATING SAMSUNG S-PEN TOOLBAR UI (One UI 7 Island)
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

      <!-- Ballpoint Pen Tool -->
      <button type="button" class="spen-btn active" id="spenToolPen" title="S-Pen (Ballpoint)">
        <i class="fa-solid fa-pen"></i>
        <span class="spen-color-dot" id="spenPenDot" style="background:#0f172a;"></span>
      </button>

      <!-- Fountain / Calligraphy Pen -->
      <button type="button" class="spen-btn" id="spenToolFountain" title="Calligraphy Fountain Pen">
        <i class="fa-solid fa-pen-nib"></i>
      </button>

      <!-- Chisel Highlighter Tool -->
      <button type="button" class="spen-btn" id="spenToolHighlighter" title="Chisel Highlighter">
        <i class="fa-solid fa-highlighter"></i>
        <span class="spen-color-dot" id="spenHighDot" style="background:#facc15;"></span>
      </button>

      <!-- Eraser Tool -->
      <button type="button" class="spen-btn" id="spenToolEraser" title="Stroke Eraser (or hold S-Pen button)">
        <i class="fa-solid fa-eraser"></i>
      </button>

      <!-- Lasso Selection Tool -->
      <button type="button" class="spen-btn" id="spenToolLasso" title="Lasso Selection (Circle notes to move/recolor)">
        <i class="fa-solid fa-wand-magic-sparkles"></i>
      </button>

      <!-- Legal Margin Notepad (Split Drawer) -->
      <button type="button" class="spen-btn" id="spenToolMargin" title="Legal Margin Notepad">
        <i class="fa-solid fa-book-journal-whills"></i>
      </button>

      <!-- Sticky Note Tool -->
      <button type="button" class="spen-btn" id="spenToolSticky" title="Add Sticky Memo">
        <i class="fa-solid fa-note-sticky"></i>
      </button>

      <div class="spen-divider"></div>

      <!-- Undo / Redo -->
      <button type="button" class="spen-btn" id="spenBtnUndo" title="Undo Stroke">
        <i class="fa-solid fa-rotate-left"></i>
      </button>
      <button type="button" class="spen-btn" id="spenBtnRedo" title="Redo Stroke">
        <i class="fa-solid fa-rotate-right"></i>
      </button>

      <!-- Hold-to-Snap Ruler Toggle -->
      <button type="button" class="spen-btn active" id="spenBtnSnap" title="Smart Hold-to-Snap Ruler (Straight Lines & Boxes)">
        <i class="fa-solid fa-ruler-combined"></i>
      </button>

      <!-- Hide/Show Markup Toggle -->
      <button type="button" class="spen-btn" id="spenBtnToggleEye" title="Show/Hide Handwritten Markup">
        <i class="fa-solid fa-eye" id="spenEyeIcon"></i>
      </button>

      <!-- Palm Rejection Mode Toggle -->
      <button type="button" class="spen-btn active" id="spenBtnPalmRejection" title="Palm Rejection: ON (Only Stylus Draws)">
        <i class="fa-solid fa-hand"></i>
      </button>

      <div class="spen-divider"></div>

      <!-- Consolidated Notes Hub (Game Changer) -->
      <button type="button" class="spen-btn" id="spenBtnNotesHub" title="My Consolidated Notes Hub" style="color:#f59e0b;">
        <i class="fa-solid fa-book-bookmark"></i>
      </button>

      <!-- Export / Print PDF -->
      <button type="button" class="spen-btn" id="spenBtnExport" title="Export or Print PDF">
        <i class="fa-solid fa-print"></i>
      </button>

      <!-- Minimize to floating icon -->
      <button type="button" class="spen-btn" id="spenBtnMinimize" title="Minimize Toolbar">
        <i class="fa-solid fa-chevron-down"></i>
      </button>

      <!-- Pen Settings Popover (Colors & Sizes) -->
      <div class="spen-popover" id="spenPenPopover">
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
        </div>
      </div>

      <!-- Highlighter Settings Popover -->
      <div class="spen-popover" id="spenHighPopover">
        <div class="spen-popover-title">Highlighter Tones</div>
        <div class="spen-colors-grid">
          ${HIGHLIGHTER_COLORS.map(
            (c, i) =>
              `<div class="spen-color-swatch ${i === 0 ? 'active' : ''}" data-high-color="${c.value}" style="background:${c.value.replace('0.45', '1')};" title="${c.name}"></div>`
          ).join('')}
        </div>
        <div class="spen-popover-title" style="margin-top:6px;">Chisel Width</div>
        <div class="spen-sizes-grid">
          <div class="spen-size-btn" data-high-size="16" title="Single Line"><div class="spen-size-preview-dot" style="width:14px;height:6px;border-radius:2px;"></div></div>
          <div class="spen-size-btn active" data-high-size="24" title="Standard"><div class="spen-size-preview-dot" style="width:20px;height:10px;border-radius:2px;"></div></div>
          <div class="spen-size-btn" data-high-size="36" title="Header"><div class="spen-size-preview-dot" style="width:28px;height:14px;border-radius:2px;"></div></div>
        </div>
      </div>
    `;

    document.body.appendChild(bar);
    setupToolbarEvents(bar);
  }

  function setupToolbarEvents(bar) {
    const btnPen = bar.querySelector('#spenToolPen');
    const btnFountain = bar.querySelector('#spenToolFountain');
    const btnHigh = bar.querySelector('#spenToolHighlighter');
    const btnEraser = bar.querySelector('#spenToolEraser');
    const btnLasso = bar.querySelector('#spenToolLasso');
    const btnMargin = bar.querySelector('#spenToolMargin');
    const btnSticky = bar.querySelector('#spenToolSticky');
    const btnUndo = bar.querySelector('#spenBtnUndo');
    const btnRedo = bar.querySelector('#spenBtnRedo');
    const btnSnap = bar.querySelector('#spenBtnSnap');
    const btnEye = bar.querySelector('#spenBtnToggleEye');
    const btnPalm = bar.querySelector('#spenBtnPalmRejection');
    const btnHub = bar.querySelector('#spenBtnNotesHub');
    const btnExport = bar.querySelector('#spenBtnExport');
    const btnMin = bar.querySelector('#spenBtnMinimize');

    const penPopover = bar.querySelector('#spenPenPopover');
    const highPopover = bar.querySelector('#spenHighPopover');

    btnPen.addEventListener('click', () => {
      NativeBridge.vibrate(1);
      state.penType = 'ballpoint';
      if (state.activeTool === 'pen') {
        penPopover.classList.toggle('active');
        highPopover.classList.remove('active');
      } else {
        setTool('pen');
        highPopover.classList.remove('active');
      }
    });

    btnFountain.addEventListener('click', () => {
      NativeBridge.vibrate(1);
      state.penType = 'fountain';
      setTool('fountain');
      closeAllPopovers();
      showToast('Calligraphy Fountain Pen: ON');
    });

    btnHigh.addEventListener('click', () => {
      NativeBridge.vibrate(1);
      if (state.activeTool === 'highlighter') {
        highPopover.classList.toggle('active');
        penPopover.classList.remove('active');
      } else {
        setTool('highlighter');
        penPopover.classList.remove('active');
      }
    });

    btnEraser.addEventListener('click', () => {
      NativeBridge.vibrate(1);
      setTool('eraser');
      closeAllPopovers();
    });

    btnLasso.addEventListener('click', () => {
      NativeBridge.vibrate(1);
      setTool('lasso');
      closeAllPopovers();
      showToast('Lasso Tool: Circle any notes to move or recolor');
    });

    btnMargin.addEventListener('click', () => {
      NativeBridge.vibrate(1);
      toggleMarginPad();
    });

    btnSticky.addEventListener('click', () => {
      NativeBridge.vibrate(1);
      setTool('sticky');
      closeAllPopovers();
      showToast('Tap anywhere on the page to drop a sticky note');
    });

    btnUndo.addEventListener('click', handleUndo);
    btnRedo.addEventListener('click', handleRedo);

    btnSnap.addEventListener('click', () => {
      state.holdToSnap = !state.holdToSnap;
      if (state.holdToSnap) {
        btnSnap.classList.add('active');
        showToast('Hold-to-Snap: ON (Straight Lines & Boxes)');
      } else {
        btnSnap.classList.remove('active');
        showToast('Hold-to-Snap: OFF');
      }
      NativeBridge.vibrate(1);
    });

    btnEye.addEventListener('click', () => {
      state.markupVisible = !state.markupVisible;
      const eyeIcon = bar.querySelector('#spenEyeIcon');
      if (state.markupVisible) {
        eyeIcon.className = 'fa-solid fa-eye';
        btnEye.classList.remove('active');
        if (state.canvas) state.canvas.classList.remove('spen-hidden');
        if (state.canvasContainer) {
          state.canvasContainer.querySelectorAll('.spen-sticky-note').forEach((el) => (el.style.display = ''));
        }
        redrawAllStrokes();
        showToast('Annotations Visible');
      } else {
        eyeIcon.className = 'fa-solid fa-eye-slash';
        btnEye.classList.add('active');
        if (state.canvas) state.canvas.classList.add('spen-hidden');
        if (state.canvasContainer) {
          state.canvasContainer.querySelectorAll('.spen-sticky-note').forEach((el) => (el.style.display = 'none'));
        }
        showToast('Annotations Hidden (Reading Mode)');
      }
      NativeBridge.vibrate(1);
    });

    btnPalm.addEventListener('click', () => {
      state.stylusOnlyMode = !state.stylusOnlyMode;
      if (state.stylusOnlyMode) {
        btnPalm.classList.add('active');
        showToast('Palm Rejection: ON (Fingers scroll, S-Pen draws)');
      } else {
        btnPalm.classList.remove('active');
        showToast('Finger Drawing: Enabled');
      }
      NativeBridge.vibrate(1);
    });

    btnHub.addEventListener('click', () => {
      NativeBridge.vibrate(1);
      openConsolidatedNotesHub();
    });

    btnExport.addEventListener('click', () => {
      NativeBridge.vibrate(1);
      showExportOptionsDialog();
    });

    btnMin.addEventListener('click', minimizeToolbar);

    // Color Swatches
    penPopover.querySelectorAll('.spen-color-swatch').forEach((swatch) => {
      swatch.addEventListener('click', () => {
        penPopover.querySelectorAll('.spen-color-swatch').forEach((s) => s.classList.remove('active'));
        swatch.classList.add('active');
        state.penColor = swatch.getAttribute('data-color');
        bar.querySelector('#spenPenDot').style.background = state.penColor;
        NativeBridge.vibrate(1);
      });
    });

    // Custom Color Input
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

    makeDraggable(bar, bar.querySelector('#spenDragHandle'));
  }

  function setTool(toolName) {
    state.activeTool = toolName;
    const bar = document.getElementById('spenToolbarContainer');
    if (!bar) return;

    bar.querySelectorAll('.spen-btn').forEach((b) => b.classList.remove('active'));

    if (toolName === 'pen') bar.querySelector('#spenToolPen')?.classList.add('active');
    if (toolName === 'fountain') bar.querySelector('#spenToolFountain')?.classList.add('active');
    if (toolName === 'highlighter') bar.querySelector('#spenToolHighlighter')?.classList.add('active');
    if (toolName === 'eraser') bar.querySelector('#spenToolEraser')?.classList.add('active');
    if (toolName === 'lasso') bar.querySelector('#spenToolLasso')?.classList.add('active');
    if (toolName === 'sticky') bar.querySelector('#spenToolSticky')?.classList.add('active');

    if (state.canvas) {
      if (toolName === 'nav') {
        state.canvas.classList.add('spen-nav-mode');
      } else {
        state.canvas.classList.remove('spen-nav-mode');
      }
    }
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
      const total = state.strokes.length + state.stickyNotes.length + state.marginPad.strokes.length;
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
    redrawAllStrokes();
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
    redrawAllStrokes();
    updateToolbarCounters();
    debounceSave();
  }

  // =========================================================================
  // 13. CONSOLIDATED NOTES HUB 2.0 (Ultimate Edition)
  // "i want those features so that my notes are consolidated , and at one place"
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

    // Unique subjects for filter pills
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
              <p>Handwritten S-Pen annotations, margin pads &amp; memos consolidated across Delhi University LL.B.</p>
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
              <div class="spen-metric-lbl">Sticky Memos</div>
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

    // Hub Event Listeners
    overlay.querySelector('#spenHubCloseBtn').addEventListener('click', closeConsolidatedNotesHub);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeConsolidatedNotesHub();
    });

    // Backup & Restore handlers
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

    // Filter pills
    let activeSubject = 'All';
    overlay.querySelectorAll('.spen-hub-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        overlay.querySelectorAll('.spen-hub-pill').forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        activeSubject = pill.getAttribute('data-sub');
        filterHubCards();
      });
    });

    // Search filter
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
          <p>Open any subject or unit from your syllabus, grab your Samsung Pencil, and start writing notes! All your handwriting and memos will consolidate right here.</p>
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
          <span><i class="fa-solid fa-note-sticky"></i> ${n.stickyCount || 0} memos</span>
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
              redrawAllStrokes();
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
  // 14. EXPORT & PRINT AS PDF
  // =========================================================================
  function showExportOptionsDialog() {
    NativeBridge.printPdf(state.currentPageTitle || 'MakeLawEasy_StudyNotes');
  }

  // =========================================================================
  // 15. TOAST NOTIFICATIONS
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

  // =========================================================================
  // 16. UTILITY FUNCTIONS
  // =========================================================================
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
  // 17. LIFECYCLE INITIALIZATION
  // =========================================================================
  function initEngine() {
    createToolbar();
    ensureHoverRing();

    setInterval(() => {
      attachCanvasToContext();
    }, 600);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllPopovers();
        closeConsolidatedNotesHub();
        clearLassoSelection();
      }
    });

    console.log('[SPenEngine] Samsung S-Pen Ultimate Notes Suite ready.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEngine);
  } else {
    initEngine();
  }
})();
