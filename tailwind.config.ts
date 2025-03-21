import type { Config } from 'tailwindcss'
import { getIconCollections, iconsPlugin } from '@egoist/tailwindcss-icons'

const config: Config = {
  content: [
    './node_modules/rc-modal-sheet/**/*.js',
  ],
  plugins: [
    iconsPlugin({
      collections: {
        ...getIconCollections(['mingcute']),
      },
    }),
  ],
}

export default config
