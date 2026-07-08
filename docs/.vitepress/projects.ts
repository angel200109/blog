export interface Project {
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
    {
        title: '🔥 热门项目',
        icon: '⭐',
        projects: [
            {
                name: 'js-challenges',
                repo: 'angel200109/js-challenges',
                description: '✨✨✨ Challenge your JavaScript programming limits step by step 前端手写题，一步步提升 JavaScript 编程水平',
                icon: '💪',
                homepage: 'https://deepwiki.com/angel200109/js-challenges',
                stars: 2318,
                tags: ['Html-css-javascript', 'Javascript', 'Nodejs'],
                featured: true,
            },
            {
                name: 'tiny-anything',
                repo: 'angel200109/tiny-anything',
                description: '🚀 Explore the source code of the front-end library and implement a super mini version 前端轮子库，包含框架及其周边生态、工具链、插件迷你源码实现',
                icon: '📦',
                homepage: 'https://deepwiki.com/angel200109/tiny-anything',
                stars: 125,
                tags: ['Esbuild', 'Hooks', 'Pinia'],
                featured: true,
            },
            {
                name: 'BOSScript',
                repo: 'angel200109/BOSScript',
                description: 'boss直聘一键批量投递，一条龙服务的油猴脚本',
                icon: '🤖',
                stars: 85,
                tags: ['Boss', 'Resume', 'Script'],
                featured: true,
            },
            {
                name: 'blog',
                repo: 'angel200109/blog',
                description: '✨✨✨ 前端历险记',
                icon: '📝',
                homepage: 'https://angel200109.github.io/blog/',
                stars: 44,
                featured: true,
            },
            {
                name: 'awesome-native',
                repo: 'angel200109/awesome-native',
                description: '🔧 Collection of native JavaScript projects',
                icon: '💎',
                stars: 33,
                tags: ['Css3', 'Html', 'Javascript'],
                featured: true,
            }
        ],
    },
    {
        title: '构建工具 & 工程化',
        icon: '🛠️',
        projects: [
            {
                name: 'tiny-vite',
                repo: 'angel200109/tiny-vite',
                description: '⚡️ a lightweight frontend build tool designed to deliver swift development experiences and efficient build processes。支持双引擎架构，esbuild 预构建，ModuleGraph，HMR，插件架构，单文件编译，代码压缩',
                icon: '⚡',
                homepage: 'https://deepwiki.com/angel200109/tiny-vite',
                stars: 14,
                tags: ['Bundle', 'Esbuild', 'Esbuild-plugin'],
            },
            {
                name: 'create-rolldown',
                repo: 'angel200109/create-rolldown',
                description: '⚡️ Scaffolding tool for Rolldown library projects - a fast JavaScript bundler written in Rust.',
                icon: '🎨',
                homepage: 'https://rolldown.rs/',
                stars: 6,
                tags: ['Bundler', 'Cli', 'Create-rolldown'],
            },
            {
                name: 'bundler-labs',
                repo: 'angel200109/bundler-labs',
                description: 'bundler labs',
                icon: '🎮',
                homepage: 'https://juejin.cn/user/2551305355400797/columns',
                stars: 5,
                tags: ['Babel', 'Bundler', 'Esbuild'],
            },
            {
                name: 'vite-plugin-oxc',
                repo: 'angel200109/vite-plugin-oxc',
                description: 'Oxc integration for vite.',
                icon: '💫',
                stars: 5,
                tags: ['Oxc', 'Oxc-transform', 'Plugin'],
            },
            {
                name: 'vite-plugin-react-devtools',
                repo: 'angel200109/vite-plugin-react-devtools',
                description: 'vite-plugin-react-devtools',
                icon: '🎮',
                stars: 5,
            },
            {
                name: 'webassembly-bundler',
                repo: 'angel200109/webassembly-bundler',
                description: 'Rust WebAssembly 集成构建工具',
                icon: '✨',
                stars: 5,
                tags: ['Rollup', 'Rspack', 'Rust'],
            },
            {
                name: 'robuild',
                repo: 'angel200109/robuild',
                description: '⚡️ Zero-config ESM/TS package builder. Powered by Oxc, Rolldown and rolldown-plugin-dts. 零配置 ESM/TS 包构建器 基于 Oxc、Rolldown 和 rolldown-plugin-dts 构建，专注于 ESM 兼容性和极速构建',
                icon: '🔧',
                homepage: 'https://angel200109.github.io/robuild/',
                stars: 4,
                tags: ['Bundler', 'Esbuild', 'Lib'],
            },
            {
                name: 'tiny-webpack',
                repo: 'angel200109/tiny-webpack',
                description: '✨ A JavaScript bundler with Webpack-like features, supporting modern frontend workflows.',
                icon: '📦',
                stars: 3,
                tags: ['Code', 'Codesplitting', 'Dynamic-import'],
            },
            {
                name: 'vite-plugin-ai-doctor',
                repo: 'angel200109/vite-plugin-ai-doctor',
                description: '🤖 AI-powered error diagnosis plugin for Vite builds | AI 驱动的 Vite 构建错误诊断插件',
                icon: '🔧',
                stars: 3,
                tags: ['Ai', 'Ai-doctor', 'Devtools'],
            }
        ],
    },
    {
        title: 'React 生态',
        icon: '⚛️',
        projects: [
            {
                name: 'abtest-kit',
                repo: 'angel200109/abtest-kit',
                description: '🔧 轻量级 A/B 测试 SDK，支持多种分流策略和可选的 React 集成。基于 robuild 构建，仅 2.2 kb。',
                icon: '🧪',
                homepage: 'https://angel200109.github.io/abtest-kit/',
                stars: 8,
                tags: ['Abtest', 'Abtest-framework', 'Abtest-sdk'],
            },
            {
                name: 'tiny-react',
                repo: 'angel200109/tiny-react',
                description: '🌱 The closest implementation to the React source code',
                icon: '🌱',
                stars: 8,
                tags: ['Framework', 'React'],
            },
            {
                name: 'rc-design',
                repo: 'angel200109/rc-design',
                description: '🗃️ rc-design is a component library developed for react, providing developers with a more lightweight and concise component library choice. Use tsx to write logic, less to write styles, dumi2 to write documentation sites, and jest+ts-jest+react-testing-library for unit testing.',
                icon: '🎨',
                homepage: 'https://angel200109.github.io/rc-design/',
                stars: 7,
                tags: ['Design-systems', 'React-components', 'Reactjs'],
            },
            {
                name: 'network-speed-js',
                repo: 'angel200109/network-speed-js',
                description: 'A small tool for testing network speed. It also has the ability to test internal and external networks.',
                icon: '📡',
                homepage: 'https://angel200109.github.io/network-speed-js/',
                stars: 4,
                tags: ['Bandwidth', 'Framework-agnostic', 'Javascript'],
            },
            {
                name: 'eslint-plugin-react-boundary',
                repo: 'angel200109/eslint-plugin-react-boundary',
                description: 'ESLint plugin to ensure React components are wrapped with Boundary',
                icon: '🔮',
                homepage: 'https://www.npmjs.com/package/eslint-plugin-react-boundary',
                stars: 3,
                tags: ['Boundary', 'Error-boundary', 'Eslint'],
            },
            {
                name: 'eslint-plugin-react-pure-export',
                repo: 'angel200109/eslint-plugin-react-pure-export',
                description: 'An ESLint plugin to enforce separation between React components and pure logic modules, improving React Fast Refresh stability and code organization.',
                icon: '🔥',
                stars: 3,
                tags: ['Eslint', 'Eslint-plugin', 'Eslint-rules'],
            }
        ],
    },
    {
        title: 'Vue 生态',
        icon: '🌲',
        projects: [
            {
                name: 'tiny-vue',
                repo: 'angel200109/tiny-vue',
                description: 'Vue 3 设计哲学与源码揭秘',
                icon: '💚',
                homepage: 'https://juejin.cn/column/7391745629876830208',
                stars: 10,
                tags: ['Components', 'Tutorial-code', 'Vuejs'],
            },
            {
                name: 'angel200109.github.io',
                repo: 'angel200109/angel200109.github.io',
                description: 'angel200109.github.io',
                icon: '💥',
                stars: 0,
            }
        ],
    },
    {
        title: '工具库 & SDK',
        icon: '📦',
        projects: [
            {
                name: 'browser-storage-lru-cleaner',
                repo: 'angel200109/browser-storage-lru-cleaner',
                description: '🧹 A browser storage auto-cleanup SDK utilizing the LRU, supporting both localStorage and IndexedDB, implemented via the Proxy pattern for business logic-agnostic automatic storage eviction  一个基于LRU算法的浏览器存储自动清理SDK，支持localStorage和IndexedDB，通过代理模式实现业务无感知的自动清理。',
                icon: '🗄️',
                homepage: 'https://angel200109.github.io/browser-storage-lru-cleaner/',
                stars: 5,
                tags: ['Browser', 'Cache', 'Cleanup'],
            },
            {
                name: 'outilx',
                repo: 'angel200109/outilx',
                description: 'A modern, modular utility library collection for JavaScript/TypeScript',
                icon: '🎖️',
                homepage: 'https://angel200109.github.io/outilx/',
                stars: 4,
                tags: ['Oxc', 'React-hooks', 'Rolldown'],
            },
            {
                name: 'text-processor',
                repo: 'angel200109/text-processor',
                description: 'Rust-based text processor provides flexible and efficient processing and conversion of text',
                icon: '🎬',
                stars: 3,
                tags: ['Processor', 'Rust', 'Text'],
            },
            {
                name: 'doc-render-sdk',
                repo: 'angel200109/doc-render-sdk',
                description: '📝 基于 Vite + robuild + React 的组件文档站点的 SDK',
                icon: '📄',
                homepage: 'https://angel200109.github.io/doc-render-sdk/',
                stars: 0,
                tags: ['Doc-render', 'Docs', 'Docs-as-code'],
            }
        ],
    },
    {
        title: '编译器 & 转换工具',
        icon: '🔨',
        projects: [
            {
                name: 'tiny-compiler',
                repo: 'angel200109/tiny-compiler',
                description: '实现超级 mini 的编译器 | codegen&compiler 生成代码 | 只需要 200 行代码 | 前端编译原理',
                icon: '🔨',
                homepage: 'https://deepwiki.com/angel200109/tiny-compiler',
                stars: 10,
                tags: ['Ast', 'Codegen', 'Compiler'],
            },
            {
                name: 'jsx-compilation',
                repo: 'angel200109/jsx-compilation',
                description: '🍻 实现 JSX 语法转成 JS 语法的编译器',
                icon: '🔄',
                homepage: 'https://angel200109.github.io/jsx-compilation',
                stars: 6,
                tags: ['Ast', 'Code', 'Generation'],
            },
            {
                name: 'oxc-loader',
                repo: 'angel200109/oxc-loader',
                description: 'webpack/Rspack loader for Oxc',
                icon: '💥',
                homepage: 'https://deepwiki.com/angel200109/oxc-loader',
                stars: 6,
                tags: ['Bundler', 'Loader', 'Loaders'],
            }
        ],
    },
    {
        title: '可视化 & 图形',
        icon: '🎨',
        projects: [
            {
                name: 'browser-core',
                repo: 'angel200109/browser-core',
                description: '实现最简浏览器渲染模型',
                icon: '🌍',
                stars: 13,
                tags: ['Browser', 'Cpu', 'Effects'],
            },
            {
                name: 'draw-wasm',
                repo: 'angel200109/draw-wasm',
                description: '用Wasm实现一个画板',
                icon: '🎯',
                homepage: 'https://rustify-org.github.io/draw-wasm/',
                stars: 7,
                tags: ['Canvas', 'Rust', 'Wasm'],
            },
            {
                name: 'text-image',
                repo: 'angel200109/text-image',
                description: '🐛🐛🐛 Text image can \"textify\" text, images, and videos, and can be used with simple configuration 它可以将文字、图片、视频进行「文本化」 只需要通过简单的配置即可使用',
                icon: '🖼️',
                homepage: 'https://angel200109.github.io/text-image/',
                stars: 4,
                tags: ['Ai', 'Code-formatter', 'Detector'],
            }
        ],
    },
    {
        title: '开发工具',
        icon: '🔍',
        projects: [
            {
                name: 'dev-server-proxy',
                repo: 'angel200109/dev-server-proxy',
                description: 'A dynamic proxy middleware for webpack-dev-server that enables hot-swapping proxy configurations and mock data without restarting your dev server. | 为 webpack-dev-server 设计的动态代理中间件，支持无需重启服务即可热更新代理配置和 mock 数据。',
                icon: '🌐',
                homepage: 'https://deepwiki.com/angel200109/dev-server-proxy',
                stars: 17,
                tags: ['Dev', 'Dev-server', 'Mockup'],
            },
            {
                name: 'cli',
                repo: 'angel200109/cli',
                description: 'cli',
                icon: '⌨️',
                homepage: 'https://juejin.cn/post/7363607004348989479',
                stars: 4,
                tags: ['Cli', 'Core'],
            },
            {
                name: 'esfinder',
                repo: 'angel200109/esfinder',
                description: 'esfinder 是一个基于Babel、SWC、Oxc 的用于分析和解析 JavaScript 和 TypeScript 项目中文件的导入及其相关依赖的工具。它能够高效地追踪与导入路径相关的文件，支持静态和动态导入。',
                icon: '🔎',
                stars: 3,
                tags: ['Babel', 'Export', 'Exporter'],
            },
            {
                name: 'startar',
                repo: 'angel200109/startar',
                description: '一个用于快速拉取 TypeScript 项目模板的交互式脚手架。通过 startar 你可以在几分钟内选择合适的模板、填写项目信息、初始化 Git 仓库并安装依赖，全流程自动化完成。',
                icon: '⭐',
                stars: 3,
                tags: ['Cli', 'Lib', 'Nodejs'],
            }
        ],
    },
    {
        title: 'Rust 项目',
        icon: '🦀',
        projects: [
            {
                name: 'mini-rspack',
                repo: 'angel200109/mini-rspack',
                description: '🚀 A simplified webpack bundler using Rust. High-performance JavaScript bundling with Rust and Node.js  一个基于Rust的简化版Webpack打包器。采用Rust实现高性能JavaScript Bundler',
                icon: '🔮',
                homepage: 'https://angel200109.github.io/mini-rspack/',
                stars: 8,
                tags: ['Bundler', 'High-performance', 'Javascript'],
            },
            {
                name: 'v8-rs',
                repo: 'angel200109/v8-rs',
                description: '⚡️ V8-RS 是一个基于 Rust 实现的最小可行版本 JavaScript 引擎，采用 JIT（Just-In-Time）编译技术。该引擎结合了解释执行和编译执行的优势，通过 Ignition 风格的字节码解释器快速启动，并通过 TurboFan 风格的优化编译器提升热点代码的执行性能。',
                icon: '🥇',
                stars: 7,
            },
            {
                name: 'rsdown',
                repo: 'angel200109/rsdown',
                description: '🦀 一个高性能的 JavaScript/TypeScript 代码转换器，基于 Rust 和 SWC',
                icon: '⚡',
                homepage: 'https://angel200109.github.io/rsdown/',
                stars: 6,
                tags: ['Bundler', 'Napi-rs', 'Rust'],
            },
            {
                name: 'chat-rs',
                repo: 'angel200109/chat-rs',
                description: 'Rust构建简易实时聊天系统',
                icon: '💬',
                stars: 5,
            },
            {
                name: 'es-module-lexer-rs',
                repo: 'angel200109/es-module-lexer-rs',
                description: '🦀 A Rust implementation of es-module-lexer with Node.js bindings via napi-rs.',
                icon: '🥇',
                stars: 5,
                tags: ['Ast', 'Es-module', 'Es-module-lexer'],
            },
            {
                name: '30-seconds-of-rs',
                repo: 'angel200109/30-seconds-of-rs',
                description: '30 seconds to collect useful rust snippet.',
                icon: '📝',
                stars: 2,
            }
        ],
    },
    {
        title: 'Node.js & 后端',
        icon: '🟢',
        projects: [
            {
                name: 'golang',
                repo: 'angel200109/golang',
                description: '📦️ js packager by golang',
                icon: '🎬',
                stars: 2,
            }
        ],
    },
    {
        title: '桌面应用 & 扩展',
        icon: '💻',
        projects: [
            {
                name: 'electron',
                repo: 'angel200109/electron',
                description: '《Electron桌面客户端应用程序开发入门到原理》专栏',
                icon: '⚡',
                homepage: 'https://juejin.cn/column/7400672360453259264',
                stars: 8,
                tags: ['Electron', 'Juejin'],
            }
        ],
    },
    {
        title: 'AI & 机器学习',
        icon: '🤖',
        projects: [
            {
                name: 'AI',
                repo: 'angel200109/AI',
                description: 'AI',
                icon: '🧠',
                stars: 2,
            }
        ],
    },
    {
        title: '其他项目',
        icon: '🎮',
        projects: [
            {
                name: 'angel200109',
                repo: 'angel200109/angel200109',
                description: 'angel200109',
                icon: '🎖️',
                stars: 18,
            },
            {
                name: 'lite-tracker',
                repo: 'angel200109/lite-tracker',
                description: '🍻 前端服务监控原理与手写开源监控框架SDK',
                icon: '🔧',
                homepage: 'https://juejin.cn/spost/7374265502669160482',
                stars: 17,
                tags: ['Monitor', 'Tracker', 'Web'],
            },
            {
                name: 'ureq',
                repo: 'angel200109/ureq',
                description: 'A modern, modular, and extensible HTTP request library | 模块化、可扩展的现代 HTTP 请求库',
                icon: '🎉',
                homepage: 'https://angel200109.github.io/ureq/',
                stars: 8,
                tags: ['Fetch', 'Http', 'Http-client'],
            },
            {
                name: 'webcontainer-ide',
                repo: 'angel200109/webcontainer-ide',
                description: 'WebContainer IDE is a production-ready, browser-based development environment that brings the full power of Node.js to your browser. Built on StackBlitz\'s WebContainer technology, it enables developers to code, build, and preview applications without any server infrastructure.',
                icon: '🎪',
                homepage: 'https://webcontainer-ide.vercel.app',
                stars: 8,
                tags: ['Editor', 'Ide', 'Monaco'],
            },
            {
                name: 'chunkflow',
                repo: 'angel200109/chunkflow',
                description: '🎉 A universal large file upload solution with chunked upload, resumable upload, and instant upload capabilities. | 通用的大文件上传解决方案，支持分片上传、断点续传和秒传功能',
                icon: '⚡',
                homepage: 'https://angel200109.github.io/chunkflow/',
                stars: 5,
                tags: ['Chunk', 'Fiber', 'File'],
            },
            {
                name: 'nodemon-rs',
                repo: 'angel200109/nodemon-rs',
                description: 'A fast implementation of nodemon in Rust. This tool automatically restarts your Node.js application when file changes are detected.',
                icon: '🎨',
                stars: 5,
                tags: ['Napi-rs', 'Node', 'Nodemon'],
            },
            {
                name: 'json-visual-diff',
                repo: 'angel200109/json-visual-diff',
                description: '一个强大且灵活的 JSON 可视化差异对比 SDK，采用可插拔的渲染器架构设计，支持实时编辑预览和多种扩展类型。',
                icon: '⭐',
                homepage: 'https://angel200109.github.io/json-visual-diff/',
                stars: 4,
                tags: ['Diff', 'Json', 'Json-diff'],
            },
            {
                name: 'streamsight',
                repo: 'angel200109/streamsight',
                description: 'StreamSight 是一个基于 rrweb 的用户行为录制与回放系统，采用 Monorepo 架构，支持高效的事件采集、压缩存储和安全回放。',
                icon: '🏆',
                homepage: 'https://deepwiki.com/angel200109/streamsight',
                stars: 4,
                tags: ['Record', 'Rrweb', 'Rust'],
            },
            {
                name: 'MicroFE',
                repo: 'angel200109/MicroFE',
                description: 'MicroFE',
                icon: '🧩',
                stars: 3,
            },
            {
                name: 'QuickNote',
                repo: 'angel200109/QuickNote',
                description: '✨ 基于 Rust 的轻量级的 macOS 菜单栏笔记应用，随时记录你的想法。',
                icon: '🏆',
                stars: 3,
                tags: ['Desktop', 'Electron', 'Macos'],
            },
            {
                name: 'rka',
                repo: 'angel200109/rka',
                description: 'A component that maintains component state and avoids repeated re-rendering.',
                icon: '🔮',
                stars: 3,
                tags: ['Cache', 'Keep-alive', 'React-keepalive'],
            },
            {
                name: 'rspack-circular-dependency-plugin',
                repo: 'angel200109/rspack-circular-dependency-plugin',
                description: 'Detect circular dependencies in modules compiled with Rspack',
                icon: '🌟',
                stars: 3,
                tags: ['Bundler', 'Circular-reference', 'Plugin'],
            },
            {
                name: 'gono',
                repo: 'angel200109/gono',
                description: '⚡️ TypeScript Execute | The easiest way to run TypeScript in Node.js with Rolldown',
                icon: '🔧',
                stars: 2,
                tags: ['Esbuild', 'Esno', 'Execute'],
            }
        ],
    }
]
