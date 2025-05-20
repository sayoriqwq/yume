/**
 * 将字符串转换为URL友好的slug
 * 处理特殊字符、空格和大小写
 * 对中文和其他非ASCII字符进行特殊处理
 */
export function slugify(text: string): string {
  if (!text)
    return ''

  // 为每个标题生成一个唯一且安全的ID
  // 1. 对于纯英文和数字，维持原来的slugify逻辑
  // 2. 对于中文和其他非ASCII字符，转换为拼音或者使用编码

  // 首先尝试常规处理
  const slug = text
    .toString()
    .toLowerCase()
    .trim()
    // 将空格替换为短横线
    .replace(/\s+/g, '-')
    // 对于中文和特殊字符，我们使用更宽容的替换策略
    // 保留字母、数字、中文字符、短横线
    .replace(/[^\w\u4E00-\u9FA5\-]+/g, '-')
    // 删除开头和结尾的短横线
    .replace(/^-+/, '')
    .replace(/-+$/, '')
    // 避免连续的短横线
    .replace(/-+/g, '-')

  // 如果处理后的slug为空（可能全是特殊字符），或者长度过长，使用哈希
  if (!slug || slug.length > 50) {
    // 创建一个简单的哈希
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i)
      hash |= 0 // 转换为32位整数
    }
    return `heading-${Math.abs(hash).toString(16)}`
  }

  return slug
}
