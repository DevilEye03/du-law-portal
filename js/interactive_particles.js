/**
 * DELHI UNIVERSITY LAW NOTES PORTAL — INTERACTIVE GPU PARTICLES
 * 
 * Ported from Bruno Imbrizi's Three.js Interactive Particles & VengeanceUI
 * Samples an image into thousands of WebGL GPU particles that scatter and
 * flow around the cursor via an off-screen touch-texture with simplex-noise
 * displacement and smooth GSAP entrance animations.
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
      float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;

      vec3 displaced = offset;
      displaced.xy += vec2(random(pindex) - 0.5, random(offset.x + pindex) - 0.5) * uRandom;
      float rndz = (random(pindex) + snoise(vec2(pindex * 0.1, uTime * 0.1)));
      displaced.z += rndz * (random(pindex) * 2.0 * uDepth);
      displaced.xy -= uTextureSize * 0.5;

      float t = texture2D(uTouch, puv).r;
      displaced.z += t * 25.0 * rndz;
      displaced.x += cos(angle) * t * 25.0 * rndz;
      displaced.y += sin(angle) * t * 25.0 * rndz;

      float psize = (snoise(vec2(uTime, pindex) * 0.5) + 2.0);
      psize *= max(grey, 0.2);
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
      vec2 uv = vUv;
      vec2 puv = vPUv;

      vec4 colA = texture2D(uTexture, puv);
      float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;

      // Soft, feathered circular particle dot
      float radius = 0.5;
      float border = 0.45;
      float dist = radius - distance(uv, vec2(0.5));
      float t = smoothstep(0.0, border, dist);

      // Gold / amber tinting
      vec3 rgb = vec3(grey) * uColor;
      float alpha = t * (0.35 + 0.65 * grey);

      gl_FragColor = vec4(rgb, alpha);
    }
  `;

  /**
   * Touch trail canvas encoder
   */
  class TouchTexture {
    constructor(radius = 0.18) {
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
        force = Math.min((dx * dx + dy * dy) * 10000, 1);
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
      intensity *= point.force;

      const radius = this.size * this.radius * intensity;
      const grd = this.ctx.createRadialGradient(pos.x, pos.y, radius * 0.25, pos.x, pos.y, radius);
      grd.addColorStop(0, "rgba(255, 255, 255, 0.25)");
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

      this.src = options.src || 'img/particles.png';
      this.color = options.color || '#e5b869'; // Radiant Gold
      this.size = options.size || 1.35;
      this.randomness = options.randomness || 1.8;
      this.depth = options.depth || 3.2;
      this.touchRadius = options.touchRadius || 0.18;
      this.threshold = options.threshold || 30;
      this.maxDimension = options.maxDimension || 260;
      this.allowUpload = options.allowUpload !== false;

      this.disposed = false;
      this.isInViewport = true;
      this.lastRender = 0;
      this.frameInterval = 1000 / 30; // Smooth 30fps GPU throttle

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
      this.loadTexture(this.src);
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

        this.uploadBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => {
          const file = e.target.files?.[0];
          if (file && file.type.startsWith('image/')) {
            if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
            this.objectUrl = URL.createObjectURL(file);
            this.loadTexture(this.objectUrl);
          }
        });
      }
    }

    setupThree() {
      const width = this.container.clientWidth || window.innerWidth || 800;
      const height = this.container.clientHeight || 520;

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

    loadTexture(src) {
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

      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');
      loader.load(src, (texture) => {
        if (this.disposed) {
          texture.dispose();
          return;
        }

        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const image = texture.image;
        const longest = Math.max(image.width, image.height);
        const scaleDown = longest > this.maxDimension ? this.maxDimension / longest : 1;
        this.imgWidth = Math.max(1, Math.round(image.width * scaleDown));
        this.imgHeight = Math.max(1, Math.round(image.height * scaleDown));
        const numPoints = this.imgWidth * this.imgHeight;

        // Sample pixel brightness
        const readCanvas = document.createElement('canvas');
        readCanvas.width = this.imgWidth;
        readCanvas.height = this.imgHeight;
        const rctx = readCanvas.getContext('2d');
        rctx.scale(1, -1);
        rctx.drawImage(image, 0, 0, this.imgWidth, this.imgHeight * -1);
        const colors = Float32Array.from(rctx.getImageData(0, 0, this.imgWidth, this.imgHeight).data);

        let numVisible = 0;
        for (let i = 0; i < numPoints; i++) {
          if (colors[i * 4] > this.threshold) numVisible++;
        }

        this.uniforms = {
          uTime: { value: 0 },
          uRandom: { value: 1.0 },
          uDepth: { value: 2.0 },
          uSize: { value: 0.0 },
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
          transparent: true,
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

        geometry.setIndex(new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1));

        const indices = new Uint16Array(numVisible);
        const offsets = new Float32Array(numVisible * 3);
        const angles = new Float32Array(numVisible);
        for (let i = 0, j = 0; i < numPoints; i++) {
          if (colors[i * 4] <= this.threshold) continue;
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

        // Invisible hit plane for cursor raycasting
        const hitGeo = new THREE.PlaneGeometry(this.imgWidth, this.imgHeight, 1, 1);
        const hitMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, depthTest: false });
        hitMat.visible = false;
        this.hitArea = new THREE.Mesh(hitGeo, hitMat);
        this.container3D.add(this.hitArea);

        this.touch = new TouchTexture(this.touchRadius);
        this.uniforms.uTouch.value = this.touch.texture;

        this.applyScale();

        // Intro GSAP animations
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(this.uniforms.uSize, { value: 0.4 }, { value: this.size, duration: 1.2, ease: "power2.out" });
          gsap.to(this.uniforms.uRandom, { value: this.randomness, duration: 1.2, ease: "power2.out" });
          gsap.fromTo(this.uniforms.uDepth, { value: 35.0 }, { value: this.depth, duration: 1.6, ease: "power3.out" });
        } else {
          this.uniforms.uSize.value = this.size;
          this.uniforms.uRandom.value = this.randomness;
          this.uniforms.uDepth.value = this.depth;
        }
      }, undefined, (err) => {
        console.warn('[InteractiveParticles] Failed to load particle texture:', err);
      });
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

      hero.addEventListener('pointermove', this.onPointerMove);

      this.onResize = () => {
        if (!this.container || !this.camera || !this.renderer) return;
        const width = this.container.clientWidth || window.innerWidth || 800;
        const height = this.container.clientHeight || 520;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.fovHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z;
        this.renderer.setSize(width, height);
        this.applyScale();
      };

      window.addEventListener('resize', this.onResize);

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
      window.removeEventListener('resize', this.onResize);
      if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
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

  // Auto-mount on load when container exists
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('interactiveParticlesContainer');
    if (container) {
      window.activeParticles = new InteractiveParticlesController({
        container: container,
        src: 'img/particles.png',
        color: '#e5b869', // Luxury DU Gold / Amber
        background: 'transparent',
        size: 1.35,
        randomness: 1.8,
        depth: 3.2,
        touchRadius: 0.18,
        threshold: 28,
        allowUpload: true
      });
    }
  });

})();
