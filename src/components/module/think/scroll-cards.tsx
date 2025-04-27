// 'use client'

// import { posts } from '@/constants/posts'
// import { useRef } from 'react'
// import { ScrollCard } from './scroll-card'

// export function ScrollCards() {
//   const containerRef = useRef<HTMLDivElement | null>(null)

//   return (
//     <div className="relative mx-auto h-[300vh] w-full">
//       <div ref={containerRef} className="sticky top-0 h-screen w-full overflow-hidden">
//         {posts.map((post, index) => (
//           <ScrollCard
//             key={post.title}
//             src={post.src}
//             alt={post.alt}
//             title={post.title}
//             summary={post.summary}
//             date={post.date}
//             index={index}
//             containerRef={containerRef}
//           />
//         ))}
//       </div>
//     </div>
//   )
// }
