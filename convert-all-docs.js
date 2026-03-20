const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// HTML 模板
const getHtmlTemplate = (title, content, relativePath = '') => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | 微波室IPD文档中心</title>
    <link rel="stylesheet" href="${relativePath}assets/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
</head>
<body>
    <!-- 顶部导航 -->
    <header class="navbar">
        <div class="navbar-left">
            <a href="${relativePath}index.html" class="logo">
                <svg class="logo-icon" viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="8" fill="#FF5A36"/>
                    <path d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20" stroke="white" stroke-width="3" stroke-linecap="round"/>
                    <circle cx="20" cy="26" r="3" fill="white"/>
                </svg>
                <span class="logo-text">微波室文档中心</span>
            </a>
        </div>
        
        <div class="navbar-center">
            <div class="nav-links">
                <a href="${relativePath}index.html" class="nav-link">首页</a>
                <a href="${relativePath}guides/index.html" class="nav-link">实施指南</a>
                <a href="${relativePath}ipd/index.html" class="nav-link">IPD流程</a>
                <a href="${relativePath}templates/index.html" class="nav-link">模板</a>
                <a href="${relativePath}hr/index.html" class="nav-link">HR管理</a>
                <a href="${relativePath}handbook/index.html" class="nav-link">员工手册</a>
            </div>
        </div>
        
        <div class="navbar-right">
            <a href="https://github.com/Panicheartan/ipd-hardware-implementation" class="nav-link" target="_blank" rel="noopener">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
            </a>
        </div>
    </header>

    <div class="layout" style="margin-top: 64px;">
        <!-- 侧边目录 -->
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <button class="sidebar-toggle" id="sidebarToggle" aria-label="切换侧边栏">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
                <span class="sidebar-title">文档目录</span>
            </div>
            <nav class="sidebar-nav" id="toc"></nav>
        </aside>

        <!-- 主内容区 -->
        <main class="main-content" id="mainContent">
            <div class="content-section">
                <h1>${title}</h1>
                ${content}
            </div>
            
            <footer style="text-align: center; padding: 40px; color: var(--text-tertiary); border-top: 1px solid var(--border-color); margin-top: 60px;">
                <p>© 2025 微波室 | IPD硬件研发实施项目</p>
                <p style="font-size: 0.9em; margin-top: 8px;">最后更新：2025年3月20日</p>
            </footer>
        </main>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script>
        // 代码高亮
        hljs.highlightAll();
        
        // 生成目录
        const content = document.querySelector('.content-section');
        const toc = document.getElementById('toc');
        const headings = content.querySelectorAll('h2, h3');
        
        if (headings.length > 0) {
            headings.forEach(heading => {
                const link = document.createElement('a');
                link.href = '#' + heading.id;
                link.textContent = heading.textContent;
                link.className = heading.tagName === 'H2' ? 'nav-link' : 'nav-link sub';
                toc.appendChild(link);
            });
        }
        
        // 侧边栏切换
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        sidebarToggle?.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    </script>
</body>
</html>`;

// 转换 Markdown 文件为 HTML
function convertMdToHtml(inputPath, outputPath, title) {
    if (!fs.existsSync(inputPath)) {
        console.log(`⚠️ 文件不存在: ${inputPath}`);
        return false;
    }
    
    const mdContent = fs.readFileSync(inputPath, 'utf-8');
    const htmlContent = marked.parse(mdContent);
    
    // 计算相对路径
    const depth = outputPath.split('/').length - 1;
    const relativePath = depth > 0 ? '../'.repeat(depth) : '';
    
    const fullHtml = getHtmlTemplate(title, htmlContent, relativePath);
    
    // 确保目录存在
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, fullHtml, 'utf-8');
    console.log(`✅ 已转换: ${path.basename(inputPath)} → ${outputPath}`);
    return true;
}

// 创建 CSS 文件
const cssContent = `
/* CSS Variables */
:root {
    --primary: #FF5A36;
    --primary-light: #FF8A6B;
    --primary-dark: #E54D2B;
    --bg-primary: #ffffff;
    --bg-secondary: #fafafa;
    --bg-tertiary: #f3f4f6;
    --text-primary: #111827;
    --text-secondary: #4b5563;
    --text-tertiary: #6b7280;
    --border-color: #e5e7eb;
    --border-color-light: #f3f4f6;
    --sidebar-bg: #ffffff;
    --sidebar-width: 280px;
    --navbar-height: 64px;
    --radius-sm: 6px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --transition: all 0.2s ease;
}

/* Reset and base */
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    scroll-behavior: smooth;
    scroll-padding-top: calc(var(--navbar-height) + 20px);
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
    line-height: 1.7;
    color: var(--text-primary);
    background: var(--bg-primary);
}

/* Navbar */
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--navbar-height);
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    z-index: 1000;
}

.navbar-left, .navbar-center, .navbar-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

.navbar-center {
    flex: 1;
    justify-content: center;
}

.nav-links {
    display: flex;
    gap: 8px;
}

.logo {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    color: var(--text-primary);
    font-weight: 600;
    font-size: 1.1em;
}

.logo-icon {
    width: 36px;
    height: 36px;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.95em;
    font-weight: 500;
    transition: var(--transition);
}

.nav-link:hover {
    color: var(--primary);
    background: var(--bg-secondary);
}

/* Layout */
.layout {
    display: flex;
    min-height: calc(100vh - var(--navbar-height));
}

/* Sidebar */
.sidebar {
    position: fixed;
    left: 0;
    top: var(--navbar-height);
    width: var(--sidebar-width);
    height: calc(100vh - var(--navbar-height));
    background: var(--sidebar-bg);
    border-right: 1px solid var(--border-color);
    overflow-y: auto;
    z-index: 100;
    transition: var(--transition);
}

.sidebar.collapsed {
    width: 0;
    overflow: hidden;
}

.sidebar-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color);
}

.sidebar-toggle {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 4px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
}

.sidebar-toggle:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.sidebar-title {
    font-weight: 600;
    font-size: 0.95em;
    color: var(--text-primary);
}

.sidebar-nav {
    padding: 12px 0;
}

.sidebar-nav .nav-link {
    display: block;
    padding: 10px 20px;
    border-radius: 0;
    color: var(--text-secondary);
}

.sidebar-nav .nav-link:hover {
    background: var(--bg-secondary);
}

.sidebar-nav .nav-link.sub {
    padding-left: 36px;
    font-size: 0.9em;
}

/* Main Content */
.main-content {
    flex: 1;
    margin-left: var(--sidebar-width);
    padding: 40px;
    max-width: 900px;
}

.content-section {
    max-width: 100%;
}

.content-section h1 {
    font-size: 2.2em;
    font-weight: 700;
    margin-bottom: 24px;
    color: var(--text-primary);
    padding-bottom: 16px;
    border-bottom: 2px solid var(--border-color);
}

.content-section h2 {
    font-size: 1.6em;
    font-weight: 600;
    margin-top: 40px;
    margin-bottom: 16px;
    color: var(--text-primary);
}

.content-section h3 {
    font-size: 1.3em;
    font-weight: 600;
    margin-top: 28px;
    margin-bottom: 12px;
    color: var(--text-secondary);
}

.content-section h4 {
    font-size: 1.1em;
    font-weight: 600;
    margin-top: 20px;
    margin-bottom: 10px;
    color: var(--text-primary);
}

.content-section p {
    margin-bottom: 16px;
    line-height: 1.8;
}

.content-section ul, .content-section ol {
    margin-bottom: 16px;
    padding-left: 28px;
}

.content-section li {
    margin-bottom: 8px;
}

.content-section a {
    color: var(--primary);
    text-decoration: none;
}

.content-section a:hover {
    text-decoration: underline;
}

.content-section blockquote {
    border-left: 4px solid var(--primary);
    padding: 16px 20px;
    margin: 20px 0;
    background: var(--bg-secondary);
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

.content-section code {
    background: var(--bg-tertiary);
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9em;
}

.content-section pre {
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 20px;
    border-radius: var(--radius-md);
    overflow-x: auto;
    margin: 20px 0;
}

.content-section pre code {
    background: none;
    padding: 0;
    color: inherit;
}

.content-section table {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    box-shadow: var(--shadow-sm);
    border-radius: var(--radius-md);
    overflow: hidden;
}

.content-section th {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    padding: 14px 16px;
    text-align: left;
    font-weight: 600;
}

.content-section td {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);
}

.content-section tr:nth-child(even) {
    background: var(--bg-secondary);
}

.content-section tr:hover {
    background: var(--bg-tertiary);
}

.content-section img {
    max-width: 100%;
    border-radius: var(--radius-md);
    margin: 20px 0;
}

/* Mobile */
@media (max-width: 768px) {
    .sidebar {
        width: 0;
        overflow: hidden;
    }
    
    .main-content {
        margin-left: 0;
        padding: 20px;
    }
    
    .navbar-center {
        display: none;
    }
    
    .content-section h1 {
        font-size: 1.6em;
    }
    
    .content-section h2 {
        font-size: 1.3em;
    }
}
`;

// 创建目录
const baseDir = '/home/openclaw/.openclaw/workspace/ipd-hardware-implementation';

// 创建 assets 目录并写入 CSS
const assetsDir = path.join(baseDir, 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}
fs.writeFileSync(path.join(assetsDir, 'style.css'), cssContent);
console.log('✅ 已创建: assets/style.css');

// 创建各个分类目录
const dirs = ['guides', 'ipd', 'templates', 'templates/ipd', 'templates/hr', 'hr'];
dirs.forEach(dir => {
    const fullPath = path.join(baseDir, dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
});

// 转换文档
const docs = [
    // 核心指南
    { input: '微波室管理体系建设核心方案.md', output: 'guides/管理体系建设核心方案.html', title: '管理体系建设核心方案' },
    { input: '微波室管理工作方案计划.md', output: 'guides/管理工作方案计划.html', title: '管理工作方案计划' },
    { input: '微波室关键工作90天执行计划.md', output: 'guides/关键工作90天执行计划.html', title: '关键工作90天执行计划' },
    { input: '员工手册编写指南.md', output: 'guides/员工手册编写指南.html', title: '员工手册编写指南' },
    { input: '员工手册编写任务计划.md', output: 'guides/员工手册编写任务计划.html', title: '员工手册编写任务计划' },
    
    // IPD理论
    { input: 'docs/01-ipd-overview.md', output: 'ipd/IPD核心理念.html', title: 'IPD核心理念和框架' },
    { input: 'docs/02-hardware-ipd-flow.md', output: 'ipd/硬件研发IPD流程.html', title: '硬件研发IPD流程' },
    
    // IPD模板
    { input: 'templates/03-hardware-srs-template.md', output: 'templates/ipd/硬件需求规格说明书.html', title: '硬件需求规格说明书模板' },
    { input: 'templates/04-design-review-checklist.md', output: 'templates/ipd/设计评审检查表.html', title: '设计评审检查表' },
    { input: 'templates/05-phase-review-report.md', output: 'templates/ipd/阶段评审报告.html', title: '阶段评审报告模板' },
    { input: 'templates/06-risk-tracking-table.md', output: 'templates/ipd/风险跟踪表.html', title: '风险跟踪表' },
    { input: 'templates/07-issue-tracking-table.md', output: 'templates/ipd/问题跟踪表.html', title: '问题跟踪表' },
    { input: 'templates/08-change-request-form.md', output: 'templates/ipd/变更请求表.html', title: '变更请求表' },
    { input: 'templates/09-test-plan-template.md', output: 'templates/ipd/测试计划模板.html', title: '测试计划模板' },
    { input: 'templates/10-meeting-minutes-template.md', output: 'templates/ipd/会议纪要模板.html', title: '会议纪要模板' },
    
    // HR模板
    { input: 'templates/hr/01-employee-handbook.md', output: 'templates/hr/员工手册通用模板.html', title: '员工手册通用模板' },
    { input: 'templates/hr/02-job-description.md', output: 'templates/hr/岗位说明书通用模板.html', title: '岗位说明书通用模板' },
    { input: 'templates/hr/02-job-description-microwave.md', output: 'templates/hr/微波室岗位说明书模板.html', title: '微波室岗位说明书模板' },
    { input: 'templates/hr/03-performance-management.md', output: 'templates/hr/绩效管理办法模板.html', title: '绩效管理办法模板' },
    { input: 'templates/hr/04-learning-organization.md', output: 'templates/hr/学习型组织建设方案.html', title: '学习型组织建设方案' },
    { input: 'templates/hr/05-manager-action-guide.md', output: 'templates/hr/管理者行动指南.html', title: '管理者行动指南' },
];

console.log('\n🔄 开始转换文档...\n');

let successCount = 0;
docs.forEach(doc => {
    const inputPath = path.join(baseDir, doc.input);
    const outputPath = path.join(baseDir, doc.output);
    if (convertMdToHtml(inputPath, outputPath, doc.title)) {
        successCount++;
    }
});

console.log(`\n✅ 成功转换 ${successCount}/${docs.length} 个文档`);
