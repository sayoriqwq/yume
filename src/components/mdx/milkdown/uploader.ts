import type { Uploader } from '@milkdown/plugin-upload'
import type { Node } from '@milkdown/prose/model'
import { Decoration } from '@milkdown/prose/view'
import toast from 'react-hot-toast'
import { uploadImage } from './upload-image'

// 图片压缩工具
export async function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file)
              return
            }
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })
            resolve(resizedFile)
          },
          file.type,
          0.8,
        )
      }
    }
  })
}

// 自定义图片上传器
export const uploader: Uploader = async (files, schema) => {
  const images: File[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files.item(i)
    if (!file) {
      continue
    }

    if (!file.type.startsWith('image/')) {
      continue
    }

    images.push(file)
  }

  const nodes: Node[] = await Promise.all(
    images.map(async (image) => {
      try {
        // 使用项目中已有的图片上传服务
        const result = await uploadImage(image)

        return schema.nodes.image.createAndFill({
          src: result.data.url,
          alt: image.name,
          title: image.name,
        }) as Node
      }
      catch (error) {
        toast.error('图片上传失败')
        console.error(error)
        return null
      }
    }),
  ).then(nodes => nodes.filter(Boolean) as Node[])

  return nodes
}

// 上传进度组件
export function uploadWidgetFactory(pos: number, spec: Parameters<typeof Decoration.widget>[2]) {
  const widgetDOM = document.createElement('span')
  widgetDOM.textContent = '图片上传中...'
  widgetDOM.style.color = '#006fee'
  return Decoration.widget(pos, widgetDOM, spec)
}
