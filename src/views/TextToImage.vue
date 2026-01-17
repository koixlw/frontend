<template>
  <div class="cultural-studio">
    <!-- 背景纹理层 -->
    <div class="texture-overlay"></div>

    <!-- 左侧工艺台 -->
    <aside class="craft-sidebar">
      <div class="sidebar-header">
        <h1 class="studio-title">
          <span class="seal-text">泥彩</span>
          <span class="title-text">工坊</span>
        </h1>
        <div class="step-indicator">
          <div class="step" :class="{ active: currentStep === 1, completed: currentStep > 1 }" @click="setStep(1)">
            <span class="step-num">壹</span>
            <span class="step-name">捏形</span>
          </div>
          <div class="step-line"></div>
          <div class="step" :class="{ active: currentStep === 2, completed: currentStep > 2 }"
            :disabled="currentStep < 2" @click="currentStep > 1 && setStep(2)">
            <span class="step-num">贰</span>
            <span class="step-name">上彩</span>
          </div>
          <div class="step-line"></div>
          <div class="step" :class="{ active: currentStep === 3, completed: currentStep > 3 }"
            :disabled="currentStep < 3" @click="currentStep > 2 && setStep(3)">
            <span class="step-num">叁</span>
            <span class="step-name">点睛</span>
          </div>
        </div>
      </div>

      <div class="sidebar-content">
        <!-- 步骤一：捏形 -->
        <transition name="fade-slide">
          <div v-if="currentStep === 1" class="step-panel">
            <div class="section-title">
              <span class="ink-dot"></span> 选择泥胚原型
            </div>
            <div class="shape-grid">
              <div v-for="shape in shapes" :key="shape.id" class="shape-card"
                :class="{ selected: craft.shape === shape.id }" @click="selectShape(shape.id)">
                <div class="shape-icon">{{ shape.icon }}</div>
                <div class="shape-name">{{ shape.name }}</div>
                <div class="shape-desc">{{ shape.desc }}</div>
              </div>
            </div>

            <div class="tool-actions">
              <button class="primary-btn" @click="nextStep" :disabled="!craft.shape">
                下一步：上彩 <span class="arrow">→</span>
              </button>
            </div>
          </div>
        </transition>

        <!-- 步骤二：上彩 -->
        <transition name="fade-slide">
          <div v-if="currentStep === 2" class="step-panel">
            <div class="section-title">
              <span class="ink-dot"></span> 调配矿物颜料
            </div>
            <div class="color-palette">
              <div v-for="color in pigments" :key="color.id" class="pigment-pot"
                :class="{ selected: craft.colors.includes(color.name) }" @click="toggleColor(color.name)"
                :title="color.desc">
                <div class="pigment-circle" :style="{ backgroundColor: color.hex }"></div>
                <span class="pigment-name">{{ color.name }}</span>
              </div>
            </div>

            <div class="section-title mt-6">
              <span class="ink-dot"></span> 绘制传统纹样
            </div>
            <div class="pattern-list">
              <div v-for="pat in patterns" :key="pat.id" class="pattern-tag"
                :class="{ selected: craft.pattern === pat.name }" @click="selectPattern(pat.name)">
                <span class="pat-icon">{{ pat.icon }}</span>
                {{ pat.name }}
                <div class="tooltip">{{ pat.meaning }}</div>
              </div>
            </div>

            <div class="tool-actions">
              <button class="secondary-btn" @click="prevStep">上一步</button>
              <button class="primary-btn" @click="nextStep">下一步：点睛 <span class="arrow">→</span></button>
            </div>
          </div>
        </transition>

        <!-- 步骤三：点睛 -->
        <transition name="fade-slide">
          <div v-if="currentStep === 3" class="step-panel">
            <div class="section-title">
              <span class="ink-dot"></span> 注入灵魂 (Prompt)
            </div>
            <div class="prompt-container">
              <textarea v-model="customPrompt" class="calligraphy-input" placeholder="在此描述神态、动作或场景细节..."
                rows="4"></textarea>
              <button class="voice-btn" @click="toggleVoice" :class="{ active: voiceOn }" title="语音输入">
                <span v-if="voiceOn" class="recording-pulse"></span>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
              </button>
            </div>

            <div class="sliders-group">
              <div class="slider-item">
                <label>手作肌理感</label>
                <input type="range" v-model="craft.textureLevel" min="0" max="100" class="clay-slider">
              </div>
              <div class="slider-item">
                <label>风格化强度</label>
                <input type="range" v-model="craft.styleStrength" min="0" max="100" class="clay-slider">
              </div>
            </div>

            <div class="tool-actions">
              <button class="secondary-btn" @click="prevStep">上一步</button>
              <button class="fire-btn" @click="startFiring" :disabled="generating">
                <span v-if="!generating">🔥 开窑烧制</span>
                <span v-else>烧制中...</span>
              </button>
            </div>
          </div>
        </transition>
      </div>

      <!-- 大师工坊入口 -->
      <div class="master-workshop-link">
        <div class="workshop-card">
          <div class="workshop-icon">🏺</div>
          <div class="workshop-info">
            <h4>大师工坊</h4>
            <p>临摹非遗传承人技法</p>
          </div>
          <span class="arrow-right">›</span>
        </div>
      </div>
    </aside>

    <!-- 右侧展示区 -->
    <main class="view-port">
      <!-- 初始/空状态 -->
      <div v-if="!generating && !resultImage" class="empty-canvas">
        <div class="canvas-content">
          <div class="ink-circle"></div>
          <h2>泥韵天成</h2>
          <p>请在左侧工坊开始您的非遗创作之旅</p>
        </div>
      </div>

      <!-- 烧制动画 -->
      <div v-if="generating" class="firing-scene">
        <div class="kiln-loader">
          <div class="clay-pot"></div>
          <div class="flames">
            <span></span><span></span><span></span>
          </div>
        </div>
        <div class="process-text">
          <p class="main-proc">{{ loadingText }}</p>
          <p class="sub-proc">正在运用{{ craft.colors.join('、') || '传统' }}釉色...</p>
        </div>
      </div>

      <!-- 成果证书 -->
      <div v-if="resultImage && !generating" class="certificate-view">
        <div class="certificate-paper">
          <div class="paper-texture"></div>

          <div class="cert-header">
            <span class="cert-title">非遗数字藏品证书</span>
            <span class="cert-no">No.{{ Date.now().toString().slice(-8) }}</span>
          </div>

          <div class="artwork-frame">
            <img :src="resultImage" alt="Generated Artwork" class="artwork-img" @click="openLightbox">
            <div class="seal-mark">泥彩<br>手作</div>
          </div>

          <div class="cert-body">
            <div class="info-row">
              <span class="label">创作时间：</span>
              <span class="value">{{ new Date().toLocaleString() }}</span>
            </div>
            <div class="info-row">
              <span class="label">工艺技法：</span>
              <span class="value">AI 泥塑生成 / {{ craft.colors.join(' ') }} / {{ craft.pattern }}</span>
            </div>
            <div class="info-row">
              <span class="label">文化溯源：</span>
              <span class="value">{{ culturalSource }}</span>
            </div>
          </div>

          <div class="cert-footer">
            <div class="inheritor-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
              <span>数字非遗传承人</span>
            </div>
            <div class="share-actions">
              <button class="icon-action" @click="downloadCert" title="下载证书">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </button>
              <button class="icon-action" @click="shareCert" title="分享">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 灯箱 -->
    <transition name="fade">
      <div v-if="showLightbox" class="lightbox" @click="showLightbox = false">
        <img :src="resultImage" class="lightbox-img">
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// 状态管理
const currentStep = ref(1)
const generating = ref(false)
const resultImage = ref(null)
const customPrompt = ref('')
const voiceOn = ref(false)
const loadingText = ref('选土炼泥...')
const showLightbox = ref(false)
const firingProgress = ref(0)
// 工艺参数
const craft = reactive({
  shape: null,
  shapeName: '',
  colors: [],
  pattern: '',
  textureLevel: 50,
  styleStrength: 65
})

// 数据配置
const shapes = [
  { id: 'child', name: '泥娃娃', icon: '👶', desc: '寓意多子多福，造型圆润讨喜' },
  { id: 'lady', name: '仕女', icon: '👘', desc: '展现东方女性温婉之美' },
  { id: 'warrior', name: '武将', icon: '🛡️', desc: '威风凛凛，镇宅辟邪' },
  { id: 'beast', name: '瑞兽', icon: '🦁', desc: '麒麟狮虎，祥瑞之兆' }
]

const pigments = [
  { name: '朱砂', hex: '#C3272B', desc: '纯正红色，辟邪祈福' },
  { name: '石青', hex: '#2A5CAA', desc: '稳重典雅，如山间清泉' },
  { name: '藤黄', hex: '#FFB61E', desc: '明亮尊贵，皇家气象' },
  { name: '蛤粉', hex: '#F5E6D3', desc: '温润如玉，用于打底高光' },
  { name: '泥棕', hex: '#8B5E3C', desc: '大地之色，质朴厚重' }
]

const patterns = [
  { id: 'cloud', name: '祥云纹', icon: '☁️', meaning: '寓意吉祥高升，渊源共生' },
  { id: 'lotus', name: '缠枝莲', icon: '🌿', meaning: '生生不息，连绵不断' },
  { id: 'face', name: '脸谱', icon: '🎭', meaning: '忠义千秋，人生百态' },
  { id: 'geo', name: '回纹', icon: '🌀', meaning: '富贵不断头' }
]

// 逻辑方法
function setStep(n) { currentStep.value = n }
function nextStep() { if (currentStep.value < 3) currentStep.value++ }
function prevStep() { if (currentStep.value > 1) currentStep.value-- }

function selectShape(id) {
  craft.shape = id
  craft.shapeName = shapes.find(s => s.id === id).name
}

function toggleColor(name) {
  const idx = craft.colors.indexOf(name)
  if (idx > -1) craft.colors.splice(idx, 1)
  else {
    if (craft.colors.length >= 3) craft.colors.shift()
    craft.colors.push(name)
  }
}

function selectPattern(name) { craft.pattern = name }

// 语音输入
let recognition = null
function toggleVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) { alert('您的浏览器不支持语音输入'); return }

  if (!voiceOn.value) {
    recognition = new SR()
    recognition.lang = 'zh-CN'
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript
      customPrompt.value += text
    }
    recognition.onend = () => { voiceOn.value = false }
    recognition.start()
    voiceOn.value = true
  } else {
    recognition.stop()
    voiceOn.value = false
  }
}

// 溯源文案
const culturalSource = computed(() => {
  const sources = [
    '灵感源自清代泥人张《钟馗嫁妹》',
    '参考了凤翔泥塑的夸张造型手法',
    '融合了惠山泥人的手捏戏文特色',
    '致敬敦煌莫高窟彩塑艺术风格'
  ]
  return sources[Math.floor(Math.random() * sources.length)]
})

// 烧制辅助函数
async function startFiring() {
  generating.value = true
  resultImage.value = null
  firingProgress.value = 0

  const steps = ['揉泥制胚...', '精雕细琢...', '上彩描金...', '入窑烧制...']
  let stepIdx = 0

  // 更新进度文字
  const interval = setInterval(() => {
    if (stepIdx < steps.length) {
      loadingText.value = steps[stepIdx]
      stepIdx++
    }
  }, 1500)

  // 构建 Prompt
  const basePrompt = `Traditional Chinese Clay Art, ${craft.shapeName}, made of clay,
    colors: ${craft.colors.join('+')}, pattern: ${craft.pattern},
    handcrafted texture, museum lighting, 3d render, 8k resolution`
  const finalPrompt = `${basePrompt}, ${customPrompt.value}, style_strength:${craft.styleStrength}%`

  try {
    const seed = Math.floor(Math.random() * 1000000)
    const encoded = encodeURIComponent(finalPrompt)
    // 预加载图片
    const url = `https://image.pollinations.ai/prompt/${encoded}?seed=${seed}&width=768&height=1024&nologo=true`

    const img = new Image()
    img.onload = () => {
      clearInterval(interval)
      resultImage.value = url
      generating.value = false
    }
    img.onerror = () => {
      clearInterval(interval)
      alert('烧制失败，请重试')
      generating.value = false
    }
    img.src = url
  } catch (e) {
    clearInterval(interval)
    alert('烧制失败，请重试')
    generating.value = false
  }
}

function openLightbox() { showLightbox.value = true }
function downloadCert() {
  const a = document.createElement('a')
  a.href = resultImage.value
  a.download = `泥彩人_数字藏品_${Date.now()}.jpg`
  a.click()
}
function shareCert() {
  alert('已复制数字藏品链接，快去分享给好友吧！')
}
</script>

<style scoped>
/* 
  新中式数字美学配色系统 
  文化转译配色系统 
  背景：仿陶土深褐 #0F0A08
  主色：朱砂红 #C3272B
  辅色：泥棕 #8B5E3C
  文字/高光：陶白 #E8C39E
*/
.cultural-studio {
  /* 新中式-浅色主题 (米黄) */
  --bg-earth: #FAF3E8;
  /* 浅米色背景 */
  --bg-panel: #FFFBF5;
  /* 面板亮白/极浅米色 */
  --color-cinnabar: #B83B3B;
  /* 朱砂红 */
  --color-celadon: #4A6B7D;
  /* 青瓷蓝 */
  --color-glaze: #C2A57E;
  /* 泥釉金 */
  --color-paper: #F5E6D3;
  /* 宣纸色 */
  --color-text-main: #2C2622;
  /* 主文字深褐 */
  --color-text-sub: #5D5550;
  /* 次文字深灰 */
  --border-color: #E6D6C6;
  /* 浅褐边框 */
}

.cultural-studio {
  /* 适配顶部导航 */
  display: flex;
  height: calc(100vh - 80px);
  background-color: var(--bg-earth);
  color: var(--color-text-main);
  font-family: "HarmonyOS Sans SC", "PingFang SC", sans-serif;
  overflow: hidden;
  position: relative;
}

.texture-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
  z-index: 0;
  mix-blend-mode: multiply;
  opacity: 0.3;
}

.ink-btn:hover {
  box-shadow: 0 0 20px rgba(184, 59, 59, 0.2);
  border-color: var(--color-cinnabar);
}

.craft-sidebar {
  width: 380px;
  background-color: var(--bg-panel);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  z-index: 10;
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.05);
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.studio-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.seal-text {
  background-color: var(--color-cinnabar);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 20px;
  border: 1px solid #8B2A2A;
}

.title-text {
  font-size: 24px;
  font-family: "KaiTi", serif;
  letter-spacing: 2px;
  color: var(--color-text-main);
}

/* 步骤指示器 */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  opacity: 0.5;
  transition: all 0.3s;
}

.step.active {
  opacity: 1;
}

.step.active .step-num {
  background: var(--color-cinnabar);
  color: var(--color-paper);
  border-color: var(--color-cinnabar);
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(184, 59, 59, 0.4);
}

.step.completed .step-num {
  background: var(--color-glaze);
  border-color: var(--color-glaze);
  color: var(--bg-earth);
}

.step-num {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "KaiTi", serif;
  font-size: 14px;
  background: #fff;
  transition: all 0.3s;
  color: var(--color-text-main);
  border-radius: 50%;
}

.step-name {
  font-size: 12px;
  color: var(--color-text-sub);
}

.step-line {
  flex: 1;
  height: 1px;
  background: var(--border-color);
  margin: 0 10px;
  margin-bottom: 18px;
}

.sidebar-content {
  flex: 1;
  position: relative;
  padding: 0 20px;
  overflow-y: auto;
}

/* 通用面板样式 */
.section-title {
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-main);
  font-family: "KaiTi";
  margin-bottom: 16px;
  font-size: 18px;
}

.ink-dot {
  width: 6px;
  height: 6px;
  background: var(--color-cinnabar);
  border-radius: 50%;
}

.mt-6 {
  margin-top: 24px;
}

/* 步骤一：捏形 */
.shape-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.shape-card {
  border: 1px solid var(--border-color);
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.shape-card:hover {
  border-color: var(--color-cinnabar);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.shape-card.selected {
  border-color: var(--color-cinnabar);
  background: #FFF5F5;
}

.shape-icon {
  font-size: 32px;
  color: var(--color-text-sub);
  margin-bottom: 8px;
}

.shape-name {
  font-weight: bold;
  margin-bottom: 4px;
  font-family: "KaiTi";
  font-size: 18px;
  color: var(--color-text-main);
}

.shape-desc {
  font-size: 12px;
  color: var(--color-text-sub);
}

/* 步骤二：上彩 */
.color-palette {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.pigment-pot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  width: 48px;
}

.pigment-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.pigment-pot:hover .pigment-circle {
  transform: scale(1.1);
}

.pigment-pot.selected .pigment-circle {
  border-color: var(--color-cinnabar);
  box-shadow: 0 0 0 2px var(--color-cinnabar);
}

.pigment-name {
  font-size: 12px;
  font-family: "KaiTi";
  color: var(--color-text-sub);
}

.pattern-list {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.pattern-tag {
  border: 1px solid var(--border-color);
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  background: #fff;
  color: var(--color-text-sub);
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;
}

.pattern-tag:hover {
  border-color: var(--color-cinnabar);
  color: var(--color-cinnabar);
}

.pattern-tag.selected {
  background: var(--color-cinnabar);
  color: #fff;
  border-color: var(--color-cinnabar);
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  color: var(--color-text-main);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 20;
}

.pattern-tag:hover .tooltip {
  opacity: 1;
}

/* 步骤三：点睛 */
.calligraphy-input {
  width: 100%;
  background: #fff;
  border: 1px solid var(--border-color);
  padding: 12px;
  border-radius: 8px;
  resize: none;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-main);
  background-image: repeating-linear-gradient(transparent, transparent 27px, rgba(0, 0, 0, 0.03) 28px);
  background-attachment: local;
  transition: all 0.3s;
}

.calligraphy-input:focus {
  outline: none;
  border-color: var(--color-cinnabar);
  box-shadow: 0 0 10px rgba(184, 59, 59, 0.1);
}

.prompt-container {
  position: relative;
  margin-bottom: 24px;
}

.voice-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: none;
  color: var(--color-text-sub);
  cursor: pointer;
  border: none;
  transition: color 0.3s;
}

.voice-btn:hover,
.voice-btn.active {
  color: var(--color-cinnabar);
}

.recording-pulse {
  display: block;
  width: 12px;
  height: 12px;
  background: var(--color-cinnabar);
  border-radius: 50%;
  animation: pulse 1s infinite;
}

.sliders-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.slider-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--color-text-sub);
}

.clay-slider {
  width: 60%;
  accent-color: var(--color-cinnabar);
}

/* 底部按钮 */
.tool-actions {
  margin-top: auto;
  display: flex;
  gap: 12px;
  padding-top: 20px;
}

.primary-btn,
.fire-btn {
  transition: all 0.3s;
  flex: 1;
  background: var(--color-cinnabar);
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
}

.primary-btn:hover:not(:disabled),
.fire-btn:hover:not(:disabled) {
  background: #A61B1F;
  box-shadow: 0 4px 12px rgba(195, 39, 43, 0.3);
}

.primary-btn:disabled,
.fire-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.secondary-btn {
  padding: 12px 20px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  color: var(--color-text-main);
  transition: all 0.3s;
}

.secondary-btn:hover {
  border-color: var(--color-cinnabar);
  color: var(--color-cinnabar);
}

/* 大师工坊 */
.master-workshop-link {
  padding: 20px;
  border-top: 1px solid var(--border-color);
}

.workshop-card {
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  border: 1px solid transparent;
  background: #fff;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.workshop-card:hover {
  border-color: var(--color-cinnabar);
  transform: translateY(-2px);
}

.workshop-icon {
  font-size: 24px;
}

.workshop-info h4 {
  font-size: 14px;
  margin-bottom: 2px;
  color: var(--color-text-main);
}

.workshop-info p {
  font-size: 11px;
  color: var(--color-text-sub);
}

.arrow-right {
  margin-left: auto;
  font-size: 20px;
  color: var(--color-text-sub);
}

/* 右侧视口 */
.view-port {
  flex: 1;
  position: relative;
  background: #F9F4EF;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid var(--border-color);
  overflow: hidden;
}

.empty-canvas {
  text-align: center;
  opacity: 0.8;
}

.ink-circle {
  width: 120px;
  height: 120px;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  margin: 0 auto 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "KaiTi";
  font-size: 48px;
  color: var(--color-cinnabar);
  background: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.ink-circle::after {
  content: "泥";
}

.firing-scene {
  text-align: center;
}

.kiln-loader {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 40px;
}

.clay-pot {
  width: 60px;
  height: 80px;
  background: #8B5E3C;
  border-radius: 30% 30% 40% 40%;
  margin: 10px auto;
  animation: spinPot 3s infinite linear;
}

.flames {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.flames span {
  display: inline-block;
  width: 10px;
  height: 20px;
  background: #C3272B;
  border-radius: 50% 50% 20% 20%;
  animation: flame 0.5s infinite alternate;
  margin: 0 2px;
}

.flames span:nth-child(2) {
  animation-delay: 0.2s;
  height: 30px;
}

.process-text .main-proc {
  font-size: 20px;
  font-family: "KaiTi";
  color: var(--color-text-main);
  margin-bottom: 8px;
}

.process-text .sub-proc {
  font-size: 14px;
  color: var(--color-text-sub);
}

/* 证书样式 */
.certificate-view {
  animation: slideUp 0.8s ease-out;
}

.certificate-paper {
  width: 400px;
  background: #fff;
  color: #000;
  padding: 30px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  position: relative;
  border-radius: 4px;
}

.paper-texture {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E");
  pointer-events: none;
  mix-blend-mode: multiply;
}

.cert-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 2px solid var(--color-text-main);
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.cert-title {
  font-family: "KaiTi";
  font-size: 20px;
  color: var(--color-text-main);
}

.cert-no {
  font-family: "Courier New";
  font-size: 12px;
  opacity: 0.7;
  color: var(--color-text-sub);
}

.artwork-frame {
  width: 100%;
  aspect-ratio: 3/4;
  background: #fff;
  border: 8px solid var(--border-color);
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  cursor: zoom-in;
}

.artwork-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.seal-mark {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  border: 2px solid var(--color-cinnabar);
  color: var(--color-cinnabar);
  font-family: "KaiTi";
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 1.1;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
}

.cert-body {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 12px;
}

.info-row .label {
  color: var(--color-text-sub);
  width: 60px;
}

.info-row .value {
  font-weight: 500;
  flex: 1;
  color: var(--color-text-main);
}

.cert-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px dashed var(--border-color);
}

.inheritor-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-cinnabar);
}

.icon-action {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-sub);
  transition: all 0.3s;
}

.icon-action:hover {
  transform: scale(1.1);
  color: var(--color-cinnabar);
}

/* 动画 */
@keyframes spinPot {
  0% {
    transform: rotateY(0deg);
  }

  100% {
    transform: rotateY(360deg);
  }
}

@keyframes flame {
  0% {
    transform: scaleY(1);
  }

  100% {
    transform: scaleY(1.5);
  }
}

@keyframes pulse {
  0% {
    opacity: 0.5;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.5;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* 灯箱 */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(13, 11, 9, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-img {
  max-height: 90vh;
  max-width: 90vw;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.8);
}
</style>
