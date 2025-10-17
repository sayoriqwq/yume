import type { ShikiTransformer } from 'shiki'
import { cn } from '@/lib/utils'

interface CopyButtonOptions {
  feedbackDuration?: number
  visibility?: 'hover' | 'always'
}

export function transformerCopyButton(
  options: CopyButtonOptions = {
    visibility: 'hover',
    feedbackDuration: 3_000,
  },
): ShikiTransformer {
  return {
    name: 'copy-button',
    pre(node) {
      node.properties = {
        ...(node.properties || {}),
        class: `${node.properties.class || ''} group relative`.trim(),
      }

      const baseBtnClass = cn(
        'rehype-shiki-copy',
        // 定位
        'absolute -top-1 -right-1',
        // 基础样式
        'rounded-md px-2 py-1 text-text-tertiary cursor-pointer',
        // 交互
        // focus采用 shiki的
        // 复制成功
        'data-[copied=true]:text-accent',
        // hover
        options.visibility === 'hover'
          ? 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
          : 'opacity-100',
      )

      node.children.unshift({
        type: 'element',
        tagName: 'button',
        properties: {
          'type': 'button',
          'data-code': this.source,
          'title': '复制代码',
          'aria-label': 'Copy code',
          'class': baseBtnClass,
          'data-visibility': options.visibility,
          'data-feedback-duration': options.feedbackDuration,
          'data-name': 'rehype-shiki-copy-button',
          'data-copied': 'false',
          // 水合后注入事件
          'onclick': undefined,
        },
        children: [
          {
            type: 'element',
            // 非常重要，span 会导致 shiki 选到这个标签然后暗色模式的样式无法覆盖住他
            tagName: 'i',
            properties: { 'class': 'icon i-mingcute-copy-2-line size-4', 'data-role': 'icon' },
            children: [],
          },
        ],
      })
    },
  }
}

// 水合时注入
let installed = false
let clickHandler: ((event: Event) => void) | null = null

export function registerCopyButton() {
  if (typeof document === 'undefined')
    return
  if (installed)
    return

  clickHandler = async (event: Event) => {
    const target = event.target as HTMLElement | null
    const btn = target?.closest('button[data-name="rehype-shiki-copy-button"]') as HTMLButtonElement | null
    if (!btn)
      return
    event.preventDefault()

    // 优先使用 data-code；缺失时回退到最近 pre>code 文本
    let source = btn.getAttribute('data-code') || ''
    if (!source) {
      const pre = btn.closest('pre')
      const codeEl = pre?.querySelector('code')
      source = codeEl?.textContent || ''
    }
    if (!source)
      return
    // 归一化换行
    source = source.replace(/\r\n?/g, '\n')

    const icon = btn.querySelector('[data-role="icon"]') as HTMLElement | null
    const feedbackDuration = btn.getAttribute('data-feedback-duration')

    const restore = () => {
      btn.setAttribute('data-copied', 'false')
      if (icon) {
        icon.classList.remove('i-mingcute-check-line')
        icon.classList.add('i-mingcute-copy-2-line')
      }
    }
    const succeed = () => {
      if (icon) {
        icon.classList.remove('i-mingcute-copy-2-line')
        icon.classList.add('i-mingcute-check-line')
      }
      btn.setAttribute('data-copied', 'true')
      setTimeout(restore, Number(feedbackDuration || 2_500))
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(source)
        succeed()
      }
      else {
        const ta = document.createElement('textarea')
        ta.value = source
        ta.style.position = 'fixed'
        ta.style.top = '0'
        ta.style.left = '0'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.focus()
        ta.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(ta)
        if (ok)
          succeed()
        else throw new Error('execCommand copy failed')
      }
    }
    catch (err) {
      console.warn('[copy-button] copy failed', err)
      btn.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-4px)' },
        { transform: 'translateX(4px)' },
        { transform: 'translateX(0)' },
      ], { duration: 300, easing: 'ease-in-out' })
    }
  }

  document.addEventListener('click', clickHandler)
  installed = true
}

export function unregisterCopyButton() {
  if (typeof document === 'undefined')
    return
  if (!installed || !clickHandler)
    return
  document.removeEventListener('click', clickHandler)
  clickHandler = null
  installed = false
}
