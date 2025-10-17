import type { RehypeShikiOptions } from '@shikijs/rehype'
import { transformerNotationDiff, transformerNotationErrorLevel, transformerNotationFocus, transformerNotationHighlight } from '@shikijs/transformers'
import { transformerCopyButton } from '../shiki-transformers/copy-button'

export const rehypeShikiOption: RehypeShikiOptions = {
  themes: {
    light: 'github-light',
    dark: 'github-dark',
  },
  transformers: [
    transformerNotationDiff({ matchAlgorithm: 'v3' }),
    transformerNotationHighlight({ matchAlgorithm: 'v3' }),
    transformerNotationFocus({ matchAlgorithm: 'v3' }),
    transformerNotationErrorLevel({ matchAlgorithm: 'v3' }),
    transformerCopyButton({
      visibility: 'always',
      feedbackDuration: 3_000,
    }),
  ],
}
