/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas
 */
const canvas = document.querySelector('canvas')
// willReadFrequently 提示渲染效率
const ctx = canvas.getContext('2d', {
  willReadFrequently: true
})

/**
 * 保证canvas的清晰度 乘以 devicePixelRatio
 */
function initCanvasSize() {
  canvas.width = window.innerWidth * devicePixelRatio
  canvas.height = window.innerHeight * devicePixelRatio
}
initCanvasSize()

/**
 * 获取 [min, max] 范围内的随机整数
 */
function getRandom(min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min)
}

/**
 * 需求：文字由一个个的小圆圈组成的，圆圈称为粒子
 * 每个粒子表达为一个对象 -> 构造函数 Particle 用于创建粒子
 * 粒子的信息：粒子是圆圈
 *  坐标：x,y
 *  半径：size
 *
 * 编程思路: 将复杂问题拆分为多个简单问题 -> 一个粒子的绘制和移动 -> 多个粒子的问题
 *  1.粒子是小圆圈
 *  2.随机的无数小圆圈，形成了一个大圈
 */
class Particle {
  constructor() {
    // 小圈半径
    this.size = getRandom(2 * devicePixelRatio, 7 * devicePixelRatio)
    // 大圈的半径
    const r = Math.min(canvas.width, canvas.height) / 2

    /**
     * 角度->弧度: 1度 = (π/180)rad
     * 弧度->角度: 1rad = (180/π)度
     * 产生随机角度（转弧度rad），确定：小圈在大圈环上的位置
     */
    const rad = (getRandom(0, 360) * Math.PI) / 180
    // 大圈的坐标
    const cx = canvas.width / 2
    const cy = canvas.height / 2

    // 小圈的坐标：在大圈环上的位置
    this.x = cx + r * Math.cos(rad)
    this.y = cy + r * Math.sin(rad)
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
    ctx.fillStyle = '#5445544d'
    ctx.fill()
  }
}

for (let i = 0; i < 1000; i++) {
  const p = new Particle()
  p.draw()
}
