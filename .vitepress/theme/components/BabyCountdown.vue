<script setup lang="ts">
import { computed } from 'vue'

// 小鱼二胎：LMP 2025.11.20，EDD 2026.8.27（12周B超校正）
const ADJUSTED_LMP = new Date(2025, 10, 20) // 11月=10（0-indexed）
const EDD = new Date(2026, 7, 27) // 8月=7
const TOTAL_DAYS = 280

// MPA 模式：以下值仅在 SSR 构建时计算，客户端由 config.ts 内联脚本实时更新
const now = new Date()
const diffMs = now.getTime() - ADJUSTED_LMP.getTime()
const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
const weeks = Math.floor(totalDays / 7)
const days = totalDays % 7
const daysUntilEdd = Math.max(0, Math.ceil((EDD.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
const progressPercent = Math.min(100, Math.max(0, (totalDays / TOTAL_DAYS) * 100))

const trimester = computed(() => {
  if (weeks < 13) return 1
  if (weeks < 28) return 2
  return 3
})

const trimesterLabel = computed(() => {
  const labels: Record<number, string> = { 1: '孕早期', 2: '孕中期', 3: '孕晚期' }
  return labels[trimester.value]
})

// 每周胎儿数据（基于 WHO 标准、Cleveland Clinic、ACOG 等权威来源）
interface WeekInfo {
  size: string
  length: string
  weight: string
  milestone: string
}

const weeklyData: Record<number, WeekInfo> = {
  4: { size: '罂粟籽', length: '约 2mm', weight: '<1g', milestone: '囊胚着床子宫壁，羊膜囊形成，胎盘开始发育' },
  5: { size: '芝麻粒', length: '约 1mm（胚芽）', weight: '<1g', milestone: '神经管（大脑和脊髓）开始形成，原始心管开始搏动' },
  6: { size: '豌豆', length: '约 5mm', weight: '<1g', milestone: '超声可探测到心跳；手臂和腿部芽状突起出现' },
  7: { size: '蓝莓', length: '约 1cm', weight: '<1g', milestone: '软骨开始骨化，大脑和面部快速发育' },
  8: { size: '覆盆子', length: '约 1.6cm', weight: '约 1g', milestone: '所有主要器官开始发育；手指脚趾有蹼相连' },
  9: { size: '葡萄', length: '约 2.3cm', weight: '约 2g', milestone: '牙齿和味蕾开始形成；多普勒可听到心跳' },
  10: { size: '金桔', length: '约 3.1cm', weight: '约 4g', milestone: '手指脚趾分开，指甲开始发育，外耳成形' },
  11: { size: '无花果', length: '约 4.1cm', weight: '约 7g', milestone: '可以握拳和张嘴，骨骼逐渐硬化' },
  12: { size: '青柠', length: '约 5.4cm', weight: '约 14g', milestone: '所有器官、四肢基本成形；肝脏开始产生胆汁' },
  13: { size: '豌豆荚', length: '约 7cm', weight: '约 23g', milestone: '声带形成；孕早期即将结束！' },
  14: { size: '柠檬', length: '约 15cm', weight: '约 93g', milestone: '胎毛覆盖全身；指纹形成，可辨别性别' },
  15: { size: '苹果', length: '约 17cm', weight: '约 117g', milestone: '耳朵移至正常位置；开始练习呼吸动作' },
  16: { size: '牛油果', length: '约 19cm', weight: '约 146g', milestone: '嘴唇发育完善，耳朵可以听到声音' },
  17: { size: '梨', length: '约 20cm', weight: '约 181g', milestone: '皮下脂肪开始积累；胎脂覆盖皮肤' },
  18: { size: '甜椒', length: '约 22cm', weight: '约 222g', milestone: '睡眠-觉醒周期初步形成' },
  19: { size: '芒果', length: '约 24cm', weight: '约 272g', milestone: '胎动增强（踢腿/挥拳）；指纹独一无二' },
  20: { size: '香蕉', length: '约 26cm', weight: '约 330g', milestone: '孕程过半！妈妈通常能感受到胎动' },
  21: { size: '胡萝卜', length: '约 27cm', weight: '约 400g', milestone: '四肢动作更协调；骨髓开始造血' },
  22: { size: '木瓜', length: '约 29cm', weight: '约 478g', milestone: '握力增强；可听到妈妈的心跳和说话声' },
  23: { size: '西柚', length: '约 31cm', weight: '约 568g', milestone: '早产存活率开始上升；快速积累体脂' },
  24: { size: '玉米', length: '约 32cm', weight: '约 670g', milestone: '肺泡已形成；医学上的存活门槛周' },
  25: { size: '西葫芦', length: '约 34cm', weight: '约 785g', milestone: '对熟悉的声音有反应；神经系统快速成熟' },
  26: { size: '葱段', length: '约 35cm', weight: '约 913g', milestone: '眼睛可以睁开；开始产生黑色素' },
  27: { size: '菜花', length: '约 37cm', weight: '约 1.1kg', milestone: '眼睛睁开并能眨眼。即将进入孕晚期！' },
  28: { size: '茄子', length: '约 38cm', weight: '约 1.2kg', milestone: '可能开始转为头朝下体位' },
  29: { size: '小南瓜', length: '约 39cm', weight: '约 1.4kg', milestone: '胎动从翻滚变为顶撞感' },
  30: { size: '卷心菜', length: '约 40cm', weight: '约 1.6kg', milestone: '大脑快速发育，表面开始出现沟回' },
  31: { size: '椰子', length: '约 42cm', weight: '约 1.8kg', milestone: '形成明显的睡眠-觉醒规律' },
  32: { size: '大番薯', length: '约 43cm', weight: '约 2.0kg', milestone: '皮肤不再透明；大部分器官发育完善' },
  33: { size: '菠萝', length: '约 44cm', weight: '约 2.2kg', milestone: '骨骼硬化（颅骨除外）；能感知光线变化' },
  34: { size: '哈密瓜', length: '约 45cm', weight: '约 2.4kg', milestone: '胎脂增厚保护皮肤；指甲长到指尖' },
  35: { size: '蜜瓜', length: '约 46cm', weight: '约 2.6kg', milestone: '体重增速高峰期（约215g/周）' },
  36: { size: '大白菜', length: '约 47cm', weight: '约 2.8kg', milestone: '胎毛脱落，头发长出' },
  37: { size: '大冬瓜', length: '约 48cm', weight: '约 3.0kg', milestone: '可能下降入骨盆。早期足月！' },
  38: { size: '韭葱', length: '约 49cm', weight: '约 3.2kg', milestone: '大脑和肺部最后冲刺成熟' },
  39: { size: '西瓜', length: '约 50cm', weight: '约 3.4kg', milestone: '完全足月！所有器官准备就绪' },
  40: { size: '小南瓜', length: '约 51cm', weight: '约 3.5kg', milestone: '预产期到了！随时准备见面' },
}

const currentWeekData = computed(() => weeklyData[weeks] || null)
const nextWeekData = computed(() => weeklyData[weeks + 1] || null)
</script>

<template>
  <div class="countdown-wrapper">
    <div class="countdown-container"
      :data-build-ts="Date.now()"
      :data-build-total="totalDays"
      :data-build-edd="daysUntilEdd"
      :data-next-week="JSON.stringify(nextWeekData)"
    >
      <div class="stats-row">
        <div class="stat-card current-week">
          <div class="stat-number"><span id="preg-w">{{ weeks }}</span><span class="stat-unit">周</span><span id="preg-d">{{ days }}</span><span class="stat-unit">天</span></div>
          <div class="stat-label">当前孕周</div>
        </div>
        <div class="stat-card days-left">
          <div class="stat-number"><span id="preg-edd">{{ daysUntilEdd }}</span><span class="stat-unit">天</span></div>
          <div class="stat-label">距预产期</div>
        </div>
        <div class="stat-card trimester-card">
          <div class="stat-number" id="preg-tri">{{ trimesterLabel }}</div>
          <div class="stat-label"><span id="preg-tri-n">{{ trimester }}</span> / 3 孕期</div>
        </div>
      </div>

      <div class="progress-section">
        <div class="progress-track">
          <div id="preg-bar" class="progress-fill" :style="{ width: progressPercent + '%' }">
            <div class="progress-glow"></div>
          </div>
          <div class="marker" style="left: 32.5%"><span>13周</span></div>
          <div class="marker" style="left: 70%"><span>28周</span></div>
        </div>
        <div class="progress-labels">
          <span :class="{ active: trimester === 1 }" data-tri="1">孕早期</span>
          <span :class="{ active: trimester === 2 }" data-tri="2">孕中期</span>
          <span :class="{ active: trimester === 3 }" data-tri="3">孕晚期</span>
        </div>
      </div>

      <div v-if="currentWeekData" class="baby-info-card">
        <div class="baby-info-header">
          <div id="preg-size" class="baby-size-badge">{{ currentWeekData.size }}</div>
          <div class="baby-info-title">第 <span id="preg-wk">{{ weeks }}</span> 周的宝宝</div>
        </div>
        <div class="baby-info-body">
          <div class="baby-measurements">
            <span id="preg-len" class="measurement">📏 {{ currentWeekData.length }}</span>
            <span class="measurement-divider">·</span>
            <span id="preg-wt" class="measurement">⚖️ {{ currentWeekData.weight }}</span>
          </div>
          <div class="baby-milestone">
            <span class="milestone-label">💡 本周发育</span>
            <p id="preg-ms" class="milestone-text">{{ currentWeekData.milestone }}</p>
          </div>
        </div>
        <div class="baby-info-footer">
          数据参考：WHO 胎儿生长标准、Cleveland Clinic、ACOG
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.countdown-wrapper {
  display: flex;
  justify-content: center;
  padding: 0 24px 32px;
}
.countdown-container { max-width: 688px; width: 100%; }
.stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
.stat-card { background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 20px 16px; text-align: center; transition: all 0.3s ease; }
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08); border-color: var(--vp-c-brand-1); }
.stat-number { font-size: 28px; font-weight: 700; color: var(--vp-c-brand-1); line-height: 1.2; }
.stat-unit { font-size: 14px; font-weight: 400; opacity: 0.7; margin: 0 1px; }
.stat-label { font-size: 13px; color: var(--vp-c-text-2); margin-top: 6px; }
.progress-section { margin-bottom: 24px; }
.progress-track { position: relative; height: 8px; background: var(--vp-c-bg-soft); border-radius: 4px; overflow: visible; margin-bottom: 12px; border: 1px solid var(--vp-c-divider); }
.progress-fill { position: relative; height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2, #a78bfa)); transition: width 1s ease; min-width: 8px; }
.progress-glow { position: absolute; right: -4px; top: 50%; transform: translateY(-50%); width: 12px; height: 12px; border-radius: 50%; background: var(--vp-c-brand-1); box-shadow: 0 0 8px var(--vp-c-brand-soft, rgba(102, 126, 234, 0.4)); animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { box-shadow: 0 0 8px var(--vp-c-brand-soft, rgba(102, 126, 234, 0.4)); } 50% { box-shadow: 0 0 16px var(--vp-c-brand-soft, rgba(102, 126, 234, 0.6)); } }
.marker { position: absolute; top: -4px; width: 2px; height: 16px; background: var(--vp-c-divider); transform: translateX(-50%); }
.marker span { position: absolute; top: 20px; left: 50%; transform: translateX(-50%); font-size: 11px; color: var(--vp-c-text-3); white-space: nowrap; }
.progress-labels { display: flex; justify-content: space-between; padding: 0 4px; }
.progress-labels span { font-size: 12px; color: var(--vp-c-text-3); transition: all 0.3s; }
.progress-labels span.active { color: var(--vp-c-brand-1); font-weight: 600; }
.baby-info-card { background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 12px; overflow: hidden; transition: all 0.3s ease; }
.baby-info-card:hover { border-color: var(--vp-c-brand-1); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06); }
.baby-info-header { display: flex; align-items: center; gap: 12px; padding: 16px 20px 12px; }
.baby-size-badge { background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2, #a78bfa)); color: #fff; font-size: 14px; font-weight: 600; padding: 4px 12px; border-radius: 20px; white-space: nowrap; }
.baby-info-title { font-size: 16px; font-weight: 600; color: var(--vp-c-text-1); }
.baby-info-body { padding: 0 20px 16px; }
.baby-measurements { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; font-size: 14px; color: var(--vp-c-text-2); }
.measurement-divider { color: var(--vp-c-divider); }
.baby-milestone { background: var(--vp-c-bg); border-radius: 8px; padding: 12px 14px; }
.milestone-label { font-size: 12px; font-weight: 600; color: var(--vp-c-brand-1); display: block; margin-bottom: 4px; }
.milestone-text { font-size: 13px; line-height: 1.6; color: var(--vp-c-text-2); margin: 0; }
.baby-info-footer { padding: 8px 20px; font-size: 11px; color: var(--vp-c-text-3); border-top: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); }
@media (max-width: 640px) {
  .countdown-wrapper { padding: 0 16px 24px; }
  .stats-row { grid-template-columns: 1fr; gap: 12px; }
  .stat-card { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; }
  .stat-number { font-size: 24px; }
  .stat-label { margin-top: 0; }
  .baby-info-header { padding: 14px 16px 10px; }
  .baby-info-body { padding: 0 16px 14px; }
  .baby-info-footer { padding: 8px 16px; }
}
</style>
