// 六种烟花形态生成器

// 觅虹甜心（心形）
function generateHeartParticles(cx, cy, color, count) {
    const particles = [];

    for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;

        // 心形参数方程 - 缩小一半
        const scale = 3;
        const heartX = 16 * Math.pow(Math.sin(t), 3);
        const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

        const x = cx + heartX * scale + randomRange(-2.5, 2.5);
        const y = cy + heartY * scale + randomRange(-2.5, 2.5);

        const angle = Math.atan2(y - cy, x - cx);
        const speed = randomRange(1, 2);
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        particles.push({ x, y, vx, vy, life: randomRange(35, 50) });
    }

    return particles;
}

// 超新星（五角星形）
function generateStarParticles(cx, cy, color, count) {
    const particles = [];
    const points = 5;

    for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;

        // 五角星参数方程 - 缩小一半
        const r = 40 * (1 + 0.5 * Math.cos(points * t));
        const x = cx + r * Math.cos(t) + randomRange(-1.5, 1.5);
        const y = cy + r * Math.sin(t) + randomRange(-1.5, 1.5);

        const angle = Math.atan2(y - cy, x - cx);
        const speed = randomRange(1, 2.5);
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        particles.push({ x, y, vx, vy, life: randomRange(35, 50) });
    }

    return particles;
}

// 全息光环（双圆环）
function generateRingsParticles(cx, cy, color, count) {
    const particles = [];
    const innerRadius = 25;
    const outerRadius = 50;

    // 内环
    const innerCount = Math.floor(count / 2);
    for (let i = 0; i < innerCount; i++) {
        const angle = (i / innerCount) * Math.PI * 2;
        const x = cx + innerRadius * Math.cos(angle);
        const y = cy + innerRadius * Math.sin(angle);

        const speed = 1.5;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        particles.push({ x, y, vx, vy, life: randomRange(35, 50) });
    }

    // 外环
    const outerCount = count - innerCount;
    for (let i = 0; i < outerCount; i++) {
        const angle = (i / outerCount) * Math.PI * 2;
        const x = cx + outerRadius * Math.cos(angle);
        const y = cy + outerRadius * Math.sin(angle);

        const speed = 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        particles.push({ x, y, vx, vy, life: randomRange(35, 50) });
    }

    return particles;
}

// 液态金芒（放射形）
function generateRadialParticles(cx, cy, color, count) {
    const particles = [];
    const rays = 24;

    for (let i = 0; i < count; i++) {
        const rayIndex = i % rays;
        const angle = (rayIndex / rays) * Math.PI * 2;

        const distance = randomRange(10, 65);
        const x = cx + distance * Math.cos(angle) + randomRange(-1.5, 1.5);
        const y = cy + distance * Math.sin(angle) + randomRange(-1.5, 1.5);

        const speed = randomRange(1, 2);
        const vx = Math.cos(angle) * speed + randomRange(-0.3, 0.3);
        const vy = Math.sin(angle) * speed + randomRange(-0.3, 0.3);

        particles.push({ x, y, vx, vy, life: randomRange(35, 50) });
    }

    return particles;
}

// 数码流呈（随机方向扇形）
function generateFanParticles(cx, cy, color, count) {
    const particles = [];

    // 随机选择扇形方向
    const baseAngle = Math.random() * Math.PI * 2;
    const fanSpread = Math.PI / 3;

    for (let i = 0; i < count; i++) {
        const angle = baseAngle + randomRange(-fanSpread / 2, fanSpread / 2);
        const distance = randomRange(15, 75);

        const x = cx + distance * Math.cos(angle);
        const y = cy + distance * Math.sin(angle);

        const speed = randomRange(1, 3);
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        particles.push({ x, y, vx, vy, life: randomRange(35, 50) });
    }

    return particles;
}

// 机械繁花（六瓣花形）
function generateFlowerParticles(cx, cy, color, count) {
    const particles = [];
    const petals = 6;

    for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;

        // 六瓣花公式 - 缩小一半
        const r = 50 * Math.abs(Math.cos(petals * t / 2));
        const x = cx + r * Math.cos(t) + randomRange(-1.5, 1.5);
        const y = cy + r * Math.sin(t) + randomRange(-1.5, 1.5);

        const angle = Math.atan2(y - cy, x - cx);
        const speed = randomRange(0.8, 2);
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        particles.push({ x, y, vx, vy, life: randomRange(35, 50) });
    }

    return particles;
}

// 烟花类型生成器映射
const FireworkGenerators = {
    'heart': generateHeartParticles,
    'star': generateStarParticles,
    'rings': generateRingsParticles,
    'radial': generateRadialParticles,
    'fan': generateFanParticles,
    'flower': generateFlowerParticles
};

// 获取烟花粒子
function getFireworkParticles(type, cx, cy, color, count) {
    const generator = FireworkGenerators[type];
    if (generator) {
        return generator(cx, cy, color, count);
    }
    return [];
}
