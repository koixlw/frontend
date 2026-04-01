<template>
  <teleport to="body">
    <transition name="lightbox">
      <div v-if="isOpen" class="lightbox-overlay" @click="close">
        <!-- 关闭按钮 -->
        <button class="lightbox-close" @click="close" aria-label="关闭">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- 导航按钮 -->
        <button
          class="lightbox-nav nav-prev"
          @click.stop="prev"
          v-if="hasPrev"
          aria-label="上一张"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <button
          class="lightbox-nav nav-next"
          @click.stop="next"
          v-if="hasNext"
          aria-label="下一张"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <!-- 主内容区 -->
        <div class="lightbox-content" @click.stop>
          <div class="image-container">
            <transition :name="transitionName" mode="out-in">
              <img
                :key="currentIndex"
                :src="currentItem.image"
                :alt="currentItem.title"
                class="lightbox-image"
                @load="onImageLoad"
              >
            </transition>

            <!-- 加载指示器 -->
            <div v-if="loading" class="lightbox-loading">
              <div class="spinner"></div>
            </div>
          </div>

          <!-- 作品信息 -->
          <div class="lightbox-info">
            <transition name="slide-up" mode="out-in">
              <div :key="currentIndex" class="info-content">
                <h2 class="info-title">{{ currentItem.title }}</h2>
                <p class="info-artist">传承人：{{ currentItem.artist }}</p>
                <p class="info-description">{{ currentItem.description }}</p>

                <!-- 交互按钮 -->
                <div class="info-actions">
                  <button class="action-btn like-btn" @click="toggleLike" :class="{ active: currentItem.isLiked }">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span>{{ currentItem.likes || 0 }}</span>
                  </button>

                  <button class="action-btn share-btn" @click="share">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                    <span>分享</span>
                  </button>

                  <router-link
                    :to="`/work/${currentItem.id}`"
                    class="action-btn detail-btn"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <span>详情</span>
                  </router-link>
                </div>
              </div>
            </transition>
          </div>

          <!-- 缩略图导航 -->
          <div class="lightbox-thumbnails" v-if="items.length > 1">
            <div
              v-for="(item, index) in items"
              :key="index"
              :class="['thumbnail', { active: index === currentIndex }]"
              @click="goTo(index)"
            >
              <img :src="item.image" :alt="item.title">
            </div>
          </div>
        </div>

        <!-- 图片计数 -->
        <div class="lightbox-counter">
          {{ currentIndex + 1 }} / {{ items.length }}
        </div>

        <!-- 键盘提示 -->
        <div class="keyboard-hint">
          <span class="hint-key">←</span>
          <span class="hint-key">→</span>
          切换图片
          <span class="hint-key">ESC</span>
          关闭
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  items: {
    type: Array,
    required: true
  },
  startIndex: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['close', 'like', 'share']);

const currentIndex = ref(props.startIndex);
const loading = ref(true);
const transitionName = ref('slide-left');

const currentItem = computed(() => props.items[currentIndex.value]);
const hasPrev = computed(() => currentIndex.value > 0);
const hasNext = computed(() => currentIndex.value < props.items.length - 1);

// 切换到指定索引
const goTo = (index) => {
  if (index === currentIndex.value) return;

  transitionName.value = index > currentIndex.value ? 'slide-left' : 'slide-right';
  currentIndex.value = index;
  loading.value = true;
};

// 上一张
const prev = () => {
  if (hasPrev.value) {
    goTo(currentIndex.value - 1);
  }
};

// 下一张
const next = () => {
  if (hasNext.value) {
    goTo(currentIndex.value + 1);
  }
};

// 关闭灯箱
const close = () => {
  emit('close');
};

// 图片加载完成
const onImageLoad = () => {
  loading.value = false;
};

// 点赞
const toggleLike = () => {
  emit('like', currentItem.value);
};

// 分享
const share = () => {
  emit('share', currentItem.value);
};

// 键盘导航
const handleKeydown = (e) => {
  if (!props.isOpen) return;

  switch(e.key) {
    case 'ArrowLeft':
      prev();
      break;
    case 'ArrowRight':
      next();
      break;
    case 'Escape':
      close();
      break;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

watch(() => props.startIndex, (newVal) => {
  currentIndex.value = newVal;
});

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // 禁止页面滚动
    document.body.style.overflow = 'hidden';
  } else {
    // 恢复页面滚动
    document.body.style.overflow = '';
  }
});
</script>

<style scoped>
/* 灯箱遮罩 */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* 进入/离开动画 */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

/* 关闭按钮 */
.lightbox-close {
  position: absolute;
  top: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10000;
}

.lightbox-close:hover {
  background: rgba(217, 59, 48, 0.8);
  transform: rotate(90deg);
}

.lightbox-close svg {
  width: 24px;
  height: 24px;
}

/* 导航按钮 */
.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10000;
}

.lightbox-nav:hover {
  background: rgba(217, 59, 48, 0.8);
  transform: translateY(-50%) scale(1.1);
}

.lightbox-nav svg {
  width: 30px;
  height: 30px;
}

.nav-prev {
  left: 30px;
}

.nav-next {
  right: 30px;
}

/* 内容区 */
.lightbox-content {
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  gap: 40px;
  align-items: center;
}

.image-container {
  position: relative;
  flex: 1;
  max-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

/* 图片切换动画 */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(50px);
}

/* 加载动画 */
.lightbox-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top-color: #d93b30;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 作品信息 */
.lightbox-info {
  flex: 0 0 350px;
  max-height: 80vh;
  overflow-y: auto;
  color: white;
  padding: 20px;
}

.info-content {
  animation: fadeSlideIn 0.5s ease;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 15px;
  line-height: 1.3;
}

.info-artist {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
}

.info-description {
  font-size: 14px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 30px;
}

.info-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.action-btn:hover {
  background: rgba(217, 59, 48, 0.8);
  border-color: #d93b30;
  transform: translateY(-2px);
}

.action-btn.like-btn.active {
  background: #d93b30;
  border-color: #d93b30;
}

.action-btn.like-btn.active svg {
  fill: currentColor;
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

/* 缩略图 */
.lightbox-thumbnails {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  overflow-x: auto;
  padding: 10px 0;
}

.thumbnail {
  flex: 0 0 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  opacity: 0.5;
}

.thumbnail:hover {
  opacity: 1;
  transform: scale(1.05);
}

.thumbnail.active {
  border-color: #d93b30;
  opacity: 1;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 计数器 */
.lightbox-counter {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 25px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  color: white;
  font-weight: 600;
  font-size: 14px;
}

/* 键盘提示 */
.keyboard-hint {
  position: absolute;
  bottom: 30px;
  right: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.hint-key {
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  font-family: monospace;
  font-weight: 600;
}

/* 滑入动画 */
.slide-up-enter-active {
  transition: all 0.5s ease;
}

.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* 响应式 */
@media (max-width: 1024px) {
  .lightbox-content {
    flex-direction: column;
    gap: 20px;
  }

  .lightbox-info {
    flex: 1;
    max-height: none;
  }

  .image-container {
    max-height: 60vh;
  }

  .lightbox-image {
    max-height: 60vh;
  }
}

@media (max-width: 768px) {
  .lightbox-close {
    top: 15px;
    right: 15px;
    width: 40px;
    height: 40px;
  }

  .nav-prev {
    left: 15px;
  }

  .nav-next {
    right: 15px;
  }

  .lightbox-nav {
    width: 45px;
    height: 45px;
  }

  .lightbox-nav svg {
    width: 24px;
    height: 24px;
  }

  .info-title {
    font-size: 22px;
  }

  .keyboard-hint {
    display: none;
  }

  .lightbox-counter {
    bottom: 15px;
  }
}
</style>
