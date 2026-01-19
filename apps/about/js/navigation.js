// ===================================
// 导航和页面切换
// ===================================

class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section');
        this.hamburger = document.querySelector('.hamburger');
        this.navLinksContainer = document.querySelector('.nav-links');
        this.backToTopBtn = document.getElementById('backToTop');
        this.lastScrollTop = 0;

        this.init();
    }

    init() {
        this.initSmoothScroll();
        this.initScrollEffects();
        this.initMobileMenu();
        this.initBackToTop();
        this.initActiveSectionHighlight();

        Debug.log('Navigation initialized');
    }

    initSmoothScroll() {
        if (!CONFIG.navigation.smoothScroll) return;

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');

                // 忽略空链接或仅 # 的链接
                if (!href || href === '#') return;

                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();

                    // 关闭移动菜单
                    this.closeMobileMenu();

                    // 平滑滚动到目标
                    const offsetTop = target.offsetTop - CONFIG.navigation.offset;

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // 更新 URL（不跳转）
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                }
            });
        });
    }

    initScrollEffects() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });

                ticking = true;
            }
        }, { passive: true });
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // 导航栏效果
        if (scrollTop > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        // 隐藏/显示导航栏
        if (scrollTop > this.lastScrollTop && scrollTop > 500) {
            // 向下滚动，隐藏导航栏
            this.navbar.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动，显示导航栏
            this.navbar.style.transform = 'translateY(0)';
        }

        this.lastScrollTop = scrollTop;

        // 返回顶部按钮
        if (scrollTop > 500) {
            this.backToTopBtn.classList.add('visible');
        } else {
            this.backToTopBtn.classList.remove('visible');
        }
    }

    initMobileMenu() {
        if (!this.hamburger) return;

        // 汉堡菜单切换
        this.hamburger.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // 点击导航链接后关闭菜单
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // 点击菜单外部关闭
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target) && this.navLinksContainer.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });

        // ESC 键关闭菜单
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navLinksContainer.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.hamburger.classList.toggle('active');
        this.navLinksContainer.classList.toggle('active');

        // 防止背景滚动
        if (this.navLinksContainer.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMobileMenu() {
        this.hamburger.classList.remove('active');
        this.navLinksContainer.classList.remove('active');
        document.body.style.overflow = '';
    }

    initBackToTop() {
        if (!this.backToTopBtn) return;

        this.backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    initActiveSectionHighlight() {
        if (!CONFIG.navigation.highlightOnScroll) return;

        const highlightSection = throttle(() => {
            const scrollTop = window.pageYOffset + CONFIG.navigation.offset + 100;

            let currentSection = '';

            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });

            this.navLinks.forEach(link => {
                link.classList.remove('active');

                const href = link.getAttribute('href');
                if (href === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        }, 100);

        window.addEventListener('scroll', highlightSection, { passive: true });
    }

    // 获取当前激活的区块
    getActiveSection() {
        const scrollTop = window.pageYOffset + CONFIG.navigation.offset + 100;

        for (const section of this.sections) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                return section.getAttribute('id');
            }
        }

        return null;
    }

    // 滚动到指定区块
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);

        if (section) {
            const offsetTop = section.offsetTop - CONFIG.navigation.offset;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    // 更新导航链接
    updateNavLinks(links) {
        const navLinksContainer = document.querySelector('.nav-links');

        if (!navLinksContainer) return;

        navLinksContainer.innerHTML = '';

        links.forEach(link => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = link.href;
            a.className = 'nav-link';
            a.textContent = link.text;

            if (link.external) {
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
            }

            li.appendChild(a);
            navLinksContainer.appendChild(li);
        });

        // 重新初始化平滑滚动
        this.initSmoothScroll();
    }
}

// 面包屑导航
class Breadcrumb {
    constructor() {
        this.container = this.createContainer();
        this.init();
    }

    createContainer() {
        const nav = document.createElement('nav');
        nav.className = 'breadcrumb';
        nav.innerHTML = '<ol></ol>';
        return nav;
    }

    init() {
        // 插入到第一个 section 之前
        const firstSection = document.querySelector('section');
        if (firstSection) {
            firstSection.parentNode.insertBefore(this.container, firstSection);
        }

        this.update();
        window.addEventListener('scroll', throttle(() => this.update(), 200));
    }

    update() {
        const currentSection = navigation.getActiveSection();

        if (!currentSection) {
            this.container.style.display = 'none';
            return;
        }

        this.container.style.display = 'block';

        const section = document.getElementById(currentSection);
        const title = section.querySelector('.section-title');
        const sectionTitle = title ? title.textContent : currentSection;

        const ol = this.container.querySelector('ol');
        ol.innerHTML = `
            <li><a href="#home">首页</a></li>
            <li>${sectionTitle}</li>
        `;
    }
}

// 进度指示器
class ProgressIndicator {
    constructor() {
        this.container = this.createContainer();
        this.indicators = [];
        this.init();
    }

    createContainer() {
        const div = document.createElement('div');
        div.className = 'progress-indicator';
        return div;
    }

    init() {
        const sections = document.querySelectorAll('section[id]');

        sections.forEach(section => {
            const indicator = document.createElement('a');
            indicator.href = `#${section.id}`;
            indicator.className = 'progress-dot';
            indicator.setAttribute('data-section', section.id);
            indicator.setAttribute('aria-label', section.querySelector('.section-title')?.textContent || section.id);

            this.container.appendChild(indicator);
            this.indicators.push(indicator);
        });

        document.body.appendChild(this.container);

        // 点击跳转
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('progress-dot')) {
                e.preventDefault();
                const sectionId = e.target.getAttribute('data-section');
                navigation.scrollToSection(sectionId);
            }
        });

        // 滚动更新
        window.addEventListener('scroll', throttle(() => this.update(), 100));
    }

    update() {
        const currentSection = navigation.getActiveSection();

        this.indicators.forEach(indicator => {
            indicator.classList.remove('active');

            if (indicator.getAttribute('data-section') === currentSection) {
                indicator.classList.add('active');
            }
        });
    }
}

// 键盘导航
class KeyboardNavigation {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            // 忽略在输入框中的按键
            if (e.target.matches('input, textarea, select, [contenteditable]')) {
                return;
            }

            switch (e.key) {
                case 'Home':
                    e.preventDefault();
                    navigation.scrollToSection('home');
                    break;

                case 'End':
                    e.preventDefault();
                    const lastSection = document.querySelectorAll('section[id]');
                    if (lastSection.length > 0) {
                        const lastId = lastSection[lastSection.length - 1].id;
                        navigation.scrollToSection(lastId);
                    }
                    break;

                case 'ArrowDown':
                case 'PageDown':
                    e.preventDefault();
                    this.navigateToNextSection();
                    break;

                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    this.navigateToPrevSection();
                    break;
            }
        });
    }

    navigateToNextSection() {
        const currentSection = navigation.getActiveSection();
        const sections = Array.from(document.querySelectorAll('section[id]'));
        const currentIndex = sections.findIndex(s => s.id === currentSection);

        if (currentIndex < sections.length - 1) {
            navigation.scrollToSection(sections[currentIndex + 1].id);
        }
    }

    navigateToPrevSection() {
        const currentSection = navigation.getActiveSection();
        const sections = Array.from(document.querySelectorAll('section[id]'));
        const currentIndex = sections.findIndex(s => s.id === currentSection);

        if (currentIndex > 0) {
            navigation.scrollToSection(sections[currentIndex - 1].id);
        }
    }
}

// 初始化导航
let navigation;
let breadcrumb;
let progressIndicator;
let keyboardNavigation;

DOM.ready(() => {
    navigation = new Navigation();

    // 可选功能
    // breadcrumb = new Breadcrumb();
    // progressIndicator = new ProgressIndicator();
    // keyboardNavigation = new KeyboardNavigation();
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Navigation,
        Breadcrumb,
        ProgressIndicator,
        KeyboardNavigation
    };
}
