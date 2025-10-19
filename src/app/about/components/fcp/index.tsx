'use client'

import { CenterImg } from './center-img'
import { IMG_PADDING } from './constants/page-config'
import { Overlay } from './overlay'

export function Fcp() {
  return (
    <div
      className="relative h-screen w-full"
      style={{ paddingLeft: IMG_PADDING, paddingRight: IMG_PADDING }}
    >
      <CenterImg />
      <Overlay />
    </div>
  )
}
