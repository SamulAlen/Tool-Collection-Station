// ===================================
// 主入口文件
// ===================================

class App {
    constructor() {
        this.initialized = false;
        this.modules = {};
    }

    init() {
        if (this.initialized) return;

        Debug.log('App initializing...');

        this.renderContent();
        this.initInteractions();
        this.initForm();

        this.initialized = true;

        Debug.log('App initialized successfully');
    }

    renderContent() {
        this.renderExperience();
        this.renderSkills('frontend');
        this.renderProjects();
        this.renderBlog();
        this.renderTestimonials();
    }

    // 渲染工作经历
    renderExperience() {
        const container = document.querySelector('.timeline');
        if (!container) return;

        const experience = RESUME_DATA.experience;

        container.innerHTML = experience.map((exp, index) => `
            <div class="timeline-item fade-up" style="animation-delay: ${index * 0.1}s">
                <div class="timeline-dot"></div>
                <div class="timeline-date">${exp.period}</div>
                <div class="timeline-content">
                    <h3>${exp.position}</h3>
                    <h4>${exp.company} · ${exp.location}</h4>
                    <p>${exp.description}</p>
                    <ul>
                        ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                    </ul>
                    <div class="timeline-skills">
                        ${exp.skills.map(skill => `<span class="timeline-skill">${skill}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        // 重新初始化动画观察器
        if (typeof scrollAnimations !== 'undefined') {
            scrollAnimations.reset();
        }
    }

    // 渲染技能
    renderSkills(category = 'frontend') {
        const container = document.querySelector('.skills-grid');
        if (!container) return;

        const skills = RESUME_DATA.skills[category] || [];

        container.innerHTML = skills.map((skill, index) => `
            <div class="skill-card scale-up" style="animation-delay: ${index * 0.05}s">
                <div class="skill-icon" style="background: ${skill.color}15; color: ${skill.color}">
                    ${skill.icon ? `<img src="images/logos/${skill.icon}" alt="${skill.name}" onerror="this.parentElement.innerHTML='${skill.name.charAt(0)}'">` : skill.name.charAt(0)}
                </div>
                <div class="skill-info">
                    <h3>${skill.name}</h3>
                    <div class="skill-bar">
                        <div class="skill-progress" style="width: ${skill.level}%"></div>
                    </div>
                </div>
            </div>
        `).join('');

        // 只观察新渲染的技能卡片，不影响其他元素
        if (typeof scrollAnimations !== 'undefined' && scrollAnimations.enabled) {
            // 移除旧的观察器中关于这个容器的观察
            scrollAnimations.observers.forEach(observer => {
                const oldCards = container.querySelectorAll('.skill-card');
                oldCards.forEach(card => observer.unobserve(card));
            });

            // 观察新的技能卡片
            const newCards = container.querySelectorAll('.skill-card');
            newCards.forEach(card => {
                // 移除旧的动画状态
                card.classList.remove('animate-in', 'animated');

                // 创建新的观察器
                const options = {
                    threshold: CONFIG.animations.threshold,
                    rootMargin: CONFIG.animations.rootMargin
                };

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !scrollAnimations.animatedElements.has(entry.target)) {
                            scrollAnimations.animateElement(entry.target);
                            scrollAnimations.animatedElements.add(entry.target);

                            if (!entry.target.classList.contains('repeat-animation')) {
                                observer.unobserve(entry.target);
                            }
                        }
                    });
                }, options);

                observer.observe(card);
                scrollAnimations.observers.push(observer);
            });
        }
    }

    // 渲染项目
    renderProjects() {
        const container = document.querySelector('.projects-grid');
        if (!container) return;

        const projects = RESUME_DATA.projects;

        container.innerHTML = projects.map((project, index) => `
            <article class="project-card fade-up" style="animation-delay: ${index * 0.1}s">
                <div class="project-image">
                    <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #f5576c 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem; font-weight: bold;">
                        ${project.title.charAt(0)}
                    </div>
                    <div class="project-overlay">
                        ${project.link ? `<a href="${project.link}" class="project-link" target="_blank" rel="noopener" aria-label="查看项目">🔗</a>` : ''}
                        ${project.github ? `<a href="${project.github}" class="project-link" target="_blank" rel="noopener" aria-label="GitHub代码">💻</a>` : ''}
                    </div>
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">
                        ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
            </article>
        `).join('');

        // 重新初始化动画观察器
        if (typeof scrollAnimations !== 'undefined') {
            scrollAnimations.reset();
        }
    }

    // 渲染博客
    renderBlog() {
        const container = document.querySelector('.blog-grid');
        if (!container) return;

        const posts = RESUME_DATA.blog.slice(0, 6);

        container.innerHTML = posts.map((post, index) => `
            <article class="blog-card fade-up" style="animation-delay: ${index * 0.1}s">
                <div class="blog-date">${DataHelper.formatDate(post.date)}</div>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <a href="${post.url}" class="blog-link" target="_blank" rel="noopener">
                    阅读更多 →
                </a>
            </article>
        `).join('');

        // 重新初始化动画观察器
        if (typeof scrollAnimations !== 'undefined') {
            scrollAnimations.reset();
        }
    }

    // 渲染推荐语
    renderTestimonials() {
        const container = document.querySelector('.testimonials-grid');
        if (!container) return;

        const testimonials = RESUME_DATA.testimonials;

        container.innerHTML = testimonials.map((item, index) => `
            <div class="testimonial-card scale-up" style="animation-delay: ${index * 0.1}s">
                <p class="testimonial-content">"${item.content}"</p>
                <div class="testimonial-author">
                    <div class="testimonial-avatar">${item.avatar}</div>
                    <div class="testimonial-info">
                        <h4>${item.name}</h4>
                        <p>${item.position} · ${item.company}</p>
                    </div>
                </div>
            </div>
        `).join('');

        // 重新初始化动画观察器
        if (typeof scrollAnimations !== 'undefined') {
            scrollAnimations.reset();
        }
    }

    initInteractions() {
        // 技能标签切换
        this.initSkillTabs();

        // 更新个人信息
        this.updateProfileInfo();
    }

    initSkillTabs() {
        const tabs = document.querySelectorAll('.skill-tab');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.dataset.category;

                // 更新激活状态
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // 重新渲染技能
                this.renderSkills(category);
            });
        });
    }

    updateProfileInfo() {
        // 更新网站标题
        document.title = `${RESUME_DATA.profile.name} - ${RESUME_DATA.profile.title}`;

        // 更新英雄区
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.textContent = RESUME_DATA.profile.name;
            heroTitle.dataset.text = RESUME_DATA.profile.name;
        }

        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            heroSubtitle.textContent = RESUME_DATA.profile.title;
        }

        // 更新联系信息
        const emailLink = document.querySelector('a[href^="mailto:"]');
        if (emailLink && RESUME_DATA.profile.email) {
            emailLink.href = `mailto:${RESUME_DATA.profile.email}`;
        }

        // 更新社交链接
        const socialLinksContainer = document.querySelector('.social-links');
        if (socialLinksContainer && RESUME_DATA.social) {
            const socialIcons = {
                github: 'GitHub',
                linkedin: 'LinkedIn',
                email: 'Email'
            };

            socialLinksContainer.innerHTML = Object.entries(RESUME_DATA.social)
                .filter(([key]) => key !== 'wechat' && key !== 'twitter')
                .map(([key, url]) => `
                    <a href="${url}" class="social-link" aria-label="${socialIcons[key] || key}" target="_blank" rel="noopener">
                        ${socialIcons[key] || key}
                    </a>
                `).join('');
        }

        // 更新统计数字
        document.querySelectorAll('.stat-number').forEach(el => {
            const statKey = el.textContent.trim();
            if (statKey === '0' && RESUME_DATA.stats) {
                // 让计数动画处理
            }
        });
    }

    initForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // 验证表单
            if (!this.validateForm(data)) {
                return;
            }

            // 模拟发送
            this.sendFormData(data);
        });
    }

    validateForm(data) {
        const errors = [];

        if (!data.name || data.name.trim().length < 2) {
            errors.push('请输入有效的姓名');
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('请输入有效的邮箱地址');
        }

        if (!data.subject || data.subject.trim().length < 2) {
            errors.push('请输入有效的主题');
        }

        if (!data.message || data.message.trim().length < 10) {
            errors.push('请输入至少10个字符的留言');
        }

        if (errors.length > 0) {
            this.showNotification(errors[0], 'error');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    sendFormData(data) {
        // 显示加载状态
        const submitBtn = document.querySelector('#contactForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '发送中...';
        submitBtn.disabled = true;

        // 模拟发送延迟
        setTimeout(() => {
            // 这里可以添加实际的发送逻辑，例如使用 EmailJS
            Debug.log('Form data:', data);

            // 显示成功消息
            this.showNotification('消息已发送！我会尽快回复您。', 'success');

            // 重置表单
            document.getElementById('contactForm').reset();

            // 恢复按钮
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }

    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">×</button>
        `;

        // 添加样式
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '15px 20px',
            background: type === 'success' ? '#00b894' : type === 'error' ? '#d63031' : '#667eea',
            color: 'white',
            borderRadius: '10px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            zIndex: '10000',
            animation: 'slideInRight 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            minWidth: '300px'
        });

        // 添加到页面
        document.body.appendChild(notification);

        // 关闭按钮
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.removeNotification(notification);
        });

        // 自动移除
        setTimeout(() => {
            this.removeNotification(notification);
        }, CONFIG.form.notificationDuration);
    }

    removeNotification(notification) {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }
}

// 添加通知动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 初始化应用
let app;

DOM.ready(() => {
    app = new App();
    app.init();
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
