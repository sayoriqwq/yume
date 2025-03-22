import type { UserJSON, WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/db'
/**
 * 同步Clerk用户数据到数据库
 */
export async function syncWithDatabase(evt: WebhookEvent) {
  const eventType = evt.type
  const userData = evt.data as UserJSON

  console.log(`处理 ${eventType} 事件，用户ID: ${userData.id}`)

  try {
    switch (eventType) {
      // 用户创建事件
      case 'user.created': {
        const primaryEmail = userData.email_addresses?.find(
          email => email.id === userData.primary_email_address_id,
        )

        await db.user.create({
          data: {
            id: userData.id,
            username: userData.username || '神秘',
            email: primaryEmail?.email_address,
            image_url: userData.image_url || null,
            clerkData: JSON.parse(JSON.stringify(userData)),
          },
        })

        console.log(`用户创建成功，ID: ${userData.id}`)
        break
      }

      // 用户更新事件
      case 'user.updated': {
        const primaryEmail = userData.email_addresses?.find(
          email => email.id === userData.primary_email_address_id,
        )

        await db.user.update({
          where: { id: userData.id },
          data: {
            username: userData.username || '神秘',
            email: primaryEmail?.email_address,
            image_url: userData.image_url || null,
            clerkData: JSON.parse(JSON.stringify(userData)),
          },
        })

        console.log(`用户更新成功，ID: ${userData.id}`)
        break
      }

      // 用户删除事件
      case 'user.deleted': {
        await db.user.delete({
          where: { id: userData.id },
        })

        console.log(`用户删除成功，ID: ${userData.id}`)
        break
      }
    }
  }
  catch (error) {
    console.error(`同步数据库失败:`, error)
    throw error
  }
}
