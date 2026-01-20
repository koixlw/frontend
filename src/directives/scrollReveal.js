// 滚动显示动画指令
export const scrollReveal = {
  mounted(el, binding) {
    const options = {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px',
      ...(binding.value || {})
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.classList.add('reveal-active');
          observer.unobserve(el); // 只触发一次
        }
      });
    }, options);

    observer.observe(el);

    // 初始化样式
    el.classList.add('reveal-on-scroll');
    el.style.opacity = '0';

    // 存储observer以便后续清理
    el._scrollRevealObserver = observer;
  },

  unmounted(el) {
    if (el._scrollRevealObserver) {
      el._scrollRevealObserver.disconnect();
    }
  }
};

// 不同的动画类型
export const scrollRevealLeft = {
  mounted(el) {
    el.classList.add('reveal-from-left');
    scrollReveal.mounted(el);
  }
};

export const scrollRevealRight = {
  mounted(el) {
    el.classList.add('reveal-from-right');
    scrollReveal.mounted(el);
  }
};

export const scrollRevealScale = {
  mounted(el) {
    el.classList.add('reveal-scale');
    scrollReveal.mounted(el);
  }
};
