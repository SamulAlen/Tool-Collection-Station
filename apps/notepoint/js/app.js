// 知识图谱 - 基于粒子效果的重写版
class KnowledgeGraph {
    constructor() {
        this.nodes = [];
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.isPanning = false;
        this.editMode = false;
        this.currentViewingNode = null;
        this.currentEditingNode = null; // 当前正在编辑的节点
        this.animationId = null;
        this.draggedNode = null; // 正在拖动的节点
        this.draggedNodesGroup = null; // 被拖动的节点组（整棵树）
        this.currentSearchQuery = ''; // 当前搜索查询
        this.highlightedNodeId = null; // 当前高亮的节点ID
        this.draggedTreeNodeIds = new Set(); // 被拖动的树的所有节点ID

        // 粒子系统配置
        this.config = {
            minDistance: 100,       // 节点间最小距离（排斥范围增大）
            repulsionStrength: 0.4, // 排斥力度（减弱）
            connectionDistance: 100, // 连线距离（改为100）
            damping: 0.88,          // 阻尼系数（降低，让弹性更明显）
            springStrength: 0.08,   // 弹簧强度（降低，让弹簧更容易拉伸压缩）
            centerPullStrength: 0.0003, // 基础向心力（配合引力井使用）
            gravityWellRadius: 300, // 引力井半径（超过此距离开始强力拉回）
            gravityWellStrength: 0.002 // 引力井强度（远距离时的强力拉回）
        };

        this.velocities = new Map(); // 存储节点速度

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFromStorage();
        this.initializeVelocities();
        this.animate();
    }

    setupEventListeners() {
        // 添加按钮拖动
        this.setupDraggable('add-button');

        // 添加按钮点击
        document.getElementById('add-button').addEventListener('click', () => {
            if (!this.isDragging) {
                this.openCreatePanel();
            }
        });


        // 创建面板
        document.getElementById('cancel-create').addEventListener('click', () => {
            this.closeCreatePanel();
        });

        document.getElementById('confirm-create').addEventListener('click', () => {
            this.createNode();
        });

        // 编辑面板
        document.getElementById('cancel-edit').addEventListener('click', () => {
            this.closeEditPanel();
        });

        document.getElementById('confirm-edit').addEventListener('click', () => {
            this.saveEditNode();
        });

        document.getElementById('delete-node').addEventListener('click', () => {
            this.deleteNode();
        });

        // 控制按钮
        document.getElementById('edit-mode-btn').addEventListener('click', () => {
            this.toggleEditMode();
        });

        document.getElementById('zoom-in-btn').addEventListener('click', () => {
            this.zoom(0.1);
        });

        document.getElementById('zoom-out-btn').addEventListener('click', () => {
            this.zoom(-0.1);
        });

        document.getElementById('reset-view-btn').addEventListener('click', () => {
            this.resetView();
        });

        // 画布平移
        const container = document.getElementById('graph-container');
        container.addEventListener('mousedown', (e) => {
            if (e.target === container || e.target.id === 'connections-layer' || e.target.id === 'nodes-container') {
                this.isPanning = true;
                this.panStartX = e.clientX - this.offsetX;
                this.panStartY = e.clientY - this.offsetY;
                container.style.cursor = 'grabbing';
            }
        });

        container.addEventListener('mousemove', (e) => {
            if (this.isPanning) {
                this.offsetX = e.clientX - this.panStartX;
                this.offsetY = e.clientY - this.panStartY;
                this.updateTransform();
            }

            // 节点拖动（移除编辑模式限制）
            if (this.draggedNode) {
                const dx = (e.clientX - this.dragStartX) / this.scale;
                const dy = (e.clientY - this.dragStartY) / this.scale;

                // 计算鼠标移动速度（用于产生惯性效果）
                const velocityX = dx - (this.draggedNode.x - this.draggedNode.originalX);
                const velocityY = dy - (this.draggedNode.y - this.draggedNode.originalY);

                // 直接移动被拖动的节点，让弹簧力自然拉动其他节点
                this.draggedNode.x = this.draggedNode.originalX + dx;
                this.draggedNode.y = this.draggedNode.originalY + dy;

                // 给被拖动的节点施加速度，产生弹性拉扯效果
                const velocity = this.velocities.get(this.draggedNode.id);
                if (velocity) {
                    velocity.vx = velocityX * 0.5;
                    velocity.vy = velocityY * 0.5;
                }

                // 编辑模式下，检测是否接触到其他节点
                if (this.editMode) {
                    this.checkNodeContact();
                }

                // 拖动超过阈值才标记为正在拖动
                if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                    this.isDragging = true;
                }
            }
        });

        container.addEventListener('mouseup', () => {
            this.isPanning = false;
            container.style.cursor = 'default';

            // 释放节点拖动
            if (this.draggedNode) {
                this.saveToStorage(); // 保存节点位置
                this.draggedNode = null;
                this.draggedTreeNodeIds.clear(); // 清除拖动树状态
                // 延迟重置拖动标志
                setTimeout(() => {
                    this.isDragging = false;
                }, 100);
            }
        });

        container.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.05 : 0.05;
            this.zoom(delta);
        });

        // 搜索
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.searchNodes(e.target.value);
        });

        // 全屏按钮
        document.getElementById('create-fullscreen-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFullscreen('create-panel');
        });

        document.getElementById('edit-fullscreen-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFullscreen('edit-panel');
        });

        // ESC键退出全屏
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.exitFullscreen();
            }
        });

        // 点击其他地方关闭面板
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.node') &&
                !e.target.closest('#view-panel') &&
                !e.target.closest('#create-panel') &&
                !e.target.closest('#add-button')) {
                this.closeViewPanel();
            }
        });
    }

    initializeVelocities() {
        this.nodes.forEach(node => {
            if (!this.velocities.has(node.id)) {
                this.velocities.set(node.id, { vx: 0, vy: 0 });
            }
        });
    }

    // 物理模拟循环
    animate() {
        this.updatePhysics();
        this.render();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    updatePhysics() {
        // 收集所有连线段
        const lineSegments = [];
        this.nodes.forEach(node => {
            if (node.parentId) {
                const parent = this.nodes.find(n => n.id === node.parentId);
                if (parent) {
                    lineSegments.push({
                        x1: parent.x + 7.5,
                        y1: parent.y + 7.5,
                        x2: node.x + 7.5,
                        y2: node.y + 7.5,
                        node1: parent,
                        node2: node
                    });
                }
            }
        });

        // 对每个节点应用物理力
        this.nodes.forEach(node => {
            let velocity = this.velocities.get(node.id);
            if (!velocity) {
                velocity = { vx: 0, vy: 0 };
                this.velocities.set(node.id, velocity);
            }

            let fx = 0, fy = 0;

            // 1. 节点间排斥力
            // 只有在拖动节点时，被拖动的节点才不产生排斥力
            // 这样编辑模式下节点不会乱动
            const shouldSkipRepulsion = this.draggedNode?.id === node.id;

            if (!shouldSkipRepulsion) {
                this.nodes.forEach(other => {
                    if (node.id === other.id) return;

                    // 被拖动的节点也不被其他节点排斥
                    if (this.draggedNode?.id === other.id) return;

                    const dx = node.x - other.x;
                    const dy = node.y - other.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < this.config.minDistance && distance > 0) {
                        const force = (this.config.minDistance - distance) / this.config.minDistance;
                        const angle = Math.atan2(dy, dx);
                        fx += Math.cos(angle) * force * this.config.repulsionStrength;
                        fy += Math.sin(angle) * force * this.config.repulsionStrength;
                    }
                });
            }

            // 2. 父子节点吸引力（弹簧效果）- 双向弹簧力
            // 子节点被父节点吸引
            if (node.parentId && (!this.editMode || this.draggedNode?.id !== node.id)) {
                const parent = this.nodes.find(n => n.id === node.parentId);
                if (parent) {
                    const dx = parent.x - node.x;
                    const dy = parent.y - node.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance > 0) {
                        const targetDistance = this.config.connectionDistance;
                        const force = (distance - targetDistance) * this.config.springStrength;
                        const angle = Math.atan2(dy, dx);
                        fx += Math.cos(angle) * force;
                        fy += Math.sin(angle) * force;
                    }
                }
            }

            // 父节点被子节点吸引（反向弹簧力，让拖动子节点时能拉动父节点）
            this.nodes.forEach(child => {
                if (child.parentId === node.id) {
                    if (!this.editMode || this.draggedNode?.id !== node.id) {
                        const dx = child.x - node.x;
                        const dy = child.y - node.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance > 0) {
                            const targetDistance = this.config.connectionDistance;
                            const force = (distance - targetDistance) * this.config.springStrength;
                            const angle = Math.atan2(dy, dx);
                            fx += Math.cos(angle) * force;
                            fy += Math.sin(angle) * force;
                        }
                    }
                }
            });

            // 3. 连线排斥力（已移除）
            // 连线不再对节点产生排斥力

            // 4. 引力井效果（距离中心越远，吸引力越强）
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const dx = centerX - node.x;
            const dy = centerY - node.y;
            const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);

            if (distanceFromCenter > 0) {
                const angle = Math.atan2(dy, dx);
                let force;

                if (distanceFromCenter <= this.config.gravityWellRadius) {
                    // 在引力井半径内，使用较弱的恒定拉力
                    force = this.config.centerPullStrength * distanceFromCenter;
                } else {
                    // 超过引力井半径，使用非线性强力拉回（引力井效应）
                    // 距离越远，力呈指数增长
                    const excessDistance = distanceFromCenter - this.config.gravityWellRadius;
                    force = (this.config.centerPullStrength * this.config.gravityWellRadius) +
                            (excessDistance * this.config.gravityWellStrength);
                }

                fx += Math.cos(angle) * force;
                fy += Math.sin(angle) * force;
            }

            // 更新速度
            velocity.vx += fx;
            velocity.vy += fy;

            // 应用阻尼
            velocity.vx *= this.config.damping;
            velocity.vy *= this.config.damping;

            // 更新位置（如果节点正在被拖动，不更新位置，但仍保持速度以产生弹性效果）
            if (this.draggedNode && this.draggedNode.id === node.id) {
                // 被拖动的节点位置由鼠标控制，但保持速度以影响连接的节点
                // 不更新位置，位置由鼠标事件处理
            } else {
                node.x += velocity.vx;
                node.y += velocity.vy;
            }

            // 边界限制
            const margin = 50;
            node.x = Math.max(margin, Math.min(window.innerWidth - margin - 15, node.x));
            node.y = Math.max(margin, Math.min(window.innerHeight - margin - 15, node.y));
        });
    }

    // 计算点到线段的距离
    pointToLineDistance(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;

        let param = -1;
        if (lenSq !== 0) {
            param = dot / lenSq;
        }

        let xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // 获取线段上离点最近的点
    closestPointOnLine(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;

        let param = -1;
        if (lenSq !== 0) {
            param = dot / lenSq;
        }

        if (param < 0) {
            return { x: x1, y: y1 };
        } else if (param > 1) {
            return { x: x2, y: y2 };
        } else {
            return {
                x: x1 + param * C,
                y: y1 + param * D
            };
        }
    }

    // 设置元素拖动功能
    setupDraggable(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;

        let isDragging = false;
        let startX, startY;
        const threshold = 5; // 移动阈值，超过此距离才算拖动

        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX - element.offsetLeft;
            startY = e.clientY - element.offsetTop;
            element.style.cursor = 'grabbing';

            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const newX = e.clientX - startX;
            const newY = e.clientY - startY;

            // 检查移动距离
            const movedDistance = Math.sqrt(
                Math.pow(newX - element.offsetLeft, 2) +
                Math.pow(newY - element.offsetTop, 2)
            );

            if (movedDistance > threshold) {
                this.isDragging = true;
            }

            element.style.left = newX + 'px';
            element.style.top = newY + 'px';
            element.style.transform = 'none'; // 移除transform，使用left/top定位
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'move';

                // 延迟重置拖动标志，避免触发点击事件
                setTimeout(() => {
                    this.isDragging = false;
                }, 100);
            }
        });
    }

    // 获取整棵关联树（包括父节点、子孙节点）
    getConnectedTree(node) {
        const nodes = new Set();
        nodes.add(node);

        // 递归获取所有父节点
        const getParents = (n) => {
            if (n.parentId) {
                const parent = this.nodes.find(p => p.id === n.parentId);
                if (parent && !nodes.has(parent)) {
                    nodes.add(parent);
                    getParents(parent);
                }
            }
        };

        // 递归获取所有子节点
        const getChildren = (n) => {
            const children = this.nodes.filter(c => c.parentId === n.id);
            children.forEach(child => {
                if (!nodes.has(child)) {
                    nodes.add(child);
                    getChildren(child);
                }
            });
        };

        getParents(node);
        getChildren(node);

        return Array.from(nodes);
    }

    openCreatePanel() {
        const panel = document.getElementById('create-panel');
        const parentSelect = document.getElementById('node-parent');
        const searchInput = document.getElementById('parent-search-input');

        document.getElementById('node-title').value = '';
        document.getElementById('node-tag').value = '';
        document.getElementById('node-content-input').value = '';
        searchInput.value = '';

        // 优化：使用分组显示父节点
        this.populateParentSelect(parentSelect);

        // 添加搜索功能
        searchInput.oninput = () => {
            this.filterParentSelect(parentSelect, searchInput.value);
        };

        panel.classList.add('active');
    }

    closeCreatePanel() {
        document.getElementById('create-panel').classList.remove('active');
        // 清除搜索事件
        document.getElementById('parent-search-input').oninput = null;
    }

    // 过滤父节点选择器
    filterParentSelect(selectElement, query) {
        const options = selectElement.querySelectorAll('option');
        const lowerQuery = query.toLowerCase().trim();

        options.forEach(option => {
            if (option.value === '') {
                // 始终显示"无父节点"选项
                option.style.display = '';
            } else {
                const text = option.textContent.toLowerCase();
                const matches = text.includes(lowerQuery);
                option.style.display = matches ? '' : 'none';
            }
        });
    }

    // 优化父节点选择器，按层级分组显示
    populateParentSelect(selectElement, excludeNodeId = null) {
        selectElement.innerHTML = '<option value="">无父节点</option>';

        // 按层级组织节点
        const rootNodes = this.nodes.filter(n => !n.parentId);
        rootNodes.forEach(root => {
            this.addNodeToSelect(selectElement, root, 0, excludeNodeId);
        });
    }

    // 递归添加节点到选择器
    addNodeToSelect(selectElement, node, level, excludeNodeId) {
        // 排除当前正在编辑的节点（避免设置自己为父节点）
        if (node.id === excludeNodeId) return;

        const option = document.createElement('option');
        option.value = node.id;
        // 使用缩进显示层级关系
        const indent = '　'.repeat(level);
        option.textContent = indent + node.title;
        selectElement.appendChild(option);

        // 递归添加子节点
        const children = this.nodes.filter(n => n.parentId === node.id);
        children.forEach(child => {
            this.addNodeToSelect(selectElement, child, level + 1, excludeNodeId);
        });
    }

    // 打开编辑面板
    openEditPanel(node) {
        this.currentEditingNode = node;
        const panel = document.getElementById('edit-panel');
        const parentSelect = document.getElementById('edit-node-parent');
        const searchInput = document.getElementById('edit-parent-search-input');

        // 填充当前节点数据
        document.getElementById('edit-node-title').value = node.title;
        document.getElementById('edit-node-tag').value = node.tag || '';
        document.getElementById('edit-node-content-input').value = node.content || '';
        searchInput.value = '';

        // 优化：使用分组显示父节点，排除当前节点
        this.populateParentSelect(parentSelect, node.id);

        // 设置当前父节点
        parentSelect.value = node.parentId || '';

        // 添加搜索功能
        searchInput.oninput = () => {
            this.filterParentSelect(parentSelect, searchInput.value);
        };

        panel.classList.add('active');
    }

    closeEditPanel() {
        document.getElementById('edit-panel').classList.remove('active');
        document.getElementById('edit-parent-search-input').oninput = null;
        this.currentEditingNode = null;
    }

    // 保存编辑的节点
    saveEditNode() {
        if (!this.currentEditingNode) return;

        const title = document.getElementById('edit-node-title').value.trim();
        const parentId = document.getElementById('edit-node-parent').value;
        const tag = document.getElementById('edit-node-tag').value.trim();
        const content = document.getElementById('edit-node-content-input').value.trim();

        if (!title) {
            alert('请输入节点标题');
            return;
        }

        // 检查是否会形成循环引用
        if (parentId && this.wouldCreateCycle(this.currentEditingNode.id, parentId)) {
            alert('无法设置此父节点：会形成循环引用');
            return;
        }

        // 更新节点数据
        this.currentEditingNode.title = title;
        this.currentEditingNode.parentId = parentId || null;
        this.currentEditingNode.tag = tag || null;
        this.currentEditingNode.content = content || '';

        this.saveToStorage();
        this.closeEditPanel();
    }

    // 检查是否会形成循环引用
    wouldCreateCycle(nodeId, newParentId) {
        if (nodeId === newParentId) return true;

        let currentId = newParentId;
        while (currentId) {
            const parent = this.nodes.find(n => n.id === currentId);
            if (!parent) break;
            if (parent.parentId === nodeId) return true;
            currentId = parent.parentId;
        }
        return false;
    }

    // 删除节点
    deleteNode() {
        if (!this.currentEditingNode) return;

        if (!confirm(`确定要删除节点"${this.currentEditingNode.title}"吗？其子节点将变为无父节点状态。`)) {
            return;
        }

        const nodeId = this.currentEditingNode.id;

        // 将子节点的父节点设为null
        this.nodes.forEach(node => {
            if (node.parentId === nodeId) {
                node.parentId = null;
            }
        });

        // 删除节点
        this.nodes = this.nodes.filter(n => n.id !== nodeId);
        this.velocities.delete(nodeId);

        this.saveToStorage();
        this.closeEditPanel();
    }

    createNode() {
        const title = document.getElementById('node-title').value.trim();
        const parentId = document.getElementById('node-parent').value;
        const tag = document.getElementById('node-tag').value.trim();
        const content = document.getElementById('node-content-input').value.trim();

        if (!title) {
            alert('请输入节点标题');
            return;
        }

        const node = {
            id: Date.now().toString(),
            title: title,
            parentId: parentId || null,
            tag: tag || null,
            content: content || '',
            x: Math.random() * (window.innerWidth - 100) + 50,
            y: Math.random() * (window.innerHeight - 100) + 50,
            children: []
        };

        this.velocities.set(node.id, { vx: 0, vy: 0 });
        this.nodes.push(node);

        if (node.parentId) {
            const parent = this.nodes.find(n => n.id === node.parentId);
            if (parent) {
                parent.children.push(node.id);
            }
        }

        this.saveToStorage();
        this.closeCreatePanel();
    }

    openViewPanel(node) {
        this.currentViewingNode = node;
        const panel = document.getElementById('view-panel');
        document.getElementById('content-title').textContent = node.title;
        // 将换行符转换为 <br> 标签，保留换行格式
        const formattedContent = (node.content || '暂无内容').replace(/\n/g, '<br>');
        document.getElementById('content-body').innerHTML = formattedContent;
        panel.classList.add('active');
    }

    closeViewPanel() {
        document.getElementById('view-panel').classList.remove('active');
        this.currentViewingNode = null;
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
        const btn = document.getElementById('edit-mode-btn');
        if (this.editMode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    }

    zoom(delta) {
        this.scale = Math.max(0.2, Math.min(3, this.scale + delta));
        this.updateTransform();
        document.getElementById('zoom-indicator').textContent = `${Math.round(this.scale * 100)}%`;
    }

    // 切换面板全屏模式
    toggleFullscreen(panelId) {
        const panel = document.getElementById(panelId);
        const fullscreenBtn = panel.querySelector('.fullscreen-btn');

        if (panel.classList.contains('fullscreen')) {
            // 退出全屏
            panel.classList.remove('fullscreen');
            fullscreenBtn.textContent = '⛶';
            fullscreenBtn.title = '全屏编辑';
        } else {
            // 进入全屏
            panel.classList.add('fullscreen');
            fullscreenBtn.textContent = '⛶';
            fullscreenBtn.title = '退出全屏 (ESC)';
        }
    }

    // 退出所有面板的全屏模式
    exitFullscreen() {
        const fullscreenPanels = document.querySelectorAll('.panel.fullscreen');
        fullscreenPanels.forEach(panel => {
            panel.classList.remove('fullscreen');
            const fullscreenBtn = panel.querySelector('.fullscreen-btn');
            if (fullscreenBtn) {
                fullscreenBtn.textContent = '⛶';
                fullscreenBtn.title = '全屏编辑';
            }
        });
    }

    resetView() {
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.updateTransform();
        document.getElementById('zoom-indicator').textContent = `100%`;
    }

    updateTransform() {
        const container = document.getElementById('nodes-container');
        container.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.scale})`;

        const svg = document.getElementById('connections-layer');
        svg.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.scale})`;
    }

    searchNodes(query) {
        // 保存当前搜索查询
        this.currentSearchQuery = query;

        const nodeElements = document.querySelectorAll('.node');
        const lineElements = document.querySelectorAll('.connection-line');

        if (!query) {
            // 清空搜索时恢复所有透明度
            nodeElements.forEach(element => {
                element.style.opacity = '1';
            });
            lineElements.forEach(line => {
                line.style.opacity = '0.8';
            });
            return;
        }

        const lowerQuery = query.toLowerCase().trim();

        // 找出所有匹配的节点ID
        const matchedNodeIds = new Set();
        this.nodes.forEach(node => {
            const matches = node.title.toLowerCase().includes(lowerQuery) ||
                           (node.tag && node.tag.toLowerCase().includes(lowerQuery)) ||
                           (node.content && node.content.toLowerCase().includes(lowerQuery));
            if (matches) {
                matchedNodeIds.add(node.id);
            }
        });

        // 更新节点透明度
        nodeElements.forEach(element => {
            const node = this.nodes.find(n => n.id === element.dataset.id);
            if (!node) return;

            const matches = matchedNodeIds.has(node.id);
            element.style.opacity = matches ? '1' : '0.2';
        });

        // 搜索时所有连接线都变淡
        lineElements.forEach(line => {
            line.style.opacity = '0.1';
        });
    }

    render() {
        const container = document.getElementById('nodes-container');
        const svg = document.getElementById('connections-layer');

        // 移除不存在的节点
        container.querySelectorAll('.node').forEach(el => {
            if (!this.nodes.find(n => n.id === el.dataset.id)) {
                el.remove();
            }
        });

        // 绘制或更新节点
        this.nodes.forEach(node => {
            let nodeEl = container.querySelector(`[data-id="${node.id}"]`);

            if (!nodeEl) {
                nodeEl = document.createElement('div');
                nodeEl.className = 'node';
                nodeEl.dataset.id = node.id;
                nodeEl.innerHTML = `<div class="node-title">${node.title}</div>`;

                // 点击事件
                nodeEl.addEventListener('click', () => {
                    if (!this.isDragging && !this.draggedNode) {
                        if (this.editMode) {
                            this.openEditPanel(node);
                        } else {
                            this.openViewPanel(node);
                        }
                    }
                });

                // 拖动事件（移除编辑模式限制，普通模式也可以拖动）
                nodeEl.addEventListener('mousedown', (e) => {
                    e.stopPropagation();
                    this.draggedNode = node;
                    nodeEl.style.cursor = 'grabbing';

                    // 记录拖动起始位置
                    this.dragStartX = e.clientX;
                    this.dragStartY = e.clientY;

                    // 记录被拖动节点的原始位置
                    node.originalX = node.x;
                    node.originalY = node.y;

                    // 获取被拖动的整棵树的节点ID（用于视觉效果）
                    this.updateDraggedTreeNodeIds(node);

                    // 编辑模式下，拖动开始时断开父节点连接
                    if (this.editMode && node.parentId) {
                        node.parentId = null;
                        this.saveToStorage();
                    }
                });

                // 鼠标悬浮高亮连接线
                nodeEl.addEventListener('mouseenter', () => {
                    this.highlightConnectedLines(node.id);
                });

                // 鼠标移出取消高亮
                nodeEl.addEventListener('mouseleave', () => {
                    this.removeHighlightLines();
                });

                container.appendChild(nodeEl);
            }

            nodeEl.style.left = node.x + 'px';
            nodeEl.style.top = node.y + 'px';

            // 处理节点透明度：搜索状态 > 拖动状态
            if (this.currentSearchQuery) {
                // 搜索时根据是否匹配设置透明度
                const lowerQuery = this.currentSearchQuery.toLowerCase().trim();
                const matches = node.title.toLowerCase().includes(lowerQuery) ||
                               (node.tag && node.tag.toLowerCase().includes(lowerQuery)) ||
                               (node.content && node.content.toLowerCase().includes(lowerQuery));
                nodeEl.style.opacity = matches ? '1' : '0.2';
            } else if (this.draggedTreeNodeIds.size > 0) {
                // 拖动时让其他节点变淡
                nodeEl.style.opacity = this.draggedTreeNodeIds.has(node.id) ? '1' : '0.2';
            } else {
                nodeEl.style.opacity = '1';
            }

            // 始终显示可拖动光标
            nodeEl.style.cursor = 'grab';
        });

        // 绘制连线
        let linesHTML = '';
        this.nodes.forEach(node => {
            if (node.parentId) {
                const parent = this.nodes.find(n => n.id === node.parentId);
                if (parent) {
                    const lineId = `line-${parent.id}-${node.id}`;

                    // 检查是否需要高亮这条线
                    const isHighlighted = this.highlightedNodeId &&
                        (this.highlightedNodeId === parent.id || this.highlightedNodeId === node.id);
                    const stroke = isHighlighted ? '#2563eb' : '#9ca3af';
                    const strokeWidth = isHighlighted ? '1.5' : '1';

                    // 拖动时，只有被拖动的树的线条保持不透明，其他变淡
                    let lineOpacity;
                    if (this.draggedTreeNodeIds.size > 0) {
                        const isInDraggedTree = this.draggedTreeNodeIds.has(parent.id) && this.draggedTreeNodeIds.has(node.id);
                        lineOpacity = isInDraggedTree ? '0.8' : '0.1';
                    } else if (this.currentSearchQuery) {
                        lineOpacity = '0.1';
                    } else if (isHighlighted) {
                        lineOpacity = '1';
                    } else {
                        lineOpacity = '0.8';
                    }

                    linesHTML += `<line id="${lineId}" x1="${parent.x + 7.5}" y1="${parent.y + 7.5}" x2="${node.x + 7.5}" y2="${node.y + 7.5}" class="connection-line" style="stroke: ${stroke}; stroke-width: ${strokeWidth}; opacity: ${lineOpacity}" />`;
                }
            }
        });
        svg.innerHTML = linesHTML;
    }

    saveToStorage() {
        localStorage.setItem('knowledgeGraph', JSON.stringify(this.nodes));
    }

    loadFromStorage() {
        const data = localStorage.getItem('knowledgeGraph');
        if (data) {
            this.nodes = JSON.parse(data);
        }
    }

    // 高亮与节点连接的所有线条
    highlightConnectedLines(nodeId) {
        this.highlightedNodeId = nodeId;
    }

    // 移除所有线条高亮
    removeHighlightLines() {
        this.highlightedNodeId = null;
    }

    // 更新被拖动的树的所有节点ID
    updateDraggedTreeNodeIds(node) {
        this.draggedTreeNodeIds.clear();
        const connectedTree = this.getConnectedTree(node);
        connectedTree.forEach(n => {
            this.draggedTreeNodeIds.add(n.id);
        });
    }

    // 编辑模式下检测节点接触
    checkNodeContact() {
        if (!this.draggedNode) return;

        const draggedNode = this.draggedNode;
        const contactDistance = 25; // 接触距离阈值

        this.nodes.forEach(node => {
            // 跳过自己和自己的子孙节点（避免循环引用）
            if (node.id === draggedNode.id) return;
            if (this.isDescendant(draggedNode.id, node.id)) return;

            const dx = draggedNode.x - node.x;
            const dy = draggedNode.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 如果接触到其他节点，建立父子关系
            if (distance < contactDistance) {
                // 检查是否会形成循环引用
                if (!this.wouldCreateCycle(draggedNode.id, node.id)) {
                    // 建立连接：被拖动节点将接触的节点作为父节点
                    // 这样有子节点的节点也可以接受新的子节点
                    draggedNode.parentId = node.id;
                    this.saveToStorage();
                }
            }
        });
    }

    // 检查节点是否是另一个节点的子孙
    isDescendant(ancestorId, nodeId) {
        let currentId = nodeId;
        while (currentId) {
            const node = this.nodes.find(n => n.id === currentId);
            if (!node) break;
            if (node.parentId === ancestorId) return true;
            currentId = node.parentId;
        }
        return false;
    }
}

// 初始化应用
const app = new KnowledgeGraph();
