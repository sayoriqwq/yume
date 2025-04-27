// 'use client'

// import type { RefObject } from 'react'
// import { posts } from '@/constants/posts'
// import { useZIndex } from '@/hooks/useZIndex'
// import { motion, useScroll, useTransform } from 'framer-motion'
// import { PostCard } from './post-card'

// interface ScrollCardProps {
//   src: string
//   alt: string
//   title: string
//   summary: string
//   date: string
//   index: number
//   containerRef: RefObject<HTMLDivElement | null>
// }

// export function ScrollCard({ src, alt, title, summary, date, index, containerRef }: ScrollCardProps) {
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ['start start', 'end end'],
//   })

//   // 圆轨迹的半径
//   const radius = 200
//   // 每一个卡片的偏移量
//   const offset = 20

//   // 第一个 card 应该出现的角度
//   // 左下，处于向下趋势
//   const startAngle = 320
//   const endAngle = startAngle + posts.length * offset
//   const angle = useTransform(
//     scrollYProgress,
//     [0, 1],
//     [startAngle - index * offset, endAngle - index * offset],
//   )

//   // 沿着轨迹的 x, y, z 坐标，加上偏移
//   const x = useTransform(angle, a => Math.sin(a * Math.PI / 180) * radius)
//   const y = useTransform(angle, a => Math.cos(a * Math.PI / 180) * radius)
//   // TODO: 理论上来说应该沿着xoz平面旋转，但是这里的z轴是垂直屏幕的，并没有偏移的效果，y的计算需要重新考虑
//   const z = useTransform(angle, a => Math.cos(a * Math.PI / 180) * radius)

//   // TODO: opacity 的风格和原来按照轨迹的风格不一致，这是一个折中的方案
//   const opacity = useTransform(
//     angle,
//     [340, 360],
//     [1, 0],
//   )

//   const [zIndex, updateZIndex, resetZIndex] = useZIndex(posts.length - index)

//   return (
//     <motion.div
//       key={title}
//       // 以新的基准点为中心
//       className="elements absolute left-1/2 top-1/3"
//       style={{
//         zIndex,
//         x,
//         y,
//         z,
//         opacity,
//         transformStyle: 'preserve-3d',
//       }}
//       onMouseDown={updateZIndex}
//       onMouseLeave={resetZIndex}
//     >
//       <PostCard src={src} alt={alt} title={title} summary={summary} date={date} mode="scroll" />
//     </motion.div>
//   )
// }
