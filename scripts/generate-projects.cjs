const fs = require('fs');
const path = require('path');

// https://api.github.com/users/angel200109/repos?per_page=1000

// ==================== 配置 ====================
const CONFIG = {
    inputFile: path.join(__dirname, '../docs/FeHelper-20260219100156.json'),
    outputFile: path.join(__dirname, '../docs/.vitepress/projects.ts'),
    minStarsForFeatured: 20,
    maxTagsPerProject: 3,
};

// ==================== 日志工具 ====================
const logger = {
    info: (msg) => console.log(`ℹ️  ${msg}`),
    success: (msg) => console.log(`✅ ${msg}`),
    warn: (msg) => console.warn(`⚠️  ${msg}`),
    error: (msg) => console.error(`❌ ${msg}`),
};

// ==================== 读取并验证 JSON 文件 ====================
function loadProjectsData() {
    try {
        if (!fs.existsSync(CONFIG.inputFile)) {
            throw new Error(`输入文件不存在: ${CONFIG.inputFile}`);
        }

        logger.info(`正在读取项目数据...`);
        const rawData = fs.readFileSync(CONFIG.inputFile, 'utf8');
        const projects = JSON.parse(rawData);

        if (!Array.isArray(projects)) {
            throw new Error('JSON 数据格式错误：期望是数组');
        }

        logger.success(`成功读取 ${projects.length} 个项目`);
        return projects;
    } catch (error) {
        logger.error(`读取项目数据失败: ${error.message}`);
        process.exit(1);
    }
}

// ==================== 提取并清理项目数据 ====================
function extractProjectData(rawProjects) {
    return rawProjects.map(project => {
        try {
            return {
                name: project.name || 'unknown',
                description: project.description || '',
                stars: project.stargazers_count || 0,
                language: project.language || null,
                homepage: project.homepage || null,
                topics: Array.isArray(project.topics) ? project.topics : [],
            };
        } catch (error) {
            logger.warn(`处理项目数据时出错: ${project.name || 'unknown'}`);
            return null;
        }
    }).filter(Boolean);
}

// ==================== 主流程 ====================
const rawProjects = loadProjectsData();
const projects = extractProjectData(rawProjects);

projects.sort((a, b) => b.stars - a.stars);
logger.info(`项目按 stars 排序完成`);

// ==================== 图标映射 ====================
const iconMap = {
    'BOSScript': '🤖', 'blog': '📝', 'awesome-native': '💎',
    'js-challenges': '💪', 'mini-anything': '🚀', 'tiny-anything': '📦',
    'tiny-vite': '⚡', 'tiny-react': '🌱', 'tiny-vue': '💚',
    'tiny-webpack': '📦', 'mini-webpack': '📦', 'mini-vite': '📦',
    'tiny-complier': '⚡', 'browser-core': '🌍', 'draw-wasm': '🎯',
    'chat-rs': '💬', 'abtest-kit': '🧪', 'async-processor': '⚙️',
    'browser-storage-lru-cleaner': '🗄️', 'esfinder': '🔎', 'cli': '⌨️',
    'chart': '📊', 'text-image': '🖼️', 'node': '📗', 'electron': '⚡',
    'AI': '🧠', 'interview': '📚', 'typescript': '📘', 'react': '⚛️',
    'vue': '💚', 'javascript': '📙', 'html-css': '🎨', 'rc-design': '🎨',
    'shooks': '🪝', 'treejs': '🌳', 'jsx-compilation': '🔄',
    'code-formatter-plugin': '✨', 'dev-server-proxy': '🌐',
    'commit-genius-js': '💡', 'vsc-delete-func': '🔧',
    '30-seconds-of-rs': '📝', 'lodash-ts': '🔨', 'network-speed-js': '📡',
    'go-enjoy': '📚', 'koa': '🎯', 'express': '🚂', 'tauri': '🦀',
    'vue-admin': '🎛️', 'react-native-demo': '📱', 'mini-react-router': '🛣️',
    'mini-redux': '🔄', 'mini-pinia': '🍍', 'mini-vue-router': '🗺️',
    'mini-vuex': '📦', 'bundle-go': '🐹', 'create-rolldown': '🎨',
    'robuild': '🔧', 'esbuild-core-plugins': '🔌', 'babel-core-plugins': '🔌',
    'oxc-plugins': '🦀', 'doc-render-sdk': '📄', 'gono': '🔧',
};

// 默认图标池（用于没有自定义图标的项目）
const defaultIcons = [
    '📦', '🎁', '🎨', '🔧', '⚙️', '🛠️', '🔨', '⚡', '🚀', '✨',
    '💎', '🎯', '🎪', '🎭', '🎬', '🎮', '🎲', '🧩', '🔮', '💫',
    '🌟', '⭐', '🌈', '🔥', '💥', '🎉', '🎊', '🏆', '🥇', '🎖️',
];

// 根据项目名称生成一致的随机图标
function getProjectIcon(projectName) {
    if (iconMap[projectName]) {
        return iconMap[projectName];
    }

    // 使用项目名称的哈希值来确保同一个项目总是得到相同的图标
    let hash = 0;
    for (let i = 0; i < projectName.length; i++) {
        hash = ((hash << 5) - hash) + projectName.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
    }

    const index = Math.abs(hash) % defaultIcons.length;
    return defaultIcons[index];
}

// ==================== 项目分类逻辑 ====================
function categorizeProject(project) {
    try {
        const { language, topics, name, stars } = project;
        const topicsLower = topics.map(t => t.toLowerCase());
        const nameLower = name.toLowerCase();

        if (stars >= CONFIG.minStarsForFeatured) return 'hot';
        if (nameLower.includes('vite') || nameLower.includes('webpack') ||
            nameLower.includes('bundle') || nameLower.includes('esbuild') ||
            nameLower.includes('rolldown') || nameLower.includes('robuild')) return 'build';
        if ((language === 'TypeScript' || language === 'JavaScript') &&
            (nameLower.includes('react') || topicsLower.includes('react') ||
                topicsLower.includes('hooks') || nameLower.includes('shooks') ||
                nameLower.includes('rc-'))) return 'react';
        if (language === 'Vue' || nameLower.includes('vue') ||
            topicsLower.includes('vue') || nameLower.includes('pinia')) return 'vue';
        if (nameLower.includes('compiler') || nameLower.includes('complier') ||
            nameLower.includes('babel') || nameLower.includes('jsx') ||
            nameLower.includes('oxc') || topicsLower.includes('compiler') ||
            nameLower.includes('formatter')) return 'compiler';
        if (topicsLower.includes('sdk') || topicsLower.includes('library') ||
            nameLower.includes('kit') || nameLower.includes('processor') ||
            nameLower.includes('lodash') || topicsLower.includes('utils') ||
            nameLower.includes('storage') || nameLower.includes('network-speed')) return 'utils';
        if (nameLower.includes('chart') || nameLower.includes('draw') ||
            nameLower.includes('canvas') || nameLower.includes('browser-core') ||
            topicsLower.includes('visualization') || nameLower.includes('text-image')) return 'visual';
        if (nameLower.includes('cli') || nameLower.includes('finder') ||
            nameLower.includes('proxy') || nameLower.includes('commit') ||
            nameLower.includes('vsc-') || topicsLower.includes('cli')) return 'devtools';
        if (language === 'Rust' && !nameLower.includes('tauri')) return 'rust';
        if (name === 'node' || name === 'koa' || name === 'express' ||
            (language === 'Go' && name !== 'bundle-go')) return 'backend';
        if (nameLower.includes('electron') || nameLower.includes('tauri')) return 'desktop';
        if (name === 'AI' || topicsLower.includes('ai') || topicsLower.includes('machine-learning')) return 'ai';
        return 'other';
    } catch (error) {
        logger.warn(`分类项目时出错: ${project.name}`);
        return 'other';
    }
}

// ==================== 分类项目 ====================
const categories = {
    hot: [], build: [], react: [], vue: [], utils: [], compiler: [],
    visual: [], devtools: [], rust: [], backend: [], desktop: [], ai: [], other: []
};

logger.info('开始分类项目...');
projects.forEach(project => {
    try {
        const category = categorizeProject(project);
        categories[category].push(project);
    } catch (error) {
        categories.other.push(project);
    }
});

// ==================== 生成代码 ====================
function generateProject(project) {
    try {
        const icon = getProjectIcon(project.name);
        const description = (project.description || project.name)
            .replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"')
            .replace(/\n/g, ' ').replace(/\r/g, '').trim();
        const homepage = project.homepage && project.homepage !== '' && project.homepage !== null ? project.homepage : null;
        const tags = project.topics.slice(0, CONFIG.maxTagsPerProject).map(t => t.charAt(0).toUpperCase() + t.slice(1));
        const featured = project.stars >= CONFIG.minStarsForFeatured;

        return `            {
                name: '${project.name}',
                repo: 'angel200109/${project.name}',
                description: '${description}',
                icon: '${icon}',${homepage ? `\n                homepage: '${homepage}',` : ''}
                stars: ${project.stars},${tags.length > 0 ? `\n                tags: [${tags.map(t => `'${t}'`).join(', ')}],` : ''}${featured ? `\n                featured: true,` : ''}
            }`;
    } catch (error) {
        return `            { name: '${project.name}', repo: 'angel200109/${project.name}', description: '${project.name}', icon: '📦', stars: ${project.stars || 0} }`;
    }
}

function generateCategory(title, icon, projects) {
    if (projects.length === 0) return '';
    try {
        return `    {\n        title: '${title}',\n        icon: '${icon}',\n        projects: [\n${projects.map(p => generateProject(p)).join(',\n')}\n        ],\n    }`;
    } catch (error) {
        return '';
    }
}

// ==================== 生成最终输出 ====================
logger.info('生成 TypeScript 代码...');
const output = `export interface Project {
    name: string
    repo: string
    description: string
    icon?: string
    homepage?: string
    tags?: string[]
    stars?: number
    featured?: boolean
}

export interface ProjectCategory {
    title: string
    icon: string
    projects: Project[]
}

export const projectCategories: ProjectCategory[] = [
${[
        generateCategory('🔥 热门项目', '⭐', categories.hot),
        generateCategory('构建工具 & 工程化', '🛠️', categories.build),
        generateCategory('React 生态', '⚛️', categories.react),
        generateCategory('Vue 生态', '🌲', categories.vue),
        generateCategory('工具库 & SDK', '📦', categories.utils),
        generateCategory('编译器 & 转换工具', '🔨', categories.compiler),
        generateCategory('可视化 & 图形', '🎨', categories.visual),
        generateCategory('开发工具', '🔍', categories.devtools),
        generateCategory('Rust 项目', '🦀', categories.rust),
        generateCategory('Node.js & 后端', '🟢', categories.backend),
        generateCategory('桌面应用 & 扩展', '💻', categories.desktop),
        generateCategory('AI & 机器学习', '🤖', categories.ai),
        generateCategory('其他项目', '🎮', categories.other),
    ].filter(c => c !== '').join(',\n')}
]
`;

// ==================== 写入文件 ====================
try {
    const outputDir = path.dirname(CONFIG.outputFile);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(CONFIG.outputFile, output, 'utf8');
    logger.success(`projects.ts 生成成功！`);
} catch (error) {
    logger.error(`写入文件失败: ${error.message}`);
    process.exit(1);
}

// ==================== 输出统计信息 ====================
console.log('\n📊 项目统计:');
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`📦 总项目数: ${projects.length}`);
console.log(`🔥 热门项目: ${categories.hot.length}`);
console.log(`🛠️  构建工具: ${categories.build.length}`);
console.log(`⚛️  React: ${categories.react.length}`);
console.log(`🌲 Vue: ${categories.vue.length}`);
console.log(`📦 工具库: ${categories.utils.length}`);
console.log(`🔨 编译器: ${categories.compiler.length}`);
console.log(`🎨 可视化: ${categories.visual.length}`);
console.log(`🔍 开发工具: ${categories.devtools.length}`);
console.log(`🦀 Rust: ${categories.rust.length}`);
console.log(`🟢 后端: ${categories.backend.length}`);
console.log(`💻 桌面应用: ${categories.desktop.length}`);
console.log(`🤖 AI: ${categories.ai.length}`);
console.log(`🎮 其他: ${categories.other.length}`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
logger.success('✨ 所有任务完成！');
