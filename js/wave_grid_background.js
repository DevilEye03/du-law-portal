/**
 * Wave Grid Background — 3D Interactive Instanced Mesh
 * Ported from VengeanceUI WaveGridBackground (Three.js + custom GLSL)
 *
 * An interactive 40x40 grid of instanced cubes that ripple with fluid,
 * wave-like motion in response to the cursor (with gentle auto-generated
 * ripples when idle).
 */

(function () {
  'use strict';

  const MAX_TRAIL = 128;

  function overrideVertexShader(vertexShader) {
    return vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        varying float vHeight;
        attribute vec2 aOffset;
        uniform sampler2D uTrailTexture;
        uniform int       uTrailCount;
        uniform float     uWaveSpeed;
        uniform float     uWaveFreq;
        uniform float     uWaveWidth;
        uniform float     uFadeTime;
        uniform float     uAmplitude;
        uniform float     uJitter;
        uniform float     uMaxHeight;

        vec2 hash2( vec2 p ) {
          p = vec2( dot( p, vec2( 127.1, 311.7 ) ), dot( p, vec2( 269.5, 183.3 ) ) );
          return fract( sin( p ) * 43758.5453123 ) - 0.5;
        }`
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>

        vHeight = 0.0;

        if ( position.y > 0.0 ) {
          vec2 jitter  = hash2( aOffset ) * uJitter;
          vec2 worldXZ = aOffset + jitter;
          float waveHeight  = 0.0;
          float totalWeight = 0.0;

          for ( int i = 0; i < uTrailCount; i++ ) {
            vec4 td = texture2D( uTrailTexture, vec2( ( float(i) + 0.5 ) / 128.0, 0.5 ) );
            float dist      = length( worldXZ - td.rg );
            float wavefront = uWaveSpeed * td.b;
            float relDist   = dist - wavefront;

            float window = exp( -( relDist * relDist ) / ( uWaveWidth * uWaveWidth ) );
            float fade   = exp( -td.b / uFadeTime );
            float atten  = 1.0 / ( 1.0 + dist * 0.1 );
            float weight = fade * window * atten * td.a;

            waveHeight  += weight * cos( uWaveFreq * relDist );
            totalWeight += weight;
          }

          waveHeight /= max( totalWeight, 1.0 );

          float displacement = clamp( waveHeight * uAmplitude, -uMaxHeight, uMaxHeight );
          transformed.y += displacement;
          vHeight = displacement;
        }`
      );
  }

  class WaveGridBackground {
    constructor(options = {}) {
      this.container = options.container || document.getElementById('heroCinematicContainer');
      this.canvas = options.canvas || document.getElementById('waveGridCanvas');
      if (!this.container || !this.canvas) return;

      this.gridSize = options.gridSize || (window.innerWidth < 768 ? 28 : 40);
      this.colorBase = options.colorBase || '#ffffff';
      this.colorHigh = options.colorHigh || '#0055ff';
      this.waveAmplitude = options.waveAmplitude !== undefined ? options.waveAmplitude : 0.45;
      this.waveSpeed = options.waveSpeed !== undefined ? options.waveSpeed : 6.0;
      this.waveFrequency = options.waveFrequency !== undefined ? options.waveFrequency : 1.2;
      this.waveWidth = options.waveWidth !== undefined ? options.waveWidth : 3.0;
      this.waveMaxHeight = options.waveMaxHeight !== undefined ? options.waveMaxHeight : 0.45;
      this.waveJitter = options.waveJitter !== undefined ? options.waveJitter : 0.2;
      this.autoAnimate = options.autoAnimate !== undefined ? options.autoAnimate : true;

      this.isVisible = true;
      this.animId = null;

      this.init();
    }

    init() {
      if (typeof THREE === 'undefined') {
        console.warn('[WaveGrid] Three.js not found');
        return;
      }

      const cubeWidth = 0.8;
      const cubeHeight = 3.0;
      const gap = 0.01;
      const bounds = this.gridSize * (cubeWidth + gap);

      const getSize = () => ({
        width: this.container.clientWidth || window.innerWidth,
        height: this.container.clientHeight || 520,
        pixelRatio: Math.min(window.devicePixelRatio || 1, 2)
      });
      let size = getSize();

      // Scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(this.colorBase).multiplyScalar(0.4);

      // Camera (mouse-driven orbit)
      const radius = 12;
      const alphaRange = Math.PI * 0.035;
      const betaRange = Math.PI * 0.06;
      this.mouse = new THREE.Vector2(0, 0);
      this.lerpedMouse = new THREE.Vector2(0, 0);

      this.camera = new THREE.PerspectiveCamera(40, size.width / size.height, 0.1, 200);
      const positionCamera = (mx, my) => {
        const alpha = my * alphaRange;
        const beta = mx * betaRange;
        this.camera.position.set(
          -radius * Math.cos(alpha) * Math.sin(beta),
          radius * Math.cos(alpha) * Math.cos(beta),
          radius * Math.sin(alpha)
        );
        this.camera.up.set(0, 0, -1);
        this.camera.lookAt(0, 0, 0);
      };
      positionCamera(0, 0);
      this.scene.add(this.camera);

      // Window mouse move for camera tilt
      this.onMouseMove = (e) => {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      };
      window.addEventListener('mousemove', this.onMouseMove, { passive: true });

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
      this.scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 3.8);
      keyLight.position.set(-20, 10, 6);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.radius = 4;
      keyLight.shadow.camera.near = 0.1;
      keyLight.shadow.camera.far = 60;
      keyLight.shadow.camera.left = -22;
      keyLight.shadow.camera.right = 22;
      keyLight.shadow.camera.top = 22;
      keyLight.shadow.camera.bottom = -22;
      keyLight.shadow.bias = 0.0001;
      this.scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
      fillLight.position.set(10, 5, -3);
      this.scene.add(fillLight);

      // Mouse trail texture
      const trailData = new Float32Array(MAX_TRAIL * 4);
      const trailTexture = new THREE.DataTexture(
        trailData,
        MAX_TRAIL,
        1,
        THREE.RGBAFormat,
        THREE.FloatType
      );
      trailTexture.needsUpdate = true;

      const trailUniforms = {
        uTrailTexture: { value: trailTexture },
        uTrailCount: { value: 0 },
        uFadeTime: { value: 2.0 },
        uWaveSpeed: { value: this.waveSpeed },
        uWaveFreq: { value: this.waveFrequency },
        uWaveWidth: { value: this.waveWidth },
        uAmplitude: { value: this.waveAmplitude },
        uJitter: { value: this.waveJitter },
        uMaxHeight: { value: this.waveMaxHeight }
      };

      const colorUniforms = {
        uColorBase: { value: new THREE.Color(this.colorBase) },
        uColorHigh: { value: new THREE.Color(this.colorHigh) }
      };

      const trail = [];
      let lastPoint = null;
      let timeSinceLastMove = 0;
      let randomPointTimer = 0;
      let placingRandom = true;
      const fadeTime = 2.0;
      const trailSpacing = 0.1;

      const rayPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(bounds, bounds),
        new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, visible: false })
      );
      rayPlane.rotation.x = -Math.PI / 2;
      rayPlane.updateMatrixWorld(true);

      const raycaster = new THREE.Raycaster();
      const pointerNDC = new THREE.Vector2();
      let rect = this.canvas.getBoundingClientRect();

      const onPointerMove = (e) => {
        rect = this.canvas.getBoundingClientRect();
        pointerNDC.set(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        raycaster.setFromCamera(pointerNDC, this.camera);
        const hits = raycaster.intersectObject(rayPlane);
        if (hits.length === 0) return;
        const { x, z } = hits[0].point;

        let distDelta = 0;
        if (lastPoint) {
          const dx = x - lastPoint.x;
          const dz = z - lastPoint.z;
          distDelta = Math.sqrt(dx * dx + dz * dz);
          if (distDelta < trailSpacing) return;
        }
        if (trail.length >= MAX_TRAIL) trail.shift();
        trail.push({ x, z, age: 0, distDelta: distDelta || 0.8 });
        lastPoint = { x, z };
        timeSinceLastMove = 0;
        placingRandom = false;
        randomPointTimer = 0;
      };
      window.addEventListener('pointermove', onPointerMove, { passive: true });

      const addRandomPoint = () => {
        const x = (Math.random() * 0.5 - 0.25) * bounds;
        const z = (Math.random() * 0.5 - 0.25) * bounds;
        const distDelta = 0.8 + Math.random() * 0.2;
        if (trail.length >= MAX_TRAIL) trail.shift();
        trail.push({ x, z, age: 0, distDelta });
      };

      // Initial friendly ripples
      addRandomPoint();
      setTimeout(addRandomPoint, 400);
      setTimeout(addRandomPoint, 900);

      const updateTrail = (delta) => {
        const expiry = fadeTime * 4;
        for (let i = trail.length - 1; i >= 0; i--) {
          trail[i].age += delta;
          if (trail[i].age > expiry) trail.splice(i, 1);
        }

        timeSinceLastMove += delta;
        if (timeSinceLastMove >= 3.0 && !placingRandom && this.autoAnimate) {
          placingRandom = true;
          randomPointTimer = 0;
        }
        if (placingRandom && this.autoAnimate) {
          randomPointTimer += delta;
          if (randomPointTimer >= 1.5) {
            addRandomPoint();
            randomPointTimer = 0;
          }
        }

        const count = Math.min(trail.length, MAX_TRAIL);
        if (count > 0 || trailUniforms.uTrailCount.value > 0) {
          for (let i = 0; i < count; i++) {
            const ti = i * 4;
            trailData[ti] = trail[i].x;
            trailData[ti + 1] = trail[i].z;
            trailData[ti + 2] = trail[i].age;
            trailData[ti + 3] = trail[i].distDelta;
          }
          trailTexture.needsUpdate = true;
          trailUniforms.uTrailCount.value = count;
        }
      };

      // Instanced Mesh Grid
      const count = this.gridSize * this.gridSize;
      const geometry = new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeWidth);
      const offsetAttribute = new THREE.InstancedBufferAttribute(new Float32Array(count * 2), 2);
      geometry.setAttribute('aOffset', offsetAttribute);

      const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
      material.onBeforeCompile = (shader) => {
        Object.assign(shader.uniforms, trailUniforms, colorUniforms);
        shader.vertexShader = overrideVertexShader(shader.vertexShader);
        shader.fragmentShader = shader.fragmentShader
          .replace(
            '#include <common>',
            `#include <common>
            varying float vHeight;
            uniform vec3  uColorBase;
            uniform vec3  uColorHigh;
            uniform float uMaxHeight;`
          )
          .replace(
            '#include <color_fragment>',
            `#include <color_fragment>
            float t = clamp( vHeight / uMaxHeight, 0.0, 1.0 );
            diffuseColor.rgb = mix( uColorBase, uColorHigh, t );`
          );
      };

      const depthMaterial = new THREE.MeshDepthMaterial();
      depthMaterial.onBeforeCompile = (shader) => {
        Object.assign(shader.uniforms, trailUniforms);
        shader.vertexShader = overrideVertexShader(shader.vertexShader);
      };

      const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
      instancedMesh.customDepthMaterial = depthMaterial;
      instancedMesh.castShadow = true;
      instancedMesh.receiveShadow = true;
      this.scene.add(instancedMesh);

      const dummy = new THREE.Object3D();
      const spacing = cubeWidth + gap;
      const offset = ((this.gridSize - 1) * spacing) / 2;
      for (let i = 0; i < this.gridSize; i++) {
        for (let j = 0; j < this.gridSize; j++) {
          const index = i * this.gridSize + j;
          const x = i * spacing - offset;
          const z = j * spacing - offset;
          dummy.position.set(x, 0, z);
          dummy.updateMatrix();
          instancedMesh.setMatrixAt(index, dummy.matrix);
          offsetAttribute.setXY(index, x, z);
        }
      }
      instancedMesh.instanceMatrix.needsUpdate = true;
      offsetAttribute.needsUpdate = true;

      // Renderer
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.95;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFShadowMap;
      this.renderer.setClearColor(new THREE.Color(this.colorBase).multiplyScalar(0.4));
      this.renderer.setSize(size.width, size.height);
      this.renderer.setPixelRatio(size.pixelRatio);

      // Resize observer
      const applySize = () => {
        size = getSize();
        this.camera.aspect = size.width / size.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(size.width, size.height);
        this.renderer.setPixelRatio(size.pixelRatio);
        rect = this.canvas.getBoundingClientRect();
      };
      window.addEventListener('resize', applySize, { passive: true });

      // Intersection observer for performance
      if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            this.isVisible = entry.isIntersecting;
          });
        }, { threshold: 0.05 });
        obs.observe(this.container);
      }

      // Animation Loop
      const clock = new THREE.Clock();
      const animate = () => {
        this.animId = requestAnimationFrame(animate);
        if (!this.isVisible) return;

        const delta = clock.getDelta();
        updateTrail(delta);

        this.lerpedMouse.x += (this.mouse.x - this.lerpedMouse.x) * 0.04;
        this.lerpedMouse.y += (this.mouse.y - this.lerpedMouse.y) * 0.04;
        positionCamera(this.lerpedMouse.x, this.lerpedMouse.y);

        this.renderer.render(this.scene, this.camera);
      };
      animate();
    }
  }

  // Expose globally and auto-initialize on DOM ready
  window.WaveGridBackground = WaveGridBackground;

  window.addEventListener('DOMContentLoaded', () => {
    const hero = document.getElementById('heroCinematicContainer');
    const canvas = document.getElementById('waveGridCanvas');
    if (hero && canvas) {
      window.waveGridInstance = new WaveGridBackground({
        container: hero,
        canvas: canvas,
        colorBase: '#ffffff',
        colorHigh: '#0055ff'
      });
    }
  });
})();
