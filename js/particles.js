/**
 * Coniugiamo! - High Performance Canvas Confetti Particle System
 */

const Confetti = {
  canvas: null,
  ctx: null,
  active: false,
  particles: [],
  colors: [
    "hsl(15, 80%, 60%)",  /* Terracotta */
    "hsl(142, 60%, 45%)", /* Sage/Green */
    "hsl(42, 90%, 55%)",  /* Gold */
    "hsl(199, 90%, 55%)", /* Cyan */
    "hsl(280, 75%, 60%)", /* Purple */
    "hsl(330, 80%, 60%)"  /* Pink */
  ],

  init() {
    if (this.canvas) return;
    this.canvas = document.createElement("canvas");
    this.canvas.style.position = "fixed";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.width = "100vw";
    this.canvas.style.height = "100vh";
    this.canvas.style.pointerEvents = "none";
    this.canvas.style.zIndex = "9999";
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    
    window.addEventListener("resize", () => this.resize());
    this.resize();
  },

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  spawn(x, y, count = 40) {
    this.init();
    this.resize();
    
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x,
        y: y,
        size: Math.random() * 8 + 6,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 10 + 5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        decay: Math.random() * 0.012 + 0.008,
        gravity: 0.25,
        drag: 0.93
      });
    }
    
    if (!this.active) {
      this.active = true;
      this.loop();
    }
  },

  loop() {
    if (this.particles.length === 0) {
      this.active = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      // Physics calculations
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed + p.gravity;
      p.speed *= p.drag;
      p.rotation += p.rotationSpeed;
      p.size -= p.decay * p.size;

      // Remove out of bounds or faded particles
      if (p.size <= 0.5 || p.y > this.canvas.height) {
        this.particles.splice(i, 1);
        continue;
      }

      // Draw particle
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.fillStyle = p.color;
      
      // Draw rectangular confetti piece
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.loop());
  }
};

window.Confetti = Confetti;
