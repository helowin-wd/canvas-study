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
 * 第一步：绘制粒子
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

  /**
   * 第二步：思考：粒子的运动 -> 坐标的变动：让粒子的坐标 运动到 新坐标位置
   *
   * 动画效果：一段时间内匀速的逼近目标位置
   */
  moveTo(tx, ty) {
    const duration = 500 // 500ms的运动时间
    // 起始位置
    const sx = this.x,
      sy = this.y
    // 横向/纵向速度 = (运动位置 - 起始位置) / 总时间
    const xSpeed = (tx - sx) / duration
    const ySpeed = (ty - sy) / duration
    // 开始运动的时间
    const startTime = Date.now()
    /**
     * 每次调用这个函数，运动小部分
     * _move 函数计算一个下一个新的位置，然后使用requestAnimationFrame
     * 注册下一次移动
     * @returns
     */
    const _move = () => {
      // 当前运动了多少时间
      const t = Date.now() - startTime
      // 目前的位置 = 初始位置 + 速度*时间
      const x = sx + xSpeed * t
      const y = sy + ySpeed * t
      // 更新坐标位置
      this.x = x
      this.y = y
      /**
       * 运动时间 超过 总运动时间，设为目标位置
       * 然后停止
       */
      if (t >= duration) {
        this.x = tx
        this.y = ty
        return
      }

      /**
       * x, y改动一点
       * _move 函数计算一个下一个新的位置，然后使用requestAnimationFrame
       * 注册下一次移动
       */
      requestAnimationFrame(_move)
    }
    _move()
  }
}

/**
 * 多个粒子的问题
 *  1.产生粒子数组，每一个粒子 都是 Particle对象
 *  2.
 */
const particles = []

/**
 * 清空画布
 */
function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const p = new Particle()
/**
 * 全局的draw方法：不断的重新画
 *  1.清空画布
 *  2.更新粒子：粒子数量和坐标
 *    粒子数量：有哪些粒子，有多少个粒子
 *       粒子的数量和文字有关，不同的文字需要的粒子数量不一样
 *       先绘制文字，通过文字分析需要的粒子数量
 *    粒子坐标：每个粒子是否需要更新位置
 *  3.然后下一次重新画
 */
function draw() {
  update()
  for (const p of particles) {
    p.draw()
  }
  // 不断调用draw函数
  requestAnimationFrame(draw)
}

let text = null
draw()

/**
 * 时间文字 '11:57:31' 
 * 
 * 优化点🔥
 *  精确到秒，并不会频繁更新，为了避免频繁更新
 *  声明全局变量text，当前文字和之前文字没有差异，直接结束
 *  有差异，更新文字
 * @returns
 */
function getText() {
  return new Date().toTimeString().substring(0, 8)
}

/**
 * 更新粒子数量和坐标
 */
function update() {
  // 1. 画文字
  const curText = getText()
  // 当前文字和之前文字没有差异，直接结束
  if (text === curText) {
    return
  }
  // 有差异，更新文字
  text = curText
  clear()
  // 绘制
  const { width, height } = canvas
  ctx.fillStyle = '#000'
  ctx.textBaseline = 'middle'
  ctx.font = `${140 * devicePixelRatio}px 'DS-Digital',
  sans-serif`
  ctx.textAlign = 'center'
  ctx.fillText(text, width / 2, height / 2)
}

