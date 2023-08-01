import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
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
import { Textarea } from '~/components/ui/textarea'
import { toast } from '~/components/ui/use-toast'

const formSchema = z.object({
  email: z.string().email(),
  offer: z.coerce.number().min(1).or(z.string().min(1)),
  message: z.string(),
})

export interface SellFormProps {
  domainName: string
}

const defaultValues = {
  email: '',
  offer: '',
  message: '',
}

const SellForm = ({ domainName }: SellFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await fetch('/api/offer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...values, domainName }),
    })

    toast({
      title: 'Offer sent!',
      description: 'We will notify the seller of your offer.',
    })
  }

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset(defaultValues)
    }
  }, [form.formState.isSubmitSuccessful, form.reset])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <FormField
          control={form.control}
          name="offer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offer</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="0.00"
                  before="$"
                  after="USD"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Optional Message</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="I'm interested in buying this domain."
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="self-end mt-4"
          isLoading={form.formState.isSubmitting}
          disabled={form.formState.isSubmitting}
        >
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default SellForm
