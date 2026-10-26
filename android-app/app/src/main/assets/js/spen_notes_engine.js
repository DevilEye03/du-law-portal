/**
 * Make Law Easy — Samsung S-Pen & Stylus Annotation Engine
 * Professional tablet-grade handwritten notes, palm rejection, pressure dynamics & consolidated notes hub.
 */
(function () {
  'use strict';

  if (window.__SPEN_ENGINE_INITIALIZED__) return;
  window.__SPEN_ENGINE_INITIALIZED__ = true;

  console.log('[SPenEngine] Initializing Samsung Stylus & Notes Suite...');

  // Configuration & State
  const state = {
    activeTool: 'pen', // 'pen' | 'highlighter' | 'eraser' | 'sticky' | 'nav'
    penColor: '#1e293b', // Default dark ink
    penSize: 3.0,
    highlighterColor: 'rgba(250, 204, 21, 0.45)', // Neon yellow
    highlighterSize: 22.0,
    eraserMode: 'stroke', // 'stroke' | 'pixel'
    eraserSize: 24.0,
    stylusOnlyMode: true, // True Palm Rejection: ONLY S-Pen draws, fingers scroll!
    markupVisible: true,
    isDrawing: false,
    currentStroke: null,
    strokes: [], // Array of stroke objects
    undoStack: [],
    redoStack: [],
    stickyNotes: [], // Array of sticky note objects
    isSpenDetected: false,
    currentPageId: '',
    currentPageTitle: '',
    currentPageSubject: '',
    isToolbarMinimized: false,
    activeIframe: null,
    canvas: null,
    ctx: null,
    canvasContainer: null,
    saveTimeout: null,
  };

  // Pre-configured Legal Scholar Palettes
  const PEN_COLORS = [
    { name: 'Onyx Black', value: '#0f172a' },
    { name: 'Court Navy', value: '#1e3a8a' },
    { name: 'Crimson Ratio', value: '#b91c1c' },
    { name: 'Emerald Act', value: '#047857' },
    { name: 'Legal Amber', value: '#d97706' },
    { name: 'Chalk White', value: '#f8fafc' },
  ];

  const HIGHLIGHTER_COLORS = [
    { name: 'Neon Yellow', value: 'rgba(250, 204, 21, 0.45)' },
    { name: 'Mint Precedent', value: 'rgba(52, 211, 153, 0.45)' },
    { name: 'Rose Doctrine', value: 'rgba(244, 114, 182, 0.45)' },
    { name: 'Sky Directive', value: 'rgba(56, 189, 248, 0.45)' },
    { name: 'Sunset Alert', value: 'rgba(251, 146, 60, 0.45)' },
  ];

  // Helper: MD5-like simple deterministic hash for page IDs
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

    updateLocalIndex: (pageId, title, subject, data) => {
      try {
        let idx = [];
        const raw = localStorage.getItem('mle_notes_master_index');
        if (raw) idx = JSON.parse(raw);
        idx = idx.filter((item) => item.pageId !== pageId);
        if (
          (data.strokes && data.strokes.length > 0) ||
          (data.stickyNotes && data.stickyNotes.length > 0)
        ) {
          idx.unshift({
            pageId,
            title: title || 'Comprehensive Study Notes',
            subject: subject || 'Law Subject',
            timestamp: Date.now(),
            strokeCount: data.strokes ? data.strokes.length : 0,
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
          // Web fallback: Trigger download
          const a = document.createElement('a');
          a.href = base64Png;
          a.download = (title || 'MakeLawEasy_Notes').replace(/[^a-zA-Z0-9_-]/g, '_') + '.png';
          a.click();
        }
      } catch (e) {
        console.warn('[SPenEngine] Export error:', e);
      }
    },
  };

  // =========================================================================
  // 2. STYLUS DETECTION & S-PEN HARDWARE LISTENERS
  // =========================================================================
  function initStylusDetection() {
    window.addEventListener('pointerdown', handleStylusPresence, { passive: true, capture: true });
    window.addEventListener('pointermove', handleStylusPresence, { passive: true, capture: true });

    if (NativeBridge.isAvailable() && window.AndroidApp.hasStylus) {
      try {
        if (window.AndroidApp.hasStylus()) {
          setSpenDetected(true);
        }
      } catch (e) {}
    }
  }

  function handleStylusPresence(e) {
    if (e.pointerType === 'pen') {
      if (!state.isSpenDetected) {
        setSpenDetected(true);
        showToast('Samsung S-Pen Active • Palm Rejection ON');
      }
    }
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

    // Main Portal Page Fallback
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

    // Check if canvas already exists in target container
    let existingCanvas = ctxInfo.container.querySelector('.spen-canvas-layer');
    if (existingCanvas && state.currentPageId === ctxInfo.pageId) {
      return; // Already attached to this document
    }

    state.currentPageId = ctxInfo.pageId;
    state.currentPageTitle = ctxInfo.title;
    state.currentPageSubject = ctxInfo.subject;

    // Ensure CSS is injected in iframe if reading a note
    if (ctxInfo.isReader) {
      injectIframeStyles(ctxInfo.doc);
    }

    // Clean up old canvas in container if changing page
    if (existingCanvas) {
      existingCanvas.remove();
    }
    ctxInfo.container.querySelectorAll('.spen-sticky-note').forEach((el) => el.remove());

    // Create Canvas Layer
    const canvas = ctxInfo.doc.createElement('canvas');
    canvas.className = 'spen-canvas-layer';
    if (!state.markupVisible) canvas.classList.add('spen-hidden');
    if (state.activeTool === 'nav') canvas.classList.add('spen-nav-mode');

    // Position container relatively if needed
    if (getComputedStyle(ctxInfo.container).position === 'static') {
      ctxInfo.container.style.position = 'relative';
    }

    ctxInfo.container.appendChild(canvas);
    state.canvas = canvas;
    state.ctx = canvas.getContext('2d', { willReadFrequently: true });
    state.canvasContainer = ctxInfo.container;

    // Resize canvas to match full document content
    syncCanvasSize(canvas, ctxInfo.container, ctxInfo.doc);

    // Bind Pointer Events (Hardware Accelerated & S-Pen pressure aware)
    bindCanvasEvents(canvas, ctxInfo.win);

    // Load Saved Notes for this page
    loadPageData(state.currentPageId);

    // Listen for resize / orientation change
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
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5); // Sharp rendering for Samsung AMOLED
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

    // S-Pen Hover detection (Floating cursor preview)
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
      isButton2: e.buttons === 2 || e.button === 2,
    };
  }

  function onPointerDown(e) {
    // Palm Rejection: If Stylus-only mode is ON, reject finger touches completely!
    if (state.stylusOnlyMode && e.pointerType === 'touch') {
      return; // Allow touch to scroll or ignore without drawing
    }

    if (state.activeTool === 'nav') return;

    if (e.pointerType === 'pen') {
      setSpenDetected(true);
    }

    // Sticky Note creation mode
    if (state.activeTool === 'sticky') {
      e.preventDefault();
      const pt = getCanvasCoords(e);
      createStickyNote(pt.x, pt.y);
      setTool('pen');
      return;
    }

    e.preventDefault();
    state.isDrawing = true;

    const pt = getCanvasCoords(e);

    // Check S-Pen side button for instant eraser
    const isEraser = state.activeTool === 'eraser' || pt.isButton2;

    if (isEraser) {
      NativeBridge.vibrate(2);
      handleEraserAction(pt);
      return;
    }

    // Start New Stroke
    const isHighlighter = state.activeTool === 'highlighter';
    const baseWidth = isHighlighter ? state.highlighterSize : state.penSize;
    const color = isHighlighter ? state.highlighterColor : state.penColor;

    state.currentStroke = {
      id: 'stroke_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type: isHighlighter ? 'highlighter' : 'pen',
      color: color,
      baseWidth: baseWidth,
      points: [pt],
      timestamp: Date.now(),
    };

    drawStrokeSegment(state.currentStroke, pt, pt);
  }

  function onPointerMove(e) {
    if (!state.isDrawing) return;

    if (state.stylusOnlyMode && e.pointerType === 'touch') return;

    e.preventDefault();

    // Use coalesced events if available for 240Hz Samsung S-Pen precision
    const events = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : [e];

    for (let i = 0; i < events.length; i++) {
      const pt = getCanvasCoords(events[i]);

      const isEraser = state.activeTool === 'eraser' || pt.isButton2;
      if (isEraser) {
        handleEraserAction(pt);
        continue;
      }

      if (!state.currentStroke) continue;

      const pts = state.currentStroke.points;
      const prevPt = pts[pts.length - 1];

      // Distance threshold to avoid zero-length points
      const dx = pt.x - prevPt.x;
      const dy = pt.y - prevPt.y;
      if (dx * dx + dy * dy < 2.0) continue;

      pts.push(pt);
      drawStrokeSegment(state.currentStroke, prevPt, pt);
    }
  }

  function onPointerUp(e) {
    if (!state.isDrawing) return;
    state.isDrawing = false;

    if (state.currentStroke && state.currentStroke.points.length > 0) {
      state.strokes.push(state.currentStroke);
      state.undoStack.push({ type: 'add_stroke', stroke: state.currentStroke });
      state.redoStack = []; // Clear redo
      state.currentStroke = null;
      updateToolbarCounters();
      debounceSave();
    }
  }

  function drawStrokeSegment(stroke, p1, p2) {
    const ctx = state.ctx;
    if (!ctx) return;

    ctx.save();

    if (stroke.type === 'highlighter') {
      ctx.globalCompositeOperation = 'multiply';
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.baseWidth;
      ctx.lineCap = 'round';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = stroke.color;
      // S-Pen Pressure dynamic line width
      const pressureMultiplier = 0.4 + 0.6 * (p2.pressure || 0.5);
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

    // Clear whole canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!state.markupVisible) return;

    // Render strokes with quadratic Bezier smoothing
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

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);

      for (let i = 1; i < pts.length; i++) {
        const midX = (pts[i - 1].x + pts[i].x) / 2;
        const midY = (pts[i - 1].y + pts[i].y) / 2;

        if (stroke.type !== 'highlighter') {
          const pressure = pts[i].pressure || 0.5;
          ctx.lineWidth = Math.max(1.0, stroke.baseWidth * (0.4 + 0.6 * pressure));
        }

        ctx.quadraticCurveTo(pts[i - 1].x, pts[i - 1].y, midX, midY);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.stroke();

      ctx.restore();
    }
  }

  // =========================================================================
  // 5. ERASER ENGINE (Samsung Notes Stroke Eraser)
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
          // Delete this entire stroke (Stroke Eraser)
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
  // 6. STICKY NOTES ON PAGE
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
        <span class="spen-sticky-title"><i class="fa-solid fa-thumbtack"></i> Note</span>
        <div class="spen-sticky-actions">
          <button type="button" class="spen-sticky-icon-btn spen-sticky-min" title="Collapse"><i class="fa-solid fa-compress"></i></button>
          <button type="button" class="spen-sticky-icon-btn spen-sticky-del" title="Delete"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </div>
      <textarea class="spen-sticky-textarea" placeholder="Write law note with S-Pen or keyboard...">${text ? escapeHtml(text) : ''}</textarea>
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

    // Make note draggable by header
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
  // 7. SAVE & LOAD DATA
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
      version: 1,
      pageId: state.currentPageId,
      title: state.currentPageTitle,
      subject: state.currentPageSubject,
      updatedAt: Date.now(),
      strokes: state.strokes,
      stickyNotes: state.stickyNotes,
    };

    NativeBridge.save(state.currentPageId, state.currentPageTitle, state.currentPageSubject, data);
    console.log('[SPenEngine] Saved notes for:', state.currentPageTitle, `(${state.strokes.length} strokes)`);
  }

  function loadPageData(pageId) {
    state.strokes = [];
    state.stickyNotes = [];
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
      console.log('[SPenEngine] Loaded notes for:', pageId, `(${state.strokes.length} strokes)`);
    }

    redrawAllStrokes();
    updateToolbarCounters();
  }

  // =========================================================================
  // 8. FLOATING SAMSUNG S-PEN TOOLBAR UI
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

      <div class="spen-status-pill no-stylus" id="spenStatusPill" title="Stylus Status">
        <i class="fa-solid fa-hand-pointer"></i> <span>Touch</span>
      </div>

      <!-- Pen Tool -->
      <button type="button" class="spen-btn active" id="spenToolPen" title="S-Pen (Pen)">
        <i class="fa-solid fa-pen-fancy"></i>
        <span class="spen-color-dot" id="spenPenDot" style="background:#1e293b;"></span>
      </button>

      <!-- Highlighter Tool -->
      <button type="button" class="spen-btn" id="spenToolHighlighter" title="Highlighter">
        <i class="fa-solid fa-highlighter"></i>
        <span class="spen-color-dot" id="spenHighDot" style="background:#facc15;"></span>
      </button>

      <!-- Eraser Tool -->
      <button type="button" class="spen-btn" id="spenToolEraser" title="Stroke Eraser">
        <i class="fa-solid fa-eraser"></i>
      </button>

      <!-- Sticky Note Tool -->
      <button type="button" class="spen-btn" id="spenToolSticky" title="Add Sticky Note">
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

      <!-- Export Annotated Page -->
      <button type="button" class="spen-btn" id="spenBtnExport" title="Export / Share Page with Notes">
        <i class="fa-solid fa-arrow-up-from-bracket"></i>
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
        <div class="spen-popover-title" style="margin-top:6px;">Stroke Width</div>
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
    // Tool buttons
    const btnPen = bar.querySelector('#spenToolPen');
    const btnHigh = bar.querySelector('#spenToolHighlighter');
    const btnEraser = bar.querySelector('#spenToolEraser');
    const btnSticky = bar.querySelector('#spenToolSticky');
    const btnUndo = bar.querySelector('#spenBtnUndo');
    const btnRedo = bar.querySelector('#spenBtnRedo');
    const btnEye = bar.querySelector('#spenBtnToggleEye');
    const btnPalm = bar.querySelector('#spenBtnPalmRejection');
    const btnHub = bar.querySelector('#spenBtnNotesHub');
    const btnExport = bar.querySelector('#spenBtnExport');
    const btnMin = bar.querySelector('#spenBtnMinimize');

    const penPopover = bar.querySelector('#spenPenPopover');
    const highPopover = bar.querySelector('#spenHighPopover');

    btnPen.addEventListener('click', () => {
      NativeBridge.vibrate(1);
      if (state.activeTool === 'pen') {
        penPopover.classList.toggle('active');
        highPopover.classList.remove('active');
      } else {
        setTool('pen');
        highPopover.classList.remove('active');
      }
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

    btnSticky.addEventListener('click', () => {
      NativeBridge.vibrate(1);
      setTool('sticky');
      closeAllPopovers();
      showToast('Tap anywhere on the page to drop a sticky note');
    });

    btnUndo.addEventListener('click', handleUndo);
    btnRedo.addEventListener('click', handleRedo);

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
        btnPalm.title = 'Palm Rejection: ON (Only Stylus Draws)';
        showToast('Palm Rejection: ON (Fingers scroll, S-Pen draws)');
      } else {
        btnPalm.classList.remove('active');
        btnPalm.title = 'Finger Drawing Allowed';
        showToast('Finger Drawing: Enabled');
      }
      NativeBridge.vibrate(1);
    });

    btnHub.addEventListener('click', () => {
      NativeBridge.vibrate(1);
      openConsolidatedNotesHub();
    });

    btnExport.addEventListener('click', exportAnnotatedPage);

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

    // Make toolbar draggable
    makeDraggable(bar, bar.querySelector('#spenDragHandle'));
  }

  function setTool(toolName) {
    state.activeTool = toolName;
    const bar = document.getElementById('spenToolbarContainer');
    if (!bar) return;

    bar.querySelectorAll('.spen-btn').forEach((b) => b.classList.remove('active'));

    if (toolName === 'pen') bar.querySelector('#spenToolPen')?.classList.add('active');
    if (toolName === 'highlighter') bar.querySelector('#spenToolHighlighter')?.classList.add('active');
    if (toolName === 'eraser') bar.querySelector('#spenToolEraser')?.classList.add('active');
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
      const total = state.strokes.length + state.stickyNotes.length;
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
  // 9. CONSOLIDATED NOTES HUB (Tablet Modal / Drawer)
  // "so that my notes are consolidated, and at one place"
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

    // Calculate aggregated metrics
    const totalTopics = allNotes.length;
    let totalStrokes = 0;
    let totalStickies = 0;
    allNotes.forEach((n) => {
      totalStrokes += n.strokeCount || 0;
      totalStickies += n.stickyCount || 0;
    });

    overlay.innerHTML = `
      <div class="spen-hub-modal">
        <div class="spen-hub-header">
          <div class="spen-hub-title-group">
            <div class="spen-hub-crest"><i class="fa-solid fa-feather-pointed"></i></div>
            <div>
              <h2>My Consolidated Study Notes</h2>
              <p>Handwritten S-Pen annotations &amp; notes consolidated across Delhi University LL.B. curriculum</p>
            </div>
          </div>
          <button type="button" class="spen-hub-close-btn" id="spenHubCloseBtn" title="Close Hub (Esc)">
            <i class="fa-solid fa-xmark"></i>
          </button>
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
              <div class="spen-metric-lbl">S-Pen Handwritten Strokes</div>
            </div>
          </div>
          <div class="spen-metric-item">
            <i class="fa-solid fa-note-sticky"></i>
            <div>
              <div class="spen-metric-num">${totalStickies}</div>
              <div class="spen-metric-lbl">Sticky Memos</div>
            </div>
          </div>
        </div>

        <div class="spen-hub-toolbar">
          <div class="spen-hub-search-wrap">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" class="spen-hub-search-input" id="spenHubSearchInput" placeholder="Search annotated topics or keywords...">
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

    // Search filter
    const searchInput = overlay.querySelector('#spenHubSearchInput');
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = allNotes.filter(
        (n) =>
          (n.title && n.title.toLowerCase().includes(q)) ||
          (n.subject && n.subject.toLowerCase().includes(q))
      );
      overlay.querySelector('#spenHubCardsGrid').innerHTML = renderNotesListHtml(filtered);
      attachCardActionEvents(overlay);
    });

    attachCardActionEvents(overlay);
  }

  function renderNotesListHtml(notes) {
    if (!notes || notes.length === 0) {
      return `
        <div class="spen-hub-empty">
          <i class="fa-solid fa-pencil"></i>
          <h3>No Consolidated Notes Yet</h3>
          <p>Open any subject or unit from your syllabus, grab your Samsung Pencil, and start writing notes! Everything automatically consolidates right here.</p>
        </div>
      `;
    }

    return notes
      .map(
        (n) => `
      <div class="spen-note-card" data-page-id="${n.pageId}">
        <div class="spen-note-card-header">
          <span class="spen-note-sub-badge">${escapeHtml(n.subject || 'LL.B. Subject')}</span>
          <span class="spen-note-date">${formatRelativeTime(n.timestamp)}</span>
        </div>
        <h4 class="spen-note-card-title">${escapeHtml(n.title || 'Comprehensive Topic Notes')}</h4>
        <div class="spen-note-stats">
          <span><i class="fa-solid fa-pen-fancy"></i> ${n.strokeCount || 0} strokes</span>
          <span><i class="fa-solid fa-note-sticky"></i> ${n.stickyCount || 0} notes</span>
        </div>
        <div class="spen-note-card-footer">
          <button type="button" class="spen-card-open-btn" data-action="open" data-page-id="${n.pageId}">
            <i class="fa-solid fa-arrow-right-to-bracket"></i> <span>Open &amp; Study</span>
          </button>
          <button type="button" class="spen-card-icon-btn" data-action="delete" data-page-id="${n.pageId}" title="Delete Notes for this Topic">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `
      )
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
    showToast('Opening topic with saved annotations...');
    // If the topic was opened via portal router
    const allNotes = NativeBridge.getAllIndex();
    const target = allNotes.find((n) => n.pageId === pageId);
    if (target) {
      // Trigger reader opening if available in parent window
      if (typeof window.openReader === 'function') {
        window.openReader(target.fileUrl || '', target.title, target.subject);
      } else {
        // Find links in subjects
        showToast('Topic ready: ' + target.title);
      }
    }
  }

  // =========================================================================
  // 10. EXPORT / SHARE ANNOTATED PAGE
  // =========================================================================
  function exportAnnotatedPage() {
    if (!state.canvas) {
      showToast('No active notes canvas to export');
      return;
    }

    NativeBridge.vibrate(1);
    showToast('Generating high-resolution snapshot...');

    try {
      const canvas = state.canvas;
      const dataUrl = canvas.toDataURL('image/png');
      const title = state.currentPageTitle || 'MakeLawEasy_StudyNotes';
      NativeBridge.exportImage(dataUrl, title);
      showToast('Export ready! Saved / Shared successfully');
    } catch (e) {
      console.error('[SPenEngine] Export failed:', e);
      showToast('Export failed: ' + e.message);
    }
  }

  // =========================================================================
  // 11. TOAST NOTIFICATIONS
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
  // 12. UTILITY FUNCTIONS
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
  // 13. LIFECYCLE & CONTINUOUS SYNC
  // =========================================================================
  function initEngine() {
    createToolbar();
    initStylusDetection();

    // Check current page / reader context every 500ms
    setInterval(() => {
      attachCanvasToContext();
    }, 600);

    // Escape closes popovers and hub
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllPopovers();
        closeConsolidatedNotesHub();
      }
    });

    console.log('[SPenEngine] Samsung S-Pen & Consolidated Notes Suite ready.');
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEngine);
  } else {
    initEngine();
  }
})();
