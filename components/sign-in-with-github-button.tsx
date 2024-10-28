import { ArrowRightIcon, GithubIcon } from 'lucide-react'
import { useState } from 'react'
import supabase from '~/lib/supabase'
import { Button } from './ui/button'

interface GitHubSignInButtonProps {
  className?: string
}

const GitHubSignInButton = ({ className }: GitHubSignInButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)

  async function signInWithGithub() {
    setIsLoading(true)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    })

    if (error) {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={signInWithGithub}
      isLoading={isLoading}
      disabled={isLoading}
      className={className}
    >
      <GithubIcon className="w-5 h-5" />
      Continue with GitHub
      <ArrowRightIcon className="w-5 h-5" />
    </Button>
  )
}

export default GitHubSignInButton
