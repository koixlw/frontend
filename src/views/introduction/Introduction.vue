<template>
  <div class="introduction">
    <IntroHero :title="title" :subtitle="subtitle" />

    <section id="start">
      <CraftSection :items="craftItems" />
    </section>
  </div>
</template>

<script setup>
import IntroHero from '@/components/IntroHero.vue';
import CraftSection from '@/components/CraftSection.vue';
import '@/assets/styles/introduction.css';

const title = '泥韵千秋';
const subtitle = '从指尖的温度，到数字的永恒';

const craftItems = [
  { icon: '🏺', title: '选泥', desc: '甄选优质红泥，去杂质，经风化、捶打，练就细腻骨骼。', delay: 100 },
  { icon: '👐', title: '塑形', desc: '一双巧手，捏、搓、揉、掀，方寸之间，神韵天成。', delay: 200 },
  { icon: '🎨', title: '彩绘', desc: '色从心生，笔随意外。浓墨重彩间，赋予泥人生命。', delay: 300 },
  { icon: '🔥', title: '烧制', desc: '浴火重生，定格永恒。千度高温下，泥土化为不朽。', delay: 400 }
];
</script>
