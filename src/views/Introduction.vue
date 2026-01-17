<template>
    <header class="hero" @mousemove="handleMouseMove">
        <video class="hero-bg-video" autoplay muted loop playsinline>
            <source src="@/assets/video/lizihua.mp4" type="video/mp4">
        </video>
        <div class="hero-overlay"></div>

        <div class="hero-content container">
            <h1 class="hero-title">
                <span class="char-block" v-for="(char, index) in titleChars" :key="index"
                    :style="{ animationDelay: index * 0.15 + 's' }">
                    {{ char }}
                </span>
            </h1>
            <p class="hero-subtitle fade-in-up">从指尖的温度，到数字的永恒</p>
            <div class="scroll-indicator" @click="scrollToStart">
                <span class="line"></span>
                <span class="text">探索旅程</span>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref } from 'vue';

const titleChars = '泥韵千秋'.split('');

const scrollToStart = () => {
    const el = document.getElementById('start');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
};

const handleMouseMove = (e) => {
    // 可按需实现视差
};
</script>

<style scoped>
.hero {
    position: relative;
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.hero-bg-video {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    transform: translate(-50%, -50%);
    object-fit: cover;
    z-index: 0;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(44, 30, 28, 0.8));
    z-index: 1;
}

.hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    color: #fff;
}

.hero-title {
    font-size: 80px;
    font-weight: bold;
    letter-spacing: 10px;
    margin-bottom: 20px;
    text-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.char-block {
    display: inline-block;
    opacity: 0;
    animation: charsEnter 1s ease-out forwards;
}

@keyframes charsEnter {
    from {
        opacity: 0;
        transform: translateY(40px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.hero-subtitle {
    font-size: 24px;
    font-weight: 300;
    opacity: 0.9;
    letter-spacing: 2px;
}

.fade-in-up {
    opacity: 0;
    animation: fadeInUp 1s ease-out 1s forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.scroll-indicator {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.3s;
}

.scroll-indicator:hover {
    opacity: 1;
}

.scroll-indicator .line {
    width: 1px;
    height: 60px;
    background: #fff;
    margin-bottom: 10px;
    animation: scrollLine 2s infinite;
    transform-origin: top;
}

@keyframes scrollLine {
    0% {
        transform: scaleY(0);
        transform-origin: top;
    }

    50% {
        transform: scaleY(1);
        transform-origin: top;
    }

    51% {
        transform: scaleY(1);
        transform-origin: bottom;
    }

    100% {
        transform: scaleY(0);
        transform-origin: bottom;
    }
}

.scroll-indicator .text {
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
}
</style>



<template>
    <section class="section craft dark-bg">
        <div class="bg-pattern"></div>
        <div class="container">
            <div class="section-header text-center" v-scroll-reveal>
                <span class="section-tag light">技艺 · Craft</span>
                <h2 class="section-heading light">七分塑，三分彩</h2>
                <p class="section-desc light">每一次捏塑都是与泥土的对话，每一笔彩绘都是灵魂的注入。</p>
            </div>

            <div class="craft-grid">
                <div class="craft-card" v-scroll-reveal="{ delay: 100 }">
                    <div class="card-icon">🏺</div>
                    <h3>选泥</h3>
                    <p>甄选优质红泥，去杂质，经风化、捶打，练就细腻骨骼。</p>
                </div>
                <div class="craft-card" v-scroll-reveal="{ delay: 200 }">
                    <div class="card-icon">👐</div>
                    <h3>塑形</h3>
                    <p>一双巧手，捏、搓、揉、掀，方寸之间，神韵天成。</p>
                </div>
                <div class="craft-card" v-scroll-reveal="{ delay: 300 }">
                    <div class="card-icon">🎨</div>
                    <h3>彩绘</h3>
                    <p>色从心生，笔随意外。浓墨重彩间，赋予泥人生命。</p>
                </div>
                <div class="craft-card" v-scroll-reveal="{ delay: 400 }">
                    <div class="card-icon">🔥</div>
                    <h3>烧制</h3>
                    <p>浴火重生，定格永恒。千度高温下，泥土化为不朽。</p>
                </div>
            </div>

            <div class="craft-spotlight" v-scroll-reveal="{ delay: 300 }">
                <img src="@/assets/images/shoubu.png" alt="匠人手部特写" class="spotlight-img">
            </div>
        </div>
    </section>
</template>

<script setup>
// 无逻辑，仅展示
</script>

<style scoped>
.dark-bg {
    background-color: #2c1e1c;
    color: #fff;
    overflow: hidden;
}

.bg-pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.05;
    background-image: radial-gradient(#d93b30 1px, transparent 1px);
    background-size: 30px 30px;
    pointer-events: none;
}

.section-desc {
    max-width: 600px;
    margin: 0 auto 60px;
    color: rgba(255, 255, 255, 0.7);
}

.text-center {
    text-align: center;
}

.craft-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
    margin-bottom: 60px;
}

.craft-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 30px 20px;
    border-radius: 8px;
    text-align: center;
    transition: all 0.3s ease;
}

.craft-card:hover {
    background: rgba(217, 59, 48, 0.1);
    transform: translateY(-5px);
    border-color: #d93b30;
}

.card-icon {
    font-size: 36px;
    margin-bottom: 20px;
}

.craft-card h3 {
    font-size: 20px;
    margin-bottom: 15px;
    color: #fff;
}

.craft-card p {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
}

.craft-spotlight {
    text-align: center;
}

.spotlight-img {
    max-width: 100%;
    max-height: 400px;
    filter: drop-shadow(0 0 50px rgba(0, 0, 0, 0.5));
    mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
}
</style>
