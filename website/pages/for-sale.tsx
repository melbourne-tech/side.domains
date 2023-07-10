import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
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
import { SendIcon } from 'lucide-react'
import LoadingDots from '~/components/loading-dots'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

const formSchema = z.object({
  email: z.string().email(),
  offer: z.coerce.number().min(0).or(z.literal('')),
})

export const getServerSideProps: GetServerSideProps<{}> = async (ctx) => {
  console.log('ctx:', ctx)
  return {
    props: {
      query: ctx.query,
      headers: ctx.req.headers,
    },
  }
}

const ForSalePage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  console.log('props:', props)
  const domainName = 'example.com'

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: '',
      offer: '',
    },
    resolver: zodResolver(formSchema),
  })

  return (
    <div className="flex flex-col items-center justify-center min-h-full bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-4 space-y-6">
        <h1 className="text-4xl font-semibold leading-none tracking-tight">
          {domainName} may be for sale
        </h1>

        <p>Send an offer using the form below</p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              console.log('values:', values)
            })}
          >
            {/* <FormItem>
              <FormLabel>Email</FormLabel>

              <FormField
                name="email"
                render={({ field }) => (
                  <>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </>
                )}
              />
            </FormItem> */}

            <div className="flex items-end gap-3">
              <FormItem className="flex-1">
                <FormField
                  name="offer"
                  render={({ field }) => (
                    <>
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
                    </>
                  )}
                />
              </FormItem>

              <Button type="submit">
                <SendIcon size={18} />
                <span>Send Offer</span>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default ForSalePage
