// 'use client'

// import { posts } from '@/constants/posts'
// import { useRef } from 'react'
// import { DragCard } from './drag-card'

// export function DragCards() {
//   return (
//     <section className="relative grid min-h-screen w-full place-content-center overflow-hidden bg-neutral-950">
//       <Cards />
//     </section>
//   )
// }

// function Cards() {
//   const containerRef = useRef<HTMLDivElement | null>(null)

//   const generateCardPosition = (index: number, totalCards: number) => {
//     // 将容器划分为网格
//     const gridSize = Math.ceil(Math.sqrt(totalCards))
//     const cellWidth = 100 / gridSize
//     const cellHeight = 100 / gridSize

//     // 计算当前卡片所在的网格位置
//     const row = Math.floor(index / gridSize)
//     const col = index % gridSize

//     // 在网格内添加随机偏移，但保持在网格范围内
//     const randomOffset = () => (Math.random() - 0.5) * 20

//     // 计算最终位置，确保卡片完全在视口内
//     const left = `${Math.min(Math.max(col * cellWidth + randomOffset(), 10), 90)}%`
//     const top = `${Math.min(Math.max(row * cellHeight + randomOffset(), 10), 90)}%`

//     // 随机旋转角度 (-15 到 15 度之间)
//     const rotate = `${(Math.random() - 0.5) * 30}deg`

//     return { top, left, rotate }
//   }

//   return (
//     <div className="absolute inset-0 z-10" ref={containerRef}>
//       {posts.map((post, index) => {
//         const { top, left, rotate } = generateCardPosition(index, posts.length)
//         return (
//           <DragCard
//             key={post.id}
//             containerRef={containerRef}
//             src={post.src}
//             alt={post.alt}
//             top={top}
//             left={left}
//             rotate={rotate}
//             title={post.title}
//             summary={post.summary}
//             date={post.date}
//           />
//         )
//       })}
//     </div>
//   )
// }
