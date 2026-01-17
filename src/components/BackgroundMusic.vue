<template>
  <div class="background-music">
    <audio
      ref="audioPlayer"
      :src="songjiaMp3"
      loop
      preload="auto"
      @ended="handleEnded"
    />

    <button
      class="music-toggle"
      @click="toggleMusic"
      :title="isPlaying ? '关闭背景音乐' : '开启背景音乐'"
      :class="{ playing: isPlaying }"
    >
      <svg v-if="isPlaying" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        <line x1="16" y1="5" x2="16" y2="11" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span v-if="showTooltip">{{ isPlaying ? '音乐开启' : '音乐关闭' }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import songjiaMp3 from '@/assets/video/songjia.mp3';

const audioPlayer = ref(null);
const isPlaying = ref(false);
const showTooltip = ref(false);

// 从 localStorage 读取用户的音乐偏好
const savedMusicState = localStorage.getItem('backgroundMusicEnabled');

const toggleMusic = () => {
  if (!audioPlayer.value) return;

  if (isPlaying.value) {
    audioPlayer.value.pause();
    isPlaying.value = false;
    localStorage.setItem('backgroundMusicEnabled', 'false');
  } else {
    audioPlayer.value.play().catch(err => {
      console.log('音频播放失败:', err);
    });
    isPlaying.value = true;
    localStorage.setItem('backgroundMusicEnabled', 'true');
  }

  // 显示提示
  showTooltip.value = true;
  setTimeout(() => {
    showTooltip.value = false;
  }, 1500);
};

const handleEnded = () => {
  // 音频会自动循环，这里是备用处理
  if (audioPlayer.value) {
    audioPlayer.value.currentTime = 0;
    audioPlayer.value.play();
  }
};

onMounted(() => {
  if (audioPlayer.value) {
    // 设置初始音量为 30%（轻柔的背景音）
    audioPlayer.value.volume = 0.3;

    // 如果用户之前开启了音乐，则自动播放
    if (savedMusicState === 'true') {
      audioPlayer.value.play().then(() => {
        isPlaying.value = true;
      }).catch(err => {
        console.log('自动播放被阻止，需要用户交互:', err);
      });
    }
  }
});
</script>

<style scoped>
.background-music {
  position: fixed;
  bottom: 100px;
  right: 30px;
  z-index: 1000;
}

.music-toggle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  position: relative;
}

.music-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.music-toggle.playing {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }
  50% {
    box-shadow: 0 4px 25px rgba(102, 126, 234, 0.8);
  }
}

.music-toggle svg {
  width: 24px;
  height: 24px;
}

.music-toggle span {
  position: absolute;
  right: 60px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .background-music {
    bottom: 80px;
    right: 20px;
  }

  .music-toggle {
    width: 45px;
    height: 45px;
  }

  .music-toggle svg {
    width: 20px;
    height: 20px;
  }
}
</style>
