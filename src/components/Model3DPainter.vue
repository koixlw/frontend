<template>
  <div class="model-painter-container">
    <div ref="viewerContainer" class="viewer" :class="{ 
      'part-mode': paintMode === 'part',
      'brush-mode': paintMode === 'brush'
    }"></div>
    
    <!-- 控制面板 -->
    <div class="control-panel">
      <!-- 工具栏 -->
      <div class="toolbar">
        <button @click="undo" :disabled="!canUndo" title="撤销">↶</button>
        <button @click="redo" :disabled="!canRedo" title="重做">↷</button>
        <button @click="resetAll" title="重置全部">⟲</button>
        <button @click="exportModel" title="导出模型">💾</button>
      </div>

      <!-- 上色工具 -->
      <div class="panel-section" :class="{ collapsed: !sections.paint }">
        <h3 @click="toggleSection('paint')">
          <span class="collapse-icon">{{ sections.paint ? '▼' : '▶' }}</span>
          🎨 上色工具
        </h3>
        <div v-show="sections.paint" class="section-content">
        <div class="color-picker-group">
          <label>选择颜色：</label>
          <input type="color" v-model="selectedColor" @input="onColorChange">
          <span class="color-hex">{{ selectedColor }}</span>
        </div>
        
        <div class="paint-mode">
          <label>
            <input type="radio" v-model="paintMode" value="whole">
            整体上色
          </label>
          <label>
            <input type="radio" v-model="paintMode" value="part">
            部位上色（{{ meshCount }}个部位）
          </label>
          <label>
            <input type="radio" v-model="paintMode" value="brush">
            画笔上色（局部涂色）
          </label>
        </div>
        
        <!-- 模型模式选择 -->
        <div class="model-mode-selector" style="margin-top: 15px; padding: 12px; background: #f0f7ff; border: 1px solid #d0e4ff; border-radius: 6px;">
          <div style="font-weight: bold; margin-bottom: 10px; color: #1976D2; font-size: 13px;">
            📐 模型底色模式
          </div>
          <label style="display: block; margin-bottom: 8px; cursor: pointer; padding: 4px;">
            <input type="radio" name="modelMode" v-model="useWhiteModel" :value="false" @change="onModelModeChange" style="margin-right: 6px;" />
            <span style="color: #333;">🎨 保持原色</span>
            <div style="font-size: 11px; color: #666; margin-left: 22px; margin-top: 2px;">
              使用模型原始颜色作为底色
            </div>
          </label>
          <label style="display: block; cursor: pointer; padding: 4px;">
            <input type="radio" name="modelMode" v-model="useWhiteModel" :value="true" @change="onModelModeChange" style="margin-right: 6px;" />
            <span style="color: #333;">⚪ 白模模式</span>
            <div style="font-size: 11px; color: #666; margin-left: 22px; margin-top: 2px;">
              纯白底色，更方便上色和配色
            </div>
          </label>
          <div v-if="!model" style="font-size: 11px; color: #ff9800; margin-top: 8px; padding: 4px; background: #fff3e0; border-radius: 4px;">
            ⚠️ 请先上传模型，或上传后会自动应用选择的模式
          </div>
        </div>

        <div v-if="paintMode === 'brush'" class="brush-settings">
          <div class="slider-group">
            <label>画笔大小: {{ parseFloat(brushSize).toFixed(1) }}</label>
            <input type="range" v-model.number="brushSize" min="0.05" max="1.0" step="0.05">
            <div style="font-size: 10px; color: #999; margin-top: 2px;">
              画笔越小，性能越好
            </div>
          </div>
          <div class="slider-group">
            <label>画笔强度: {{ parseFloat(brushStrength).toFixed(2) }}</label>
            <input type="range" v-model.number="brushStrength" min="0.1" max="1.0" step="0.05">
          </div>
          
          <div class="slider-group" style="margin-top: 15px;">
            <label style="display: flex; align-items: center; cursor: pointer; font-weight: normal;">
              <input type="checkbox" v-model="performanceMode" @change="togglePerformanceMode" style="margin-right: 8px; cursor: pointer;">
              <span>🚀 性能模式</span>
            </label>
            <div v-if="performanceMode" style="font-size: 11px; color: #4CAF50; margin-top: 4px;">
              ✓ 已优化：降低更新频率，减少卡顿
            </div>
            <div v-else style="font-size: 11px; color: #666; margin-top: 4px;">
              高面数模型建议开启
            </div>
          </div>
        </div>

        <button @click="applyColorToAll" class="apply-btn">应用到整个模型</button>
        <button @click="resetColors" class="reset-btn">重置颜色</button>
        </div>
      </div>

      <!-- 材质设置 -->
      <div class="panel-section" :class="{ collapsed: !sections.material }">
        <h3 @click="toggleSection('material')">
          <span class="collapse-icon">{{ sections.material ? '▼' : '▶' }}</span>
          ✨ 材质设置
        </h3>
        <div v-show="sections.material" class="section-content">
          <div class="slider-group">
            <label>粗糙度: {{ parseFloat(roughness).toFixed(2) }}</label>
            <input type="range" v-model.number="roughness" min="0" max="1" step="0.01" @input="updateMaterial">
          </div>
          <div class="slider-group">
            <label>金属度: {{ parseFloat(metalness).toFixed(2) }}</label>
            <input type="range" v-model.number="metalness" min="0" max="1" step="0.01" @input="updateMaterial">
          </div>
          <div class="slider-group">
            <label>透明度: {{ parseFloat(opacity).toFixed(2) }}</label>
            <input type="range" v-model.number="opacity" min="0" max="1" step="0.01" @input="updateMaterial">
          </div>
        </div>
      </div>

      <!-- 变换控制 -->
      <div class="panel-section" :class="{ collapsed: !sections.transform }">
        <h3 @click="toggleSection('transform')">
          <span class="collapse-icon">{{ sections.transform ? '▼' : '▶' }}</span>
          🔄 变换控制
        </h3>
        <div v-show="sections.transform" class="section-content">
          <div class="transform-group">
            <label>位置 X: {{ modelPosition.x.toFixed(2) }}</label>
            <input type="range" v-model.number="modelPosition.x" min="-5" max="5" step="0.1" @input="updateTransform">
          </div>
          <div class="transform-group">
            <label>位置 Y: {{ modelPosition.y.toFixed(2) }}</label>
            <input type="range" v-model.number="modelPosition.y" min="-5" max="5" step="0.1" @input="updateTransform">
          </div>
          <div class="transform-group">
            <label>位置 Z: {{ modelPosition.z.toFixed(2) }}</label>
            <input type="range" v-model.number="modelPosition.z" min="-5" max="5" step="0.1" @input="updateTransform">
          </div>
          <div class="transform-group">
            <label>旋转 Y: {{ modelRotation.y.toFixed(0) }}°</label>
            <input type="range" v-model.number="modelRotation.y" min="0" max="360" step="1" @input="updateTransform">
          </div>
          <div class="transform-group">
            <label>缩放: {{ modelScale.toFixed(2) }}</label>
            <input type="range" v-model.number="modelScale" min="0.1" max="3" step="0.1" @input="updateTransform">
          </div>
          <button @click="resetTransform">重置变换</button>
        </div>
      </div>

      <!-- 光照控制 -->
      <div class="panel-section" :class="{ collapsed: !sections.lighting }">
        <h3 @click="toggleSection('lighting')">
          <span class="collapse-icon">{{ sections.lighting ? '▼' : '▶' }}</span>
          💡 光照控制
        </h3>
        <div v-show="sections.lighting" class="section-content">
          <div class="slider-group">
            <label>环境光: {{ parseFloat(lightIntensity.ambient).toFixed(1) }}</label>
            <input type="range" v-model.number="lightIntensity.ambient" min="0" max="3" step="0.1" @input="updateLighting">
          </div>
          <div class="slider-group">
            <label>主光源: {{ parseFloat(lightIntensity.key).toFixed(1) }}</label>
            <input type="range" v-model.number="lightIntensity.key" min="0" max="3" step="0.1" @input="updateLighting">
          </div>
          <div class="slider-group">
            <label>补光: {{ parseFloat(lightIntensity.fill).toFixed(1) }}</label>
            <input type="range" v-model.number="lightIntensity.fill" min="0" max="3" step="0.1" @input="updateLighting">
          </div>
          <button @click="resetLighting">重置光照</button>
        </div>
      </div>

      <!-- 视角控制 -->
      <div class="panel-section" :class="{ collapsed: !sections.view }">
        <h3 @click="toggleSection('view')">
          <span class="collapse-icon">{{ sections.view ? '▼' : '▶' }}</span>
          👁️ 视角控制
        </h3>
        <div v-show="sections.view" class="section-content">
          <button @click="resetCamera">重置视角</button>
          <button @click="setViewAngle('front')">前视图</button>
          <button @click="setViewAngle('side')">侧视图</button>
          <button @click="setViewAngle('top')">顶视图</button>
          <button @click="toggleWireframe">{{ wireframe ? '实体模式' : '线框模式' }}</button>
          <button @click="toggleAutoRotate">{{ autoRotate ? '停止旋转' : '自动旋转' }}</button>
          <div class="slider-group">
            <label>旋转速度: {{ parseFloat(rotationSpeed).toFixed(1) }}</label>
            <input type="range" v-model.number="rotationSpeed" min="0.5" max="5" step="0.5" @input="updateRotationSpeed">
          </div>
        </div>
      </div>

      <!-- 环境设置 -->
      <div class="panel-section" :class="{ collapsed: !sections.environment }">
        <h3 @click="toggleSection('environment')">
          <span class="collapse-icon">{{ sections.environment ? '▼' : '▶' }}</span>
          🌍 环境设置
        </h3>
        <div v-show="sections.environment" class="section-content">
          <div class="color-picker-group">
            <label>背景颜色：</label>
            <input type="color" v-model="backgroundColor" @input="updateBackground">
          </div>
          <div class="checkbox-group">
            <label>
              <input type="checkbox" v-model="showGrid" @change="toggleGrid">
              显示网格
            </label>
          </div>
          <div class="checkbox-group">
            <label>
              <input type="checkbox" v-model="showShadows" @change="toggleShadows">
              显示阴影
            </label>
          </div>
        </div>
      </div>

      <!-- 快速配色 -->
      <div class="panel-section" :class="{ collapsed: !sections.presets }">
        <h3 @click="toggleSection('presets')">
          <span class="collapse-icon">{{ sections.presets ? '▼' : '▶' }}</span>
          🎨 快速配色
        </h3>
        <div v-show="sections.presets" class="section-content">
        <div class="color-presets">
          <div 
            v-for="preset in colorPresets" 
            :key="preset.color"
            class="preset-color"
            :style="{ backgroundColor: preset.color }"
            :title="preset.name"
            @click.stop="selectedColor = preset.color; onColorChange()"
          ></div>
        </div>
        </div>
      </div>

      <!-- 信息面板 -->
      <div class="info-panel">
        <div class="info-item">
          <span>顶点数:</span>
          <span>{{ modelInfo.vertices }}</span>
        </div>
        <div class="info-item">
          <span>面数:</span>
          <span>{{ modelInfo.faces }}</span>
        </div>
        <div class="info-item">
          <span>部位数:</span>
          <span>{{ meshCount }}</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">加载中...</div>
    <div v-if="paintMode === 'part'" class="hint">
      点击模型部位进行上色（共{{ meshCount }}个部位）
    </div>
    <div v-if="paintMode === 'brush'" class="hint brush-hint">
      按住鼠标左键拖动涂色 | 画笔大小: {{ parseFloat(brushSize).toFixed(1) }}
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { markRaw } from 'vue'

export default {
  name: 'Model3DPainter',
  props: {
    modelUrl: {
      type: String,
      required: true
    },
    modelType: {
      type: String,
      default: 'glb',
      validator: (value) => ['glb', 'gltf', 'obj'].includes(value)
    }
  },
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      model: null,
      raycaster: null,
      mouse: null,
      wireframe: false,
      autoRotate: true,
      loading: false,
      selectedColor: '#ffffff',
      paintMode: 'whole',
      roughness: 0.5,
      metalness: 0.5,
      originalMaterials: new Map(),
      isDragging: false,
      mouseDownPosition: { x: 0, y: 0 },
      meshCount: 0,
      brushSize: 0.3,  // 默认较小的画笔，性能更好
      brushStrength: 0.8,
      isPainting: false,
      lastPaintTime: 0, // 用于节流
      paintThrottle: 50, // 毫秒，画笔更新间隔
      vertexColors: new Map(),
      opacity: 1.0,
      // 面板折叠状态
      sections: {
        paint: true,
        material: false,
        transform: false,
        lighting: false,
        view: false,
        environment: false,
        presets: false
      },
      // 变换控制
      modelPosition: { x: 0, y: 0, z: 0 },
      modelRotation: { x: 0, y: 0, z: 0 },
      modelScale: 1.0,
      // 光照控制
      lightIntensity: {
        ambient: 1.2,
        key: 1.8,
        fill: 1.5
      },
      lights: {},
      rotationSpeed: 2.0,
      // 环境设置
      backgroundColor: '#f8f8f8',
      showGrid: true,
      showShadows: true,
      performanceMode: false, // 性能模式
      useWhiteModel: false, // 是否使用白模模式
      // 模型信息
      modelInfo: {
        vertices: 0,
        faces: 0
      },
      // 历史记录
      history: [],
      historyIndex: -1,
      maxHistory: 20,
      colorPresets: [
        { name: '白色', color: '#ffffff' },
        { name: '红色', color: '#ff0000' },
        { name: '橙色', color: '#ff8800' },
        { name: '黄色', color: '#ffff00' },
        { name: '绿色', color: '#00ff00' },
        { name: '青色', color: '#00ffff' },
        { name: '蓝色', color: '#0000ff' },
        { name: '紫色', color: '#ff00ff' },
        { name: '粉色', color: '#ff88cc' },
        { name: '棕色', color: '#8b4513' },
        { name: '灰色', color: '#888888' },
        { name: '黑色', color: '#000000' }
      ]
    }
  },
  computed: {
    canUndo() {
      return this.historyIndex > 0
    },
    canRedo() {
      return this.historyIndex < this.history.length - 1
    }
  },
  mounted() {
    this.initScene()
    this.loadModel()
    this.animate()
    window.addEventListener('resize', this.onWindowResize)
    
    // 添加鼠标事件监听
    const container = this.$refs.viewerContainer
    container.addEventListener('mousedown', this.onMouseDown)
    container.addEventListener('mousemove', this.onMouseMove)
    container.addEventListener('mouseup', this.onMouseUp)
    container.addEventListener('mouseleave', this.onMouseLeave)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onWindowResize)
    
    const container = this.$refs.viewerContainer
    container.removeEventListener('mousedown', this.onMouseDown)
    container.removeEventListener('mousemove', this.onMouseMove)
    container.removeEventListener('mouseup', this.onMouseUp)
    container.removeEventListener('mouseleave', this.onMouseLeave)
    
    this.dispose()
  },
  methods: {
    initScene() {
      // 创建场景（明亮背景）
      this.scene = markRaw(new THREE.Scene())
      this.scene.background = new THREE.Color(0xf8f8f8)
      // 移除雾效，保持清晰
      
      // 设置环境光照
      this.scene.environment = null

      // 创建相机
      const container = this.$refs.viewerContainer
      this.camera = markRaw(new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      ))
      this.camera.position.set(0, 2, 5)

      // 创建渲染器（类似Blender的渲染设置）
      this.renderer = markRaw(new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      }))
      this.renderer.setSize(container.clientWidth, container.clientHeight)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      this.renderer.shadowMap.enabled = true
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
      
      // 使用更明亮的色调映射
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping
      this.renderer.toneMappingExposure = 1.5 // 适中曝光，避免过曝导致颜色失真
      this.renderer.outputEncoding = THREE.sRGBEncoding
      this.renderer.physicallyCorrectLights = false // 禁用物理光照
      this.renderer.gammaFactor = 2.2
      
      console.log('🎨 渲染器设置:')
      console.log(`  色调映射: ACESFilmic`)
      console.log(`  曝光度: ${this.renderer.toneMappingExposure}（降低曝光以显示真实颜色）`)
      console.log(`  输出编码: sRGB`)
      console.log(`  物理光照: 禁用`)
      
      container.appendChild(this.renderer.domElement)

      // 光照系统（保存引用以便后续控制）
      if (!this.lights) this.lights = {}
      
      // 🔆 超强环境光 - 确保模型完全可见
      this.lights.ambient = new THREE.AmbientLight(0xffffff, 3.0)
      this.scene.add(this.lights.ambient)

      // 主光源 - 从前上方照射（对准相机方向）
      this.lights.key = new THREE.DirectionalLight(0xffffff, 3.5)
      this.lights.key.position.set(0, 10, 10) // 正前方
      this.lights.key.target.position.set(0, 0, 0)
      this.lights.key.castShadow = true
      this.lights.key.shadow.mapSize.width = 2048
      this.lights.key.shadow.mapSize.height = 2048
      this.scene.add(this.lights.key)
      this.scene.add(this.lights.key.target)

      // 补光 - 从相机位置照射
      this.lights.fill = new THREE.DirectionalLight(0xffffff, 3.0)
      this.lights.fill.position.set(5, 5, 10)
      this.scene.add(this.lights.fill)

      // 后方补光 - 防止背面全黑
      this.lights.rim = new THREE.DirectionalLight(0xffffff, 2.5)
      this.lights.rim.position.set(0, 5, -10)
      this.scene.add(this.lights.rim)

      // 半球光 - 提供整体照明
      this.lights.hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, 2.5)
      this.scene.add(this.lights.hemi)
      
      // 点光源 - 在相机附近
      this.lights.front = new THREE.PointLight(0xffffff, 3.5, 100)
      this.lights.front.position.set(0, 0, 8) // 靠近相机
      this.scene.add(this.lights.front)
      
      // 🔆 额外添加6个方向的点光源（360度照明）
      const pointLightPositions = [
        [10, 0, 0],   // 右
        [-10, 0, 0],  // 左
        [0, 10, 0],   // 上
        [0, -10, 0],  // 下
        [0, 0, 10],   // 前
        [0, 0, -10]   // 后
      ]
      
      pointLightPositions.forEach((pos, index) => {
        const light = new THREE.PointLight(0xffffff, 2.0, 50)
        light.position.set(pos[0], pos[1], pos[2])
        this.scene.add(light)
      })
      
      console.log('💡 光照系统初始化完成:')
      console.log(`  环境光强度: 3.0`)
      console.log(`  主光源强度: 3.5`)
      console.log(`  补光强度: 3.0`)
      console.log(`  后方补光: 2.5`)
      console.log(`  半球光: 2.5`)
      console.log(`  前方点光源: 3.5`)
      console.log(`  额外点光源: 6个 × 2.0强度`)
      console.log(`  总光照强度: 极强（360度全方位照明）`)

      // 网格地面（保存引用）
      this.gridHelper = new THREE.GridHelper(10, 20, 0x888888, 0xcccccc)
      this.gridHelper.position.y = -0.5
      this.scene.add(this.gridHelper)
      
      // 添加地面平面（接收阴影）
      const planeGeometry = new THREE.PlaneGeometry(20, 20)
      const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 })
      const plane = new THREE.Mesh(planeGeometry, planeMaterial)
      plane.rotation.x = -Math.PI / 2
      plane.position.y = -0.5
      plane.receiveShadow = true
      this.scene.add(plane)

      // 控制器
      this.controls = markRaw(new OrbitControls(this.camera, this.renderer.domElement))
      this.controls.enableDamping = true
      this.controls.dampingFactor = 0.05
      this.controls.autoRotate = this.autoRotate
      this.controls.autoRotateSpeed = this.rotationSpeed

      // 射线检测
      this.raycaster = markRaw(new THREE.Raycaster())
      this.mouse = new THREE.Vector2()
    },

    async loadModel() {
      this.loading = true
      
      try {
        if (this.modelType === 'glb' || this.modelType === 'gltf') {
          await this.loadGLTF()
        } else if (this.modelType === 'obj') {
          await this.loadOBJ()
        }
      } catch (error) {
        console.error('模型加载失败:', error)
        this.$emit('error', error)
      } finally {
        this.loading = false
      }
    },

    loadGLTF() {
      return new Promise((resolve, reject) => {
        const loader = new GLTFLoader()
        loader.load(
          this.modelUrl,
          (gltf) => {
            this.model = markRaw(gltf.scene)
            this.prepareModel()
            this.addModelToScene()
            this.$emit('loaded', gltf)
            resolve(gltf)
          },
          (progress) => {
            const percent = (progress.loaded / progress.total) * 100
            this.$emit('progress', percent)
          },
          reject
        )
      })
    },

    loadOBJ() {
      return new Promise((resolve, reject) => {
        const loader = new OBJLoader()
        loader.load(
          this.modelUrl,
          (obj) => {
            this.model = markRaw(obj)
            this.prepareModel()
            this.addModelToScene()
            this.$emit('loaded', obj)
            resolve(obj)
          },
          (progress) => {
            const percent = (progress.loaded / progress.total) * 100
            this.$emit('progress', percent)
          },
          reject
        )
      })
    },

    prepareModel() {
      // 准备模型，保存原始材质，设置可编辑材质
      this.meshCount = 0
      this.model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          this.meshCount++
          
          // 处理材质（可能是数组或单个材质）
          const materials = Array.isArray(child.material) ? child.material : [child.material]
          
          materials.forEach((mat, index) => {
            if (mat) {
              // 保存原始材质
              this.originalMaterials.set(`${child.uuid}_${index}`, mat.clone())
            }
          })
          
          // 读取原始颜色，如果是黑色或太暗，使用浅灰色
          let originalColor = 0xcccccc // 默认浅灰色
          
          if (materials[0]) {
            if (materials[0].color) {
              const hex = materials[0].color.getHex()
              // 检查是否太暗（黑色或接近黑色）
              const brightness = (
                materials[0].color.r + 
                materials[0].color.g + 
                materials[0].color.b
              ) / 3
              
              // 如果太暗（小于0.1），使用浅灰色；否则使用原色
              if (brightness > 0.1) {
                originalColor = hex
              } else {
                console.log('⚠️ 检测到过暗颜色，使用默认浅灰色')
              }
            }
            
            // 如果有纹理贴图，即使颜色暗也要保留
            if (materials[0].map) {
              originalColor = materials[0].color ? materials[0].color.getHex() : 0xffffff
            }
          }
          
          // 根据用户选择决定使用原色还是白模
          if (this.useWhiteModel) {
            originalColor = 0xffffff // 纯白色
            console.log(`部位 ${this.meshCount}: ${child.name} [白模模式]`)
          } else {
            // 保持原色模式：检查原色是否太暗
            if (originalColor === 0xcccccc) {
              // 如果检测到的是默认浅灰色（说明原色可能太暗），使用稍亮的灰色
              originalColor = 0xdddddd
              console.log(`部位 ${this.meshCount}: ${child.name} [原色太暗，使用浅灰]`)
            } else {
              console.log(`部位 ${this.meshCount}: ${child.name} [保持原色]`)
            }
          }
          
          console.log(`  原始材质颜色: ${materials[0] && materials[0].color ? '#' + materials[0].color.getHexString() : '无'}`)
          console.log(`  使用颜色: 0x${originalColor.toString(16)}`)
          
          // 为每个mesh创建全新的独立材质（先不启用顶点颜色）
          const newMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(originalColor), // 强制创建新的Color对象
            roughness: 0.3,
            metalness: 0.0,
            map: materials[0] ? materials[0].map : null,
            side: THREE.DoubleSide,
            flatShading: false,
            transparent: false,
            opacity: 1.0,
            vertexColors: false, // 先禁用顶点颜色，确保基础颜色正常
            emissive: 0x000000, // 不使用自发光，避免颜色失真
            emissiveIntensity: 0.0
          })
          
          console.log(`  新材质颜色: #${newMaterial.color.getHexString()}`)
          
          // 🔧 检查并修复法线
          if (child.geometry) {
            if (!child.geometry.attributes.normal) {
              console.log('  ⚠️ 缺少法线数据，正在计算...')
              child.geometry.computeVertexNormals()
            }
            
            // 检查法线方向
            const normals = child.geometry.attributes.normal
            if (normals) {
              let normalSum = 0
              for (let i = 0; i < normals.count; i++) {
                normalSum += normals.getZ(i)
              }
              const avgNormalZ = normalSum / normals.count
              console.log(`  法线平均Z值: ${avgNormalZ.toFixed(3)} ${avgNormalZ < 0 ? '⚠️ (可能朝内)' : '✅'}`)
              
              // 如果法线朝内且模型使用双面渲染，尝试翻转法线
              if (Math.abs(avgNormalZ) < 0.1) {
                console.log('  🔧 法线方向不明确，但使用双面渲染应该没问题')
              }
            }
          }
          
          // 准备顶点颜色数据（但暂不启用）
          if (child.geometry && !child.geometry.attributes.color) {
            const colors = []
            const positions = child.geometry.attributes.position
            if (positions) {
              const color = new THREE.Color(originalColor)
              
              for (let i = 0; i < positions.count; i++) {
                colors.push(color.r, color.g, color.b)
              }
              child.geometry.setAttribute('color', 
                new THREE.Float32BufferAttribute(colors, 3))
            }
          }
          
          child.material = newMaterial
          
          // 强制材质更新
          child.material.needsUpdate = true
          
          if (!child.name) {
            child.name = `mesh_${this.meshCount}`
          }
          
          console.log(`部位 ${this.meshCount}: ${child.name}, 材质UUID: ${child.material.uuid}`)
        }
      })
      console.log('✅ 模型准备完成，共有', this.meshCount, '个可独立上色的部位')
      console.log('='  .repeat(60))
      
      if (this.meshCount === 1) {
        console.log('💡 提示：模型只有1个部位，建议使用"画笔上色"模式进行局部涂色')
      }
      
      // 统计模型信息
      this.calculateModelInfo()
      
      // 🔧 应用用户选择的模型模式（白模或原色）
      if (this.useWhiteModel) {
        console.log('🎨 检测到用户已选择白模模式，正在应用...')
        this.applyModelMode()
      }
      
      // 最终检查：遍历模型确认材质设置
      console.log('🔍 最终材质检查:')
      this.model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          console.log(`  ${child.name}:`)
          console.log(`    材质颜色: #${child.material.color.getHexString()}`)
          console.log(`    材质类型: ${child.material.type}`)
          console.log(`    粗糙度: ${child.material.roughness}`)
          console.log(`    金属度: ${child.material.metalness}`)
          console.log(`    顶点颜色: ${child.material.vertexColors ? '启用' : '禁用'}`)
          console.log(`    双面渲染: ${child.material.side === THREE.DoubleSide ? '是' : '否'}`)
          console.log(`    透明: ${child.material.transparent ? '是' : '否'}`)
          console.log(`    自发光: ${child.material.emissive ? '#' + child.material.emissive.getHexString() : '无'}`)
          console.log(`    可见性: ${child.visible ? '是' : '否'}`)
          
          // 检查几何体
          if (child.geometry) {
            const hasPosition = !!child.geometry.attributes.position
            const hasNormal = !!child.geometry.attributes.normal
            const hasUV = !!child.geometry.attributes.uv
            console.log(`    几何体: 顶点=${hasPosition ? '✅' : '❌'}, 法线=${hasNormal ? '✅' : '❌'}, UV=${hasUV ? '✅' : '❌'}`)
          }
        }
      })
      
      console.log(`\n🎯 当前模式: ${this.useWhiteModel ? '⚪ 白模模式' : '🎨 保持原色'}`)
    },

    calculateModelInfo() {
      let vertices = 0
      let faces = 0
      
      this.model.traverse((child) => {
        if (child instanceof THREE.Mesh && child.geometry) {
          if (child.geometry.attributes.position) {
            vertices += child.geometry.attributes.position.count
          }
          if (child.geometry.index) {
            faces += child.geometry.index.count / 3
          } else if (child.geometry.attributes.position) {
            faces += child.geometry.attributes.position.count / 3
          }
        }
      })
      
      this.modelInfo.vertices = vertices
      this.modelInfo.faces = Math.floor(faces)
    },

    addModelToScene() {
      const box = new THREE.Box3().setFromObject(this.model)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())

      // 居中并稍微抬高模型
      this.model.position.sub(center)
      this.model.position.y += 0.2 // 稍微抬高，避免与地面重叠
      
      // 为模型添加阴影
      this.model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
      
      const maxDim = Math.max(size.x, size.y, size.z)
      const fov = this.camera.fov * (Math.PI / 180)
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2))
      cameraZ *= 2.5
      
      // 设置相机位置（更好的观察角度）
      this.camera.position.set(cameraZ * 0.8, cameraZ * 0.5, cameraZ)
      this.camera.lookAt(0, 0, 0)

      this.scene.add(this.model)
    },

    onMouseDown(event) {
      this.isDragging = false
      this.isPainting = false
      this.mouseDownPosition.x = event.clientX
      this.mouseDownPosition.y = event.clientY
      
      // 画笔模式：按下鼠标开始绘画
      if (this.paintMode === 'brush' && event.button === 0) {
        this.isPainting = true
        this.paintWithBrush(event)
      }
    },

    onMouseMove(event) {
      const deltaX = Math.abs(event.clientX - this.mouseDownPosition.x)
      const deltaY = Math.abs(event.clientY - this.mouseDownPosition.y)
      
      // 如果移动超过5像素，认为是拖动
      if (deltaX > 5 || deltaY > 5) {
        this.isDragging = true
      }
      
      // 画笔模式：拖动时连续绘画
      if (this.isPainting && this.paintMode === 'brush') {
        this.paintWithBrush(event)
      }
    },

    onMouseUp(event) {
      // 部位上色模式：只有点击（非拖动）时上色
      if (!this.isDragging && this.paintMode === 'part' && this.model) {
        this.paintAtPosition(event)
      }
      
      this.isDragging = false
      this.isPainting = false
    },

    onMouseLeave() {
      this.isPainting = false
    },

    paintAtPosition(event) {
      const rect = this.$refs.viewerContainer.getBoundingClientRect()
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      this.raycaster.setFromCamera(this.mouse, this.camera)
      const intersects = this.raycaster.intersectObject(this.model, true)

      console.log('📍 点击检测:', intersects.length, '个交点')

      if (intersects.length > 0) {
        const mesh = intersects[0].object
        console.log('🎯 点击目标:', mesh.name, '类型:', mesh.type)
        
        if (mesh instanceof THREE.Mesh) {
          // 先闪烁高亮
          const originalColor = mesh.material.color.getHex()
          const originalEmissive = mesh.material.emissive.getHex()
          
          mesh.material.emissive = new THREE.Color(0x4488ff)
          mesh.material.emissiveIntensity = 0.5
          
          // 200ms后上色
          setTimeout(() => {
            this.applyColorToMesh(mesh)
          }, 200)
        }
      } else {
        console.log('⚠️ 未点击到任何部位')
      }
    },

    paintWithBrush(event) {
      // 🚀 性能优化：节流处理，避免过于频繁的更新
      const now = Date.now()
      if (now - this.lastPaintTime < this.paintThrottle) {
        return // 跳过本次更新
      }
      this.lastPaintTime = now
      
      const rect = this.$refs.viewerContainer.getBoundingClientRect()
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      this.raycaster.setFromCamera(this.mouse, this.camera)
      const intersects = this.raycaster.intersectObject(this.model, true)

      if (intersects.length > 0) {
        const intersection = intersects[0]
        const mesh = intersection.object
        
        if (mesh instanceof THREE.Mesh && mesh.geometry.attributes.color) {
          // 首次画笔使用时，启用顶点颜色
          if (!mesh.material.vertexColors) {
            console.log('🖌️ 首次使用画笔，启用顶点颜色')
            mesh.material.vertexColors = true
            mesh.material.needsUpdate = true
          }
          this.paintVertices(mesh, intersection)
        }
      }
    },

    paintVertices(mesh, intersection) {
      const geometry = mesh.geometry
      const position = geometry.attributes.position
      const color = geometry.attributes.color
      
      if (!position || !color) return
      
      // 获取交点位置（世界坐标）
      const point = intersection.point.clone()
      mesh.worldToLocal(point) // 转换到本地坐标
      
      const brushColor = new THREE.Color(this.selectedColor)
      const brushRadius = parseFloat(this.brushSize)
      const strength = parseFloat(this.brushStrength)
      
      // 🚀 性能优化：预计算常量
      const brushRadiusSquared = brushRadius * brushRadius // 避免重复计算平方
      const px = point.x
      const py = point.y
      const pz = point.z
      const brushR = brushColor.r
      const brushG = brushColor.g
      const brushB = brushColor.b
      
      let paintedCount = 0
      
      // 遍历所有顶点，对范围内的顶点进行着色
      for (let i = 0; i < position.count; i++) {
        const vx = position.getX(i)
        const vy = position.getY(i)
        const vz = position.getZ(i)
        
        // 🚀 性能优化：先用平方距离判断，避免开平方
        const dx = vx - px
        const dy = vy - py
        const dz = vz - pz
        const distanceSquared = dx * dx + dy * dy + dz * dz
        
        // 如果在画笔范围内
        if (distanceSquared < brushRadiusSquared) {
          // 只有在需要时才计算真实距离
          const distance = Math.sqrt(distanceSquared)
          
          // 计算衰减（中心强，边缘弱）
          const falloff = 1 - (distance / brushRadius)
          const finalStrength = strength * falloff
          const invStrength = 1 - finalStrength
          
          // 获取当前顶点颜色
          const currentR = color.getX(i)
          const currentG = color.getY(i)
          const currentB = color.getZ(i)
          
          // 🚀 性能优化：内联计算，避免创建临时变量
          color.setXYZ(
            i,
            currentR * invStrength + brushR * finalStrength,
            currentG * invStrength + brushG * finalStrength,
            currentB * invStrength + brushB * finalStrength
          )
          paintedCount++
        }
      }
      
      // 标记颜色属性需要更新
      if (paintedCount > 0) {
        color.needsUpdate = true
      }
    },

    onColorChange() {
      if (this.paintMode === 'whole') {
        this.applyColorToAll()
      }
    },

    applyColorToAll() {
      if (!this.model) return

      this.model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          this.applyColorToMesh(child)
        }
      })
    },

    applyColorToMesh(mesh) {
      if (!mesh.material) {
        console.error('❌ 该部位没有材质')
        return
      }
      
      console.log('🎨 正在为部位上色:', mesh.name, '当前材质UUID:', mesh.material.uuid)
      
      // 保存当前纹理
      const currentMap = mesh.material.map
      
      // 完全废弃旧材质，创建全新的材质实例
      // 这样可以确保100%独立，不会互相影响
      const oldMaterial = mesh.material
      oldMaterial.dispose() // 释放旧材质
      
      mesh.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(this.selectedColor),
        roughness: parseFloat(this.roughness),
        metalness: parseFloat(this.metalness),
        map: currentMap,
        side: THREE.DoubleSide,
        flatShading: false,
        transparent: false,
        opacity: 1.0
      })
      
      // 确保材质已更新
      mesh.material.needsUpdate = true
      
      console.log('✅ 上色完成:', mesh.name, '新颜色:', this.selectedColor, '新材质UUID:', mesh.material.uuid)
    },

    updateMaterial() {
      console.log('✨ 更新材质:', { roughness: this.roughness, metalness: this.metalness, opacity: this.opacity })
      if (!this.model) {
        console.log('⚠️ 模型未加载')
        return
      }

      let count = 0
      this.model.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          child.material.roughness = parseFloat(this.roughness)
          child.material.metalness = parseFloat(this.metalness)
          child.material.opacity = parseFloat(this.opacity)
          child.material.transparent = this.opacity < 1.0
          child.material.needsUpdate = true
          count++
        }
      })
      console.log(`✅ 已更新 ${count} 个材质`)
    },

    resetColors() {
      if (!this.model) return

      console.log(`🔄 重置颜色 [${this.useWhiteModel ? '白模模式' : '保持原色模式'}]`)
      
      let resetCount = 0
      this.model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const original = this.originalMaterials.get(`${child.uuid}_0`)
          if (original) {
            // 根据当前模式决定重置的颜色
            let resetColor
            
            if (this.useWhiteModel) {
              // 白模模式：重置为纯白色
              resetColor = 0xffffff
            } else {
              // 保持原色模式：恢复原始颜色
              if (original.color) {
                const brightness = (original.color.r + original.color.g + original.color.b) / 3
                resetColor = brightness > 0.1 ? original.color.getHex() : 0xdddddd
              } else {
                resetColor = 0xdddddd
              }
            }
            
            // 更新材质颜色
            child.material.color.setHex(resetColor)
            child.material.needsUpdate = true
            
            // 同时重置顶点颜色（用于画笔模式）
            if (child.geometry && child.geometry.attributes.color) {
              const colors = child.geometry.attributes.color
              const positions = child.geometry.attributes.position
              const color = new THREE.Color(resetColor)
              
              for (let i = 0; i < positions.count; i++) {
                colors.setXYZ(i, color.r, color.g, color.b)
              }
              colors.needsUpdate = true
            }
            
            resetCount++
          }
        }
      })
      console.log('✅ 已重置', resetCount, '个部位的颜色')
    },

    animate() {
      requestAnimationFrame(this.animate)
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
    },

    onWindowResize() {
      const container = this.$refs.viewerContainer
      this.camera.aspect = container.clientWidth / container.clientHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(container.clientWidth, container.clientHeight)
    },

    resetCamera() {
      this.camera.position.set(0, 2, 5)
      this.controls.reset()
    },

    toggleWireframe() {
      this.wireframe = !this.wireframe
      if (this.model) {
        this.model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material.wireframe = this.wireframe
          }
        })
      }
    },

    toggleAutoRotate() {
      this.autoRotate = !this.autoRotate
      this.controls.autoRotate = this.autoRotate
    },

    // 面板折叠控制
    toggleSection(section) {
      this.sections[section] = !this.sections[section]
      console.log(`📂 ${section} 面板:`, this.sections[section] ? '展开' : '折叠')
    },

    // 变换控制
    updateTransform() {
      if (!this.model) return
      
      this.model.position.set(
        this.modelPosition.x,
        this.modelPosition.y,
        this.modelPosition.z
      )
      
      this.model.rotation.y = this.modelRotation.y * Math.PI / 180
      
      this.model.scale.set(this.modelScale, this.modelScale, this.modelScale)
    },

    resetTransform() {
      this.modelPosition = { x: 0, y: 0, z: 0 }
      this.modelRotation = { x: 0, y: 0, z: 0 }
      this.modelScale = 1.0
      this.updateTransform()
    },

    // 光照控制
    updateLighting() {
      console.log('💡 更新光照:', this.lightIntensity)
      if (this.lights && this.lights.ambient) {
        this.lights.ambient.intensity = parseFloat(this.lightIntensity.ambient)
      }
      if (this.lights && this.lights.key) {
        this.lights.key.intensity = parseFloat(this.lightIntensity.key)
      }
      if (this.lights && this.lights.fill) {
        this.lights.fill.intensity = parseFloat(this.lightIntensity.fill)
      }
      console.log('✅ 光照已更新')
    },

    resetLighting() {
      this.lightIntensity = {
        ambient: 1.2,
        key: 1.8,
        fill: 1.5
      }
      this.updateLighting()
    },

    // 视角控制
    setViewAngle(angle) {
      if (!this.model) return
      
      const distance = 5
      
      switch(angle) {
        case 'front':
          this.camera.position.set(0, 1, distance)
          break
        case 'side':
          this.camera.position.set(distance, 1, 0)
          break
        case 'top':
          this.camera.position.set(0, distance, 0.1)
          break
      }
      
      this.camera.lookAt(0, 0, 0)
      this.controls.update()
    },

    updateRotationSpeed() {
      this.controls.autoRotateSpeed = this.rotationSpeed
    },

    // 环境控制
    updateBackground() {
      this.scene.background = new THREE.Color(this.backgroundColor)
    },

    toggleGrid() {
      if (this.gridHelper) {
        this.gridHelper.visible = this.showGrid
      }
    },

    toggleShadows() {
      this.renderer.shadowMap.enabled = this.showShadows
      if (this.model) {
        this.model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = this.showShadows
            child.receiveShadow = this.showShadows
          }
        })
      }
    },
    
    togglePerformanceMode() {
      if (this.performanceMode) {
        // 性能模式：增加节流时间，减少画笔更新频率
        this.paintThrottle = 100 // 100ms
        console.log('🚀 性能模式已启用: 画笔更新间隔 100ms')
      } else {
        // 正常模式
        this.paintThrottle = 50 // 50ms
        console.log('✏️ 正常模式: 画笔更新间隔 50ms')
      }
    },
    
    onModelModeChange() {
      console.log(`🔘 用户切换模式: useWhiteModel = ${this.useWhiteModel}`)
      
      // 使用 $nextTick 确保 v-model 已更新
      this.$nextTick(() => {
        console.log(`📋 确认状态: useWhiteModel = ${this.useWhiteModel}`)
        this.applyModelMode()
      })
    },
    
    applyModelMode() {
      if (!this.model) {
        console.log('⚠️ 模型尚未加载，模式将在加载后自动应用')
        return
      }
      
      console.log(`🎨 应用模型模式: ${this.useWhiteModel ? '⚪ 白模模式' : '🎨 保持原色'}`)
      console.log(`📊 当前状态详情:`)
      console.log(`   - useWhiteModel: ${this.useWhiteModel}`)
      console.log(`   - useWhiteModel类型: ${typeof this.useWhiteModel}`)
      
      let updateCount = 0
      
      // 遍历模型，重新设置颜色
      this.model.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const originalMaterialKey = Array.from(this.originalMaterials.keys()).find(key => 
            key.startsWith(child.uuid)
          )
          
          let targetColor
          
          if (this.useWhiteModel === true) {
            // 白模模式：使用纯白色
            targetColor = 0xffffff
            console.log(`  ⚪ ${child.name}: 设置为纯白 #ffffff`)
          } else {
            // 保持原色模式：从保存的原始材质中恢复颜色
            if (originalMaterialKey) {
              const originalMaterial = this.originalMaterials.get(originalMaterialKey)
              if (originalMaterial && originalMaterial.color) {
                const brightness = (originalMaterial.color.r + originalMaterial.color.g + originalMaterial.color.b) / 3
                if (brightness > 0.1) {
                  targetColor = originalMaterial.color.getHex()
                } else {
                  targetColor = 0xdddddd // 原色太暗，使用浅灰
                }
                console.log(`  🎨 ${child.name}: 恢复原色 #${new THREE.Color(targetColor).getHexString()}`)
              } else {
                targetColor = 0xdddddd
                console.log(`  ⚪ ${child.name}: 使用默认浅灰 #dddddd`)
              }
            } else {
              targetColor = 0xdddddd
              console.log(`  ⚠️ ${child.name}: 无原始材质，使用浅灰 #dddddd`)
            }
          }
          
          console.log(`     更新前颜色: #${child.material.color.getHexString()}`)
          console.log(`     更新前自发光: #${child.material.emissive.getHexString()}`)
          console.log(`     是否有纹理贴图: ${child.material.map ? '是' : '否'}`)
          console.log(`     顶点颜色状态: ${child.material.vertexColors ? '启用' : '禁用'}`)
          
          // 更新材质颜色
          child.material.color.setHex(targetColor)
          
          // 🔧 移除自发光，确保颜色纯净
          child.material.emissive.setHex(0x000000)
          child.material.emissiveIntensity = 0
          
          // 🔧 白模模式：移除纹理贴图，只显示纯色
          if (this.useWhiteModel === true) {
            if (child.material.map) {
              console.log(`     🗑️ 移除纹理贴图（白模模式）`)
              child.material.map = null
            }
            // 禁用顶点颜色，使用材质颜色
            if (child.material.vertexColors) {
              console.log(`     🗑️ 禁用顶点颜色（白模模式）`)
              child.material.vertexColors = false
            }
          } else {
            // 保持原色模式：恢复纹理贴图
            if (originalMaterialKey) {
              const originalMaterial = this.originalMaterials.get(originalMaterialKey)
              if (originalMaterial && originalMaterial.map && !child.material.map) {
                console.log(`     ✅ 恢复纹理贴图（保持原色模式）`)
                child.material.map = originalMaterial.map
              }
            }
          }
          
          child.material.needsUpdate = true
          
          console.log(`     更新后颜色: #${child.material.color.getHexString()}`)
          console.log(`     更新后自发光: #${child.material.emissive.getHexString()}`)
          console.log(`     更新后纹理: ${child.material.map ? '有' : '无'}`)
          console.log(`     更新后顶点颜色: ${child.material.vertexColors ? '启用' : '禁用'}`)
          
          // 同时更新顶点颜色（用于画笔模式）
          if (child.geometry && child.geometry.attributes.color) {
            const colors = child.geometry.attributes.color
            const positions = child.geometry.attributes.position
            const color = new THREE.Color(targetColor)
            
            for (let i = 0; i < positions.count; i++) {
              colors.setXYZ(i, color.r, color.g, color.b)
            }
            colors.needsUpdate = true
            console.log(`     ✓ 已同步更新顶点颜色为 #${color.getHexString()}`)
          } else if (this.useWhiteModel === true && child.geometry && !child.geometry.attributes.color) {
            // 白模模式且没有顶点颜色：创建纯白顶点颜色
            console.log(`     ⚠️ 创建白色顶点颜色数据`)
            const colors = []
            const positions = child.geometry.attributes.position
            if (positions) {
              for (let i = 0; i < positions.count; i++) {
                colors.push(1.0, 1.0, 1.0) // 纯白
              }
              child.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
            }
          }
          
          updateCount++
        }
      })
      
      console.log(`✅ 模型模式应用完成，更新了 ${updateCount} 个部位`)
      console.log(`🔍 请检查模型颜色是否为: ${this.useWhiteModel ? '纯白色 #ffffff' : '原色/浅灰色'}`)
    },

    // 历史记录
    saveState() {
      // 保存当前状态
      const state = {
        // 这里可以保存需要撤销/重做的状态
        timestamp: Date.now()
      }
      
      this.history = this.history.slice(0, this.historyIndex + 1)
      this.history.push(state)
      
      if (this.history.length > this.maxHistory) {
        this.history.shift()
      } else {
        this.historyIndex++
      }
    },

    undo() {
      if (this.canUndo) {
        this.historyIndex--
        // 恢复状态
        console.log('撤销操作')
      }
    },

    redo() {
      if (this.canRedo) {
        this.historyIndex++
        // 恢复状态
        console.log('重做操作')
      }
    },

    resetAll() {
      if (confirm('确定要重置所有设置吗？')) {
        this.resetColors()
        this.resetTransform()
        this.resetLighting()
        this.resetCamera()
        console.log('🔄 已重置所有设置')
      }
    },

    exportModel() {
      if (!this.model) return
      
      // 导出为GLB
      alert('导出功能开发中...')
      console.log('💾 准备导出模型')
    },

    dispose() {
      if (this.renderer) {
        this.renderer.dispose()
      }
      if (this.controls) {
        this.controls.dispose()
      }
    }
  }
}
</script>

<style scoped>
.model-painter-container {
  position: relative;
  width: 100%;
  height: 600px;
  display: flex;
  gap: 10px;
}

.viewer {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.viewer.part-mode {
  cursor: crosshair;
}

.viewer.brush-mode {
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="black" stroke-width="2"/><circle cx="12" cy="12" r="2" fill="black"/></svg>') 12 12, auto;
}

.brush-settings {
  margin: 10px 0;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 4px;
}

.toolbar {
  display: flex;
  gap: 5px;
  padding: 10px;
  background: #f0f0f0;
  border-bottom: 1px solid #ddd;
}

.toolbar button {
  flex: 1;
  padding: 8px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.toolbar button:hover:not(:disabled) {
  background: #409eff;
  color: white;
  transform: translateY(-2px);
}

.toolbar button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.panel-section {
  border-bottom: 1px solid #eee;
  transition: all 0.3s;
}

.panel-section h3 {
  margin: 0;
  padding: 12px 15px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fafafa;
  transition: all 0.2s;
}

.panel-section h3:hover {
  background: #f0f0f0;
}

.panel-section.collapsed h3 {
  background: #f5f5f5;
}

.collapse-icon {
  font-size: 12px;
  transition: transform 0.3s;
}

.panel-section.collapsed .collapse-icon {
  transform: rotate(-90deg);
}

.section-content {
  padding: 15px;
  background: white;
}

.panel-section > div:not(.slider-group):not(.transform-group):not(.color-picker-group):not(.checkbox-group):not(.color-presets):not(.brush-settings):not(.section-content) {
  padding: 10px 15px;
}

.transform-group {
  margin-bottom: 10px;
}

.checkbox-group {
  margin: 8px 0;
  padding: 5px 0;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
}

.checkbox-group input[type="checkbox"] {
  cursor: pointer;
}

.info-panel {
  position: sticky;
  bottom: 0;
  padding: 12px 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 12px;
  border-top: 1px solid #ddd;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
}

.info-item span:first-child {
  opacity: 0.9;
}

.info-item span:last-child {
  font-weight: bold;
}

.control-panel {
  width: 280px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  overflow-y: auto;
  max-height: 600px;
}

.panel-section {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.panel-section:last-child {
  border-bottom: none;
}

.panel-section h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.panel-section button {
  width: 100%;
  margin-bottom: 5px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
}

.panel-section button:hover {
  background: #f0f0f0;
}

.color-picker-group {
  margin-bottom: 10px;
}

.color-picker-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 13px;
  color: #666;
}

.color-picker-group input[type="color"] {
  width: 60px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.color-hex {
  margin-left: 10px;
  font-family: monospace;
  font-size: 12px;
  color: #666;
}

.paint-mode {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 10px 0;
}

.paint-mode label {
  display: flex;
  align-items: center;
  font-size: 13px;
  cursor: pointer;
}

.paint-mode input[type="radio"] {
  margin-right: 5px;
}

.apply-btn {
  background: #409eff !important;
  color: white !important;
  border: none !important;
}

.apply-btn:hover {
  background: #66b1ff !important;
}

.reset-btn {
  background: #f56c6c !important;
  color: white !important;
  border: none !important;
}

.reset-btn:hover {
  background: #f78989 !important;
}

.slider-group {
  margin-bottom: 10px;
}

.slider-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 13px;
  color: #666;
}

.slider-group input[type="range"] {
  width: 100%;
}

.color-presets {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.preset-color {
  width: 100%;
  height: 40px;
  border: 2px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.preset-color:hover {
  transform: scale(1.1);
  border-color: #409eff;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 20px 40px;
  border-radius: 8px;
  font-size: 18px;
  z-index: 10;
}

.hint {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(64, 158, 255, 0.9);
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  pointer-events: none;
}

.brush-hint {
  background: rgba(103, 194, 58, 0.9);
}
</style>

