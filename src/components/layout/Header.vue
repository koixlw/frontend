<template>
  <header class="header sticky-header" role="navigation" aria-label="主导航">
    <div class="container">
      <div class="logo-container">
        <router-link to="/" class="logo">
          <span class="logo-text">{{ $t('logo.title') }}</span>
          <span class="logo-subtitle">{{ $t('logo.subtitle') }}</span>
        </router-link>
      </div>

      <nav class="nav">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link to="/" class="nav-link" :class="{ active: isActive('/') }">{{ $t('nav.home') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link" :class="{ active: isActive('/about') }">{{ $t('nav.about') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/inheritors" class="nav-link"
              :class="{ active: isActive('/inheritors') }">{{ $t('nav.inheritors') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/gallery" class="nav-link" :class="{ active: isActive('/gallery') }">{{ $t('nav.gallery') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/news" class="nav-link" :class="{ active: isActive('/news') }">{{ $t('nav.news') }}</router-link>
          </li>
          <li class="nav-item dropdown-container">
            <span class="nav-link dropdown-trigger" :class="{ active: isActive('/ai') }">{{ $t('nav.aiInteractive') }}</span>
            <ul class="dropdown-menu">
              <li>
                <router-link to="/ai/text2image" class="dropdown-item">{{ $t('nav.text2image') }}</router-link>
              </li>
              <li>
                <router-link to="/ai/image2image" class="dropdown-item">{{ $t('nav.styleFusion') }}</router-link>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <router-link to="/shop" class="nav-link" :class="{ active: isActive('/shop') }">{{ $t('nav.shop') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/reserve" class="nav-link" :class="{ active: isActive('/reserve') }">{{ $t('nav.reserve') }}</router-link>
          </li>
          <li class="nav-item language-switcher">
            <button class="language-btn" @click="toggleLanguage" :title="$t('language.current')">
              {{ $t('language.switch') }}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const route = useRoute();
const { locale } = useI18n();

// 切换语言
const toggleLanguage = () => {
  const newLocale = locale.value === 'zh' ? 'en' : 'zh';
  locale.value = newLocale;
  localStorage.setItem('locale', newLocale);
};

// 路由高亮
function isActive(path) {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
}

// 监听滚动事件，改变header样式
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

const handleScroll = () => {
  const header = document.querySelector('.header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};
</script>

<style scoped>
.header {
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.header.scrolled {
  background-color: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
}

.logo-container {
  flex: 0 0 auto;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #333;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: #d93b30;
}

.logo-subtitle {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

.nav {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.nav-list {
  list-style: none;
  display: flex;
  gap: 30px;
}

.nav-item {
  position: relative;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 0;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #d93b30;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #d93b30;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

/* 当前路由高亮 */
.nav-link.active {
  color: #d93b30;
}

.nav-link.active::after {
  width: 100%;
}

/* 下拉菜单样式 */
.dropdown-container {
  position: relative;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background-color: white;
  min-width: 120px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: var(--radius-1, 4px);
  padding: 8px 0;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  list-style: none;
  z-index: 1001;
}

.dropdown-container:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.dropdown-item {
  display: block;
  padding: 8px 16px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.2s ease, color 0.2s ease;
  white-space: nowrap;
  text-align: center;
}

.dropdown-item:hover {
  background-color: rgba(185, 44, 35, 0.08);
  color: #d93b30;
}

/* 语言切换按钮样式 */
.language-switcher {
  margin-left: 20px;
}

.language-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.language-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.language-btn:active {
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .nav-list {
    gap: 20px;
  }

  .nav-link {
    font-size: 14px;
  }

  .language-switcher {
    margin-left: 15px;
  }

  .language-btn {
    padding: 6px 12px;
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .container {
    height: 60px;
  }

  .logo-text {
    font-size: 20px;
  }

  .nav {
    display: none;
  }
}
</style>
