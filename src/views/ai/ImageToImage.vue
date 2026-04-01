<template>
  <div class="fusion-studio">
    <!-- 背景纹理层 -->
    <div class="texture-overlay"></div>

    <!-- 左侧工艺台 -->
    <aside class="craft-sidebar">
      <div class="sidebar-header">
        <h1 class="studio-title">
          <span class="seal-text">泥彩</span>
          <span class="title-text">风格融合</span>
        </h1>
        <div class="step-indicator">
          <div class="step" :class="{ active: currentStep === 1, completed: currentStep > 1 }" @click="setStep(1)">
            <span class="step-num">壹</span>
            <span class="step-name">传照</span>
          </div>
          <div class="step-line"></div>
          <div class="step" :class="{ active: currentStep === 2, completed: currentStep > 2 }"
            :disabled="currentStep < 2" @click="currentStep > 1 && setStep(2)">
            <span class="step-num">贰</span>
            <span class="step-name">选韵</span>
          </div>
          <div class="step-line"></div>
          <div class="step" :class="{ active: currentStep === 3, completed: currentStep > 3 }"
            :disabled="currentStep < 3" @click="currentStep > 2 && setStep(3)">
            <span class="step-num">叁</span>
            <span class="step-name">融魂</span>
          </div>
        </div>
      </div>

      <div class="sidebar-content">
        <!-- 步骤一：传照 -->
        <transition name="fade-slide">
          <div v-if="currentStep === 1" class="step-panel">
            <div class="section-title">
              <span class="ink-dot"></span> 上传照片
            </div>
            <div class="upload-area">
              <div class="dropzone" :class="{ active: dragActive, filled: contentImageUrl }"
                @dragover.prevent="dragActive=true" @dragleave.prevent="dragActive=false" @drop.prevent="onContentDrop">
                <input type="file" accept="image/*" @change="onContentImageChange" hidden ref="contentInputRef" />
                <div v-if="!contentImageUrl" class="dropzone-content">
                  <div class="upload-icon">📷</div>
                  <p>拖拽图片到此，或<span @click="$refs.contentInputRef?.click()" class="click-upload">点击上传</span></p>
                  <p class="hint">支持 JPG/PNG，≤10MB</p>
                </div>
                <div v-else class="preview-container">
                  <img :src="contentImageUrl" alt="内容图预览" />
                  <button class="remove-btn" @click="contentImageUrl=''">✕</button>
                </div>
              </div>
            </div>

            <div class="tool-actions">
              <button class="primary-btn" @click="nextStep" :disabled="!contentImageUrl">
                下一步：选韵 <span class="arrow">→</span>
              </button>
            </div>
          </div>
        </transition>

        <!-- 步骤二：选韵 -->
        <transition name="fade-slide">
          <div v-if="currentStep === 2" class="step-panel">
            <div class="section-title">
              <span class="ink-dot"></span> 选择泥彩风格
            </div>

            <div class="style-section">
              <div class="subsection-title">预设风格</div>
              <div class="style-grid">
                <div v-for="style in presetStyles" :key="style.id" class="style-card"
                  :class="{ selected: presetStyle === style.id }" @click="selectStyle(style.id)">
                  <div class="style-icon">{{ style.icon }}</div>
                  <div class="style-name">{{ style.name }}</div>
                  <div class="style-desc">{{ style.desc }}</div>
                </div>
              </div>
            </div>

            <div class="style-section mt-6">
              <div class="subsection-title">或上传风格图</div>
              <div class="dropzone small" :class="{ filled: styleImageUrl }">
                <input type="file" accept="image/*" @change="onStyleImageChange" hidden ref="styleInputRef" />
                <div v-if="!styleImageUrl" class="dropzone-content" @click="$refs.styleInputRef?.click()">
                  <div class="upload-icon small">🎨</div>
                  <p class="small">点击上传参考图</p>
                </div>
                <div v-else class="preview-container">
                  <img :src="styleImageUrl" alt="风格图预览" />
                  <button class="remove-btn" @click="styleImageUrl=''">✕</button>
                </div>
              </div>
            </div>

            <div class="sliders-group">
              <div class="slider-item">
                <label>风格强度</label>
                <input type="range" v-model="blend" min="0" max="100" class="clay-slider">
                <span class="slider-value">{{ blend }}%</span>
              </div>
              <div class="slider-item checkbox">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="withBorder">
                  <span>添加非遗纹样边框</span>
                </label>
              </div>
            </div>

            <div class="tool-actions">
              <button class="secondary-btn" @click="prevStep">上一步</button>
              <button class="primary-btn" @click="nextStep">下一步：融魂 <span class="arrow">→</span></button>
            </div>
          </div>
        </transition>

        <!-- 步骤三：融魂 -->
        <transition name="fade-slide">
          <div v-if="currentStep === 3" class="step-panel">
            <div class="section-title">
              <span class="ink-dot"></span> 生成融合之作
            </div>

            <div class="summary-box">
              <div class="summary-item">
                <span class="summary-label">原图：</span>
                <img v-if="contentImageUrl" :src="contentImageUrl" class="summary-thumb" />
                <span v-else class="empty-text">未选择</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">风格：</span>
                <span class="summary-value">{{ getSelectedStyleName() }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">强度：</span>
                <span class="summary-value">{{ blend }}%</span>
              </div>
            </div>

            <div class="tool-actions">
              <button class="secondary-btn" @click="prevStep">上一步</button>
              <button class="fire-btn" @click="generateFusion" :disabled="generating">
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
            <h4>文生图工坊</h4>
            <p>从零开始创作泥彩作品</p>
          </div>
          <span class="arrow-right">›</span>
        </div>
      </div>
    </aside>

    <!-- 右侧展示区 -->
    <main class="view-port">
      <!-- 初始/空状态 -->
      <div v-if="!generating && !fusionImageUrl" class="empty-canvas">
        <div class="canvas-content">
          <div class="ink-circle"></div>
          <h2>风格融合</h2>
          <p>在左侧工坊开始您的风格融合之旅</p>
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
          <p class="sub-proc">正在应用{{ getSelectedStyleName() }}风格...</p>
        </div>
      </div>

      <!-- 成果证书 -->
      <div v-if="fusionImageUrl && !generating" class="certificate-view">
        <div class="certificate-paper">
          <div class="paper-texture"></div>

          <div class="cert-header">
            <span class="cert-title">非遗风格融合证书</span>
            <span class="cert-no">No.{{ Date.now().toString().slice(-8) }}</span>
          </div>

          <div class="artwork-frame" :class="[presetStyle, { 'with-border': withBorder }]">
            <img :src="fusionImageUrl" alt="融合结果" class="artwork-img" @click="openLightbox">
            <div class="style-overlay" :style="overlayStyle"></div>
            <div class="seal-mark">泥彩<br>融合</div>
          </div>

          <div class="cert-body">
            <div class="info-row">
              <span class="label">创作时间：</span>
              <span class="value">{{ new Date().toLocaleString() }}</span>
            </div>
            <div class="info-row">
              <span class="label">风格技法：</span>
              <span class="value">AI 风格融合 / {{ getSelectedStyleName() }} / 强度{{ blend }}%</span>
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
              <button class="icon-action" @click="downloadResult" title="下载图片">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </button>
              <button class="icon-action" @click="reset" title="重新创作">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
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
        <img :src="fusionImageUrl" class="lightbox-img">
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

// 状态管理
const currentStep = ref(1)
const generating = ref(false)
const contentImageUrl = ref('')
const styleImageUrl = ref('')
const fusionImageUrl = ref('')
const presetStyle = ref('fengxiang')
const dragActive = ref(false)
const blend = ref(60)
const withBorder = ref(true)
const loadingText = ref('准备材料...')
const showLightbox = ref(false)

// 数据配置
const presetStyles = [
  { id: 'fengxiang', name: '凤翔泥塑', icon: '🏺', desc: '陕西民间艺术，造型夸张色彩艳丽' },
  { id: 'nicai-doll', name: '泥彩娃娃', icon: '👶', desc: '圆润讨喜，寓意多子多福' },
  { id: 'classic', name: '经典泥彩', icon: '🎭', desc: '传统脸谱风格，忠义千秋' }
]

// 计算属性
const overlayStyle = computed(() => ({
  opacity: Math.min(0.75, Math.max(0, blend.value / 100 * 0.7))
}))

const culturalSource = computed(() => {
  const sources = [
    '灵感源自陕西凤翔泥塑彩绘技法',
    '参考了河南淮阳泥塑的勾勒填色传统',
    '融合了河北玉田泥人的点染艺术特色',
    '致敬北京泥塑兔儿爷的造型美学'
  ]
  return sources[Math.floor(Math.random() * sources.length)]
})

// 逻辑方法
function setStep(n) { currentStep.value = n }
function nextStep() { if (currentStep.value < 3) currentStep.value++ }
function prevStep() { if (currentStep.value > 1) currentStep.value-- }

function selectStyle(id) { presetStyle.value = id }
function getSelectedStyleName() {
  return presetStyles.find(s => s.id === presetStyle.value)?.name || '未知风格'
}

function onContentImageChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    alert('请上传图片文件（JPG/PNG 等）')
    return
  }
  contentImageUrl.value = URL.createObjectURL(file)
}

function onContentDrop(e) {
  dragActive.value = false
  const file = e.dataTransfer?.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    alert('请拖拽图片文件（JPG/PNG 等）')
    return
  }
  contentImageUrl.value = URL.createObjectURL(file)
}

function onStyleImageChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    alert('请上传图片文件作为风格图')
    return
  }
  styleImageUrl.value = URL.createObjectURL(file)
}

async function generateFusion() {
  if (!contentImageUrl.value) {
    alert('请先上传照片或插画')
    return
  }

  generating.value = true
  fusionImageUrl.value = null

  const steps = ['分析原图...', '提取风格...', '融合色彩...', '精修细节...']
  let stepIdx = 0

  const interval = setInterval(() => {
    if (stepIdx < steps.length) {
      loadingText.value = steps[stepIdx]
      stepIdx++
    }
  }, 1500)

  try {
    // 模拟生成过程
    await new Promise(r => setTimeout(r, 3000))
    fusionImageUrl.value = contentImageUrl.value
    generating.value = false
    clearInterval(interval)
  } catch (e) {
    clearInterval(interval)
    alert('生成失败，请重试')
    generating.value = false
  }
}

function downloadResult() {
  if (!fusionImageUrl.value) return
  const a = document.createElement('a')
  a.href = fusionImageUrl.value
  a.download = `泥彩风格融合_${Date.now()}.png`
  a.click()
}

function reset() {
  contentImageUrl.value = ''
  styleImageUrl.value = ''
  fusionImageUrl.value = ''
  presetStyle.value = 'fengxiang'
  blend.value = 60
  withBorder.value = true
  currentStep.value = 1
}

function openLightbox() { showLightbox.value = true }
</script>

<style scoped>
/* 新中式数字美学配色系统 */
.fusion-studio {
  --bg-earth: #FAF3E8;
  --bg-panel: #FFFBF5;
  --color-cinnabar: #B83B3B;
  --color-celadon: #4A6B7D;
  --color-glaze: #C2A57E;
  --color-paper: #F5E6D3;
  --color-text-main: #2C2622;
  --color-text-sub: #5D5550;
  --border-color: #E6D6C6;
}

.fusion-studio {
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

.subsection-title {
  font-size: 14px;
  color: var(--color-text-sub);
  margin-bottom: 12px;
  font-weight: 500;
}

/* 上传区域 */
.upload-area {
  margin-bottom: 20px;
}

.dropzone {
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  background: #fff;
  transition: all 0.3s;
  cursor: pointer;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropzone.small {
  min-height: 120px;
  padding: 12px;
}

.dropzone:hover,
.dropzone.active {
  border-color: var(--color-cinnabar);
  background: #FFF5F5;
}

.dropzone-content {
  cursor: pointer;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.upload-icon.small {
  font-size: 32px;
  margin-bottom: 8px;
}

.click-upload {
  color: var(--color-cinnabar);
  cursor: pointer;
  font-weight: 500;
}

.hint {
  font-size: 12px;
  color: var(--color-text-sub);
  margin-top: 8px;
}

.preview-container {
  position: relative;
  width: 100%;
}

.preview-container img {
  width: 100%;
  border-radius: 6px;
}

.remove-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-cinnabar);
  color: #fff;
  border: 2px solid #fff;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}

.remove-btn:hover {
  transform: scale(1.1);
}

/* 风格选择 */
.style-section {
  margin-bottom: 20px;
}

.style-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.style-card {
  border: 1px solid var(--border-color);
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 12px;
}

.style-card:hover {
  border-color: var(--color-cinnabar);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.style-card.selected {
  border-color: var(--color-cinnabar);
  background: #FFF5F5;
}

.style-icon {
  font-size: 28px;
}

.style-name {
  font-weight: bold;
  font-family: "KaiTi";
  font-size: 16px;
  color: var(--color-text-main);
}

.style-desc {
  font-size: 12px;
  color: var(--color-text-sub);
}

/* 滑块组 */
.sliders-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}

.slider-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: var(--color-text-sub);
}

.slider-item label {
  min-width: 80px;
}

.clay-slider {
  flex: 1;
  accent-color: var(--color-cinnabar);
}

.slider-value {
  min-width: 40px;
  text-align: right;
  color: var(--color-cinnabar);
  font-weight: 600;
}

.slider-item.checkbox {
  justify-content: flex-start;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin: 0;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--color-cinnabar);
}

/* 汇总信息 */
.summary-box {
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
}

.summary-item:last-child {
  margin-bottom: 0;
}

.summary-label {
  color: var(--color-text-sub);
  min-width: 60px;
}

.summary-thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.summary-value {
  color: var(--color-text-main);
  font-weight: 500;
}

.empty-text {
  color: var(--color-text-sub);
  font-style: italic;
}

/* 按钮样式 */
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

.arrow {
  margin-left: 4px;
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
  text-decoration: none;
  color: inherit;
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
  content: "融";
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

.style-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: multiply;
  opacity: 0.38;
}

.artwork-frame.with-border::before {
  content:"";
  position:absolute;
  inset:0;
  pointer-events:none;
  border-radius:0;
  border: 10px solid transparent;
  background: repeating-linear-gradient(45deg, rgba(185,44,35,.25) 0 8px, rgba(240,208,160,.25) 8px 16px);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

/* 预设风格滤镜 */
.fengxiang .style-overlay {
  background: linear-gradient(135deg, rgba(185,44,35,0.35), rgba(240,208,160,0.35));
  filter: contrast(1.05) saturate(1.1);
}

.nicai-doll .style-overlay {
  background: linear-gradient(135deg, rgba(255,165,0,0.32), rgba(255,105,180,0.28));
  filter: saturate(1.2) contrast(1.08);
}

.classic .style-overlay {
  background: linear-gradient(135deg, rgba(180,80,60,0.30), rgba(120,80,60,0.30));
  filter: grayscale(0.05) saturate(1.05);
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
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
}

@keyframes flame {
  0% { transform: scaleY(1); }
  100% { transform: scaleY(1.5); }
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
