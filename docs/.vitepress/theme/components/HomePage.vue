<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-copy">
        <h1 class="greeting">
          Hi, 我是 <span>Angelxia</span> 👋
        </h1>
        <h2 class="headline">热爱全栈开发，在实践中探索与成长</h2>
        <p class="bio">
          从前端到后端，再到 Agent，探索工程化与全栈实践，记录成长历程。在这里分享学习笔记、项目经验和面试复盘，把过程慢慢沉淀下来。
        </p>

        <div class="actions">
          <a class="btn btn-primary" href="/vue/mvvm-architecture">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 4.5h8.5L18 8v11.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-14a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" stroke-width="1.8" />
              <path d="M14.5 4.5V8H18" fill="none" stroke="currentColor" stroke-width="1.8" />
              <path d="M8 12h8M8 15.5h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            浏览文章
          </a>
          <a class="btn btn-secondary" href="https://github.com/angel200109?tab=repositories" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 15.5c3-1 5.5-6.5 7-11l1.2 4.4L18 10c-3.2 1.4-6.6 4.8-8.8 9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
              <path d="M13.2 8.9 19 7.5l-1.8 5.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
            </svg>
            查看项目
          </a>
        </div>

        <div class="socials">
          <a
            v-for="item in socials"
            :key="item.name"
            class="social"
            :class="{ copied: item.copy && copied, disabled: item.disabled }"
            :href="item.disabled ? undefined : item.copy ? '#' : item.href"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noopener' : undefined"
            :aria-disabled="item.disabled ? 'true' : undefined"
            :tabindex="item.disabled ? -1 : undefined"
            @click="onSocialClick($event, item)"
          >
            <span class="social-icon" :class="item.name" :style="item.color && !item.disabled ? { color: item.color } : undefined">
              <svg v-if="item.name === 'GitHub'" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              <svg v-else-if="item.name === '掘金'" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.2 2.6 8.1v2.2L12 4.5l9.4 5.8V8.1L12 2.2Zm0 6.1L2.6 14.2v2.2L12 10.6l9.4 5.8v-2.2L12 8.3Zm0 6.1-9.4 5.9L12 22l9.4-1.7-9.4-5.9Z" />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
                <path d="m4 7 8 6 8-6" />
              </svg>
            </span>
            {{ item.name }}
            <span v-if="item.copy && copied" class="copy-toast">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                <path d="M5 12.5 9.5 17 19 7.5" />
              </svg>
              已复制
            </span>
          </a>
        </div>
      </div>

      <div class="portrait" aria-hidden="true">
        <div class="orbit-system">
          <div class="orbit"></div>
          <div class="orbit-track">
            <span class="celestial star" style="--d: 0deg">
              <svg viewBox="0 0 24 24" fill="#a98bc5">
                <path d="M12 1.6 13.7 9.2 21.4 12 13.7 14.8 12 22.4 10.3 14.8 2.6 12 10.3 9.2Z" />
              </svg>
            </span>
            <span class="celestial star star-sm" style="--d: 338deg">
              <svg viewBox="0 0 24 24" fill="#c48edf">
                <path d="M12 1.6 13.7 9.2 21.4 12 13.7 14.8 12 22.4 10.3 14.8 2.6 12 10.3 9.2Z" />
              </svg>
            </span>
            <span class="celestial dot" style="--d: 348deg"></span>
            <span class="celestial star star-lg" style="--d: 18deg">
              <svg viewBox="0 0 24 24" fill="#8b6aae">
                <path d="M12 1.6 13.7 9.2 21.4 12 13.7 14.8 12 22.4 10.3 14.8 2.6 12 10.3 9.2Z" />
              </svg>
            </span>
            <span class="celestial moon" style="--d: 112deg">
              <svg viewBox="0 0 24 24" fill="#c48edf">
                <path d="M14.2 3.2A8.8 8.8 0 1 0 20.8 16 7.2 7.2 0 0 1 14.2 3.2Z" />
              </svg>
            </span>
            <span class="celestial planet-mini" style="--d: 228deg">
              <svg viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="4.2" fill="#daa8ee" />
                <circle cx="6.4" cy="6.6" r="1.1" fill="#fff" opacity=".45" />
              </svg>
            </span>
            <span class="celestial star" style="--d: 58deg">
              <svg viewBox="0 0 24 24" fill="#8b6aae">
                <path d="M12 1.6 13.7 9.2 21.4 12 13.7 14.8 12 22.4 10.3 14.8 2.6 12 10.3 9.2Z" />
              </svg>
            </span>
            <span class="celestial star star-sm" style="--d: 86deg">
              <svg viewBox="0 0 24 24" fill="#c48edf">
                <path d="M12 1.6 13.7 9.2 21.4 12 13.7 14.8 12 22.4 10.3 14.8 2.6 12 10.3 9.2Z" />
              </svg>
            </span>
            <span class="celestial star" style="--d: 168deg">
              <svg viewBox="0 0 24 24" fill="#a98bc5">
                <path d="M12 1.6 13.7 9.2 21.4 12 13.7 14.8 12 22.4 10.3 14.8 2.6 12 10.3 9.2Z" />
              </svg>
            </span>
            <span class="celestial star star-sm" style="--d: 198deg">
              <svg viewBox="0 0 24 24" fill="#8b6aae">
                <path d="M12 1.6 13.7 9.2 21.4 12 13.7 14.8 12 22.4 10.3 14.8 2.6 12 10.3 9.2Z" />
              </svg>
            </span>
            <span class="celestial star" style="--d: 268deg">
              <svg viewBox="0 0 24 24" fill="#c48edf">
                <path d="M12 1.6 13.7 9.2 21.4 12 13.7 14.8 12 22.4 10.3 14.8 2.6 12 10.3 9.2Z" />
              </svg>
            </span>
            <span class="celestial star star-sm" style="--d: 312deg">
              <svg viewBox="0 0 24 24" fill="#daa8ee">
                <path d="M12 1.6 13.7 9.2 21.4 12 13.7 14.8 12 22.4 10.3 14.8 2.6 12 10.3 9.2Z" />
              </svg>
            </span>
            <span class="celestial dot" style="--d: 38deg"></span>
            <span class="celestial dot" style="--d: 148deg"></span>
            <span class="celestial dot" style="--d: 292deg"></span>
          </div>
        </div>
        <div class="avatar-glow"></div>
        <div class="avatar">
          <img src="/avatar.png" alt="Angelxia" />
        </div>

        <article v-for="card in orbitCards" :key="card.title" class="orbit-card" :class="card.pos">
          <span class="orbit-icon" :style="{ color: card.color, background: card.bg }">
            <svg v-if="card.pos === 'school'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="m3 10 9-6 9 6-9 5-9-5Z" />
              <path d="M7 12.5v4.2L12 20l5-3.3v-4.2" />
            </svg>
            <svg v-else-if="card.pos === 'major'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13 7l-2 10" />
            </svg>
            <svg v-else-if="card.pos === 'location'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
              <circle cx="12" cy="10" r="2.2" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor">
              <path d="m12 3.2 2.4 5.7 6.2.6-4.7 4.1 1.4 6.1L12 16.8 6.7 19.7l1.4-6.1-4.7-4.1 6.2-.6L12 3.2Z" />
            </svg>
          </span>
          <div>
            <p class="orbit-title">{{ card.title }}</p>
            <p class="orbit-desc">{{ card.desc }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="stats">
      <article v-for="stat in stats" :key="stat.label" class="stat-card">
        <div class="stat-head">
          <span class="stat-icon" :style="{ color: stat.color, background: stat.bg }">
            <svg v-if="stat.id === 'frontend'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13 7l-2 10" />
            </svg>
            <svg v-else-if="stat.id === 'backend'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <rect x="4" y="4" width="7" height="7" rx="1.4" />
              <rect x="13" y="4" width="7" height="7" rx="1.4" />
              <rect x="4" y="13" width="7" height="7" rx="1.4" />
              <rect x="13" y="13" width="7" height="7" rx="1.4" />
            </svg>
            <svg v-else-if="stat.id === 'agent'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <circle cx="12" cy="12" r="3.2" />
              <path d="M12 5.2V3M12 21v-2.2M5.2 12H3M21 12h-2.2M7 7l-1.6-1.6M18.6 18.6 17 17M17 7l1.6-1.6M6.4 18.6 8 17" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M7 4h10a1 1 0 0 1 1 1v15l-3.2-2-2.8 2-2.8-2L6 20V5a1 1 0 0 1 1-1Z" />
              <path d="M9.5 9h5M9.5 12.5h5" stroke-linecap="round" />
            </svg>
          </span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
        <p v-for="line in stat.lines" :key="line" class="stat-desc">{{ line }}</p>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const EMAIL = '2643152157@qq.com'

const socials = [
  { name: 'GitHub', href: 'https://github.com/angel200109', external: true },
  { name: '掘金', href: '#', disabled: true, color: '#1e80ff' },
  { name: '邮箱', href: '#', copy: true, color: '#3b82f6' },
]

const copied = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | undefined

async function onSocialClick(event: MouseEvent, item: (typeof socials)[number]) {
  if (item.disabled) {
    event.preventDefault()
    return
  }
  if (!item.copy) return
  event.preventDefault()
  try {
    await navigator.clipboard.writeText(EMAIL)
  } catch {
    const input = document.createElement('textarea')
    input.value = EMAIL
    input.setAttribute('readonly', '')
    input.style.position = 'fixed'
    input.style.left = '-9999px'
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
  }
  copied.value = true
  window.clearTimeout(copiedTimer)
  copiedTimer = window.setTimeout(() => {
    copied.value = false
  }, 700)
}

const orbitCards = [
  { pos: 'school', title: '学校', desc: '广州大学 / 计算机技术', color: '#8b6aae', bg: 'rgba(139, 106, 174, 0.12)' },
  { pos: 'major', title: '专业', desc: '前端开发 / 全栈探索中', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
  { pos: 'location', title: '所在地', desc: '广州，中国', color: '#8b6aae', bg: 'rgba(139, 106, 174, 0.12)' },
  { pos: 'interest', title: '兴趣', desc: '阅读 · 旅行 / 摄影 · 音乐', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
]

const stats = [
  {
    id: 'frontend',
    label: '前端开发',
    lines: ['Html / Css / Vue / React / TypeScript / 工程化', '深入框架原理与工程实践'],
    color: '#8b6aae',
    bg: 'rgba(139, 106, 174, 0.12)',
  },
  {
    id: 'backend',
    label: '后端开发',
    lines: ['Python / NodeJS / FastAPI / Koa / NextJS / MySQL / Redis', '探索服务架构与全栈开发'],
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.12)',
  },
  {
    id: 'agent',
    label: 'Agent 应用开发',
    lines: ['LLM / Function Call / Skill / MCP / RAG / Langchain', '智能体落地实践'],
    color: '#8b6aae',
    bg: 'rgba(139, 106, 174, 0.12)',
  },
  {
    id: 'learn',
    label: '持续学习',
    lines: ['技术笔记沉淀', '记录实践与思考', '不断探索与成长'],
    color: '#8b6aae',
    bg: 'rgba(139, 106, 174, 0.12)',
  },
]
</script>

<style scoped>
.home-page {
  max-width: 1152px;
  margin: 0 auto;
  padding: 36px 24px 16px;
  font-family: var(--vp-font-family-base);
  flex: 1;
  width: 100%;
  box-sizing: border-box;
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 20px;
}

.home-page :is(h1, h2, h3, p, a, span) {
  font-family: inherit;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
  gap: 40px;
  align-items: center;
  flex: 0 1 auto;
  min-height: 0;
}

.greeting {
  margin: 0 0 16px;
  font-size: 54px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: var(--vp-c-text-1);
}

.greeting span {
  color: var(--vp-c-brand);
}

.headline {
  margin: 0 0 16px;
  font-size: 32px;
  line-height: 1.4;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.bio {
  margin: 0 0 28px;
  max-width: 600px;
  font-size: 19px;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 28px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 22px;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.btn svg {
  width: 18px;
  height: 18px;
}

.btn-primary {
  color: #fff;
  background: linear-gradient(135deg, #c48edf 0%, #8b6aae 50%, #6e4d91 100%);
  box-shadow: 0 8px 20px rgba(139, 106, 174, 0.28);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(139, 106, 174, 0.36);
}

.btn-secondary {
  color: var(--vp-c-brand);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-brand);
}

.btn-secondary:hover {
  transform: translateY(-2px);
  background: var(--vp-c-brand-soft);
}

.socials {
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
}

.social {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--vp-c-text-2);
  font-size: 16px;
  text-decoration: none;
}

.social:hover {
  color: var(--vp-c-brand);
}

.social.disabled {
  opacity: 0.38;
  cursor: not-allowed;
  user-select: none;
  pointer-events: none;
}

.social.disabled:hover {
  color: var(--vp-c-text-2);
}

.copy-toast {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 8px);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 999px;
  background: #c48edf;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  box-shadow: 0 8px 18px rgba(139, 106, 174, 0.28);
  transform: translateX(-50%);
  animation: toast-in 0.16s ease-out;
  pointer-events: none;
}

.copy-toast svg {
  width: 12px;
  height: 12px;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.social-icon {
  display: inline-flex;
  width: 18px;
  height: 18px;
}

.social-icon svg {
  width: 18px;
  height: 18px;
}

.social-icon.GitHub {
  color: #6b7280;
}

.portrait {
  position: relative;
  min-height: min(540px, calc(100vh - var(--vp-nav-height) - 260px));
}

.orbit-system {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.orbit {
  position: absolute;
  inset: 50% auto auto 50%;
  width: 332px;
  height: 332px;
  border: 1.5px dashed rgba(139, 106, 174, 0.42);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.orbit-track {
  position: absolute;
  inset: 50% auto auto 50%;
  width: 0;
  height: 0;
  animation: orbit-spin 90s linear infinite;
}

.celestial {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(var(--d)) translateY(-166px) rotate(calc(var(--d) * -1));
}

.celestial svg {
  display: block;
  filter: drop-shadow(0 2px 6px rgba(139, 106, 174, 0.35));
}

.planet-mini {
  width: 14px;
  height: 14px;
  margin: -7px 0 0 -7px;
}

.planet-mini svg {
  width: 14px;
  height: 14px;
}

.moon {
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
}

.moon svg {
  width: 16px;
  height: 16px;
}

.star {
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  animation: twinkle 2.8s ease-in-out infinite;
}

.star svg {
  width: 16px;
  height: 16px;
}

.star-lg {
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
}

.star-lg svg {
  width: 20px;
  height: 20px;
}

.star-sm {
  width: 10px;
  height: 10px;
  margin: -5px 0 0 -5px;
  animation-delay: 0.8s;
}

.star-sm svg {
  width: 10px;
  height: 10px;
}

.dot {
  width: 6px;
  height: 6px;
  margin: -3px 0 0 -3px;
  border-radius: 50%;
  background: #8b6aae;
  box-shadow: 0 0 8px rgba(139, 106, 174, 0.7);
}

.avatar-glow {
  position: absolute;
  inset: 50% auto auto 50%;
  width: 340px;
  height: 340px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(196, 142, 223, 0.45), transparent 70%);
  filter: blur(8px);
}

.avatar {
  position: absolute;
  inset: 50% auto auto 50%;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  overflow: hidden;
  transform: translate(-50%, -50%);
  border: 4px solid #fff;
  box-shadow: 0 0 0 4px rgba(139, 106, 174, 0.35), 0 16px 40px rgba(139, 106, 174, 0.22);
  background: linear-gradient(135deg, #edc8fa, #a98bc5);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.orbit-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 210px;
  max-width: 250px;
  padding: 10px 14px 10px 10px;
  border-radius: 16px;
  background: var(--vp-c-bg);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  animation: float 4.5s ease-in-out infinite;
}

.orbit-card.school { top: 18%; left: -28px; }
.orbit-card.location { top: 24%; right: -24px; animation-delay: 0.6s; }
.orbit-card.major { top: 66%; left: -44px; animation-delay: 1.1s; }
.orbit-card.interest { top: 68%; right: -44px; animation-delay: 1.7s; }

.orbit-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.orbit-icon svg {
  width: 18px;
  height: 18px;
}

.orbit-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.orbit-desc {
  margin: 2px 0 0;
  font-size: 15px;
  line-height: 1.45;
  color: var(--vp-c-text-2);
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 8px;
  flex-shrink: 0;
}

.stat-card {
  padding: 28px 22px;
  border-radius: 18px;
  background: var(--vp-c-bg);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(139, 106, 174, 0.14);
}

.stat-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.stat-icon svg {
  width: 18px;
  height: 18px;
}

.stat-label {
  font-size: 17px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.stat-desc {
  margin: 10px 0 0;
  font-size: 15px;
  line-height: 1.55;
  color: var(--vp-c-text-2);
}

.stat-desc + .stat-desc {
  margin-top: 4px;
}

:global(html.dark) .orbit-card {
  background: var(--vp-c-bg-mute);
  border: 1px solid rgba(196, 142, 223, 0.28);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
}

:global(html.dark) .stat-card {
  background: var(--vp-c-bg-soft);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.28);
}

:global(.dark) .orbit {
  border-color: rgba(196, 142, 223, 0.28);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

@keyframes orbit-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.45; transform: rotate(var(--d)) translateY(-166px) rotate(calc(var(--d) * -1)) scale(0.85); }
  50% { opacity: 1; transform: rotate(var(--d)) translateY(-166px) rotate(calc(var(--d) * -1)) scale(1.15); }
}

@media (prefers-reduced-motion: reduce) {
  .orbit-track,
  .star {
    animation: none;
  }
}

@media (max-width: 960px) {
  .home-page {
    min-height: auto;
    justify-content: flex-start;
  }

  .hero {
    grid-template-columns: 1fr;
    flex: none;
  }

  .portrait {
    min-height: 420px;
    max-width: 520px;
    margin: 0 auto;
  }

  .greeting {
    font-size: 42px;
  }

  .headline {
    font-size: 24px;
  }

  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .home-page {
    padding: 24px 16px 56px;
  }

  .orbit-card {
    min-width: 0;
    max-width: 46%;
    padding: 8px 10px;
  }

  .orbit-card.school,
  .orbit-card.major { left: 0; }

  .orbit-card.location,
  .orbit-card.interest { right: 0; }

  .orbit-desc {
    font-size: 14px;
  }

  .stats {
    grid-template-columns: 1fr;
  }
}
</style>
