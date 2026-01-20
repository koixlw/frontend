<template>
  <section class="craft-process" ref="processRef">
    <div class="container-museum">
      <!-- 标题区 -->
      <div class="process-header" v-scroll-reveal>
        <span class="section-tag">匠心工艺</span>
        <h2 class="text-display-md">从泥土到艺术品</h2>
        <div class="divider-gold"></div>
        <p class="text-body-lg" style="color: var(--color-gray-light);">
          七分塑,三分彩<br>
          每一步都凝聚着匠人的心血与智慧
        </p>
      </div>

      <!-- 工艺步骤导航 -->
      <div class="process-nav" v-scroll-reveal="{ delay: 200 }">
        <div
          v-for="(step, index) in steps"
          :key="index"
          :class="['nav-item', { active: currentStep === index }]"
          @click="goToStep(index)"
        >
          <div class="nav-number">{{ String(index + 1).padStart(2, '0') }}</div>
          <div class="nav-icon">{{ step.icon }}</div>
          <div class="nav-label">{{ step.title }}</div>
          <div class="nav-progress" :style="{ width: getStepProgress(index) }"></div>
        </div>
      </div>

      <!-- 步骤展示区 -->
      <div class="process-display" v-scroll-reveal="{ delay: 400 }">
        <transition :name="transitionDirection" mode="out-in">
          <div :key="currentStep" class="step-content">
            <!-- 左侧 - 工艺展示 -->
            <div class="step-visual">
              <!-- 主图片 -->
              <div class="visual-image">
                <img :src="steps[currentStep].image" :alt="steps[currentStep].title">
                <div class="image-overlay overlay-ink"></div>

                <!-- 热点标注 -->
                <div
                  v-for="(hotspot, hIndex) in steps[currentStep].hotspots"
                  :key="hIndex"
                  class="hotspot"
                  :style="{ left: hotspot.x + '%', top: hotspot.y + '%' }"
                  @click="showHotspotDetail(hotspot)"
                >
                  <div class="hotspot-pulse"></div>
                  <div class="hotspot-tooltip">
                    <div class="tooltip-title">{{ hotspot.title }}</div>
                    <div class="tooltip-desc">{{ hotspot.desc }}</div>
                  </div>
                </div>
              </div>

              <!-- 工艺参数 -->
              <div class="visual-specs">
                <div
                  v-for="(spec, sIndex) in steps[currentStep].specs"
                  :key="sIndex"
                  class="spec-item"
                >
                  <span class="spec-label">{{ spec.label }}</span>
                  <span class="spec-value">{{ spec.value }}</span>
                </div>
              </div>
            </div>

            <!-- 右侧 - 工艺说明 -->
            <div class="step-info">
              <!-- 工序名称 -->
              <h3 class="step-title">
                <span class="step-number">{{ currentStep + 1 }}</span>
                {{ steps[currentStep].title }}
              </h3>

              <!-- 工序描述 -->
              <p class="step-desc">{{ steps[currentStep].description }}</p>

              <!-- 关键要点 -->
              <div class="step-points">
                <div class="points-title">关键要点</div>
                <ul class="points-list">
                  <li v-for="(point, pIndex) in steps[currentStep].points" :key="pIndex">
                    <span class="point-icon">●</span>
                    <span class="point-text">{{ point }}</span>
                  </li>
                </ul>
              </div>

              <!-- 时间和难度 -->
              <div class="step-meta">
                <div class="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span>{{ steps[currentStep].duration }}</span>
                </div>
                <div class="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <span>{{ steps[currentStep].difficulty }}</span>
                </div>
              </div>

              <!-- 导航按钮 -->
              <div class="step-navigation">
                <button
                  class="nav-btn prev-btn"
                  @click="prevStep"
                  :disabled="currentStep === 0"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                  上一步
                </button>

                <button
                  class="nav-btn next-btn"
                  @click="nextStep"
                  :disabled="currentStep === steps.length - 1"
                >
                  下一步
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- 进度指示器 -->
      <div class="process-progress" v-scroll-reveal="{ delay: 600 }">
        <div class="progress-bar">
          <div
            v-for="(step, index) in steps"
            :key="index"
            :class="['progress-segment', { active: index <= currentStep }]"
            :style="{ flex: 1 }"
          ></div>
        </div>
        <div class="progress-label">
          工艺进度: {{ currentStep + 1 }} / {{ steps.length }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import img1 from '@/assets/images/image1.png';
import img2 from '@/assets/images/image2.png';

const currentStep = ref(0);
const transitionDirection = ref('slide-left');

// 工艺步骤数据
const steps = ref([
  {
    title: '选泥',
    icon: '🏺',
    image: img1,
    description: '选用优质的黏土,经过风化、破碎、筛选、淘洗等多道工序,去除杂质,练就细腻纯净的泥料。这是制作优质泥彩人的第一步,也是决定成品质量的关键。',
    duration: '2-3天',
    difficulty: '★★☆☆☆',
    specs: [
      { label: '泥土类型', value: '红黏土' },
      { label: '含水率', value: '18-22%' },
      { label: '颗粒度', value: '< 0.05mm' }
    ],
    points: [
      '选择黏性强的红黏土',
      '自然风化至少1年',
      '反复淘洗去除杂质',
      '练泥至质地均匀细腻'
    ],
    hotspots: [
      { x: 30, y: 40, title: '泥料源头', desc: '来自优质黏土矿' },
      { x: 70, y: 60, title: '处理中', desc: '正在风化处理' }
    ]
  },
  {
    title: '揉泥',
    icon: '👐',
    image: img2,
    description: '将练好的泥料反复揉搓,排除气泡,使泥料质地更加均匀紧密。这个过程需要匠人丰富的经验和手感,是保证成品不开裂、不变形的关键。',
    duration: '1-2小时',
    difficulty: '★★★☆☆',
    specs: [
      { label: '揉压次数', value: '> 100次' },
      { label: '泥料温度', value: '20-25°C' },
      { label: '目标密度', value: '1.8g/cm³' }
    ],
    points: [
      '反复揉压排除气泡',
      '保持泥料适宜湿度',
      '手感判断泥料状态',
      '揉至表面光滑细腻'
    ],
    hotspots: [
      { x: 50, y: 50, title: '揉压中心', desc: '核心揉压区域' }
    ]
  },
  {
    title: '塑形',
    icon: '🖐️',
    image: img1,
    description: '运用捏、塑、压、贴等多种技法,将泥料塑造成型。这是考验匠人技艺的关键环节,需要深厚的功底和丰富的经验,才能塑造出生动传神的作品。',
    duration: '3-5小时',
    difficulty: '★★★★☆',
    specs: [
      { label: '工具', value: '竹刀、木槌' },
      { label: '精度', value: '± 0.5mm' },
      { label: '关键', value: '神态捕捉' }
    ],
    points: [
      '先塑大体轮廓',
      '逐步细化五官',
      '注重神态表现',
      '手脚等细节精雕'
    ],
    hotspots: [
      { x: 40, y: 35, title: '面部', desc: '重点刻画区域' },
      { x: 60, y: 65, title: '手部', desc: '精细塑造部分' }
    ]
  },
  {
    title: '晾干',
    icon: '☀️',
    image: img2,
    description: '将塑造成型的泥彩人放置在阴凉通风处自然阴干,避免阳光直射和风吹。这个过程需要匠人精心照料,确保干燥均匀,防止开裂变形。',
    duration: '7-15天',
    difficulty: '★★☆☆☆',
    specs: [
      { label: '环境温度', value: '20-25°C' },
      { label: '相对湿度', value: '50-60%' },
      { label: '干燥程度', value: '含水率 < 8%' }
    ],
    points: [
      '阴凉通风处放置',
      '避免阳光直射',
      '定期翻动确保均匀',
      '自然阴干约10天'
    ],
    hotspots: [
      { x: 50, y: 50, title: '晾晒区', desc: '保持通风干燥' }
    ]
  },
  {
    title: '上色',
    icon: '🎨',
    image: img1,
    description: '使用矿物颜料进行彩绘,色彩鲜艳明快,具有浓郁的民族特色。彩绘讲究"随类赋彩",根据不同题材和人物性格选择合适的色彩搭配。',
    duration: '2-4小时',
    difficulty: '★★★★★',
    specs: [
      { label: '颜料', value: '矿物颜料' },
      { label: '技法', value: '工笔重彩' },
      { label: '层数', value: '3-5层' }
    ],
    points: [
      '先勾后填技法',
      '色彩对比鲜明',
      '面部细致描绘',
      '服饰花纹精美'
    ],
    hotspots: [
      { x: 35, y: 30, title: '面部', desc: '精细彩绘' },
      { x: 65, y: 70, title: '服饰', desc: '纹饰描绘' }
    ]
  },
  {
    title: '烧制',
    icon: '🔥',
    image: img2,
    description: '将彩绘完成的泥彩人入窑烧制,温度控制在800-900℃之间。经过高温烧制,泥彩人定色固化,色彩更加鲜艳持久,且具有一定的防水防潮性能。',
    duration: '8-12小时',
    difficulty: '★★★☆☆',
    specs: [
      { label: '窑温', value: '850±50°C' },
      { label: '升温速度', value: '5°C/min' },
      { label: '保温时间', value: '2-3小时' }
    ],
    points: [
      '逐步升温防止开裂',
      '达到目标温度保温',
      '自然冷却降温',
      '出窑检验质量'
    ],
    hotspots: [
      { x: 50, y: 50, title: '窑炉', desc: '高温烧制区' }
    ]
  },
  {
    title: '成品',
    icon: '✨',
    image: img1,
    description: '经过以上六道工序,一件精美的泥彩人作品终于完成。每一件作品都凝聚着匠人的心血,都是独一无二的艺术珍品,承载着深厚的文化内涵。',
    duration: '总计 15-30天',
    difficulty: '★★★★★',
    specs: [
      { label: '重量', value: '200-500g' },
      { label: '高度', value: '10-30cm' },
      { label: '保存期', value: '50年以上' }
    ],
    points: [
      '每件都是孤品',
      '具有收藏价值',
      '可长期保存传承',
      '承载文化内涵'
    ],
    hotspots: [
      { x: 50, y: 50, title: '作品', desc: '完成的艺术品' }
    ]
  }
]);

// 切换步骤
const goToStep = (index) => {
  if (index === currentStep.value) return;

  transitionDirection.value = index > currentStep.value ? 'slide-left' : 'slide-right';
  currentStep.value = index;
};

const nextStep = () => {
  if (currentStep.value < steps.value.length - 1) {
    transitionDirection.value = 'slide-left';
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    transitionDirection.value = 'slide-right';
    currentStep.value--;
  }
};

// 计算步骤进度
const getStepProgress = (index) => {
  if (index < currentStep.value) return '100%';
  if (index === currentStep.value) return '0%';
  return '0%';
};

// 显示热点详情
const showHotspotDetail = (hotspot) => {
  // 可以打开模态框或显示详情
  alert(`${hotspot.title}\n\n${hotspot.desc}`);
};
</script>

<style scoped>
.craft-process {
  position: relative;
  padding: 120px 0;
  background: linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg-warm) 100%);
}

/* === 标题区 === */
.process-header {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 80px;
}

.section-tag {
  display: inline-block;
  padding: 10px 25px;
  background: rgba(139, 69, 19, 0.1);
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  font-size: 14px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 20px;
}

/* === 工艺导航 === */
.process-nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 60px;
  flex-wrap: wrap;
}

.nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background: white;
  border: 2px solid var(--color-gray-light);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  min-width: 120px;
}

.nav-item:hover {
  border-color: var(--color-primary);
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.nav-item.active {
  background: var(--gradient-earth);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-accent);
}

.nav-item.active .nav-number,
.nav-item.active .nav-icon,
.nav-item.active .nav-label {
  color: white;
}

.nav-number {
  font-family: 'Stele', serif;
  font-size: 24px;
  font-weight: 900;
  color: var(--color-primary);
}

.nav-icon {
  font-size: 32px;
}

.nav-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-dark);
}

.nav-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: var(--color-gold);
  transition: width 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

/* === 步骤展示 === */
.process-display {
  margin-bottom: 60px;
}

.step-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

/* 左侧 - 视觉展示 */
.step-visual {
  position: relative;
}

.visual-image {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-xl);
}

.visual-image img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.6s ease;
}

.visual-image:hover img {
  transform: scale(1.05);
}

/* 热点标注 */
.hotspot {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(196, 30, 58, 0.3);
  border: 2px solid var(--color-accent);
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
  z-index: 10;
}

.hotspot:hover {
  background: rgba(196, 30, 58, 0.6);
  transform: translate(-50%, -50%) scale(1.2);
}

.hotspot-pulse {
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  border: 2px solid var(--color-accent);
  animation: hotspotPulse 2s ease-in-out infinite;
}

@keyframes hotspotPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.hotspot-tooltip {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  padding: 15px;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid var(--color-gold);
  border-radius: 8px;
  color: white;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
}

.hotspot:hover .hotspot-tooltip {
  opacity: 1;
  pointer-events: auto;
}

.tooltip-title {
  font-weight: 600;
  margin-bottom: 5px;
  color: var(--color-gold);
}

.tooltip-desc {
  font-size: 12px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.8);
}

/* 工艺参数 */
.visual-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 20px;
}

.spec-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  border-left: 3px solid var(--color-primary);
}

.spec-label {
  font-size: 12px;
  color: var(--color-gray);
  text-transform: uppercase;
}

.spec-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-dark);
}

/* 右侧 - 工艺信息 */
.step-info {
  padding: 20px;
}

.step-title {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  font-size: 32px;
  font-weight: 700;
  color: var(--color-dark);
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: var(--gradient-earth);
  color: white;
  font-family: 'Stele', serif;
  font-size: 24px;
  font-weight: 900;
  border-radius: 50%;
}

.step-desc {
  font-size: 16px;
  line-height: 1.8;
  color: var(--color-gray);
  margin-bottom: 30px;
}

/* 关键要点 */
.step-points {
  margin-bottom: 30px;
}

.points-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 15px;
}

.points-list {
  list-style: none;
  padding: 0;
}

.points-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 15px;
  color: var(--color-dark);
}

.point-icon {
  color: var(--color-accent);
  font-size: 8px;
  margin-top: 6px;
}

/* 元数据 */
.step-meta {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(139, 69, 19, 0.05);
  border-radius: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-dark);
}

.meta-item svg {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
}

/* 导航按钮 */
.step-navigation {
  display: flex;
  gap: 20px;
}

.nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  background: white;
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover:not(:disabled) {
  background: var(--gradient-earth);
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: var(--shadow-accent);
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.nav-btn svg {
  width: 20px;
  height: 20px;
}

/* === 进度条 === */
.process-progress {
  max-width: 600px;
  margin: 0 auto;
}

.progress-bar {
  display: flex;
  gap: 5px;
  margin-bottom: 15px;
}

.progress-segment {
  height: 4px;
  background: var(--color-gray-light);
  border-radius: 2px;
  transition: all 0.4s ease;
}

.progress-segment.active {
  background: var(--gradient-gold);
}

.progress-label {
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-gray);
}

/* === 切换动画 === */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
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

/* === 响应式 === */
@media (max-width: 1024px) {
  .step-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .visual-specs {
    order: -1;
  }
}

@media (max-width: 768px) {
  .craft-process {
    padding: 80px 0;
  }

  .process-nav {
    gap: 10px;
  }

  .nav-item {
    min-width: 80px;
    padding: 15px;
  }

  .nav-number {
    font-size: 20px;
  }

  .nav-icon {
    font-size: 24px;
  }

  .nav-label {
    font-size: 12px;
  }

  .step-title {
    font-size: 24px;
  }

  .step-meta {
    flex-direction: column;
    gap: 15px;
  }

  .step-navigation {
    flex-direction: column;
  }

  .nav-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
