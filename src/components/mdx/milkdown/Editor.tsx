import { useMilkdown } from '@/atoms/editor/useMilkdown'
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/kit/core'
import { clipboard } from '@milkdown/kit/plugin/clipboard'
import { indent } from '@milkdown/kit/plugin/indent'
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { gfm } from '@milkdown/kit/preset/gfm'
import { automd } from '@milkdown/plugin-automd'
import { history } from '@milkdown/plugin-history'
import { prism, prismConfig } from '@milkdown/plugin-prism'
import { trailing } from '@milkdown/plugin-trailing'
import { Milkdown, useEditor } from '@milkdown/react'
import { nord } from '@milkdown/theme-nord'
import css from 'refractor/css'
import javascript from 'refractor/javascript'
import jsx from 'refractor/jsx'
import markdown from 'refractor/markdown'
import tsx from 'refractor/tsx'
import typescript from 'refractor/typescript'
import 'prism-themes/themes/prism-nord.css'
import '@/styles/milkdown.css'

export function MilkdownEditor() {
  const { milkdownContent, setMilkdownContent } = useMilkdown()
  useEditor(root =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root)

        ctx.set(defaultValueCtx, milkdownContent)

        const listener = ctx.get(listenerCtx)

        listener.markdownUpdated((ctx, markdown, prevMarkdown) => {
          if (markdown !== prevMarkdown) {
            setMilkdownContent(markdown)
          }
        })

        ctx.set(prismConfig.key, {
          configureRefractor: (refractor) => {
            refractor.register(markdown)
            refractor.register(css)
            refractor.register(javascript)
            refractor.register(typescript)
            refractor.register(jsx)
            refractor.register(tsx)
          },
        })
      })
      .config(nord)
      .use(history)
      .use(listener)
      .use(commonmark)
      .use(gfm)
      .use(prism)
      .use(clipboard)
      .use(indent)
      // 文末node
      .use(trailing)
    // []()这样的没有被解析成链接就可以使用
      .use(automd),
  )

  return (
    <Milkdown />
  )
}
