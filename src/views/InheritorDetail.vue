<template>
	<div class="inheritor-detail">
		<!-- 页面头部 - 水墨风格 -->
		<div class="page-header">
			<div class="header-decoration">
				<div class="cloud cloud-left"></div>
				<div class="cloud cloud-right"></div>
			</div>
			<div class="container">
				<button @click="goBack" class="back-button">
					<span class="back-arrow">←</span>
					<span class="back-text">返回列表</span>
				</button>
			</div>
		</div>

		<!-- 加载状态 -->
		<div v-if="loading" class="loading-container">
			<div class="ink-loading">
				<div class="ink-drop ink-drop-1"></div>
				<div class="ink-drop ink-drop-2"></div>
				<div class="ink-drop ink-drop-3"></div>
			</div>
			<p class="loading-text">
				<span class="loading-char">加</span>
				<span class="loading-char">载</span>
				<span class="loading-char">中</span>
				<span class="loading-char">...</span>
			</p>
		</div>

		<!-- 错误提示 -->
		<div v-else-if="error" class="error-container">
			<div class="error-icon">⚠️</div>
			<h2 class="error-title">加载失败</h2>
			<p class="error-message">{{ error }}</p>
			<button @click="loadInheritorDetail" class="retry-button">重试</button>
		</div>

		<!-- 传承人详情内容 -->
		<div v-else-if="detail && detail.basicInfo" class="detail-content">
			<div class="container">
				<!-- 传承人基本信息卡片 -->
				<section class="hero-section">
					<div class="hero-card">
						<div class="card-decoration-top"></div>
						<div class="hero-content">
							<!-- 左侧：传承人照片 -->
							<div class="hero-left">
								<div class="image-container">
									<div class="image-frame">
										<img :src="detail.basicInfo.imageUrl || '/assets/images/image.png'"
											:alt="detail.basicInfo.name" class="inheritor-image" loading="lazy"
											decoding="async">
										<div class="image-overlay"></div>
									</div>
									<div class="seal-stamp"></div>
								</div>
								<div class="level-badge" :class="detail.basicInfo.level">
									<img :src="badgeIcon" alt="徽章" class="badge-icon" loading="lazy" decoding="async">
									{{ detail.basicInfo.levelDisplayName }}
								</div>
							</div>

							<!-- 右侧：基本信息 -->
							<div class="hero-right">
								<div class="name-section">
									<h1 class="inheritor-name">
										<span class="name-decoration">「</span>
										{{ detail.basicInfo.name }}
										<span class="name-decoration">」</span>
									</h1>
									<p class="inheritor-title">{{ detail.basicInfo.title }}</p>
								</div>

								<div class="info-grid">
									<div class="info-item">
										<img :src="regionIcon" alt="地区" class="info-icon" loading="lazy"
											decoding="async">
										<div class="info-content">
											<span class="info-label">所属地区</span>
											<span class="info-value">{{ detail.basicInfo.regionDisplayName }}</span>
										</div>
									</div>
									<div class="info-item">
										<img :src="dateIcon" alt="年份" class="info-icon" loading="lazy" decoding="async">
										<div class="info-content">
											<span class="info-label">入选年份</span>
											<span class="info-value">{{ detail.basicInfo.year }}年</span>
										</div>
									</div>
									<div class="info-item" v-if="detail.basicInfo.craftType">
										<span class="info-icon-text">🎨</span>
										<div class="info-content">
											<span class="info-label">技艺类型</span>
											<span class="info-value">{{ detail.basicInfo.craftType }}</span>
										</div>
									</div>
								</div>

								<!-- 统计信息 -->
								<div class="stats-grid" v-if="hasStats">
									<div class="stat-item">
										<div class="stat-number">{{ detail.worksCount || 0 }}</div>
										<div class="stat-label">作品总数</div>
									</div>
									<div class="stat-item">
										<div class="stat-number">{{ detail.exhibitionsCount || 0 }}</div>
										<div class="stat-label">参展次数</div>
									</div>
									<div class="stat-item">
										<div class="stat-number">{{ detail.awardsCount || 0 }}</div>
										<div class="stat-label">获奖次数</div>
									</div>
									<div class="stat-item">
										<div class="stat-number">{{ detail.apprenticesCount || 0 }}</div>
										<div class="stat-label">培养学生</div>
									</div>
								</div>
							</div>
						</div>
						<div class="card-decoration-bottom"></div>
					</div>
				</section>

				<!-- 完整传记 -->
				<section class="section-card" v-if="detail.fullBiography">
					<div class="section-header">
						<div class="section-title-wrapper">
							<div class="title-decoration"></div>
							<h2 class="section-title">
								<span class="title-char">人</span>
								<span class="title-char">物</span>
								<span class="title-char">传</span>
								<span class="title-char">记</span>
							</h2>
							<div class="title-decoration"></div>
						</div>
					</div>
					<div class="section-content">
						<div class="biography-text">
							{{ detail.fullBiography }}
						</div>
					</div>
				</section>

				<!-- 个人故事 -->
				<section class="section-card" v-if="detail.personalStory">
					<div class="section-header">
						<div class="section-title-wrapper">
							<div class="title-decoration"></div>
							<h2 class="section-title">
								<span class="title-char">个</span>
								<span class="title-char">人</span>
								<span class="title-char">故</span>
								<span class="title-char">事</span>
							</h2>
							<div class="title-decoration"></div>
						</div>
					</div>
					<div class="section-content">
						<div class="story-content">
							<div class="story-icon">📖</div>
							<div class="story-text">
								{{ detail.personalStory }}
							</div>
						</div>
					</div>
				</section>

				<!-- 艺术理念 -->
				<section class="section-card philosophy-section" v-if="detail.philosophy">
					<div class="section-header">
						<div class="section-title-wrapper">
							<div class="title-decoration"></div>
							<h2 class="section-title">
								<span class="title-char">艺</span>
								<span class="title-char">术</span>
								<span class="title-char">理</span>
								<span class="title-char">念</span>
							</h2>
							<div class="title-decoration"></div>
						</div>
					</div>
					<div class="section-content">
						<div class="philosophy-quote">
							<div class="quote-mark quote-left">❝</div>
							<p class="philosophy-text">{{ detail.philosophy }}</p>
							<div class="quote-mark quote-right">❞</div>
						</div>
					</div>
				</section>

				<!-- 教育背景和师承 -->
				<section class="section-card" v-if="detail.educationBackground || detail.masterInfo">
					<div class="section-header">
						<div class="section-title-wrapper">
							<div class="title-decoration"></div>
							<h2 class="section-title">
								<span class="title-char">教</span>
								<span class="title-char">育</span>
								<span class="title-char">背</span>
								<span class="title-char">景</span>
							</h2>
							<div class="title-decoration"></div>
						</div>
					</div>
					<div class="section-content">
						<div class="education-content">
							<div class="education-item" v-if="detail.educationBackground">
								<h3 class="education-subtitle">🎓 教育经历</h3>
								<p class="education-text">{{ detail.educationBackground }}</p>
							</div>
							<div class="education-item" v-if="detail.masterInfo">
								<h3 class="education-subtitle">👨‍🏫 师承信息</h3>
								<p class="education-text">{{ detail.masterInfo }}</p>
							</div>
							<div class="education-item" v-if="detail.inheritanceLineage">
								<h3 class="education-subtitle">📜 传承谱系</h3>
								<p class="education-text">{{ detail.inheritanceLineage }}</p>
							</div>
						</div>
					</div>
				</section>

				<!-- 职业生涯 -->
				<section class="section-card" v-if="detail.careerHistory">
					<div class="section-header">
						<div class="section-title-wrapper">
							<div class="title-decoration"></div>
							<h2 class="section-title">
								<span class="title-char">职</span>
								<span class="title-char">业</span>
								<span class="title-char">生</span>
								<span class="title-char">涯</span>
							</h2>
							<div class="title-decoration"></div>
						</div>
					</div>
					<div class="section-content">
						<div class="career-text">
							{{ detail.careerHistory }}
						</div>
					</div>
				</section>

				<!-- 代表作品 -->
				<section class="section-card" v-if="detail.majorWorks">
					<div class="section-header">
						<div class="section-title-wrapper">
							<div class="title-decoration"></div>
							<h2 class="section-title">
								<span class="title-char">代</span>
								<span class="title-char">表</span>
								<span class="title-char">作</span>
								<span class="title-char">品</span>
							</h2>
							<div class="title-decoration"></div>
						</div>
					</div>
					<div class="section-content">
						<div class="works-content">
							<div class="works-icon">🎨</div>
							<div class="works-text">
								{{ detail.majorWorks }}
							</div>
						</div>
					</div>
				</section>

				<!-- 荣誉成就 -->
				<section class="section-card" v-if="detail.honors || detail.awards">
					<div class="section-header">
						<div class="section-title-wrapper">
							<div class="title-decoration"></div>
							<h2 class="section-title">
								<span class="title-char">荣</span>
								<span class="title-char">誉</span>
								<span class="title-char">成</span>
								<span class="title-char">就</span>
							</h2>
							<div class="title-decoration"></div>
						</div>
					</div>
					<div class="section-content">
						<div class="honors-content">
							<div class="achievement-icon">🏆</div>
							<div class="honors-text">
								<div v-if="detail.honors" class="honor-item">
									<h4>荣誉称号</h4>
									<p>{{ detail.honors }}</p>
								</div>
								<div v-if="detail.awards" class="honor-item">
									<h4>主要奖项</h4>
									<p>{{ detail.awards }}</p>
								</div>
								<div v-if="detail.publications" class="honor-item">
									<h4>出版著作</h4>
									<p>{{ detail.publications }}</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				<!-- 代表作品展示 -->
				<section class="section-card works-section" v-if="detail?.works?.length > 0">
					<div class="section-header">
						<div class="section-title-wrapper">
							<div class="title-decoration"></div>
							<h2 class="section-title">
								<span class="title-char">代</span>
								<span class="title-char">表</span>
								<span class="title-char">作</span>
								<span class="title-char">品</span>
							</h2>
							<div class="title-decoration"></div>
						</div>
					</div>
					<div class="section-content">
						<div class="works-gallery">
							<div class="work-item" v-for="work in detail.works" :key="work.id">
								<div class="work-image-wrapper">
									<img :src="work.imageUrl" :alt="work.name" class="work-image" loading="lazy">
									<div class="work-overlay">
										<div class="work-info">
											<h4 class="work-name">{{ work.name }}</h4>
											<p class="work-desc">{{ work.description }}</p>
											<span class="work-year">{{ work.year }}年</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<!-- 视频展示 -->
				<section class="section-card videos-section" v-if="detail?.videos?.length > 0">
					<div class="section-header">
						<div class="section-title-wrapper">
							<div class="title-decoration"></div>
							<h2 class="section-title">
								<span class="title-char">技</span>
								<span class="title-char">艺</span>
								<span class="title-char">视</span>
								<span class="title-char">频</span>
							</h2>
							<div class="title-decoration"></div>
						</div>
					</div>
					<div class="section-content">
						<div class="videos-grid">
							<div class="video-item" v-for="video in detail.videos" :key="video.id">
								<div class="video-thumbnail">
									<img :src="video.cover" :alt="video.title" class="video-cover" loading="lazy">
									<div class="play-button">▶</div>
									<div class="video-duration">{{ video.duration }}</div>
								</div>
								<div class="video-info">
									<h4 class="video-title">{{ video.title }}</h4>
									<p class="video-desc">{{ video.description }}</p>
									<div class="video-meta">
										<span class="video-views">👁 {{ video.views.toLocaleString() }}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<!-- 技艺流程 -->
				<section class="section-card process-section" v-if="craftProcess && craftProcess.length > 0">
					<div class="section-header">
						<div class="section-title-wrapper">
							<div class="title-decoration"></div>
							<h2 class="section-title">
								<span class="title-char">技</span>
								<span class="title-char">艺</span>
								<span class="title-char">流</span>
								<span class="title-char">程</span>
							</h2>
							<div class="title-decoration"></div>
						</div>
					</div>
					<div class="section-content">
						<div class="process-timeline">
							<div class="process-step" v-for="(step, index) in craftProcess" :key="step.step || index">
								<div class="step-number">{{ step.step || index + 1 }}</div>
								<div class="step-content">
									<h3 class="step-title">{{ step.title }}</h3>
									<p class="step-description">{{ step.description }}</p>
									<span class="step-duration" v-if="step.duration">⏱ 预计耗时: {{ step.duration }}</span>
								</div>
							</div>
						</div>
					</div>
				</section>

				<!-- 创新贡献 -->
				<section class="section-card" v-if="detail.innovationContributions">
					<div class="section-header">
						<div class="section-title-wrapper">
							<div class="title-decoration"></div>
							<h2 class="section-title">
								<span class="title-char">创</span>
								<span class="title-char">新</span>
								<span class="title-char">贡</span>
								<span class="title-char">献</span>
							</h2>
							<div class="title-decoration"></div>
						</div>
					</div>
					<div class="section-content">
						<div class="innovation-content">
							<div class="innovation-icon">💡</div>
							<div class="innovation-text">
								{{ detail.innovationContributions }}
							</div>
						</div>
					</div>
				</section>

				<!-- 传承教学 -->
				<section class="section-card" v-if="detail.teachingExperience || detail.apprenticesInfo">
					<div class="section-header">
						<div class="section-title-wrapper">
							<div class="title-decoration"></div>
							<h2 class="section-title">
								<span class="title-char">传</span>
								<span class="title-char">承</span>
								<span class="title-char">教</span>
								<span class="title-char">学</span>
							</h2>
							<div class="title-decoration"></div>
						</div>
					</div>
					<div class="section-content">
						<div class="teaching-content">
							<div class="teaching-item" v-if="detail.teachingExperience">
								<h4>教学经历</h4>
								<p>{{ detail.teachingExperience }}</p>
							</div>
							<div class="teaching-item" v-if="detail.apprenticesInfo">
								<h4>学生情况</h4>
								<p>{{ detail.apprenticesInfo }}</p>
							</div>
						</div>
					</div>
				</section>

				<!-- 文化影响 -->
				<section class="section-card" v-if="detail.culturalImpact">
					<div class="section-header">
						<div class="section-title-wrapper">
							<div class="title-decoration"></div>
							<h2 class="section-title">
								<span class="title-char">文</span>
								<span class="title-char">化</span>
								<span class="title-char">影</span>
								<span class="title-char">响</span>
							</h2>
							<div class="title-decoration"></div>
						</div>
					</div>
					<div class="section-content">
						<div class="impact-text">
							{{ detail.culturalImpact }}
						</div>
					</div>
				</section>

				<!-- 工作室信息 -->
				<section class="section-card" v-if="detail.workshopAddress">
					<div class="section-header">
						<div class="section-title-wrapper">
							<div class="title-decoration"></div>
							<h2 class="section-title">
								<span class="title-char">工</span>
								<span class="title-char">作</span>
								<span class="title-char">室</span>
							</h2>
							<div class="title-decoration"></div>
						</div>
					</div>
					<div class="section-content">
						<div class="workshop-content">
							<div class="workshop-icon">📍</div>
							<div class="workshop-info">
								<p class="workshop-address">{{ detail.workshopAddress }}</p>
								<p class="workshop-hint" v-if="detail.officialWebsite">
									官方网站：<a :href="detail.officialWebsite" target="_blank">{{ detail.officialWebsite
										}}</a>
								</p>
							</div>
						</div>
					</div>
				</section>

				<!-- 联系咨询 -->
				<section class="section-card contact-section">
					<div class="section-header">
						<div class="section-title-wrapper">
							<div class="title-decoration"></div>
							<h2 class="section-title">
								<span class="title-char">联</span>
								<span class="title-char">系</span>
								<span class="title-char">咨</span>
								<span class="title-char">询</span>
							</h2>
							<div class="title-decoration"></div>
						</div>
					</div>
					<div class="section-content">
						<div class="contact-content">
							<p class="contact-text">
								如果您对{{ detail.basicInfo.name }}传承人的技艺感兴趣，
								或想预约参观学习，欢迎通过我们的预约系统联系。
							</p>
							<router-link to="/reserve" class="contact-button">
								<span class="btn-icon">📅</span>
								<span class="btn-text">立即预约</span>
								<span class="btn-arrow">→</span>
							</router-link>
						</div>
					</div>
				</section>
			</div>
			<button v-show="showBackToTop" class="back-to-top" @click="scrollToTop">↑</button>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getInheritorDetailById } from '../api/inheritor'

// 导入本地图片资源
import badgeIcon from '@/image/徽章.png'
import regionIcon from '@/image/我的页_地区.png'
import dateIcon from '@/image/日期.png'

const route = useRoute()
const router = useRouter()

const detail = ref(null)
const loading = ref(false)
const error = ref(null)
const showBackToTop = ref(false)

// 技艺流程数据 - 从详情数据中获取，如果没有则使用默认演示数据
const craftProcess = computed(() => {
  if (detail.value?.craftProcess && detail.value.craftProcess.length > 0) {
    return detail.value.craftProcess
  }
  // 如果 API 未返回数据，返回空数组（不显示）
  return []
})

// 是否有统计信息
const hasStats = computed(() => {
	return detail.value && (
		detail.value.worksCount > 0 ||
		detail.value.exhibitionsCount > 0 ||
		detail.value.awardsCount > 0 ||
		detail.value.apprenticesCount > 0
	)
})

// 加载传承人详情
const loadInheritorDetail = async () => {
	try {
		loading.value = true
		error.value = null

		const id = route.params.id
		console.log('正在加载传承人详细信息，ID:', id)

		const response = await getInheritorDetailById(id)
		console.log('传承人详细信息响应:', response)

		if (response) {
			detail.value = response
		} else {
			error.value = '未找到该传承人信息'
		}
	} catch (err) {
		console.error('加载传承人详细信息失败:', err)
		error.value = err.message || '加载失败，请稍后重试'
	} finally {
		loading.value = false
	}
}

// 返回列表
const goBack = () => {
	router.push('/inheritors')
}

// 组件挂载时加载数据
onMounted(() => {
	loadInheritorDetail()
	const onScroll = () => {
		showBackToTop.value = window.scrollY > 400
	}
	window.addEventListener('scroll', onScroll, { passive: true })
})

const scrollToTop = () => {
	window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
/* 全局变量 */
/* 全局变量 - 修正为局部作用域 */
.inheritor-detail {
	--primary-red: #c8102e;
	--gold: #d4af37;
	--ink-black: #1a1a1a;
	--paper-white: #faf9f6;
	--shadow-ink: rgba(0, 0, 0, 0.1);
}

.inheritor-detail {
	min-height: 100vh;
	background: linear-gradient(180deg, #faf9f6 0%, #f5f3ed 50%, #faf9f6 100%);
}

/* 页面头部 */
.page-header {
	position: relative;
	background: linear-gradient(180deg, #faf9f6 0%, #f5f3ed 100%);
	padding: 30px 0 20px;
	overflow: hidden;
	border-bottom: 1px solid rgba(200, 16, 46, 0.1);
}

.header-decoration {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	pointer-events: none;
}

.cloud {
	position: absolute;
	width: 150px;
	height: 75px;
	opacity: 0.15;
	animation: float 20s ease-in-out infinite;
}

.cloud-left {
	top: 10px;
	left: 5%;
	animation-delay: 0s;
}

.cloud-right {
	top: 15px;
	right: 5%;
	animation-delay: -10s;
}

@keyframes float {

	0%,
	100% {
		transform: translateY(0) translateX(0);
	}

	50% {
		transform: translateY(-10px) translateX(5px);
	}
}

/* 返回按钮 */
.back-button {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 12px 24px;
	background: white;
	border: 2px solid var(--primary-red);
	border-radius: 50px;
	color: var(--primary-red);
	font-size: 15px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	box-shadow: 0 2px 8px rgba(200, 16, 46, 0.1);
}

.back-button:hover {
	background: var(--primary-red);
	color: white;
	transform: translateX(-5px);
	box-shadow: 0 4px 15px rgba(200, 16, 46, 0.3);
}

.back-arrow {
	font-size: 18px;
	transition: transform 0.3s ease;
}

.back-button:hover .back-arrow {
	transform: translateX(-3px);
}

/* 加载状态 */
.loading-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 100px 20px;
	min-height: 500px;
}

.ink-loading {
	position: relative;
	width: 100px;
	height: 100px;
	margin-bottom: 30px;
}

.ink-drop {
	position: absolute;
	width: 24px;
	height: 24px;
	border-radius: 50%;
	background: var(--ink-black);
	animation: inkDrop 1.5s ease-in-out infinite;
}

.ink-drop-1 {
	top: 0;
	left: 50%;
	transform: translateX(-50%);
	animation-delay: 0s;
}

.ink-drop-2 {
	top: 50%;
	left: 0;
	transform: translateY(-50%);
	animation-delay: 0.3s;
}

.ink-drop-3 {
	top: 50%;
	right: 0;
	transform: translateY(-50%);
	animation-delay: 0.6s;
}

@keyframes inkDrop {

	0%,
	100% {
		opacity: 0.3;
		transform: scale(0.8);
	}

	50% {
		opacity: 1;
		transform: scale(1.2);
	}
}

.loading-text {
	font-size: 18px;
	color: var(--ink-black);
	letter-spacing: 4px;
	display: flex;
	gap: 4px;
}

.loading-char {
	display: inline-block;
	animation: charWave 1.5s ease-in-out infinite;
}

.loading-char:nth-child(1) {
	animation-delay: 0s;
}

.loading-char:nth-child(2) {
	animation-delay: 0.1s;
}

.loading-char:nth-child(3) {
	animation-delay: 0.2s;
}

.loading-char:nth-child(4) {
	animation-delay: 0.3s;
}

@keyframes charWave {

	0%,
	100% {
		transform: translateY(0);
		opacity: 0.6;
	}

	50% {
		transform: translateY(-10px);
		opacity: 1;
	}
}

/* 错误提示 */
.error-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 100px 20px;
	min-height: 500px;
	text-align: center;
}

.error-icon {
	font-size: 64px;
	margin-bottom: 20px;
	animation: shake 0.5s ease;
}

@keyframes shake {

	0%,
	100% {
		transform: translateX(0);
	}

	25% {
		transform: translateX(-10px);
	}

	75% {
		transform: translateX(10px);
	}
}

.error-title {
	font-size: 28px;
	color: var(--ink-black);
	margin-bottom: 16px;
}

.error-message {
	font-size: 16px;
	color: #666;
	margin-bottom: 30px;
}

.retry-button {
	padding: 12px 32px;
	background: var(--primary-red);
	color: white;
	border: none;
	border-radius: 50px;
	font-size: 15px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: 0 4px 15px rgba(200, 16, 46, 0.3);
}

.retry-button:hover {
	background: #a00d25;
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(200, 16, 46, 0.4);
}

/* 容器 */
.container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 20px;
}

.detail-content {
	padding: 40px 0 80px;
}

/* Hero 区域 - 传承人基本信息 */
.hero-section {
	margin-bottom: 40px;
}

.hero-card {
	position: relative;
	background: white;
	border-radius: 24px;
	overflow: hidden;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.card-decoration-top,
.card-decoration-bottom {
	position: absolute;
	left: 0;
	right: 0;
	height: 4px;
	background: linear-gradient(to right,
			transparent,
			var(--gold),
			var(--primary-red),
			var(--gold),
			transparent);
	z-index: 1;
}

.card-decoration-top {
	top: 0;
}

.card-decoration-bottom {
	bottom: 0;
}

.hero-content {
	display: flex;
	gap: 50px;
	padding: 60px;
	align-items: center;
}

/* 左侧照片区域 */
.hero-left {
	flex: 0 0 400px;
	position: relative;
}

.image-container {
	position: relative;
}

.image-frame {
	position: relative;
	width: 100%;
	aspect-ratio: 3/4;
	border-radius: 20px;
	overflow: hidden;
	box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
	border: 4px solid white;
	outline: 2px solid var(--gold);
}

.inheritor-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.6s ease;
}

.image-frame:hover .inheritor-image {
	transform: scale(1.05);
}

.image-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(to bottom,
			transparent 60%,
			rgba(0, 0, 0, 0.3) 100%);
}

/* 印章装饰 */
.seal-stamp {
	position: absolute;
	bottom: 20px;
	right: 20px;
	width: 70px;
	height: 70px;
	background: rgba(200, 16, 46, 0.9);
	border: 3px solid white;
	border-radius: 8px;
	transform: rotate(-8deg);
	box-shadow: 0 6px 20px rgba(200, 16, 46, 0.4);
	animation: sealPulse 3s ease-in-out infinite;
}

@keyframes sealPulse {

	0%,
	100% {
		transform: rotate(-8deg) scale(1);
	}

	50% {
		transform: rotate(-8deg) scale(1.05);
	}
}

/* 级别徽章 */
.level-badge {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 12px 24px;
	margin-top: 20px;
	border-radius: 50px;
	font-size: 15px;
	font-weight: 700;
	color: white;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.badge-icon {
	width: 20px;
	height: 20px;
	object-fit: contain;
	filter: brightness(0) invert(1);
	animation: badgeRotate 4s linear infinite;
}

@keyframes badgeRotate {
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
}

.level-badge.national {
	background: linear-gradient(135deg, #c8102e 0%, #e63946 100%);
}

.level-badge.provincial {
	background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
}

.level-badge.municipal {
	background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
}

.level-badge.county {
	background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
}

/* 右侧信息区域 */
.hero-right {
	flex: 1;
}

.name-section {
	margin-bottom: 40px;
	padding-bottom: 30px;
	border-bottom: 2px solid rgba(200, 16, 46, 0.1);
}

.inheritor-name {
	font-size: 48px;
	font-weight: 900;
	color: var(--ink-black);
	margin-bottom: 16px;
	display: flex;
	align-items: center;
	gap: 8px;
	letter-spacing: 4px;
}

.name-decoration {
	font-size: 52px;
	color: var(--primary-red);
	opacity: 0.7;
}

.inheritor-title {
	font-size: 18px;
	color: #666;
	letter-spacing: 2px;
	font-weight: 500;
}

/* 信息网格 */
.info-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 20px;
	margin-bottom: 30px;
}

.info-item {
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 20px;
	background: linear-gradient(135deg, rgba(200, 16, 46, 0.05), rgba(212, 175, 55, 0.05));
	border-radius: 16px;
	border: 2px solid rgba(200, 16, 46, 0.1);
	transition: all 0.3s ease;
}

.info-item:hover {
	transform: translateY(-4px);
	box-shadow: 0 8px 20px rgba(200, 16, 46, 0.15);
	border-color: var(--gold);
}

.info-icon {
	width: 40px;
	height: 40px;
	object-fit: contain;
	animation: iconPulse 2s ease-in-out infinite;
}

.info-icon-text {
	font-size: 32px;
	animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {

	0%,
	100% {
		transform: scale(1);
	}

	50% {
		transform: scale(1.1);
	}
}

.info-content {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.info-label {
	font-size: 13px;
	color: #888;
	font-weight: 500;
}

.info-value {
	font-size: 17px;
	color: var(--ink-black);
	font-weight: 700;
}

/* 统计信息网格 */
.stats-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 20px;
	padding: 25px;
	background: linear-gradient(135deg, rgba(200, 16, 46, 0.08), rgba(212, 175, 55, 0.08));
	border-radius: 16px;
	border: 2px solid rgba(200, 16, 46, 0.15);
}

.stat-item {
	text-align: center;
	padding: 15px;
	background: white;
	border-radius: 12px;
	transition: all 0.3s ease;
}

.stat-item:hover {
	transform: translateY(-4px);
	box-shadow: 0 6px 20px rgba(200, 16, 46, 0.2);
}

.stat-number {
	font-size: 32px;
	font-weight: 900;
	color: var(--primary-red);
	margin-bottom: 8px;
}

.stat-label {
	font-size: 13px;
	color: #666;
	font-weight: 600;
}

/* 区块卡片样式 */
.section-card {
	background: white;
	border-radius: 20px;
	padding: 50px;
	margin-bottom: 30px;
	box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
	position: relative;
	overflow: hidden;
}

.section-card::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 3px;
	background: linear-gradient(to right, transparent, var(--gold), var(--primary-red), var(--gold), transparent);
}

/* 区块标题 */
.section-header {
	margin-bottom: 40px;
}

.section-title-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 20px;
}

.title-decoration {
	flex: 1;
	height: 2px;
	background: linear-gradient(to right, transparent, var(--gold));
}

.title-decoration:last-child {
	background: linear-gradient(to left, transparent, var(--gold));
}

.section-title {
	font-size: 32px;
	font-weight: 900;
	color: var(--ink-black);
	display: flex;
	gap: 8px;
	letter-spacing: 6px;
}

.title-char {
	display: inline-block;
	animation: titleFloat 3s ease-in-out infinite;
}

.title-char:nth-child(1) {
	animation-delay: 0s;
}

.title-char:nth-child(2) {
	animation-delay: 0.1s;
}

.title-char:nth-child(3) {
	animation-delay: 0.2s;
}

.title-char:nth-child(4) {
	animation-delay: 0.3s;
}

.title-char:nth-child(5) {
	animation-delay: 0.4s;
}

@keyframes titleFloat {

	0%,
	100% {
		transform: translateY(0);
	}

	50% {
		transform: translateY(-4px);
	}
}

/* 区块内容 */
.section-content {
	line-height: 2;
}

.biography-text,
.career-text,
.impact-text {
	font-size: 17px;
	color: #444;
	line-height: 2.2;
	text-align: justify;
	letter-spacing: 0.5px;
	text-indent: 2em;
}

/* 个人故事样式 */
.story-content,
.works-content,
.innovation-content {
	display: flex;
	gap: 24px;
	align-items: flex-start;
	padding: 30px;
	background: linear-gradient(135deg, rgba(200, 16, 46, 0.05), rgba(212, 175, 55, 0.05));
	border-radius: 16px;
	border-left: 4px solid var(--gold);
}

.story-icon,
.works-icon,
.innovation-icon {
	font-size: 48px;
	flex-shrink: 0;
	animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {

	0%,
	100% {
		transform: translateY(0) rotate(0deg);
	}

	50% {
		transform: translateY(-8px) rotate(5deg);
	}
}

.story-text,
.works-text,
.innovation-text {
	flex: 1;
	font-size: 17px;
	color: #444;
	line-height: 2.2;
	letter-spacing: 0.5px;
}

/* 艺术理念样式 */
.philosophy-section {
	background: linear-gradient(135deg, #faf9f6 0%, white 100%);
	border: 2px solid rgba(200, 16, 46, 0.1);
}

.philosophy-quote {
	position: relative;
	padding: 40px 60px;
	text-align: center;
}

.quote-mark {
	font-size: 60px;
	color: var(--gold);
	opacity: 0.3;
	line-height: 1;
}

.quote-left {
	position: absolute;
	top: 20px;
	left: 20px;
}

.quote-right {
	position: absolute;
	bottom: 20px;
	right: 20px;
}

.philosophy-text {
	font-size: 20px;
	color: var(--primary-red);
	line-height: 2;
	font-weight: 500;
	font-style: italic;
	letter-spacing: 1px;
}

/* 教育背景样式 */
.education-content {
	display: flex;
	flex-direction: column;
	gap: 30px;
}

.education-item {
	padding: 25px;
	background: rgba(200, 16, 46, 0.03);
	border-radius: 12px;
	border-left: 4px solid var(--primary-red);
}

.education-subtitle {
	font-size: 18px;
	font-weight: 700;
	color: var(--primary-red);
	margin-bottom: 12px;
}

.education-text {
	font-size: 16px;
	color: #555;
	line-height: 2;
	letter-spacing: 0.5px;
}

/* 荣誉成就样式 */
.honors-content {
	display: flex;
	gap: 24px;
	align-items: flex-start;
}

.achievement-icon {
	font-size: 48px;
	flex-shrink: 0;
	animation: iconFloat 3s ease-in-out infinite;
}

.honors-text {
	flex: 1;
}

.honor-item {
	margin-bottom: 25px;
}

.honor-item:last-child {
	margin-bottom: 0;
}

.honor-item h4 {
	font-size: 18px;
	font-weight: 700;
	color: var(--primary-red);
	margin-bottom: 12px;
}

.honor-item p {
	font-size: 16px;
	color: #555;
	line-height: 2;
	letter-spacing: 0.5px;
}

/* 传承教学样式 */
.teaching-content {
	display: flex;
	flex-direction: column;
	gap: 25px;
}

.teaching-item {
	padding: 25px;
	background: rgba(212, 175, 55, 0.08);
	border-radius: 12px;
	border-left: 4px solid var(--gold);
}

.teaching-item h4 {
	font-size: 18px;
	font-weight: 700;
	color: var(--gold);
	margin-bottom: 12px;
}

.teaching-item p {
	font-size: 16px;
	color: #555;
	line-height: 2;
	letter-spacing: 0.5px;
}

/* 工作室信息 */
.workshop-content {
	display: flex;
	gap: 24px;
	align-items: flex-start;
	padding: 30px;
	background: linear-gradient(135deg, rgba(212, 175, 55, 0.08), rgba(200, 16, 46, 0.05));
	border-radius: 16px;
	border: 2px solid rgba(200, 16, 46, 0.1);
}

.workshop-icon {
	font-size: 40px;
	flex-shrink: 0;
}

.workshop-info {
	flex: 1;
}

.workshop-address {
	font-size: 18px;
	color: var(--ink-black);
	font-weight: 600;
	margin-bottom: 12px;
	line-height: 1.8;
}

.workshop-hint {
	font-size: 15px;
	color: #666;
}

.workshop-hint a {
	color: var(--primary-red);
	text-decoration: none;
	transition: all 0.3s ease;
}

.workshop-hint a:hover {
	text-decoration: underline;
}

/* 联系区块 */
.contact-section {
	background: linear-gradient(135deg, #faf9f6 0%, white 100%);
	border: 2px solid rgba(200, 16, 46, 0.1);
}

.contact-content {
	text-align: center;
}

.contact-text {
	font-size: 17px;
	color: #555;
	line-height: 2;
	margin-bottom: 30px;
	letter-spacing: 0.5px;
}

.contact-button {
	display: inline-flex;
	align-items: center;
	gap: 12px;
	padding: 16px 40px;
	background: linear-gradient(135deg, var(--primary-red), #e63946);
	color: white;
	text-decoration: none;
	border-radius: 50px;
	font-size: 16px;
	font-weight: 700;
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	box-shadow: 0 6px 20px rgba(200, 16, 46, 0.3);
	position: relative;
	overflow: hidden;
}

.contact-button::before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg, var(--gold), #fbbf24);
	transition: left 0.4s ease;
	z-index: 0;
}

.contact-button:hover::before {
	left: 0;
}

.btn-icon,
.btn-text,
.btn-arrow {
	position: relative;
	z-index: 1;
}

.btn-icon {
	font-size: 20px;
}

.btn-arrow {
	font-size: 20px;
	transition: transform 0.3s ease;
}

.contact-button:hover {
	transform: translateY(-4px);
	box-shadow: 0 10px 30px rgba(200, 16, 46, 0.4);
}

.contact-button:hover .btn-arrow {
	transform: translateX(5px);
}

.back-to-top {
	position: fixed;
	right: 24px;
	bottom: 24px;
	width: 44px;
	height: 44px;
	border-radius: 50%;
	border: none;
	background: rgba(0, 0, 0, 0.6);
	color: #fff;
	font-size: 18px;
	line-height: 44px;
	text-align: center;
	cursor: pointer;
	box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
	z-index: 1000;
}

/* 响应式设计 */
@media (max-width: 1024px) {
	.hero-content {
		flex-direction: column;
		padding: 40px;
	}

	.hero-left {
		flex: 0 0 auto;
		width: 100%;
		max-width: 400px;
	}

	.section-card {
		padding: 35px;
	}

	.stats-grid {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (max-width: 768px) {
	.hero-content {
		padding: 30px 20px;
	}

	.inheritor-name {
		font-size: 36px;
	}

	.section-title {
		font-size: 24px;
	}

	.section-card {
		padding: 25px;
	}

	.info-grid {
		grid-template-columns: 1fr;
	}

	.stats-grid {
		grid-template-columns: 1fr;
	}
}

@media (max-width: 480px) {
	.inheritor-name {
		font-size: 28px;
		flex-direction: column;
		gap: 4px;
	}

	.section-title {
		font-size: 20px;
	}

	.hero-left {
		max-width: 100%;
	}

	.philosophy-text {
		font-size: 17px;
	}
}

/* 作品展示样式 */
.works-section {
	background: linear-gradient(135deg, #fff 0%, #faf9f6 100%);
}

.works-gallery {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	gap: 25px;
}

.work-item {
	position: relative;
	border-radius: 16px;
	overflow: hidden;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	transition: all 0.4s ease;
}

.work-item:hover {
	transform: translateY(-8px);
	box-shadow: 0 8px 25px rgba(200, 16, 46, 0.2);
}

.work-image-wrapper {
	position: relative;
	aspect-ratio: 4/3;
	overflow: hidden;
}

.work-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.6s ease;
}

.work-item:hover .work-image {
	transform: scale(1.1);
}

.work-overlay {
	position: absolute;
	inset: 0;
	background: linear-gradient(to top,
		rgba(0, 0, 0, 0.9) 0%,
		rgba(0, 0, 0, 0.3) 50%,
		transparent 100%);
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	padding: 20px;
	opacity: 0;
	transition: opacity 0.4s ease;
}

.work-item:hover .work-overlay {
	opacity: 1;
}

.work-info {
	color: white;
}

.work-name {
	font-size: 18px;
	font-weight: 700;
	margin-bottom: 8px;
	color: white;
}

.work-desc {
	font-size: 14px;
	line-height: 1.6;
	margin-bottom: 8px;
	opacity: 0.9;
}

.work-year {
	display: inline-block;
	padding: 4px 12px;
	background: var(--primary-red);
	border-radius: 20px;
	font-size: 12px;
	font-weight: 600;
}

/* 视频展示样式 */
.videos-section {
	background: linear-gradient(135deg, #fff 0%, #faf9f6 100%);
}

.videos-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
	gap: 25px;
}

.video-item {
	background: white;
	border-radius: 16px;
	overflow: hidden;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	transition: all 0.4s ease;
}

.video-item:hover {
	transform: translateY(-5px);
	box-shadow: 0 8px 25px rgba(200, 16, 46, 0.2);
}

.video-thumbnail {
	position: relative;
	aspect-ratio: 16/9;
	overflow: hidden;
	background: #000;
}

.video-cover {
	width: 100%;
	height: 100%;
	object-fit: cover;
	opacity: 0.9;
	transition: opacity 0.3s ease;
}

.video-item:hover .video-cover {
	opacity: 1;
}

.play-button {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 60px;
	height: 60px;
	background: rgba(200, 16, 46, 0.9);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 24px;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.video-item:hover .play-button {
	transform: translate(-50%, -50%) scale(1.1);
	background: var(--primary-red);
}

.video-duration {
	position: absolute;
	bottom: 10px;
	right: 10px;
	padding: 4px 10px;
	background: rgba(0, 0, 0, 0.8);
	color: white;
	border-radius: 4px;
	font-size: 12px;
	font-weight: 600;
}

.video-info {
	padding: 20px;
}

.video-title {
	font-size: 16px;
	font-weight: 700;
	color: var(--ink-black);
	margin-bottom: 8px;
}

.video-desc {
	font-size: 14px;
	color: #666;
	line-height: 1.6;
	margin-bottom: 12px;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.video-meta {
	display: flex;
	align-items: center;
	gap: 15px;
	font-size: 13px;
	color: #888;
}

.video-views {
	display: flex;
	align-items: center;
	gap: 4px;
}

/* 技艺流程样式 */
.process-section {
	background: linear-gradient(135deg, #faf9f6 0%, white 100%);
}

.process-timeline {
	position: relative;
	padding: 20px 0;
}

.process-step {
	display: flex;
	gap: 30px;
	margin-bottom: 40px;
	position: relative;
}

.process-step:last-child {
	margin-bottom: 0;
}

.process-step:not(:last-child)::after {
	content: '';
	position: absolute;
	left: 24px;
	top: 50px;
	bottom: -30px;
	width: 2px;
	background: linear-gradient(to bottom,
		var(--gold) 0%,
		var(--primary-red) 100%);
}

.step-number {
	flex-shrink: 0;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	background: linear-gradient(135deg, var(--primary-red), #e63946);
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24px;
	font-weight: 900;
	box-shadow: 0 4px 15px rgba(200, 16, 46, 0.3);
	position: relative;
	z-index: 1;
}

.step-content {
	flex: 1;
	background: white;
	padding: 25px;
	border-radius: 16px;
	border: 2px solid rgba(200, 16, 46, 0.1);
	transition: all 0.3s ease;
}

.process-step:hover .step-content {
	border-color: var(--gold);
	box-shadow: 0 4px 20px rgba(212, 175, 55, 0.2);
	transform: translateX(5px);
}

.step-title {
	font-size: 20px;
	font-weight: 700;
	color: var(--primary-red);
	margin-bottom: 12px;
}

.step-description {
	font-size: 15px;
	color: #555;
	line-height: 1.8;
	margin-bottom: 12px;
}

.step-duration {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 6px 14px;
	background: linear-gradient(135deg,
		rgba(200, 16, 46, 0.08),
		rgba(212, 175, 55, 0.08));
	border-radius: 20px;
	font-size: 13px;
	color: var(--primary-red);
	font-weight: 600;
}

/* 响应式优化 */
@media (max-width: 768px) {
	.works-gallery {
		grid-template-columns: 1fr;
	}

	.videos-grid {
		grid-template-columns: 1fr;
	}

	.process-step {
		flex-direction: column;
		gap: 15px;
	}

	.process-step:not(:last-child)::after {
		left: 25px;
		top: 50px;
		bottom: -20px;
	}

	.step-number {
		width: 50px;
		height: 50px;
	}

	.step-content {
		width: 100%;
	}
}
</style>
