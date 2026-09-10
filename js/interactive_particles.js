/**
 * DELHI UNIVERSITY LAW NOTES PORTAL — INTERACTIVE GPU PARTICLES
 * 
 * Ported from Bruno Imbrizi's Three.js Interactive Particles & VengeanceUI
 * Samples an image or procedural Scales of Justice emblem into thousands of
 * WebGL GPU particles that scatter and flow around the cursor via an off-screen
 * touch-texture with simplex-noise displacement and smooth GSAP entrance animations.
 */

(function () {
  'use strict';

  // Ashima / Stefan Gustavson 2D simplex noise inlined in GLSL
  const SIMPLEX_2D = /* glsl */ `
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
      m = m * m; m = m * m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
  `;

  const VERT = /* glsl */ `
    precision highp float;

    attribute float pindex;
    attribute vec3 position;
    attribute vec3 offset;
    attribute vec2 uv;
    attribute float angle;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    uniform float uTime;
    uniform float uRandom;
    uniform float uDepth;
    uniform float uSize;
    uniform vec2 uTextureSize;
    uniform sampler2D uTexture;
    uniform sampler2D uTouch;

    varying vec2 vPUv;
    varying vec2 vUv;

    ${SIMPLEX_2D}

    float random(float n) {
      return fract(sin(n) * 43758.5453123);
    }

    void main() {
      vUv = uv;

      vec2 puv = offset.xy / uTextureSize;
      vPUv = puv;

      vec4 colA = texture2D(uTexture, puv);
      float grey = max(max(colA.r, colA.g), colA.b);

      vec3 displaced = offset;
      displaced.xy += vec2(random(pindex) - 0.5, random(offset.x + pindex) - 0.5) * uRandom;
      float rndz = (random(pindex) + snoise(vec2(pindex * 0.1, uTime * 0.12)));
      displaced.z += rndz * (random(pindex) * 2.0 * uDepth);
      displaced.xy -= uTextureSize * 0.5;

      float t = texture2D(uTouch, puv).r;
      displaced.z += t * 38.0 * rndz;
      displaced.x += cos(angle) * t * 38.0 * rndz;
      displaced.y += sin(angle) * t * 38.0 * rndz;

      float psize = (snoise(vec2(uTime * 0.25, pindex * 0.2)) * 0.45 + 2.2);
      psize *= max(grey, 0.4);
      psize *= uSize;

      vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
      mvPosition.xyz += position * psize;
      vec4 finalPosition = projectionMatrix * mvPosition;

      gl_Position = finalPosition;
    }
  `;

  const FRAG = /* glsl */ `
    precision highp float;

    uniform sampler2D uTexture;
    uniform vec3 uColor;

    varying vec2 vPUv;
    varying vec2 vUv;

    void main() {
      // Soft, circular feathered particle dot
      float dist = 0.5 - distance(vUv, vec2(0.5));
      if (dist < 0.0) discard;
      float t = smoothstep(0.0, 0.35, dist);

      vec4 colA = texture2D(uTexture, vPUv);
      float bright = max(max(colA.r, colA.g), colA.b);
      float alpha = t * clamp(bright * 1.5, 0.55, 1.0);

      // Radiant gold / amber tint with warm sparkling core
      vec3 goldTint = mix(uColor, vec3(1.0, 0.96, 0.82), t * 0.35);

      gl_FragColor = vec4(goldTint, alpha);
    }
  `;

  /**
   * Touch trail canvas encoder
   */
  class TouchTexture {
    constructor(radius = 0.22) {
      this.size = 64;
      this.maxAge = 120;
      this.radius = radius;
      this.trail = [];
      this.canvas = document.createElement("canvas");
      this.canvas.width = this.canvas.height = this.size;
      this.ctx = this.canvas.getContext("2d");
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, 0, this.size, this.size);
      this.texture = new THREE.Texture(this.canvas);
    }

    easeOutSine(t, b, c, d) {
      return c * Math.sin((t / d) * (Math.PI / 2)) + b;
    }

    addTouch(x, y) {
      let force = 0;
      const last = this.trail[this.trail.length - 1];
      if (last) {
        const dx = last.x - x;
        const dy = last.y - y;
        force = Math.min((dx * dx + dy * dy) * 12000, 1);
      }
      this.trail.push({ x, y, age: 0, force });
    }

    update() {
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, 0, this.size, this.size);

      for (let i = this.trail.length - 1; i >= 0; i--) {
        this.trail[i].age++;
        if (this.trail[i].age > this.maxAge) this.trail.splice(i, 1);
      }
      for (const point of this.trail) this.drawTouch(point);

      this.texture.needsUpdate = true;
    }

    drawTouch(point) {
      const pos = { x: point.x * this.size, y: (1 - point.y) * this.size };
      let intensity;
      if (point.age < this.maxAge * 0.3) {
        intensity = this.easeOutSine(point.age / (this.maxAge * 0.3), 0, 1, 1);
      } else {
        intensity = this.easeOutSine(1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7), 0, 1, 1);
      }
      intensity *= Math.max(point.force, 0.4);

      const radius = this.size * this.radius * intensity;
      const grd = this.ctx.createRadialGradient(pos.x, pos.y, radius * 0.2, pos.x, pos.y, radius);
      grd.addColorStop(0, "rgba(255, 255, 255, 0.4)");
      grd.addColorStop(1, "rgba(0, 0, 0, 0.0)");
      this.ctx.beginPath();
      this.ctx.fillStyle = grd;
      this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  /**
   * Main Interactive Particles Controller
   */
  class InteractiveParticlesController {
    constructor(options = {}) {
      this.container = typeof options.container === 'string' ? document.querySelector(options.container) : options.container;
      if (!this.container) return;

      this.src = options.src || 'particles.png';
      this.color = options.color || '#e5b869'; // Radiant Gold
      this.size = options.size || 1.8;
      this.randomness = options.randomness || 1.4;
      this.depth = options.depth || 3.8;
      this.touchRadius = options.touchRadius || 0.22;
      this.threshold = options.threshold || 25;
      this.maxDimension = options.maxDimension || 260;
      this.allowUpload = options.allowUpload !== false;

      this.disposed = false;
      this.isInViewport = true;
      this.lastRender = 0;
      this.frameInterval = 1000 / 30; // 30fps throttle for silky-smooth performance

      this.init();
    }

    init() {
      if (typeof THREE === 'undefined') {
        console.warn('[InteractiveParticles] Three.js not found. Skipping WebGL particle initialization.');
        return;
      }

      this.setupDOM();
      this.setupThree();
      this.setupEvents();

      // Start with the procedural emblem canvas immediately (0ms latency fallback)
      const fallbackCanvas = this.createDefaultEmblemCanvas();
      this.buildParticlesFromCanvas(fallbackCanvas);

      // Also attempt to load external image if provided
      if (this.src) {
        this.loadExternalImage(this.src);
      }
    }

    createDefaultEmblemCanvas() {
      const c = document.createElement('canvas');
      c.width = 280;
      c.height = 280;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 280, 280);

      ctx.strokeStyle = '#ffffff';
      ctx.fillStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const cx = 140, cy = 140;

      // Pedestal Base
      ctx.beginPath();
      ctx.rect(cx - 50, cy + 85, 100, 12);
      ctx.rect(cx - 30, cy + 75, 60, 10);
      ctx.fill();

      // Central Column
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy + 75);
      ctx.lineTo(cx - 5, cy - 70);
      ctx.lineTo(cx + 5, cy - 70);
      ctx.lineTo(cx + 6, cy + 75);
      ctx.closePath();
      ctx.fill();

      // Top Finial
      ctx.beginPath();
      ctx.arc(cx, cy - 80, 7, 0, Math.PI * 2);
      ctx.fill();

      // Cross Beam
      ctx.beginPath();
      ctx.lineWidth = 4.5;
      ctx.moveTo(cx - 95, cy - 55);
      ctx.lineTo(cx + 95, cy - 55);
      ctx.stroke();

      // Center pivot
      ctx.beginPath();
      ctx.arc(cx, cy - 55, 8, 0, Math.PI * 2);
      ctx.stroke();

      // Left & right beam tips
      ctx.beginPath();
      ctx.arc(cx - 95, cy - 55, 5, 0, Math.PI * 2);
      ctx.arc(cx + 95, cy - 55, 5, 0, Math.PI * 2);
      ctx.fill();

      // Left Strings
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 95, cy - 55);
      ctx.lineTo(cx - 118, cy + 10);
      ctx.moveTo(cx - 95, cy - 55);
      ctx.lineTo(cx - 72, cy + 10);
      ctx.stroke();

      // Left Pan
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.arc(cx - 95, cy + 10, 24, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 120, cy + 10);
      ctx.lineTo(cx - 70, cy + 10);
      ctx.stroke();

      // Right Strings
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx + 95, cy - 55);
      ctx.lineTo(cx + 72, cy + 10);
      ctx.moveTo(cx + 95, cy - 55);
      ctx.lineTo(cx + 118, cy + 10);
      ctx.stroke();

      // Right Pan
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.arc(cx + 95, cy + 10, 24, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 70, cy + 10);
      ctx.lineTo(cx + 120, cy + 10);
      ctx.stroke();

      // Constellation Stardust Ring
      const numStars = 200;
      for (let i = 0; i < numStars; i++) {
        const angle = (i / numStars) * Math.PI * 2;
        const dist = 115 + (Math.sin(i * 14.5) * 0.5 + 0.5) * 24;
        const sx = cx + Math.cos(angle) * dist;
        const sy = cy + Math.sin(angle) * dist;
        const rad = (i % 4 === 0) ? 2.2 : 1.4;
        ctx.beginPath();
        ctx.arc(sx, sy, rad, 0, Math.PI * 2);
        ctx.fill();
      }

      return c;
    }

    setupDOM() {
      this.container.classList.add('interactive-particles-wrap');
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'interactive-particles-canvas';
      this.container.appendChild(this.canvas);

      // Create Upload Control if allowed
      if (this.allowUpload) {
        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.accept = 'image/*';
        this.fileInput.style.display = 'none';
        this.container.appendChild(this.fileInput);

        this.uploadBtn = document.createElement('button');
        this.uploadBtn.type = 'button';
        this.uploadBtn.className = 'particles-upload-btn';
        this.uploadBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> <span>Custom Emblem</span>';
        this.uploadBtn.title = 'Upload any image to morph the interactive particle field';
        this.container.appendChild(this.uploadBtn);

        this.uploadBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.fileInput.click();
        });
        this.fileInput.addEventListener('change', (e) => {
          const file = e.target.files?.[0];
          if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (ev) => {
              const img = new Image();
              img.onload = () => this.buildParticlesFromImage(img);
              img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
          }
        });
      }
    }

    setupThree() {
      const rect = this.container.getBoundingClientRect();
      const width = rect.width || this.container.clientWidth || window.innerWidth || 800;
      const height = rect.height || this.container.clientHeight || 520;

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
      this.camera.position.z = 300;

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true
      });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.setSize(width, height);
      this.renderer.setClearColor(0x000000, 0);

      this.fovHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z;
      this.clock = new THREE.Clock(true);
      this.container3D = new THREE.Object3D();
      this.scene.add(this.container3D);

      this.raycaster = new THREE.Raycaster();
      this.mouseNDC = new THREE.Vector2();
    }

    loadExternalImage(src) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (!this.disposed) this.buildParticlesFromImage(img);
      };
      img.onerror = () => {
        console.log('[InteractiveParticles] Fallback procedural emblem active.');
      };
      img.src = src;
    }

    buildParticlesFromImage(image) {
      const longest = Math.max(image.width, image.height);
      const scaleDown = longest > this.maxDimension ? this.maxDimension / longest : 1;
      const w = Math.max(1, Math.round(image.width * scaleDown));
      const h = Math.max(1, Math.round(image.height * scaleDown));

      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d');
      ctx.drawImage(image, 0, 0, w, h);
      this.buildParticlesFromCanvas(c);
    }

    buildParticlesFromCanvas(canvas) {
      if (this.disposed) return;

      if (this.object3D) {
        this.container3D.remove(this.object3D);
        if (this.object3D.geometry) this.object3D.geometry.dispose();
        if (this.object3D.material) this.object3D.material.dispose();
        this.object3D = null;
      }
      if (this.hitArea) {
        this.container3D.remove(this.hitArea);
        if (this.hitArea.geometry) this.hitArea.geometry.dispose();
        if (this.hitArea.material) this.hitArea.material.dispose();
        this.hitArea = null;
      }

      this.imgWidth = canvas.width;
      this.imgHeight = canvas.height;
      const numPoints = this.imgWidth * this.imgHeight;

      // Inverted read canvas for WebGL texture orientation
      const readCanvas = document.createElement('canvas');
      readCanvas.width = this.imgWidth;
      readCanvas.height = this.imgHeight;
      const rctx = readCanvas.getContext('2d');
      rctx.scale(1, -1);
      rctx.drawImage(canvas, 0, 0, this.imgWidth, this.imgHeight * -1);
      const colors = Float32Array.from(rctx.getImageData(0, 0, this.imgWidth, this.imgHeight).data);

      let numVisible = 0;
      for (let i = 0; i < numPoints; i++) {
        const r = colors[i * 4];
        const g = colors[i * 4 + 1];
        const b = colors[i * 4 + 2];
        const a = colors[i * 4 + 3];
        const bright = Math.max(r, g, b);
        if (bright > this.threshold || (a > 40 && bright > 15)) numVisible++;
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      this.uniforms = {
        uTime: { value: 0 },
        uRandom: { value: this.randomness },
        uDepth: { value: this.depth },
        uSize: { value: this.size },
        uTextureSize: { value: new THREE.Vector2(this.imgWidth, this.imgHeight) },
        uTexture: { value: texture },
        uTouch: { value: null },
        uColor: { value: new THREE.Color(this.color) },
      };

      const material = new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: VERT,
        fragmentShader: FRAG,
        depthTest: false,
        depthWrite: false,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });

      const geometry = new THREE.InstancedBufferGeometry();

      const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3);
      positions.setXYZ(0, -0.5, 0.5, 0.0);
      positions.setXYZ(1, 0.5, 0.5, 0.0);
      positions.setXYZ(2, -0.5, -0.5, 0.0);
      positions.setXYZ(3, 0.5, -0.5, 0.0);
      geometry.setAttribute('position', positions);

      const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
      uvs.setXY(0, 0.0, 0.0);
      uvs.setXY(1, 1.0, 0.0);
      uvs.setXY(2, 0.0, 1.0);
      uvs.setXY(3, 1.0, 1.0);
      geometry.setAttribute('uv', uvs);

      geometry.setIndex(new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 1, 2, 3]), 1));

      const indices = new Uint16Array(numVisible);
      const offsets = new Float32Array(numVisible * 3);
      const angles = new Float32Array(numVisible);
      for (let i = 0, j = 0; i < numPoints; i++) {
        const r = colors[i * 4];
        const g = colors[i * 4 + 1];
        const b = colors[i * 4 + 2];
        const a = colors[i * 4 + 3];
        const bright = Math.max(r, g, b);
        if (bright <= this.threshold && !(a > 40 && bright > 15)) continue;
        offsets[j * 3 + 0] = i % this.imgWidth;
        offsets[j * 3 + 1] = Math.floor(i / this.imgWidth);
        indices[j] = i;
        angles[j] = Math.random() * Math.PI;
        j++;
      }
      geometry.setAttribute('pindex', new THREE.InstancedBufferAttribute(indices, 1, false));
      geometry.setAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 3, false));
      geometry.setAttribute('angle', new THREE.InstancedBufferAttribute(angles, 1, false));

      this.object3D = new THREE.Mesh(geometry, material);
      this.container3D.add(this.object3D);

      // Hit plane for cursor raycasting — must have transparent opacity: 0 with visible: true
      const hitGeo = new THREE.PlaneGeometry(this.imgWidth, this.imgHeight, 1, 1);
      const hitMat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthTest: false,
        depthWrite: false
      });
      this.hitArea = new THREE.Mesh(hitGeo, hitMat);
      this.container3D.add(this.hitArea);

      if (!this.touch) {
        this.touch = new TouchTexture(this.touchRadius);
      }
      this.uniforms.uTouch.value = this.touch.texture;

      this.applyScale();

      // Intro GSAP animations
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(this.uniforms.uSize, { value: 0.3 }, { value: this.size, duration: 1.2, ease: "power2.out" });
        gsap.to(this.uniforms.uRandom, { value: this.randomness, duration: 1.2, ease: "power2.out" });
        gsap.fromTo(this.uniforms.uDepth, { value: 30.0 }, { value: this.depth, duration: 1.6, ease: "power3.out" });
      } else {
        this.uniforms.uSize.value = this.size;
        this.uniforms.uRandom.value = this.randomness;
        this.uniforms.uDepth.value = this.depth;
      }
    }

    applyScale() {
      if (!this.object3D || !this.hitArea || !this.imgHeight) return;
      const scale = (this.fovHeight / this.imgHeight) * 0.95;
      this.object3D.scale.set(scale, scale, 1);
      this.hitArea.scale.set(scale, scale, 1);
    }

    setupEvents() {
      const hero = this.container.closest('.sem-hero-cinematic') || this.container;

      this.onPointerMove = (e) => {
        if (!this.hitArea || !this.touch || !this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        this.mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.mouseNDC, this.camera);
        const hits = this.raycaster.intersectObject(this.hitArea);
        if (hits.length > 0 && hits[0].uv) {
          this.touch.addTouch(hits[0].uv.x, hits[0].uv.y);
        }
      };

      hero.addEventListener('pointermove', this.onPointerMove, { passive: true });

      this.onResize = () => {
        if (!this.container || !this.camera || !this.renderer) return;
        const rect = this.container.getBoundingClientRect();
        const width = rect.width || this.container.clientWidth || window.innerWidth || 800;
        const height = rect.height || this.container.clientHeight || 520;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.fovHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z;
        this.renderer.setSize(width, height);
        this.applyScale();
      };

      window.addEventListener('resize', this.onResize, { passive: true });

      if (window.ResizeObserver) {
        this.resizeObserver = new ResizeObserver(() => this.onResize());
        this.resizeObserver.observe(this.container);
      }

      // Visibility & Performance observer
      this.visibilityObserver = new IntersectionObserver(([entry]) => {
        this.isInViewport = entry.isIntersecting;
        this.updateAnimationLoop();
      }, { rootMargin: '160px' });
      this.visibilityObserver.observe(this.container);

      document.addEventListener('visibilitychange', () => this.updateAnimationLoop());

      this.updateAnimationLoop();
    }

    updateAnimationLoop() {
      if (!this.renderer) return;
      this.renderer.setAnimationLoop(!this.disposed && this.isInViewport && !document.hidden ? (timestamp) => this.renderFrame(timestamp) : null);
    }

    renderFrame(timestamp) {
      if (timestamp - this.lastRender < this.frameInterval) return;
      this.lastRender = timestamp;
      const delta = Math.min(this.clock.getDelta(), 0.05);
      if (this.touch) this.touch.update();
      if (this.uniforms) this.uniforms.uTime.value += delta;
      this.renderer.render(this.scene, this.camera);
    }

    destroy() {
      this.disposed = true;
      if (this.renderer) this.renderer.setAnimationLoop(null);
      if (this.visibilityObserver) this.visibilityObserver.disconnect();
      if (this.resizeObserver) this.resizeObserver.disconnect();
      window.removeEventListener('resize', this.onResize);
      if (this.object3D) {
        this.object3D.geometry.dispose();
        this.object3D.material.dispose();
      }
      if (this.hitArea) {
        this.hitArea.geometry.dispose();
        this.hitArea.material.dispose();
      }
      if (this.touch && this.touch.texture) this.touch.texture.dispose();
      if (this.renderer) this.renderer.dispose();
    }
  }

  // Export globally
  window.InteractiveParticlesController = InteractiveParticlesController;

  // Bulletproof auto-boot
  function bootInteractiveParticles() {
    const container = document.getElementById('interactiveParticlesContainer');
    if (container && !window.activeParticles) {
      window.activeParticles = new InteractiveParticlesController({
        container: container,
        src: 'particles.png',
        color: '#e5b869', // Radiant Gold
        size: 1.8,
        randomness: 1.4,
        depth: 3.8,
        touchRadius: 0.22,
        threshold: 25,
        allowUpload: true
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootInteractiveParticles);
  } else {
    bootInteractiveParticles();
  }

})();
