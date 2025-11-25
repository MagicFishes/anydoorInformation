export const setHtmlFontSize = () => {
    let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
    if (htmlWidth > 768) {
        // 桌面端：以 1920 为基准值，大屏幕等比放大
        document.documentElement.style.fontSize = 100 / 1920 + "vw";
    } else {
        // 移动端：以 375 为基准值
        document.documentElement.style.fontSize = 100 / 375 + "vw";
    }
};

// 初始化
setHtmlFontSize();

// 监听窗口大小变化
window.addEventListener("resize", setHtmlFontSize);

