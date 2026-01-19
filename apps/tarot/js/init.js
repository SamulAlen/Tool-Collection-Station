// 全局导出和初始化检查
(function() {
    // 确保 audioManager 在全局作用域
    if (typeof audioManager !== 'undefined') {
        window.audioManager = audioManager;
    }
})();
