<template>
  <div class="painter-page">
    <h1>3D模型上色工具</h1>
    
    <div class="upload-section">
      <input 
        type="file" 
        @change="handleFileUpload" 
        accept=".glb,.gltf,.obj"
        ref="fileInput"
      >
      <span>或者</span>
      <input 
        v-model="modelUrlInput" 
        placeholder="输入模型URL"
        @keyup.enter="loadFromUrl"
      >
      <button @click="loadFromUrl">加载</button>
    </div>

    <Model3DPainter 
      v-if="currentModelUrl"
      :modelUrl="currentModelUrl"
      :modelType="currentModelType"
      @loaded="onModelLoaded"
      @error="onModelError"
      @progress="onProgress"
    />

    <div v-else class="placeholder">
      <div class="placeholder-content">
        <h3>上传白模文件进行上色</h3>
        <p>支持 GLB、GLTF、OBJ 格式</p>
        <ul>
          <li>整体上色：选择颜色后自动应用到整个模型</li>
          <li>部位上色：点击模型的不同部位单独上色</li>
          <li>材质调整：调节粗糙度和金属度</li>
          <li>快速配色：使用预设颜色快速上色</li>
        </ul>
      </div>
    </div>

    <div v-if="loadingProgress > 0 && loadingProgress < 100" class="progress-bar">
      <div class="progress-fill" :style="{ width: loadingProgress + '%' }"></div>
      <span>{{ loadingProgress.toFixed(0) }}%</span>
    </div>
  </div>
</template>

<script>
import Model3DPainter from '@/components/3d/Model3DPainter.vue'

export default {
  name: 'Model3DPainterPage',
  components: {
    Model3DPainter
  },
  data() {
    return {
      currentModelUrl: '',
      currentModelType: 'glb',
      modelUrlInput: '',
      loadingProgress: 0
    }
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      const ext = file.name.split('.').pop().toLowerCase()
      this.currentModelType = ext
      this.currentModelUrl = URL.createObjectURL(file)
    },

    loadFromUrl() {
      if (!this.modelUrlInput) return
      
      const ext = this.modelUrlInput.split('.').pop().toLowerCase()
      this.currentModelType = ext
      this.currentModelUrl = this.modelUrlInput
    },

    onModelLoaded(model) {
      console.log('模型加载成功:', model)
      this.loadingProgress = 100
    },

    onModelError(error) {
      console.error('模型加载失败:', error)
      alert('模型加载失败，请检查文件格式或URL')
    },

    onProgress(percent) {
      this.loadingProgress = percent
    }
  }
}
</script>

<style scoped>
.painter-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.upload-section {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.upload-section input[type="file"] {
  flex: 0 0 auto;
}

.upload-section input[type="text"] {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.upload-section button {
  padding: 8px 20px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.upload-section button:hover {
  background: #66b1ff;
}

.placeholder {
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
}

.placeholder-content {
  text-align: center;
  padding: 40px;
}

.placeholder-content h3 {
  font-size: 24px;
  margin-bottom: 10px;
}

.placeholder-content p {
  font-size: 16px;
  margin-bottom: 20px;
  opacity: 0.9;
}

.placeholder-content ul {
  text-align: left;
  display: inline-block;
  font-size: 14px;
  opacity: 0.9;
}

.placeholder-content li {
  margin-bottom: 8px;
}

.progress-bar {
  position: relative;
  margin-top: 20px;
  height: 30px;
  background: #f0f0f0;
  border-radius: 15px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #409eff, #66b1ff);
  transition: width 0.3s;
}

.progress-bar span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  color: #333;
}
</style>

