// Theme Management
const themeToggle = document.getElementById('themeToggle');
const sunIcon = themeToggle.querySelector('.sun-icon');
const moonIcon = themeToggle.querySelector('.moon-icon');
const hljsLight = document.getElementById('hljs-light');
const hljsDark = document.getElementById('hljs-dark');

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        if (hljsLight) hljsLight.disabled = true;
        if (hljsDark) hljsDark.disabled = false;
    } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
        if (hljsLight) hljsLight.disabled = false;
        if (hljsDark) hljsDark.disabled = true;
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

themeToggle.addEventListener('click', toggleTheme);

// Sidebar Toggle
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024 && 
        !sidebar.contains(e.target) && 
        !sidebarToggle.contains(e.target) && 
        sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
});

// Active Navigation Link
const navLinks = document.querySelectorAll('.nav-group .nav-link');
const sections = document.querySelectorAll('.content-section');

function updateActiveLink() {
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= top && scrollPos < bottom) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink);
updateActiveLink();

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const offset = 80;
            const targetPosition = targetSection.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close sidebar on mobile
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('open');
            }
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

// Search Functionality
const searchModal = document.getElementById('searchModal');
const searchInput = document.getElementById('searchInput');
const modalSearchInput = document.getElementById('modalSearchInput');
const searchResults = document.getElementById('searchResults');

// Search index
const searchIndex = [
    { id: 'welcome', title: '欢迎加入微波室', desc: '关于微波室、团队结构介绍' },
    { id: 'vision', title: '团队愿景与使命', desc: '愿景、使命、核心价值观' },
    { id: 'org', title: '组织架构', desc: '组织架构图、管理层级' },
    { id: 'teams', title: '各组职责', desc: '产品管理组、产品开发组、技术开发组职责' },
    { id: 'values', title: '核心价值观', desc: '客户导向、质量第一、协同合作、持续改进、诚信正直' },
    { id: 'rules', title: '行为规范', desc: '日常工作规范、保密、知识产权' },
    { id: 'attendance', title: '考勤管理', desc: '工作时间、请假流程、加班管理' },
    { id: 'communication', title: '沟通协作', desc: '会议规范、邮件规范、即时通讯' },
    { id: 'ipd-phases', title: 'IPD研发阶段', desc: '概念、计划、开发、验证、发布、生命周期' },
    { id: 'ipd-roles', title: 'IPD关键角色', desc: '项目经理、系统工程师、各专业工程师' },
    { id: 'training', title: '培训体系', desc: '新员工培训、专业培训、项目管理培训' },
    { id: 'learning', title: '学习机制', desc: '组内学习机制、技术分享' },
    { id: 'career', title: '职业发展', desc: '技术通道、管理通道、晋升路径' },
    { id: 'certification', title: '技能认证', desc: '天线、射频、数字、电源认证' },
    { id: 'rewards', title: '奖励机制', desc: '个人奖励、团队奖励、奖项设置' },
    { id: 'benefits', title: '员工福利', desc: '基本福利、专项福利、员工关怀' },
    { id: 'contact', title: '联系方式', desc: '常用联系方式、部门内线' },
    { id: 'systems', title: '常用系统', desc: 'OA系统、PLM系统、项目管理' }
];

function openSearch() {
    searchModal.classList.add('active');
    modalSearchInput.focus();
    modalSearchInput.value = '';
    searchResults.innerHTML = '';
}

function closeSearch() {
    searchModal.classList.remove('active');
}

function performSearch(query) {
    if (!query.trim()) {
        searchResults.innerHTML = '';
        return;
    }
    
    const lowerQuery = query.toLowerCase();
    const results = searchIndex.filter(item => 
        item.title.toLowerCase().includes(lowerQuery) ||
        item.desc.toLowerCase().includes(lowerQuery)
    );
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-result-item">
                <div>
                    <h4>未找到结果</h4>
                    <p>请尝试其他关键词</p>
                </div>
            </div>
        `;
        return;
    }
    
    searchResults.innerHTML = results.map(item => `
        <div class="search-result-item" onclick="navigateToSection('${item.id}')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <div>
                <h4>${item.title}</h4>
                <p>${item.desc}</p>
            </div>
        </div>
    `).join('');
}

function navigateToSection(id) {
    closeSearch();
    const section = document.getElementById(id);
    if (section) {
        const offset = 80;
        const targetPosition = section.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    }
}

// Search event listeners
searchInput.addEventListener('click', openSearch);
searchInput.addEventListener('focus', openSearch);

modalSearchInput.addEventListener('input', (e) => {
    performSearch(e.target.value);
});

searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
        closeSearch();
    }
});

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to open search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
    }
    
    // Escape to close search
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
        closeSearch();
    }
});

// Back to Top
const backToTop = document.getElementById('backToTop');

function toggleBackToTop() {
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', toggleBackToTop);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards and sections for animation
document.querySelectorAll('.card, .value-card, .reward-card, .mission-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    observer.observe(el);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateActiveLink();
});

// Handle keyboard navigation in search modal
modalSearchInput.addEventListener('keydown', (e) => {
    const items = searchResults.querySelectorAll('.search-result-item');
    const activeItem = searchResults.querySelector('.search-result-item.active');
    
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!activeItem) {
            items[0]?.classList.add('active');
        } else {
            const next = activeItem.nextElementSibling;
            if (next) {
                activeItem.classList.remove('active');
                next.classList.add('active');
                next.scrollIntoView({ block: 'nearest' });
            }
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (activeItem) {
            const prev = activeItem.previousElementSibling;
            if (prev) {
                activeItem.classList.remove('active');
                prev.classList.add('active');
                prev.scrollIntoView({ block: 'nearest' });
            }
        }
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeItem) {
            activeItem.click();
        } else if (items.length > 0) {
            items[0].click();
        }
    }
});

// Add hover styles for search results
const style = document.createElement('style');
style.textContent = `
    .search-result-item.active {
        background: var(--bg-tertiary);
    }
`;
document.head.appendChild(style);
