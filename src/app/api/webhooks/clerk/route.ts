import type { WebhookEvent } from '@clerk/nextjs/server'
import process from 'process'
import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { syncWithDatabase } from '../utils'

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  }
  catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  // Do something with payload
  const user = evt.data
  const eventType = evt.type

  console.log(`Received webhook with ID ${user.id} and event type of ${eventType}`)

  // 调用同步方法
  if (['user.created', 'user.updated', 'user.deleted'].includes(eventType)) {
    try {
      await syncWithDatabase(evt)
    }
    catch (error) {
      console.error('数据库同步失败:', error)
    }
  }

  console.log('Webhook payload:', body)
  console.log('user:', user)

  return new Response('Webhook received', { status: 200 })
}
