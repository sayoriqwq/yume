// https://github.com/vercel/satori/issues/660

import type { NextRequest } from 'next/server'
import { siteConfig } from '@/config/site'
import { ImageResponse } from 'next/og'

// 字体文件
export const runtime = 'edge'

// 图片尺寸
const width = 1200
const height = 630

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // 获取查询参数，提供默认值确保安全
    const title = searchParams.get('title') || siteConfig.name
    const description = searchParams.get('description') || siteConfig.description
    const theme = searchParams.get('theme') || 'dark'

    // 日期格式化
    const date = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    // 定义主题颜色
    const themeColors = {
      dark: {
        bg: 'linear-gradient(to bottom right, #111827, #1f2937)',
        text: '#ffffff',
        accent: '#3b82f6',
        card: 'rgba(255, 255, 255, 0.1)',
      },
      light: {
        bg: 'linear-gradient(to bottom right, #f8fafc, #e2e8f0)',
        text: '#0f172a',
        accent: '#3b82f6',
        card: 'rgba(255, 255, 255, 0.8)',
      },
    }

    const colors = theme === 'light' ? themeColors.light : themeColors.dark

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: colors.bg,
            color: colors.text,
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* 装饰元素 */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120%',
            height: '120%',
            opacity: 0.1,
            background: `radial-gradient(circle at center, ${colors.accent}55 0%, transparent 70%)`,
          }}
          />

          {/* 波浪装饰 */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '15%',
            backgroundImage: `linear-gradient(to right, transparent, ${colors.accent}40, transparent)`,
            backgroundSize: '200% 100%',
            clipPath: 'polygon(0 50%, 5% 45%, 10% 50%, 15% 55%, 20% 50%, 25% 45%, 30% 50%, 35% 55%, 40% 50%, 45% 45%, 50% 50%, 55% 55%, 60% 50%, 65% 45%, 70% 50%, 75% 55%, 80% 50%, 85% 45%, 90% 50%, 95% 55%, 100% 50%, 100% 100%, 0 100%)',
          }}
          />

          {/* 卡片内容 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            width: '80%',
            maxWidth: '900px',
            padding: '48px',
            borderRadius: '24px',
            background: colors.card,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(10px)',
          }}
          >
            {/* 顶部区域：Logo 和日期 */}
            <div style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  background: colors.accent,
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '20px',
                }}
                >
                  YM
                </div>
                <span style={{ fontSize: '24px', fontWeight: 500 }}>
                  {siteConfig.name}
                </span>
              </div>
              <div style={{ fontSize: '16px', opacity: 0.8 }}>
                {date}
              </div>
            </div>

            {/* 标题 */}
            <h1 style={{
              fontSize: '48px',
              fontWeight: 800,
              margin: '0 0 16px 0',
              padding: '5px',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              background: `linear-gradient(to right, ${colors.text}, ${colors.accent})`,
              backgroundClip: 'text',
              color: 'transparent',
            }}
            >
              {title}
            </h1>

            {/* 描述 */}
            {description && (
              <p style={{
                fontSize: '22px',
                margin: 0,
                opacity: 0.8,
                lineHeight: 1.4,
                maxWidth: '85%',
              }}
              >
                {description.length > 100
                  ? `${description.substring(0, 100)}...`
                  : description}
              </p>
            )}
          </div>

          {/* 页脚 */}
          <div style={{
            position: 'absolute',
            bottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'auto',
            fontSize: '16px',
          }}
          >
            <span>
              访问
              {siteConfig.url}
              {' '}
              了解更多
            </span>
          </div>
        </div>
      ),
      {
        width,
        height,
        headers: {
          'Cache-Control': 'public, max-age=86400, must-revalidate',
        },
      },
    )
  }
  catch (error) {
    console.error('OG 图片生成失败:', error)

    // 返回一个简单的备用图片
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            background: '#f3f4f6',
            color: '#111827',
          }}
        >
          {siteConfig.name}
        </div>
      ),
      {
        width,
        height,
      },
    )
  }
}
