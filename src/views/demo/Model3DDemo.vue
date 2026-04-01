<template>
  <div class="demo-page">
    <h1>3D模型展示</h1>
    
    <!-- 上传模型 -->
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

    <!-- 3D查看器 -->
    <Model3DViewer 
      v-if="currentModelUrl"
      :modelUrl="currentModelUrl"
      :modelType="currentModelType"
      @loaded="onModelLoaded"
      @error="onModelError"
      @progress="onProgress"
    />

    <div v-else class="placeholder">
      请上传模型文件或输入模型URL
    </div>

    <!-- 加载进度 -->
    <div v-if="loadingProgress > 0 && loadingProgress < 100" class="progress-bar">
      <div class="progress-fill" :style="{ width: loadingProgress + '%' }"></div>
      <span>{{ loadingProgress.toFixed(0) }}%</span>
    </div>
  </div>
</template>

<script>
import Model3DViewer from '@/components/3d/Model3DViewer.vue'

export default {
  name: 'Model3DDemo',
  components: {
    Model3DViewer
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

      // 获取文件扩展名
      const ext = file.name.split('.').pop().toLowerCase()
      this.currentModelType = ext

      // 创建临时URL
      this.currentModelUrl = URL.createObjectURL(file)
    },

    loadFromUrl() {
      if (!this.modelUrlInput) return
      
      // 从URL获取文件类型
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
.demo-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
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
  background: #f0f0f0;
  border: 2px dashed #ddd;
  border-radius: 8px;
  color: #999;
  font-size: 18px;
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

