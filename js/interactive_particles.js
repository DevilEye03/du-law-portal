/**
 * DELHI UNIVERSITY LAW NOTES PORTAL — INTERACTIVE GPU PARTICLES
 * 
 * Ported from Bruno Imbrizi's Three.js Interactive Particles & VengeanceUI.
 * Renders the headline text "Study Smarter, Pass with Distinction." directly
 * into thousands of WebGL GPU particles that disperse and scatter under cursor
 * hover and seamlessly re-assemble with 2D simplex noise and glowing gold stardust.
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
    varying vec3 vColor;

    ${SIMPLEX_2D}

    float random(float n) {
      return fract(sin(n) * 43758.5453123);
    }

    void main() {
      vUv = uv;

      vec2 puv = offset.xy / uTextureSize;
      vPUv = puv;

      vec4 colA = texture2D(uTexture, puv);
      vColor = colA.rgb;

      vec3 displaced = offset;
      displaced.xy += vec2(random(pindex) - 0.5, random(offset.x + pindex) - 0.5) * uRandom;
      float rndz = (random(pindex) + snoise(vec2(pindex * 0.1, uTime * 0.14)));
      displaced.z += rndz * (random(pindex) * 2.0 * uDepth);
      displaced.xy -= uTextureSize * 0.5;

      float t = texture2D(uTouch, puv).r;
      displaced.z += t * 38.0 * rndz;
      displaced.x += cos(angle) * t * 38.0 * rndz;
      displaced.y += sin(angle) * t * 38.0 * rndz;

      float psize = (snoise(vec2(uTime * 0.25, pindex * 0.2)) * 0.4 + 2.4);
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
    varying vec2 vPUv;
    varying vec2 vUv;
    varying vec3 vColor;

    void main() {
      // Feathered circular particle dot
      float dist = 0.5 - distance(vUv, vec2(0.5));
      if (dist < 0.0) discard;
      float t = smoothstep(0.0, 0.35, dist);

      float bright = max(max(vColor.r, vColor.g), vColor.b);
      if (bright < 0.08) discard;

      // Radiant sparkling core
      vec3 finalColor = mix(vColor, vec3(1.0, 0.98, 0.92), t * 0.35);
      float alpha = t * clamp(bright * 1.5, 0.65, 1.0);

      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  /**
   * Touch trail canvas encoder
   */
  class TouchTexture {
    constructor(radius = 0.24) {
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
      intensity *= Math.max(point.force, 0.45);

      const radius = this.size * this.radius * intensity;
      const grd = this.ctx.createRadialGradient(pos.x, pos.y, radius * 0.2, pos.x, pos.y, radius);
      grd.addColorStop(0, "rgba(255, 255, 255, 0.45)");
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

      this.size = options.size || 1.8;
      this.randomness = options.randomness || 1.3;
      this.depth = options.depth || 3.6;
      this.touchRadius = options.touchRadius || 0.24;
      this.threshold = options.threshold || 25;
      this.maxDimension = options.maxDimension || 340;

      this.disposed = false;
      this.isInViewport = true;
      this.lastRender = 0;
      this.frameInterval = 1000 / 30; // 30fps smooth GPU throttle

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

      // Render the typographic text into particles immediately
      const textCanvas = this.createTextCanvas();
      this.buildParticlesFromCanvas(textCanvas);

      // Listen for custom web font load to re-rasterize if font was pending
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          if (!this.disposed) {
            const fontCanvas = this.createTextCanvas();
            this.buildParticlesFromCanvas(fontCanvas);
          }
        });
      }

      // Mark container as active to transition from HTML fallback
      this.container.classList.add('particles-active');
    }

    createTextCanvas() {
      const c = document.createElement('canvas');
      c.width = 980;
      c.height = 240;
      const ctx = c.getContext('2d');

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, c.width, c.height);

      ctx.textBaseline = 'middle';

      const fontWhite = '700 96px "Playfair Display", Georgia, serif';
      const fontGold = 'italic 700 98px "Playfair Display", Georgia, serif';

      ctx.font = fontWhite;
      const w1 = ctx.measureText('Made Law ').width;
      ctx.font = fontGold;
      const w2 = ctx.measureText('Easy.').width;
      const totalW = w1 + w2;

      const startX = Math.max(20, (c.width - totalW) / 2);
      const cy = c.height / 2;

      // "Made Law " in pure white
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ffffff';
      ctx.font = fontWhite;
      ctx.fillText('Made Law ', startX, cy);

      // "Easy." in radiant gold italic with period dot matching reference
      const goldGrad = ctx.createLinearGradient(startX + w1, cy - 40, startX + w1 + w2, cy + 40);
      goldGrad.addColorStop(0, '#fcedc7');
      goldGrad.addColorStop(0.45, '#e5b869');
      goldGrad.addColorStop(1, '#c59b27');
      ctx.fillStyle = goldGrad;
      ctx.font = fontGold;
      ctx.fillText('Easy.', startX + w1, cy);

      return c;
    }

    setupDOM() {
      this.container.classList.add('interactive-particles-wrap');
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'interactive-particles-canvas';
      this.container.appendChild(this.canvas);
    }

    setupThree() {
      const rect = this.container.getBoundingClientRect();
      const width = rect.width || this.container.clientWidth || window.innerWidth || 800;
      const height = rect.height || this.container.clientHeight || 220;

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

      const aspect = canvas.width / canvas.height;
      this.imgWidth = this.maxDimension;
      this.imgHeight = Math.max(1, Math.round(this.maxDimension / aspect));
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
        const bright = Math.max(r, g, b);
        if (bright > this.threshold) numVisible++;
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
        const bright = Math.max(r, g, b);
        if (bright <= this.threshold) continue;
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

      // Hit plane for cursor raycasting — transparent opacity: 0 with visible: true
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
        gsap.fromTo(this.uniforms.uDepth, { value: 25.0 }, { value: this.depth, duration: 1.5, ease: "power3.out" });
      } else {
        this.uniforms.uSize.value = this.size;
        this.uniforms.uRandom.value = this.randomness;
        this.uniforms.uDepth.value = this.depth;
      }
    }

    applyScale() {
      if (!this.object3D || !this.hitArea || !this.imgHeight || !this.imgWidth) return;
      const width = this.container.clientWidth || 800;
      const height = this.container.clientHeight || 200;
      const scaleH = (this.fovHeight / this.imgHeight) * 0.86;
      const scaleW = ((this.fovHeight * (width / height)) / this.imgWidth) * 0.90;
      const scale = Math.min(scaleH, scaleW);
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
        const height = rect.height || this.container.clientHeight || 220;
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

  // Auto-boot
  function bootInteractiveParticles() {
    const container = document.getElementById('interactiveParticlesContainer');
    if (container && !window.activeParticles) {
      window.activeParticles = new InteractiveParticlesController({
        container: container,
        size: 1.8,
        randomness: 1.3,
        depth: 3.6,
        touchRadius: 0.24,
        threshold: 25
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootInteractiveParticles);
  } else {
    bootInteractiveParticles();
  }

})();
