'use client'

import { serialize } from 'next-mdx-remote/serialize'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import rehypePrettyCode from 'rehype-pretty-code'
import { components, rehypePrettyCodeOptions } from './components/components'

// 动态导入MDXRemote组件，避免服务端渲染问题
const MDXRemote = dynamic(() => import('next-mdx-remote').then(mod => mod.MDXRemote), {
  ssr: false,
  loading: () => <div className="p-4">加载内容中...</div>,
})

interface ClientMDXProps {
  markdown: string
  className?: string
  components?: Record<string, React.ComponentType<any>>
}

export function ClientMDX({ markdown, className, components: customComponents }: ClientMDXProps) {
  const [mdxSource, setMdxSource] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 处理MDX内容
  useEffect(() => {
    async function prepareMDX() {
      setIsLoading(true)
      try {
        const serialized = await serialize(markdown || '', {
          mdxOptions: {
            rehypePlugins: [
              [rehypePrettyCode, rehypePrettyCodeOptions],
            ],
          },
        })

        setMdxSource(serialized)
      }
      catch (error) {
        console.error('解析MDX失败:', error)
      }
      finally {
        setIsLoading(false)
      }
    }

    prepareMDX()
  }, [markdown])

  if (isLoading) {
    return <div className={className}>内容加载中...</div>
  }

  if (!mdxSource) {
    return <div className={className}>无法渲染内容</div>
  }

  return (
    <div className={className}>
      <MDXRemote
        {...mdxSource}
        components={{ ...components, ...customComponents }}
      />
    </div>
  )
}

// 导出编译源码钩子，便于外部使用
export function useCompiledMDX(markdown: string) {
  const [compiledSource, setCompiledSource] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function compile() {
      setIsLoading(true)
      setError(null)
      try {
        const serialized = await serialize(markdown || '', {
          mdxOptions: {
            rehypePlugins: [
              [rehypePrettyCode, rehypePrettyCodeOptions],
            ],
          },
        })

        setCompiledSource(serialized.compiledSource)
      }
      catch (err) {
        setError(err instanceof Error ? err : new Error('未知错误'))
        console.error('编译MDX失败:', err)
      }
      finally {
        setIsLoading(false)
      }
    }

    compile()
  }, [markdown])

  return { compiledSource, isLoading, error }
}
