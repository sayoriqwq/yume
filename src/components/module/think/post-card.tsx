// import { cn } from '@/lib/utils'
// import { motion } from 'framer-motion'
// import Image from 'next/image'
// import Link from 'next/link'
// import { useState } from 'react'

// interface PostCardProps {
//   src: string
//   alt: string
//   title: string
//   summary: string
//   date: string
//   mode: 'scroll' | 'drag' | 'grid'
//   className?: string
// }

// export function PostCard({ src, alt, title, summary, date, mode, className }: PostCardProps) {
//   const [isPressed, setIsPressed] = useState(false)

//   return (
//     <motion.div
//       className={
//         cn(
//           'flex w-72 flex-col gap-y-3 rounded-xl p-4 shadow-md backdrop-blur-xs',
//           'group',
//           'transition-all duration-300 hover:shadow-lg',
//           {
//             'flex-col-reverse bg-white': mode === 'scroll',
//             'bg-white': mode === 'drag',
//           },
//           className,
//         )
//       }
//       onPointerDown={() => setIsPressed(true)}
//       onPointerUp={() => setIsPressed(false)}
//       onPointerLeave={() => setIsPressed(false)}
//       animate={{ scale: isPressed ? 1.05 : 1 }}
//     >
//       <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg">
//         <Image
//           src={src}
//           alt={alt}
//           fill
//           className="object-cover transition-transform duration-300 hover:scale-105"
//           draggable={false}
//           onDragStart={e => e.preventDefault()}
//         />
//       </div>

//       <div className="flex flex-col gap-y-3">
//         <div className="flex-between">
//           <Link href={`/post/${title}`}>
//             <h3 className="line-clamp-1 text-lg font-bold text-gray-800 transition-colors duration-300 group-hover:text-blue-500 group-hover:underline">{title}</h3>
//           </Link>
//           <time className="text-xs text-gray-500">{date}</time>
//         </div>

//         <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
//           {summary}
//         </p>
//       </div>
//     </motion.div>
//   )
// }
