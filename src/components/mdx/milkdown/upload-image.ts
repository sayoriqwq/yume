export async function uploadImage(file: File) {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`/api/admin/upload`, {
      method: 'POST',
      body: formData,
    })

    const res = await response.json()

    if (res.code !== 1000) {
      throw new Error(res.msg || '上传图片失败')
    }

    return res
  }
  catch (error) {
    console.error('上传图片错误:', error)
    throw error
  }
}
