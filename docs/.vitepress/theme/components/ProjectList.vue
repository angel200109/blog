<template>
  <div class="projects-container">
    <!-- Hero Section -->
    <div class="hero-section">
      <h1 class="hero-title">开源项目集</h1>
      <p class="hero-subtitle">
        涵盖前端工程化、构建工具、编译器、组件库等领域。从源码实现到工程实践，持续探索技术边界
      </p>
    </div>

    <!-- Projects Content -->
    <div class="projects-wrapper">
      <div
        v-for="(category, index) in categories"
        :key="index"
        class="category-section"
      >
        <div class="category-header">
          <div class="category-title-wrapper">
            <span class="category-icon">{{ category.icon }}</span>
            <h2 
              :id="getCategoryId(category.title)" 
              class="category-title"
            >
              {{ category.title }}
            </h2>
          </div>
          <span class="project-count">{{ category.projects.length }}</span>
        </div>
        
        <div class="projects-grid">
          <ProjectCard
            v-for="project in category.projects"
            :key="project.name"
            :project="project"
          />
        </div>
      </div>
    </div>

    <!-- Footer Section -->
    <div class="footer-section">
      <div class="footer-content">
        <h2 class="footer-title">开源协作</h2>
        <p class="footer-text">
          所有项目均采用 MIT 协议开源，欢迎 Star、Fork、提交 Issue 或 PR，一起构建更好的开源生态
        </p>
        <div class="footer-actions">
          <a href="https://github.com/angel200109" target="_blank" class="footer-btn">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            访问 GitHub
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { projectCategories } from '../../projects'
import ProjectCard from './ProjectCard.vue'

const categories = projectCategories

// 生成分类 ID（用于锚点）
function getCategoryId(title: string): string {
  return title
    .replace(/🔥|⭐|🛠️|⚛️|🌲|📦|🔨|🎨|🔍|🦀|🟢|💻|🤖|🎮/g, '') // 移除 emoji
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/&/g, 'and')
}
</script>

<style scoped>
.projects-container {
  width: 100%;
  max-width: 100vw;
  margin: 0;
  padding: 0;
  background: var(--vp-c-bg);
}

/* Hero Section - Apple Style */
.hero-section {
  padding: 120px 24px 80px;
  text-align: center;
  background: linear-gradient(180deg, 
    rgba(59, 130, 246, 0.03) 0%, 
    transparent 100%
  );
}

.hero-title {
  font-size: clamp(48px, 8vw, 80px);
  font-weight: 700;
  margin: 0 0 24px;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: clamp(18px, 2.5vw, 24px);
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.6;
  font-weight: 400;
  max-width: 800px;
  margin: 0 auto;
}

/* Projects Wrapper */
.projects-wrapper {
  max-width: 1600px;
  margin: 0 auto;
  padding: 40px 32px;
}

.category-section {
  margin-bottom: 70px;
}

.category-section:last-child {
  margin-bottom: 40px;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 0 2px;
}

.category-title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-icon {
  font-size: 28px;
  line-height: 1;
}

.category-title {
  margin: 0;
  font-size: clamp(22px, 3vw, 28px);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
  scroll-margin-top: 100px;
}

.project-count {
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  padding: 4px 10px;
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
}

/* 紧凑的自适应网格 - 标题完整显示 */
.projects-grid {
  display: grid;
  /* 使用 auto-fill 自动填充，列宽在 min 和 max 之间自适应 */
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 18px;
  align-items: start;
}

/* 响应式调整 - 优化屏效 */
@media (min-width: 1600px) {
  .projects-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
}

@media (min-width: 1200px) and (max-width: 1599px) {
  .projects-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 18px;
  }
}

@media (min-width: 768px) and (max-width: 1199px) {
  .projects-grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }
  
  .projects-wrapper {
    padding: 50px 28px;
  }
}

@media (min-width: 480px) and (max-width: 767px) {
  .projects-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
  
  .projects-wrapper {
    padding: 40px 24px;
  }
}

@media (max-width: 479px) {
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .hero-section {
    padding: 60px 20px 40px;
  }
  
  .projects-wrapper {
    padding: 30px 20px;
  }
  
  .category-section {
    margin-bottom: 50px;
  }
  
  .category-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}

/* Footer Section */
.footer-section {
  background: linear-gradient(180deg, 
    transparent 0%, 
    rgba(59, 130, 246, 0.03) 100%
  );
  padding: 80px 24px 100px;
  margin-top: 60px;
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.footer-title {
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 600;
  margin: 0 0 20px;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
}

.footer-text {
  font-size: clamp(16px, 2vw, 20px);
  color: var(--vp-c-text-2);
  margin: 0 0 40px;
  line-height: 1.6;
}

.footer-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.footer-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

.footer-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
}

.footer-btn:active {
  transform: translateY(0);
}

/* Smooth Scrolling */
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
</style>
