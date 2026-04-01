<template>
  <div class="model-viewer-container">
    <div ref="viewerContainer" class="viewer"></div>
    <div class="controls">
      <button @click="resetCamera">重置视角</button>
      <button @click="toggleWireframe">{{ wireframe ? '实体' : '线框' }}</button>
      <button @click="toggleAutoRotate">{{ autoRotate ? '停止旋转' : '自动旋转' }}</button>
    </div>
    <div v-if="loading" class="loading">加载中...</div>
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { markRaw } from 'vue'

export default {
  name: 'Model3DViewer',
  props: {
    modelUrl: {
      type: String,
      required: true
    },
    modelType: {
      type: String,
      default: 'glb', // 'glb', 'gltf', 'obj'
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
      wireframe: false,
      autoRotate: true,
      loading: false
    }
  },
  mounted() {
    this.initScene()
    this.loadModel()
    this.animate()
    window.addEventListener('resize', this.onWindowResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onWindowResize)
    this.dispose()
  },
  methods: {
    initScene() {
      // 创建场景（使用 markRaw 防止 Vue 响应式处理）
      this.scene = markRaw(new THREE.Scene())
      this.scene.background = new THREE.Color(0xf0f0f0)

      // 创建相机
      const container = this.$refs.viewerContainer
      this.camera = markRaw(new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      ))
      this.camera.position.set(0, 2, 5)

      // 创建渲染器
      this.renderer = markRaw(new THREE.WebGLRenderer({ antialias: true }))
      this.renderer.setSize(container.clientWidth, container.clientHeight)
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.shadowMap.enabled = true
      container.appendChild(this.renderer.domElement)

      // 添加光源
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
      this.scene.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(5, 10, 7.5)
      directionalLight.castShadow = true
      this.scene.add(directionalLight)

      const pointLight = new THREE.PointLight(0xffffff, 0.4)
      pointLight.position.set(-5, 5, -5)
      this.scene.add(pointLight)

      // 添加网格地面
      const gridHelper = new THREE.GridHelper(10, 10)
      this.scene.add(gridHelper)

      // 添加控制器
      this.controls = markRaw(new OrbitControls(this.camera, this.renderer.domElement))
      this.controls.enableDamping = true
      this.controls.dampingFactor = 0.05
      this.controls.autoRotate = this.autoRotate
      this.controls.autoRotateSpeed = 2.0
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
            // 为OBJ添加材质
            this.model.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshStandardMaterial({
                  color: 0x888888,
                  roughness: 0.5,
                  metalness: 0.5
                })
              }
            })
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

    addModelToScene() {
      // 计算模型边界并居中
      const box = new THREE.Box3().setFromObject(this.model)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())

      // 居中模型
      this.model.position.sub(center)
      
      // 调整相机位置以适应模型大小
      const maxDim = Math.max(size.x, size.y, size.z)
      const fov = this.camera.fov * (Math.PI / 180)
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2))
      cameraZ *= 2.5
      this.camera.position.z = cameraZ

      this.scene.add(this.model)
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
.model-viewer-container {
  position: relative;
  width: 100%;
  height: 600px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.viewer {
  width: 100%;
  height: 100%;
}

.controls {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 10px;
}

.controls button {
  padding: 8px 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.controls button:hover {
  background: #f0f0f0;
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
}
</style>

