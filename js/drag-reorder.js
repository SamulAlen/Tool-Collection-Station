/**
 * 拖拽排序控制器
 * 实现导航菜单项的拖拽排序功能
 */

class DragReorderController {
    constructor() {
        this.navList = document.querySelector('.nav-list');
        this.draggedItem = null;
        this.draggedIndex = null;

        if (!this.navList) {
            console.error('Navigation list not found');
            return;
        }

        this.init();
    }

    /**
     * 初始化拖拽排序
     */
    init() {
        const navItems = this.navList.querySelectorAll('.nav-item');

        navItems.forEach((item, index) => {
            // 为每个导航项添加拖拽属性
            item.setAttribute('draggable', 'true');
            item.dataset.index = index;

            // 添加拖拽手柄
            const dragHandle = document.createElement('span');
            dragHandle.className = 'drag-handle';
            dragHandle.innerHTML = '⋮⋮';
            dragHandle.title = '拖动排序';
            item.appendChild(dragHandle);

            // 绑定拖拽事件
            this.bindDragEvents(item);
        });

        // 加载保存的排序
        this.loadSavedOrder();

        console.log('DragReorderController initialized');
    }

    /**
     * 绑定拖拽事件
     * @param {HTMLElement} item - 导航项元素
     */
    bindDragEvents(item) {
        // 开始拖拽
        item.addEventListener('dragstart', (e) => {
            this.draggedItem = item;
            this.draggedIndex = parseInt(item.dataset.index);
            item.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', item.innerHTML);
        });

        // 拖拽结束
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            this.draggedItem = null;
            this.draggedIndex = null;

            // 移除所有 drag-over 样式
            const items = this.navList.querySelectorAll('.nav-item');
            items.forEach(i => i.classList.remove('drag-over'));
        });

        // 拖拽经过
        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            if (this.draggedItem && this.draggedItem !== item) {
                item.classList.add('drag-over');
                this.getDragAfterElement(item);
            }
        });

        // 拖拽离开
        item.addEventListener('dragleave', () => {
            item.classList.remove('drag-over');
        });

        // 放置
        item.addEventListener('drop', (e) => {
            e.preventDefault();
            item.classList.remove('drag-over');

            if (this.draggedItem && this.draggedItem !== item) {
                const targetIndex = parseInt(item.dataset.index);
                this.reorderItems(this.draggedIndex, targetIndex);
            }
        });
    }

    /**
     * 获取拖拽后的插入位置
     * @param {HTMLElement} targetItem - 目标元素
     */
    getDragAfterElement(targetItem) {
        const allItems = [...this.navList.querySelectorAll('.nav-item')];
        const draggedIndex = allItems.indexOf(this.draggedItem);
        const targetIndex = allItems.indexOf(targetItem);

        if (draggedIndex < targetIndex) {
            // 向后拖拽
            targetItem.after(this.draggedItem);
        } else {
            // 向前拖拽
            targetItem.before(this.draggedItem);
        }

        this.updateIndexes();
    }

    /**
     * 重新排序导航项
     * @param {number} fromIndex - 起始索引
     * @param {number} toIndex - 目标索引
     */
    reorderItems(fromIndex, toIndex) {
        const items = [...this.navList.querySelectorAll('.nav-item')];
        const [draggedItem] = items.splice(fromIndex, 1);
        items.splice(toIndex, 0, draggedItem);

        // 更新 DOM
        items.forEach(item => {
            this.navList.appendChild(item);
        });

        // 更新索引
        this.updateIndexes();

        // 保存排序
        this.saveOrder(items);

        console.log(`Reordered: item ${fromIndex} -> ${toIndex}`);
    }

    /**
     * 更新所有导航项的索引
     */
    updateIndexes() {
        const items = this.navList.querySelectorAll('.nav-item');
        items.forEach((item, index) => {
            item.dataset.index = index;
        });
    }

    /**
     * 保存排序到 localStorage
     * @param {NodeList} items - 导航项列表
     */
    saveOrder(items) {
        const order = [];
        items.forEach(item => {
            const appId = item.getAttribute('data-app');
            if (appId) {
                order.push(appId);
            }
        });
        localStorage.setItem('navOrder', JSON.stringify(order));
    }

    /**
     * 加载保存的排序
     */
    loadSavedOrder() {
        const savedOrder = localStorage.getItem('navOrder');
        if (!savedOrder) return;

        try {
            const order = JSON.parse(savedOrder);
            const items = this.navList.querySelectorAll('.nav-item');
            const itemsMap = new Map();

            // 创建映射
            items.forEach(item => {
                const appId = item.getAttribute('data-app');
                if (appId) {
                    itemsMap.set(appId, item);
                }
            });

            // 按保存的顺序重新排列
            order.forEach(appId => {
                const item = itemsMap.get(appId);
                if (item) {
                    this.navList.appendChild(item);
                }
            });

            // 更新索引
            this.updateIndexes();

            console.log('Loaded saved navigation order');
        } catch (e) {
            console.error('Failed to load saved order:', e);
        }
    }

    /**
     * 重置排序到默认顺序
     */
    resetToDefault() {
        localStorage.removeItem('navOrder');
        const config = APP_CONFIG.apps;
        const items = this.navList.querySelectorAll('.nav-item');
        const itemsMap = new Map();

        items.forEach(item => {
            const appId = item.getAttribute('data-app');
            if (appId) {
                itemsMap.set(appId, item);
            }
        });

        // 按配置中的顺序重新排列
        Object.keys(config).forEach(appId => {
            const item = itemsMap.get(appId);
            if (item) {
                this.navList.appendChild(item);
            }
        });

        this.updateIndexes();
        console.log('Reset to default order');
    }
}
