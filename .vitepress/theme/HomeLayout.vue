<script setup>
import DefaultTheme from 'vitepress/theme'
import BabyCountdown from './components/BabyCountdown.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #home-hero-after>
      <BabyCountdown />
    </template>
  </Layout>
</template>
