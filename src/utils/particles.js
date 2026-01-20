// 粒子特效系统 - 用于首页背景
export function initParticles(canvas) {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  // 泥土色调
  const clayColors = [
    'rgba(217, 59, 48, 0.6)',   // 朱砂红
    'rgba(196, 90, 60, 0.6)',   // 赭石
    'rgba(232, 168, 124, 0.6)', // 藤黄
    'rgba(44, 30, 28, 0.4)'     // 墨色
  ];

  // 粒子类
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5;
      this.size = Math.random() * 4 + 1;
      this.color = clayColors[Math.floor(Math.random() * clayColors.length)];
      this.alpha = Math.random() * 0.5 + 0.2;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;

      // 边界检测
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;

      // 绘制不规则泥土粒子形状
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.quadraticCurveTo(this.size, -this.size / 2, this.size, 0);
      ctx.quadraticCurveTo(this.size, this.size / 2, 0, this.size);
      ctx.quadraticCurveTo(-this.size, this.size / 2, -this.size, 0);
      ctx.quadraticCurveTo(-this.size, -this.size / 2, 0, -this.size);
      ctx.fill();

      ctx.restore();
    }
  }

  // 初始化粒子
  function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];

    const particleCount = Math.floor((width * height) / 15000); // 根据屏幕大小调整数量
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  // 连接附近的粒子
  function connectParticles() {
    const maxDistance = 120;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.2;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(217, 59, 48, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // 鼠标交互
  let mouse = { x: null, y: null, radius: 150 };

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // 动画循环
  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(particle => {
      // 鼠标排斥效果
      if (mouse.x !== null) {
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          particle.vx += Math.cos(angle) * force * 0.5;
          particle.vy += Math.sin(angle) * force * 0.5;
        }
      }

      particle.update();
      particle.draw();
    });

    connectParticles();
    requestAnimationFrame(animate);
  }

  init();
  animate();

  // 窗口调整
  window.addEventListener('resize', () => {
    init();
  });

  return {
    destroy: () => {
      window.removeEventListener('resize', init);
    }
  };
}
