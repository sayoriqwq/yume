// import type { RefObject } from 'react'
// import { useZIndex } from '@/hooks/useZIndex'
// import { cn } from '@/lib/utils'
// import { motion } from 'framer-motion'
// import { PostCard } from './post-card'

// interface DragCardProps {
//   containerRef: RefObject<HTMLDivElement | null>
//   src: string
//   alt: string
//   top: string
//   left: string
//   rotate: string
//   title: string
//   summary: string
//   date: string
//   className?: string
// }

// export function DragCard({
//   containerRef,
//   src,
//   alt,
//   top,
//   left,
//   rotate,
//   title,
//   summary,
//   date,
//   className,
// }: DragCardProps) {
//   const [zIndex, updateZIndex] = useZIndex(0)

//   return (
//     <motion.div
//       onMouseDown={updateZIndex}
//       style={{
//         top,
//         left,
//         rotate,
//         zIndex,
//       }}
//       className={cn(
//         'elements absolute cursor-grab',
//         className,
//       )}
//       drag
//       dragConstraints={containerRef}
//       dragElastic={0.3}
//     >
//       <PostCard src={src} alt={alt} title={title} summary={summary} date={date} mode="drag" />
//     </motion.div>
//   )
// }
