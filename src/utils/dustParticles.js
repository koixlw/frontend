// 灰尘粒子系统 - 营造"时间感"和"厚重感"
export function initDustParticles(canvas) {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  // 设置画布尺寸
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  // 粒子类 - 模拟灰尘和泥土微粒
  class DustParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = Math.random() * 0.3 + 0.1;
      this.opacity = Math.random() * 0.3 + 0.1;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 2;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.02 + 0.01;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
      this.wobble += this.wobbleSpeed;

      // 添加轻微的左右摆动
      this.wobbleX = Math.sin(this.wobble) * 0.5;

      // 边界检测
      if (this.y > height) {
        this.y = -10;
        this.x = Math.random() * width;
      }
      if (this.x < -10) this.x = width + 10;
      if (this.x > width + 10) this.x = -10;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x + this.wobbleX, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.getColor();
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    getColor() {
      // 泥土色系 - 随机选择
      const colors = [
        'rgba(139, 69, 19, 0.6)',    // 深土褐
        'rgba(160, 82, 45, 0.5)',    // 赭石
        'rgba(212, 175, 55, 0.4)',   // 金色微粒
        'rgba(196, 30, 58, 0.3)',    // 朱砂红
        'rgba(188, 143, 143, 0.4)'   // 玫瑰褐
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  }

  // 初始化粒子
  function init() {
    resize();
    particles = [];

    // 根据屏幕大小决定粒子数量
    const particleCount = Math.floor((width * height) / 20000);

    for (let i = 0; i < particleCount; i++) {
      particles.push(new DustParticle());
    }
  }

  // 动画循环
  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    requestAnimationFrame(animate);
  }

  // 鼠标交互 - 轻微扰动
  let mouseX = null;
  let mouseY = null;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouseX = null;
    mouseY = null;
  });

  // 添加鼠标影响
  const originalUpdate = DustParticle.prototype.update;
  DustParticle.prototype.update = function() {
    originalUpdate.call(this);

    // 鼠标附近的粒子会被轻微推开
    if (mouseX !== null && mouseY !== null) {
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        const force = (150 - distance) / 150;
        this.x += (dx / distance) * force * 2;
        this.y += (dy / distance) * force * 2;
      }
    }
  };

  init();
  animate();

  // 窗口调整
  window.addEventListener('resize', resize);

  return {
    destroy: () => {
      window.removeEventListener('resize', resize);
      particles = [];
    }
  };
}

// 泥土粒子爆炸效果 - 用于页面切换
export function clayExplosion(container, callback) {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.zIndex = '9999';
  canvas.style.pointerEvents = 'none';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  let particles = [];
  let animationId;

  // 爆炸粒子
  class ExplosionParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 15 + 5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.size = Math.random() * 8 + 4;
      this.life = 1;
      this.decay = Math.random() * 0.02 + 0.01;
      this.color = this.getColor();
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 10;
    }

    getColor() {
      const colors = ['#8B4513', '#A0522D', '#D4AF37', '#C41E3A', '#2C1E1C'];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.3; // 重力
      this.vx *= 0.98; // 空气阻力
      this.vy *= 0.98;
      this.rotation += this.rotationSpeed;
      this.life -= this.decay;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.life;
      ctx.fillStyle = this.color;

      // 绘制不规则泥土碎片
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

  // 创建中心爆炸点
  const centerX = width / 2;
  const centerY = height / 2;

  for (let i = 0; i < 50; i++) {
    particles.push(new ExplosionParticle(centerX, centerY));
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles = particles.filter(p => p.life > 0);

    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    if (particles.length > 0) {
      animationId = requestAnimationFrame(animate);
    } else {
      // 动画结束
      canvas.remove();
      if (callback) callback();
    }
  }

  animate();
}

// 时间轴粒子效果 - 用于历史时间轴
export function timelineParticles(container) {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.inset = '0';
  canvas.style.pointerEvents = 'none';
  container.style.position = 'relative';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    const rect = container.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
  }

  class TimelineParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.targetY = this.y;
      this.size = Math.random() * 3 + 1;
      this.speedY = Math.random() * 0.5 + 0.2;
      this.opacity = 0;
      this.fadeIn = true;
    }

    update() {
      // 淡入
      if (this.fadeIn) {
        this.opacity += 0.01;
        if (this.opacity >= 0.5) this.fadeIn = false;
      }

      this.y += this.speedY;

      if (this.y > height) {
        this.y = -10;
        this.x = Math.random() * width;
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = 'rgba(212, 175, 55, 0.6)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    resize();
    particles = [];

    const particleCount = Math.floor((width * height) / 15000);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new TimelineParticle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    requestAnimationFrame(animate);
  }

  init();
  animate();

  window.addEventListener('resize', resize);

  return {
    destroy: () => {
      window.removeEventListener('resize', resize);
      canvas.remove();
    }
  };
}

// 聚光灯效果 - 鼠标跟随的光照
export function initSpotlight(container) {
  let mouseElement = null;
  let rafId;

  const handleMouseMove = (e) => {
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    container.style.setProperty('--mouse-x', `${x}%`);
    container.style.setProperty('--mouse-y', `${y}%`);
  };

  const init = () => {
    container.addEventListener('mousemove', handleMouseMove);
    container.classList.add('spotlight-enabled');
  };

  const destroy = () => {
    container.removeEventListener('mousemove', handleMouseMove);
    container.classList.remove('spotlight-enabled');
    if (rafId) cancelAnimationFrame(rafId);
  };

  init();

  return { destroy };
}
