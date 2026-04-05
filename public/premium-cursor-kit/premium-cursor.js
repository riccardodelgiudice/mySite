/* Premium cursor + optional smooth scroll
   --------------------------------------
   Usage:
   new PremiumCursor({
     hoverSelector: 'a, button',
     viewSelector: '[data-cursor="view"]'
   })

   initPremiumSmoothScroll({
     lerp: 0.08,
     wheelMultiplier: 0.92
   })
*/

(function () {
  const DEFAULTS = {
    hoverSelector: 'a, button, [data-cursor="hover"]',
    viewSelector: '[data-cursor="view"]',
    trailCount: 16,
    spawnInterval: 22,
    minSpawnDistance: 10,
  };

  const MODES = {
    default: { scale: 0.96, lag: 0.16 },
    hover: { scale: 1.45, lag: 0.145 },
    VIEW: { scale: 2.55, lag: 0.12 },
  };

  class PremiumCursor {
    constructor(options = {}) {
      this.options = { ...DEFAULTS, ...options };
      this.finePointer = window.matchMedia('(pointer: fine)').matches;
      this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!this.finePointer) return;

      this.pointer = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        visible: false,
        lastTrailX: window.innerWidth / 2,
        lastTrailY: window.innerHeight / 2,
      };

      this.follower = {
        x: this.pointer.x,
        y: this.pointer.y,
        scale: 0,
        opacity: 0,
      };

      this.currentMode = 'default';
      this.currentLabel = 'VIEW';
      this.lastSpawn = 0;
      this.lastFrame = performance.now();
      this.trailIndex = 0;

      this.build();
      this.bind();
      this.rafId = window.requestAnimationFrame(this.render);
    }

    build() {
      this.root = document.createElement('div');
      this.root.className = 'pcursor';
      this.root.dataset.mode = 'default';

      this.trailLayer = document.createElement('div');
      this.trailLayer.className = 'pcursor__trail-layer';

      this.orb = document.createElement('div');
      this.orb.className = 'pcursor__orb';
      this.orb.innerHTML = `
        <span class="pcursor__halo"></span>
        <span class="pcursor__ring"></span>
        <span class="pcursor__dot"></span>
        <span class="pcursor__label">VIEW</span>
      `;

      this.label = this.orb.querySelector('.pcursor__label');
      this.root.append(this.trailLayer, this.orb);
      document.body.appendChild(this.root);

      this.trails = Array.from({ length: this.options.trailCount }, () => {
        const node = document.createElement('span');
        node.className = 'pcursor__trail';
        this.trailLayer.appendChild(node);
        return {
          el: node,
          active: false,
          x: 0,
          y: 0,
          life: 0,
          maxLife: 1,
          scale: 1,
          alpha: 0,
        };
      });
    }

    getMeta(target) {
      if (!(target instanceof Element)) {
        return { mode: 'default', label: 'VIEW' };
      }

      const viewTarget = target.closest(this.options.viewSelector);
      if (viewTarget) {
        return {
          mode: 'VIEW',
          label: viewTarget.getAttribute('data-cursor-label') || 'VIEW',
        };
      }

      const hoverTarget = target.closest(this.options.hoverSelector);
      if (hoverTarget) {
        return {
          mode: 'hover',
          label: hoverTarget.getAttribute('data-cursor-label') || '',
        };
      }

      return { mode: 'default', label: 'VIEW' };
    }

    setMode(mode, label = 'VIEW') {
      if (mode === this.currentMode && label === this.currentLabel) return;
      this.currentMode = mode;
      this.currentLabel = label || 'VIEW';
      this.root.dataset.mode = mode;
      this.label.textContent = this.currentLabel;
    }

    spawnTrail(speed) {
      const trail = this.trails[this.trailIndex];
      this.trailIndex = (this.trailIndex + 1) % this.trails.length;

      trail.active = true;
      trail.x = this.pointer.x;
      trail.y = this.pointer.y;
      trail.life = 1;
      trail.maxLife = this.currentMode === 'VIEW' ? 0.82 : this.currentMode === 'hover' ? 0.7 : 0.52;
      trail.scale = Math.min(1.55, 0.72 + speed * 0.016);
      trail.alpha = this.currentMode === 'VIEW' ? 0.28 : this.currentMode === 'hover' ? 0.2 : 0.13;
      trail.el.dataset.mode = this.currentMode;
      trail.el.style.opacity = `${trail.alpha}`;
    }

    updateTrails(delta) {
      this.trails.forEach((trail) => {
        if (!trail.active) return;

        trail.life -= delta / (trail.maxLife * 1000);
        if (trail.life <= 0) {
          trail.active = false;
          trail.el.style.opacity = '0';
          return;
        }

        const progress = trail.life;
        const scale = trail.scale * (1 + (1 - progress) * 0.55);
        const opacity = trail.alpha * Math.pow(progress, 1.6);

        trail.el.style.opacity = `${opacity}`;
        trail.el.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      });
    }

    updateOrb() {
      const target = MODES[this.currentMode] || MODES.default;
      const lag = this.pointer.visible ? target.lag : 0.14;
      const targetScale = this.pointer.visible ? target.scale : 0;
      const targetOpacity = this.pointer.visible ? 1 : 0;

      this.follower.x += (this.pointer.x - this.follower.x) * lag;
      this.follower.y += (this.pointer.y - this.follower.y) * lag;
      this.follower.scale += (targetScale - this.follower.scale) * 0.18;
      this.follower.opacity += (targetOpacity - this.follower.opacity) * 0.16;

      this.orb.style.opacity = `${this.follower.opacity}`;
      this.orb.style.transform = `translate3d(${this.follower.x}px, ${this.follower.y}px, 0) translate(-50%, -50%) scale(${this.follower.scale})`;
    }

    render = (time) => {
      const delta = time - this.lastFrame;
      this.lastFrame = time;

      this.updateOrb();

      if (!this.reduceMotion && this.pointer.visible) {
        const distance = Math.hypot(
          this.pointer.x - this.pointer.lastTrailX,
          this.pointer.y - this.pointer.lastTrailY
        );

        if (time - this.lastSpawn > this.options.spawnInterval && distance > this.options.minSpawnDistance) {
          this.spawnTrail(distance);
          this.pointer.lastTrailX = this.pointer.x;
          this.pointer.lastTrailY = this.pointer.y;
          this.lastSpawn = time;
        }
      }

      if (!this.reduceMotion) {
        this.updateTrails(delta);
      }

      this.rafId = window.requestAnimationFrame(this.render);
    };

    handleMove = (event) => {
      this.pointer.x = event.clientX;
      this.pointer.y = event.clientY;
      this.pointer.visible = true;
      const meta = this.getMeta(event.target);
      this.setMode(meta.mode, meta.label);
    };

    handleOver = (event) => {
      const meta = this.getMeta(event.target);
      this.setMode(meta.mode, meta.label);
    };

    handleLeave = () => {
      this.pointer.visible = false;
      this.setMode('default');
    };

    handleDown = () => {
      this.root.dataset.pressed = 'true';
    };

    handleUp = () => {
      delete this.root.dataset.pressed;
    };

    bind() {
      document.addEventListener('mousemove', this.handleMove, { passive: true });
      document.addEventListener('mouseover', this.handleOver, { passive: true });
      document.addEventListener('mouseleave', this.handleLeave);
      document.addEventListener('mousedown', this.handleDown);
      document.addEventListener('mouseup', this.handleUp);
    }

    destroy() {
      window.cancelAnimationFrame(this.rafId);
      document.removeEventListener('mousemove', this.handleMove);
      document.removeEventListener('mouseover', this.handleOver);
      document.removeEventListener('mouseleave', this.handleLeave);
      document.removeEventListener('mousedown', this.handleDown);
      document.removeEventListener('mouseup', this.handleUp);
      this.root?.remove();
    }
  }

  function initPremiumSmoothScroll(options = {}) {
    if (!window.Lenis) return null;

    const lenis = new window.Lenis({
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: false,
      gestureOrientation: 'vertical',
      wheelMultiplier: 0.92,
      touchMultiplier: 1,
      ...options,
    });

    let frameId = 0;
    const raf = (time) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    };

    frameId = window.requestAnimationFrame(raf);
    lenis.destroyWithRaf = () => {
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
    };

    return lenis;
  }

  window.PremiumCursor = PremiumCursor;
  window.initPremiumSmoothScroll = initPremiumSmoothScroll;
})();
