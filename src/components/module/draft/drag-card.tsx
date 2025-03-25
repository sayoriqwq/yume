'use client'

import type { RefObject } from 'react'
import { useZIndex } from '@/hooks/useZIndex'
import { cn } from '@/lib/utils'
import { motion, useMotionValue } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { DraftCard } from './draft-card'

interface DraftDragCardProps {
  containerRef: RefObject<HTMLDivElement | null>
  id: number
  title: string
  slug: string
  category: string
  description?: string
  cover?: string
  content: string
  viewCount: number
  published: boolean
  createdAt: Date
  updatedAt?: Date
  top: string
  left: string
  rotate: string
  className?: string
}

export function DraftDragCard({
  containerRef,
  top,
  left,
  rotate: initialRotate,
  className,
  id,
  ...articleProps
}: DraftDragCardProps) {
  const [zIndex, updateZIndex] = useZIndex(0)
  const [isRotateMode, setIsRotateMode] = useState(false)
  const [isMouseDown, setIsMouseDown] = useState(false)

  // 跟踪旋转角度
  const initialAngle = Number.parseInt(initialRotate) || 0
  const rotation = useMotionValue(initialAngle)
  // 存储上一次的角度值和鼠标位置
  const lastAngle = useRef(initialAngle)
  const lastMousePosition = useRef({ x: 0, y: 0 })
  const accumulatedRotation = useRef(initialAngle)

  // 监听Alt键按下状态
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setIsRotateMode(true)
        e.preventDefault()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setIsRotateMode(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // 参考点，用于计算旋转
  const elementRef = useRef<HTMLDivElement>(null)

  // 处理鼠标按下事件，同时记录初始鼠标位置
  const handleMouseDown = (e: React.MouseEvent) => {
    updateZIndex()
    setIsMouseDown(true)

    if (elementRef.current) {
      lastMousePosition.current = { x: e.clientX, y: e.clientY }
      // 记录当前的累积角度
      accumulatedRotation.current = lastAngle.current
    }
  }

  return (
    <motion.div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      onMouseUp={() => setIsMouseDown(false)}
      onMouseLeave={() => setIsMouseDown(false)}
      style={{
        top,
        left,
        zIndex,
        rotate: rotation,
      }}
      className={cn(
        'absolute cursor-grab drag-elements',
        isRotateMode ? 'cursor-alias' : '',
        className,
      )}
      drag={!isRotateMode}
      dragConstraints={containerRef}
      dragElastic={0.3}
      whileDrag={{ scale: 1.05 }}
      whileTap={{ cursor: isRotateMode ? 'alias' : 'grabbing' }}
      // 添加过渡效果
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        boxShadow: isRotateMode
          ? '0 10px 30px rgba(0, 0, 0, 0.2)'
          : '0 4px 15px rgba(0, 0, 0, 0.1)',
      }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      onMouseMove={(e) => {
        // 只有同时按住Alt键和鼠标左键时才能旋转
        if (isRotateMode && isMouseDown && elementRef.current) {
          const rect = elementRef.current.getBoundingClientRect()
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2

          // 计算当前鼠标位置与中心点的角度
          const currentMousePos = { x: e.clientX, y: e.clientY }

          // 计算上一次鼠标位置的角度和当前鼠标位置的角度
          const lastAngleRad = Math.atan2(
            lastMousePosition.current.y - centerY,
            lastMousePosition.current.x - centerX,
          )

          const currentAngleRad = Math.atan2(
            currentMousePos.y - centerY,
            currentMousePos.x - centerX,
          )

          // 计算角度差（弧度）
          let deltaAngleRad = currentAngleRad - lastAngleRad

          // 处理过±π边界的情况
          if (deltaAngleRad > Math.PI) {
            deltaAngleRad -= 2 * Math.PI
          }
          else if (deltaAngleRad < -Math.PI) {
            deltaAngleRad += 2 * Math.PI
          }

          // 将弧度差转为角度差
          const deltaAngleDeg = deltaAngleRad * (180 / Math.PI)

          // 累积角度变化
          accumulatedRotation.current += deltaAngleDeg

          // 应用平滑因子
          const rotationFactor = 0.2
          const smoothedAngle = lastAngle.current * (1 - rotationFactor) + accumulatedRotation.current * rotationFactor

          // 更新状态
          lastAngle.current = smoothedAngle
          lastMousePosition.current = currentMousePos

          // 设置旋转
          rotation.set(smoothedAngle)
        }
      }}
    >
      <DraftCard
        {...articleProps}
        id={id}
        mode="drag"
        className={cn(
          'transition-all duration-300',
          isRotateMode && 'ring-2 ring-primary ring-offset-2',
        )}
      />
    </motion.div>
  )
}
