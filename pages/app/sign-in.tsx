import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import AppLayout from '~/components/layouts/AppLayout'
import { Button } from '~/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { useToast } from '~/components/ui/use-toast'
import supabase from '~/lib/supabase'
import { NextPageWithLayout } from '~/lib/types'

const formSchema = z.object({
  email: z.string().min(1, 'Email must not be empty').email('Invalid email'),
})

const SignInPage: NextPageWithLayout = () => {
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
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          isLoading={form.formState.isSubmitting}
          disabled={form.formState.isSubmitting}
          className="self-end"
        >
          Sign In / Sign Up
        </Button>
      </form>
    </Form>
  )
}

SignInPage.getLayout = (page) => (
  <AppLayout title="Sign In" showSignOut={false}>
    {page}
  </AppLayout>
)

export default SignInPage
