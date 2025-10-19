import { IntroCard } from '@/components/module/about/intro-card'
import { SocialIcons } from '@/components/module/about/social-icons'

export default function Page() {
  return (
    <div className="relative w-full" style={{ height: `calc(100vh + ${1000}px)` }}>
      <div className="grid h-screen grid-cols-1 place-content-center gap-10 md:grid-cols-2">
        <div className="flex-center flex-col gap-10">
          <p className="text-2xl font-bold">
            陌生人，你好 👋
          </p>
          <p className="text-xl">
            如你所见，这里是我的个人空间
          </p>
          <p className="text-xl">
            接下来，我会从几个方面聊聊自己
          </p>
          <SocialIcons />
        </div>
        <div className="flex-center">
          <IntroCard />
        </div>
      </div>
    </div>
  )
}
