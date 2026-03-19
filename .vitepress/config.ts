import { defineConfig } from 'vitepress'

export default defineConfig({
  mpa: true,
  base: '/family-hub-demo/',
  title: '小鱼一家',
  description: '家庭健康与生活管理',
  lang: 'zh-CN',

  // 排除不需要构建的文件
  srcExclude: [
    'CLAUDE.md',
    'README.md',
    'node_modules/**',
    'encrypted_test/**',
    'archive/**',
    'private/**',
  ],

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
    ],

    sidebar: [
      {
        text: '家庭档案',
        items: [
          { text: '小鱼健康档案', link: '/health/xiaoyu' },
          { text: '阿达健康档案', link: '/health/ada' },
          { text: '糖豆成长记录', link: '/health/tangdou' },
        ]
      },
      {
        text: '孕期参考',
        items: [
          { text: '用药指南', link: '/health/medication_guide' },
          { text: '补剂管理', link: '/health/supplements' },
          { text: '产品安全评估', link: '/health/product_safety' },
          { text: '孕期日常须知', link: '/health/pregnancy_guide' },
        ]
      },
      {
        text: '日常管理',
        items: [
          { text: '待办 & 决策', link: '/todo' },
          { text: '菜单', link: '/health/recipes' },
          { text: '家庭药箱', link: '/health/medicine_cabinet' },
        ]
      }
    ],

    outline: {
      level: [2, 3],
      label: '目录'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
  },

  head: [
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' }],
    ['meta', { name: 'robots', content: 'noindex, nofollow' }],
    // MPA 模式下无客户端 JS，需内联脚本恢复 dark/light 切换
    ['script', {}, `
      ;(function() {
        var s = typeof localStorage !== 'undefined' && localStorage.getItem('vitepress-theme-appearance');
        var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (s === 'dark' || (!s && d)) document.documentElement.classList.add('dark');
        document.addEventListener('DOMContentLoaded', function() {
          var btn = document.querySelector('.VPSwitchAppearance');
          if (btn) btn.addEventListener('click', function() {
            document.documentElement.classList.toggle('dark');
            var isDark = document.documentElement.classList.contains('dark');
            localStorage.setItem('vitepress-theme-appearance', isDark ? 'dark' : 'light');
          });
        });
      })();
    `],
  ],
})
