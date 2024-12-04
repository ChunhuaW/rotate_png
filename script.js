// 获取canvas元素及其2D绘图上下文
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// 创建图片对象并设置加载路径
const img = new Image();
img.src = '时间轴-透明底.png';

// 图片加载成功后，会触发该函数
img.onload = function () {
    // 获取图片宽度和高度
    const imgWidth = img.width;
    const imgHeight = img.height;
    // 计算图片等比例缩小的比例，以适应画布尺寸，确保完整显示图片的上半部分
    const scale = Math.min(canvas.width / imgWidth, canvas.height / imgHeight);
    // 根据比例计算缩小后的图片宽度和高度
    const scaledWidth = imgWidth * scale;
    const scaledHeight = imgHeight * scale;
    // 以画布中心为旋转中心
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    let startAngle = 0; // 记录鼠标按下时的初始角度
    let isDragging = false; // 标记是否正在拖动鼠标
    let currentAngle = 0; // 当前角度，初始化为0度

    // 为canvas元素添加'mousedown'事件监听器，当鼠标在canvas上按下时触发该函数
    canvas.addEventListener('mousedown', function (e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // 计算鼠标按下时与图片中心的距离
        const dx = x - centerX;
        const dy = y - centerY;
        startAngle = Math.atan2(dy, dx); // 获取初始角度（弧度制）
        isDragging = true;
    });

    // 为canvas元素添加'mousemove'事件监听器，当鼠标在canvas上移动且处于拖动状态（isDragging为true）时触发该函数
    canvas.addEventListener('mousemove', function (e) {
        if (isDragging) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            // 计算鼠标移动时与图片中心的距离
            const dx = x - centerX;
            const dy = y - centerY;
            const current = Math.atan2(dy, dx); // 获取当前角度（弧度制）
            // 计算角度差值并更新当前角度
            const angleDiff = current - startAngle;
            currentAngle += angleDiff * (180 / Math.PI);
            startAngle = current;
            // 重新绘制图片
            draw();
        }
    });

    // 为canvas元素添加'mouseup'事件监听器，当鼠标在canvas上松开时触发该函数
    canvas.addEventListener('mouseup', function () {
        isDragging = false;
    });

    function draw() {
        // 清除画布上之前绘制的内容
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 保存当前绘图状态
        ctx.save();

        // 平移坐标原点到旋转中心
        ctx.translate(centerX, centerY);

        // 将角度转换为弧度进行旋转操作
        ctx.rotate(currentAngle * (Math.PI / 180));

        // 在旋转后的位置绘制缩小后的图片，以图片自身中心为基准绘制
        ctx.drawImage(img, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
        // 恢复之前保存的绘图状态
        ctx.restore();
    }

    // 初始绘制图片
    draw();
};