import type { Options } from 'rehype-autolink-headings'

export const rehypeAutolinkHeadingsOptions: Options = {
  behavior: 'append',
  test: (el: any) => el?.tagName !== 'h1',
  content: { type: 'text', value: '#' },
  headingProperties: {
    className: ['group flex gap-2 w-fit'],
  },
  properties: {
    className: [
      'no-underline',
      'opacity-0 group-hover:opacity-100 text-gray2',
    ],
    ariaLabel: 'Link to section',
    // 作为装饰性链接：不进 tab 序列
    tabIndex: -1,
  },
}
