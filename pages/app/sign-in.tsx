import { zodResolver } from '@hookform/resolvers/zod'
import { MailIcon } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import AppLayout from '~/components/layouts/AppLayout'
import OrDivider from '~/components/or-divider'
import GitHubSignInButton from '~/components/sign-in-with-github-button'
import { Button } from '~/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { useToast } from '~/components/ui/use-toast'
import { useIsSignedIn } from '~/lib/contexts/auth'
import supabase from '~/lib/supabase'
import { NextPageWithLayout } from '~/lib/types'

const formSchema = z.object({
  email: z.string().min(1, 'Email must not be empty').email('Invalid email'),
})

const SignInPage: NextPageWithLayout = () => {
  const router = useRouter()

  const isSignedIn = useIsSignedIn()
  useEffect(() => {
    if (isSignedIn) {
      router.replace('/')
    }
  }, [isSignedIn, router])

  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
    })

    if (error) {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Sign in email sent!',
        description: 'Please check your email for a sign in link.',
      })
    }
  }

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset({
        email: '',
      })
    }
  }, [form.formState.isSubmitSuccessful, form.reset])

  return (
    <div className="flex flex-col gap-6 mt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sign In</h2>

        <p>
          To get started, sign in or sign up with your GitHub account or email
          address.
        </p>
      </div>

      <GitHubSignInButton className="self-start" />

      <OrDivider className="max-w-96 mx-auto" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@yourdomain.com" {...field} />
                </FormControl>
                <FormDescription>
                  Use the same email you used at checkout.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant="outline"
            isLoading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
            className="self-end"
          >
            <MailIcon className="w-4 h-4" />
            Sign In / Sign Up
          </Button>
        </form>
      </Form>
    </div>
  )
}

SignInPage.getLayout = (page) => (
  <AppLayout showSignOut={false}>{page}</AppLayout>
)

export default SignInPage
