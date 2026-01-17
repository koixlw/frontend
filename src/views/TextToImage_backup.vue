<template>
  <div class="t2i-page">
    <div class="container">
      <p class="subtitle">以文字为笔，以泥彩为魂，让老记忆在AI中重生</p>
      <h2 class="title">非遗泥彩人 · 文生图</h2>

      <!-- 向导步骤条 -->
      <div class="steps">
        <div class="step" :class="{active: step===1, done: step>1}">
          <span class="num">①</span>
          <span class="text">说出你心中的泥彩人</span>
        </div>
        <div class="step" :class="{active: step===2, done: step>2}">
          <span class="num">②</span>
          <span class="text">AI创作 · 窑火燃起</span>
        </div>
        <div class="step" :class="{active: step===3}">
          <span class="num">③</span>
          <span class="text">欣赏与分享</span>
        </div>
      </div>

      <!-- Step 1: 输入区 -->
      <section v-show="step===1" class="pane">
        <label class="label">提示词</label>
        <div class="prompt-row">
          <textarea
            v-model="prompt"
            class="paper-input"
            rows="4"
            placeholder="描述你心中的泥彩人，例如：一个吹唢呐的红色泥娃娃，笑容灿烂，背景是春节庙会"
          ></textarea>
          <button class="mic" @click="toggleVoice" :class="{on: voiceOn}" title="语音输入">🎤</button>
        </div>

        <!-- 灵感标签库 -->
        <div class="tag-groups">
          <div class="tag-group">
            <div class="tag-group-title">主题</div>
            <div class="tags">
              <button v-for="t in tags.theme" :key="t" class="tag" @click="appendTag(t)">{{ t }}</button>
            </div>
          </div>
          <div class="tag-group">
            <div class="tag-group-title">颜色</div>
            <div class="tags">
              <button v-for="t in tags.color" :key="t" class="tag" @click="appendTag(t)">{{ t }}</button>
            </div>
          </div>
          <div class="tag-group">
            <div class="tag-group-title">动作</div>
            <div class="tags">
              <button v-for="t in tags.action" :key="t" class="tag" @click="appendTag(t)">{{ t }}</button>
            </div>
          </div>
          <div class="tag-group">
            <div class="tag-group-title">风格</div>
            <div class="tags">
              <button v-for="t in tags.style" :key="t" class="tag" @click="appendTag(t)">{{ t }}</button>
            </div>
          </div>
        </div>

        <!-- 简选参数 -->
        <div class="row">
          <label class="toggle"><input type="checkbox" v-model="withBorder" /> 添加非遗纹样边框</label>
        </div>

    
        <div class="adv-grid">
          <div>
            <label class="label">尺寸</label>
            <select v-model="size" class="select">
              <option value="512x512">1:1 方形（512）</option>
              <option value="768x512">16:10 横幅（768×512）</option>
              <option value="512x768">10:16 竖幅（512×768）</option>
            </select>
          </div>
          <div>
            <label class="label">质量模式</label>
            <select v-model="quality" class="select">
              <option value="standard">标准</option>
              <option value="high">高质量（较慢）</option>
            </select>
          </div>
        </div>

        <details class="advanced">
          <summary>高级选项</summary>
          <div class="adv-sliders">
            <div class="field">
              <label class="label">风格强度</label>
              <input type="range" min="0" max="100" v-model.number="styleStrength" />
            </div>
            <div class="field">
              <label class="label">微调程度</label>
              <input type="range" min="0" max="100" v-model.number="tweakLevel" />
              <p class="tiny">微调程度越高，生成的多图差异越显著；低微调保持主体一致性更强。</p>
            </div>
          </div>
        </details>

        <!-- 知识卡（根据预设或关键词触发） -->
        <div class="knowledge" v-if="cardData">
          <div class="knowledge-card">
            <h4 class="k-title">{{ cardData.title }}</h4>
            <p class="k-body">{{ cardData.body }}</p>
          </div>
        </div>

        <div class="actions">
          <button class="seal-btn" :disabled="!prompt.trim() || generating" @click="startGenerate">
            {{ generating ? '刻印中...' : '刻印（生成）' }}
          </button>
          <button class="btn secondary" @click="resetForm">重置</button>
        </div>
      </section>

      <!-- Step 2: 生成动画 -->
      <section v-show="step===2" class="pane generating">
        <div class="kiln">
          <div class="flame"></div>
          <div class="heat"></div>
        </div>
        <p class="poetic">窑火正旺，泥彩成形中…</p>
        <p class="tiny">AI 正在根据你的描述与泥彩美学生成多种变体</p>
      </section>

      <!-- Step 3: 结果与互动 -->
      <section v-show="step===3" class="pane">
        <h3 class="pane-title">生成结果（{{ variants.length }} 款变体）</h3>
        <div class="variants">
          <div class="variant" v-for="(v,i) in variants" :key="i">
            <div class="frame" :class="{border: withBorder}">
              <img :src="v" class="img" :alt="`生成变体_${i+1}`" />
              <div class="overlay" :style="overlayStyle"></div>
            </div>
            <div class="v-actions">
              <button class="btn secondary" @click="download(v, i)">下载</button>
              <button class="btn" @click="share(v)">分享</button>
              <button class="btn ghost" @click="collect(v)">收藏</button>
            </div>
          </div>
        </div>

        <!-- 提示词与小故事 -->
        <div class="prompt-view">提示词：{{ fullPrompt }}</div>
        <div class="story" v-if="story">
          <h4 class="story-title">小故事</h4>
          <p class="story-body">{{ story }}</p>
        </div>

        <div class="actions">
          <button class="btn secondary" @click="step=1">再次生成</button>
          <router-link to="/gallery" class="btn">去作品展柜</router-link>
        </div>
      </section>

      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// 基本输入
const prompt = ref('')
const size = ref('512x512')
const quality = ref('standard')
const styleStrength = ref(60)
const tweakLevel = ref(40)
const withBorder = ref(true)
const generating = ref(false)
const error = ref('')
const step = ref(1)

// 语音（简版）
const voiceOn = ref(false)
let recognition = null

// 结果
const variants = ref([])
const story = ref('')
const lastBaseSeed = ref(0)

// 灵感标签
const tags = {
  theme: ['喜庆','祈福','丰收','门神','孩童','戏曲人物'],
  color: ['朱红','明黄','靛蓝','墨黑','桃粉','陶土色'],
  action: ['吹笛','舞狮','敲鼓','抱鲤鱼','放鞭炮'],
  style: ['传统泥塑风','现代插画风','3D写实风','水墨风']
}
function appendTag(t){
  const s = prompt.value?.trim()
  prompt.value = s ? `${s}，${t}` : t
  updateCardByTag(t)
}

// 文化知识卡（示例）
const cardData = ref(null)
function updateCardByTag(t){
  if(['门神','祈福'].includes(t)){
    cardData.value = { title: '门神文化', body: '门神象征守护与祈福，常见朱红与金色点缀，配以云纹回纹。' }
  } else if(['孩童','泥娃娃'].includes(t)){
    cardData.value = { title: '泥娃娃', body: '圆脸团子、笑眼红晕，童趣是泥彩人重要主题，寓意纯真与吉祥。' }
  }
}

// 风格映射（用于拼接到提示词）
const styleMap = {
  base: 'Nicairen clay folk art, handcrafted texture, warm earthy palette, museum-grade'
}
const fullPrompt = computed(() => `${prompt.value}, ${styleMap.base}, style_strength:${styleStrength.value}`)

// 语音输入（浏览器支持受限）
function toggleVoice(){
  try{
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if(!SR){ alert('当前浏览器不支持语音输入'); return }
    if(!recognition){
      recognition = new SR(); recognition.lang='zh-CN'; recognition.continuous=false; recognition.interimResults=true
      recognition.onresult = (e) => { const r = Array.from(e.results).map(x=>x[0].transcript).join(' '); prompt.value = (prompt.value + ' ' + r).trim() }
      recognition.onend = () => { voiceOn.value = false }
    }
    if(!voiceOn.value){ recognition.start(); voiceOn.value=true } else { recognition.stop(); voiceOn.value=false }
  }catch(e){ console.error(e) }
}

// 生成逻辑（使用 pollinations 占位）
function buildUrl(seedNum){
  const [w,h] = size.value.split('x').map(Number)
  const s = seedNum ?? Math.floor(Math.random()*1000000)
  const q = quality.value === 'high' ? '&enhance=true' : ''
  const encoded = encodeURIComponent(fullPrompt.value)
  return `https://image.pollinations.ai/prompt/${encoded}?seed=${s}&width=${w}&height=${h}${q}&t=${Date.now()}`
}

async function startGenerate(){
  if(!prompt.value.trim()) return
  error.value = ''
  generating.value = true
  step.value = 2
  variants.value = []
  story.value = ''
  setTimeout(async ()=>{
    try{
      // 基础种子与微调偏移：根据微调程度生成差异化序列
      const base = lastBaseSeed.value || Math.floor(Math.random()*100000)
      lastBaseSeed.value = base
      const step = Math.max(1, Math.round(tweakLevel.value / 8))
      const offsets = [0, step, step*2 + 1, step*3 + 2]
      const urls = offsets.map(off => buildUrl(base + off))
      variants.value = urls
      // 生成一个简短故事（占位）
      story.value = genStory(prompt.value)
      step.value = 3
    }catch(e){ error.value = e?.message || '生成失败，请稍后重试' }
    finally{ generating.value = false }
  }, 900)
}

function genStory(text){
  const theme = (text.match(/喜庆|祈福|丰收|门神|孩童|戏曲人物/)||['泥彩人'])[0]
  return `在一座古镇的窑火旁，${theme}的身影被捏塑成形。泥彩的朱红与金色在火光中跳跃，像老记忆被轻轻唤醒。它看向来人，仿佛要把祝愿与故事，一并托付给你。`
}

// 结果交互
function download(url, i){ const a=document.createElement('a'); a.href=url; a.download=`nicairen_${i+1}.png`; a.click() }
async function share(url){ try{ await navigator.clipboard.writeText(url); alert('已复制分享链接到剪贴板'); }catch{ window.open(url, '_blank') } }
function collect(url){ /* 可接入后端收藏接口 */ alert('已收藏到“非遗记忆库”（示例）') }

// 叠加滤镜（演示用）
const overlayStyle = computed(()=>({
  opacity: 0.28,
  background: 'linear-gradient(135deg, rgba(185,44,35,0.35), rgba(240,208,160,0.25))',
  mixBlendMode: 'multiply'
}))

function resetForm(){ prompt.value=''; size.value='512x512'; quality.value='standard'; styleStrength.value=60; tweakLevel.value=40; withBorder.value=true; cardData.value=null; variants.value=[]; story.value=''; step.value=1; lastBaseSeed.value=0 }

// 根据输入动态提示（示例：触发知识卡）
watch(prompt, (v)=>{
  if(/凤翔|门神|娃娃|祈福/.test(v)){
    cardData.value = { title: '民俗符号', body: '凤翔泥塑、门神、泥娃娃等元素常见于节庆与祈福场景，色彩以朱红、明黄为主。' }
  }
})
</script>

<style scoped>
.t2i-page { padding: 60px 0; background: var(--color-bg); }
.container { max-width: 1000px; margin: 0 auto; padding: 0 20px; }
.subtitle { text-align: center; color: #b92c23; margin-bottom: 6px; }
.title { text-align: center; font-size: 32px; margin-bottom: 20px; }

.steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px; }
.step { display:flex; align-items:center; gap:8px; background:#efe7d9; border:1px solid #e1d7c6; border-radius:10px; padding:10px; opacity:.85 }
.step.active { opacity: 1; box-shadow: 0 0 0 2px #d93b30 inset; }
.step.done { opacity:.9 }
.step .num { background:#d93b30; color:#fff; border-radius:50%; width:26px; height:26px; display:flex; align-items:center; justify-content:center; font-weight:700 }
.step .text { color:#5a4a3a; font-weight:600 }

.pane { background:#faf7ef; border:1px solid #e1d7c6; border-radius:12px; padding:16px; }
.pane-title { font-size:18px; margin-bottom:10px; }

.label { display:block; font-weight:600; margin:12px 0 6px; color:#5a4a3a }
.prompt-row { display:grid; grid-template-columns: 1fr auto; gap:8px; align-items:start }
.paper-input { width:100%; padding:14px 16px; border:1px solid #d8cbb6; border-radius:14px; font-size:15px; background: linear-gradient(180deg, #fffaf2, #fff8ee); box-shadow: inset 0 1px 3px rgba(0,0,0,.05) }
.mic { border:1px solid #d8cbb6; background:#fff; border-radius:50%; width:40px; height:40px; cursor:pointer }
.mic.on { background:#ffe6d9 }

.tag-groups { display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:10px; margin-top:12px }
.tag-group { background:#fff; border:1px dashed #d8cbb6; border-radius:10px; padding:10px }
.tag-group-title { font-weight:700; color:#7a6a56; margin-bottom:8px }
.tags { display:flex; flex-wrap:wrap; gap:8px }
.tag { padding:6px 10px; border:1px solid #d8cbb6; border-radius:16px; background:#fff; cursor:pointer; transition: transform .15s, box-shadow .15s }
.tag:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,.08) }

.row { display:grid; grid-template-columns: 1fr 1fr 1fr; gap:12px; align-items:center; margin-top:12px }
.select, .input { width:100%; padding:10px; border:1px solid #d8cbb6; border-radius:12px; background:#fff }
.toggle { color:#5a4a3a }

.advanced { margin-top: 10px }
.advanced summary { cursor:pointer; padding:6px 8px; border: 1px solid #e1d7c6; border-radius:8px; background:#fff }
.adv-grid { display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-top:10px }

.knowledge { margin-top:12px }
.knowledge-card { background:#fff; border:1px solid #e1d7c6; border-radius:10px; padding:12px }
.k-title { font-size:16px; margin-bottom:6px }
.k-body { color:#666; line-height:1.7 }

.actions { display:flex; gap:10px; margin-top:16px }
.btn { background:#d93b30; color:#fff; border:none; padding:10px 16px; border-radius:6px; cursor:pointer }
.btn.secondary { background:#7a6a56 }
.btn.ghost { background:transparent; color:#d93b30; border:1px solid #d93b30 }
.btn:disabled { opacity:.6; cursor:not-allowed }

/* 印章按钮与动效 */
.seal-btn { position:relative; background:#b92c23; color:#fff; border:none; padding:12px 18px; border-radius:8px; cursor:pointer; overflow:hidden }
.seal-btn::after { content:''; position:absolute; inset:-10px; border:3px solid rgba(255,255,255,.25); border-radius:50%; transform: scale(0); transition: transform .25s ease }
.seal-btn:active::after { transform: scale(1) }

/* 窑火动画 */
.generating { text-align:center }
.kiln { position:relative; height:160px; margin: 10px auto; }
.flame { position:absolute; left:50%; transform:translateX(-50%); bottom:0; width:120px; height:120px; background: radial-gradient(circle at 50% 60%, rgba(255,180,80,.8), rgba(255,80,60,.7), rgba(185,44,35,.6)); border-radius:50%; filter: blur(6px); animation: flame 1.6s infinite ease-in-out }
.heat { position:absolute; left:50%; transform:translateX(-50%); bottom:0; width:180px; height:20px; background:#c7b28f; border-radius:20px }
@keyframes flame { 0%,100%{ transform:translateX(-50%) scale(1)} 50%{ transform:translateX(-50%) scale(1.06) } }
.poetic { color:#5a4a3a; margin-top:6px }
.tiny { color:#9a8a76; font-size:12px }

/* 结果区 */
.variants { display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:16px }
.variant { background:#fff; border:1px solid #e1d7c6; border-radius:10px; padding:10px }
.frame { position:relative; border-radius:8px; overflow:hidden }
.frame.border { box-shadow: inset 0 0 0 10px rgba(217,59,48,.08), inset 0 0 0 12px rgba(217,59,48,.22) }
.img { width:100%; display:block }
.overlay { position:absolute; inset:0; pointer-events:none }
.v-actions { display:flex; gap:8px; margin-top:10px }
.prompt-view { margin-top:14px; color:#5a4a3a }
.story { margin-top:12px; background:#fff; border:1px solid #e1d7c6; border-radius:10px; padding:12px }
.story-title { font-size:16px; margin-bottom:6px }
.story-body { color:#666; line-height:1.8 }

.error { color:#d93b30; margin-top:12px }
@media (max-width:768px){ .row{ grid-template-columns: 1fr } .adv-grid{ grid-template-columns: 1fr } }
</style>
.advanced {
  margin-top: 12px;
}
.adv-sliders {
  display: flex;
  flex-direction: column;
  gap: 14px; /* 为两个滑块提供恰当间距，避免拥挤 */
  padding: 8px 12px;
}
.adv-sliders .field .label { margin-bottom: 4px; }
.adv-sliders input[type="range"] { width: 100%; }
