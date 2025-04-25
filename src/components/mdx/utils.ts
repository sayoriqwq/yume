/**
 * 将字符串转换为URL友好的slug
 * 处理特殊字符、空格和大小写
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
  // 将空格替换为短横线
    .replace(/\s+/g, '-')
  // 处理特殊字符
    .replace(/[^\w\-]+/g, '-')
  // 删除开头和结尾的短横线
    .replace(/^-+/, '')
    .replace(/-+$/, '')
  // 避免连续的短横线
    .replace(/-+/g, '-')
}
