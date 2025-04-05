'use client'

import type { MDXEditorProps as BaseMDXEditorProps, MDXEditorMethods } from '@mdxeditor/editor'
import type { ForwardedRef } from 'react'
import {
  codeBlockPlugin,
  codeMirrorPlugin,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  // directivesPlugin,
  // jsxPlugin,
} from '@mdxeditor/editor'
// 只导入最简单的工具栏
import { SimpleToolbar } from './editor/SimpleToolbar'

import '@mdxeditor/editor/style.css'

// Sandpack 设置（可选，用于交互式代码块）
// import { sandpackPlugin, SandpackConfig } from '@mdxeditor/editor'
// const defaultSnippetContent = `
// export default function App() {
//   return (
//     <div className="App">
//       <h1>Hello CodeSandbox</h1>
//       <h2>Start editing to see some magic happen!</h2>
//     </div>
//   )
// }
// `.trim()

// const simpleSandpackConfig: SandpackConfig = {
//   defaultPreset: 'react',
//   presets: [
//     {
//       label: 'React',
//       name: 'react',
//       meta: 'live react',
//       sandpackTemplate: 'react',
//       sandpackTheme: 'light',
//       snippetFileName: '/App.js',
//       snippetLanguage: 'jsx',
//       initialSnippetContent: defaultSnippetContent
//     }
//   ]
// }

// 定义插件
function defaultPlugins(_markdown: string | (() => Promise<string>) | Promise<string>) {
  return [
    headingsPlugin(),
    listsPlugin(),
    quotePlugin(),
    thematicBreakPlugin(),
    linkPlugin(),
    imagePlugin(),
    tablePlugin(),
    frontmatterPlugin(),
    codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
    // sandpackPlugin({ sandpackConfig: simpleSandpackConfig }), // 可选
    // directivesPlugin({ directiveDescriptors: [] }), // 可选
    // jsxPlugin(), // 可选
    linkDialogPlugin(),
    codeMirrorPlugin({
      codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'text', tsx: 'TypeScript' },
    }),
    // diffSourcePlugin({ diffMarkdown: markdown, viewMode: 'rich-text' }), // 可选
    markdownShortcutPlugin(),
    toolbarPlugin({ toolbarContents: () => <SimpleToolbar /> }),
  ]
}

// 扩展基础编辑器属性
// 使用 Omit 排除我们手动处理的属性（markdown, onChange, plugins）
interface EditorWrapperProps extends Omit<BaseMDXEditorProps, 'markdown' | 'onChange' | 'plugins'> {
  editorRef?: ForwardedRef<MDXEditorMethods> | null
  markdown: string // 显式要求 markdown 属性
  onChange: (markdown: string) => void
}

export default function MDXEditorWrapper({
  editorRef,
  markdown,
  onChange,
  ...rest // 传递剩余属性
}: EditorWrapperProps) {
  return (
    <MDXEditor
      ref={editorRef}
      markdown={markdown} // 正确传递 markdown 属性
      onChange={onChange}
      // 使用当前 markdown 值初始化插件
      plugins={defaultPlugins(markdown)}
      contentEditableClassName="prose dark:prose-invert prose-sm max-w-none"
      {...rest} // 展开剩余属性
    />
  )
}
