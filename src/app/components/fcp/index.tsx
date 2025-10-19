import { IntroCard } from '@/components/module/about/intro-card'
import { SocialIcons } from '@/components/module/about/social-icons'

export default function Fcp() {
  return (
    <div className="relative w-full h-[80vh]">
      <div className="grid h-screen grid-cols-1 place-content-center gap-10 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <IntroContent />
        </div>
        <div className="order-1 md:order-2 flex-center m-4">
          <IntroCard />
        </div>
      </div>
    </div>
  )
}

function IntroContent() {
  return (
    <div className="flex-center flex-col gap-8 text-xl text-muted-foreground">
      <p className="text-2xl font-bold text-foreground">
        你好 👋
      </p>
      <p>
        我是
        {' '}
        <span className="font-bold"> sayori </span>
        ，你也可以叫我浅梦
      </p>
      <p>
        是一个什么都不会的小菜鸡
      </p>
      <p>
        间歇性努力 & 持续性摸鱼
      </p>
      <SocialIcons />
    </div>
  )
}
