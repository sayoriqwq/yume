import type { Options as RehypePrettyCodeOptions } from 'rehype-pretty-code'
import { createHeading } from './elements/heading'
import Pre from './elements/pre'

export const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  pre: Pre,
}

export const rehypePrettyCodeOptions: RehypePrettyCodeOptions = {
  theme: {
    light: 'github-light',
    dark: 'github-dark',
  },
}
