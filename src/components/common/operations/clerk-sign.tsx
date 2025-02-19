import { useModalStatus } from '@/atoms/hooks/use-modal-status'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useClerk,
  UserButton,
} from '@clerk/nextjs'
import { LogIn } from 'lucide-react'
import { LoadingIcon } from '../loading/loading-icon'

export function ClerkSign() {
  const { loaded } = useClerk()

  useModalStatus()

  if (!loaded) {
    return <LoadingIcon />
  }

  return (
    <div className="flex-center size-5">
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <LogIn className="size-5 cursor-pointer hover:text-yume-spotlight-foreground transition-colors duration-300 ease-in-out" />
        </SignInButton>
      </SignedOut>
    </div>
  )
}
