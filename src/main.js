import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import i18n from './locales';
import './assets/styles/base.css';
import './assets/styles/animations.css'; // 导入动画样式
import './assets/styles/design-system.css'; // 导入设计系统 - 博物馆级视觉设计

console.log('main.js is loading...');
console.log('Vue app created');

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);

console.log('Router, Pinia and i18n plugins installed');

// 全局滚动动画指令
app.directive('scroll-reveal', {
  mounted: (el, binding) => {
    el.classList.add('reveal');

    // 处理传入的参数 (delay)
    if (binding.value) {
      if (binding.value.delay) {
        el.style.transitionDelay = `${binding.value.delay}ms`;
      }
      if (binding.value.duration) {
        el.style.transitionDuration = `${binding.value.duration}ms`;
      }
      if (binding.value.class) {
        el.classList.add(binding.value.class);
      }
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.classList.add('active');
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(el);
  }
});

app.mount('#app');

console.log('App mounted successfully');
