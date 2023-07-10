import { zodResolver } from '@hookform/resolvers/zod'
import { SendIcon } from 'lucide-react'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import DomainsBackground from '~/components/domains-background'
import InfiniteDomainScroller from '~/components/infinite-domain-scroller'
import { Button } from '~/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'

const formSchema = z.object({
  email: z.string().email(),
  offer: z.coerce.number().min(0).or(z.literal('')),
})

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: {
          domain: 'buy.alaister.dev',
        },
      },
    ],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<{ domain: string }> = async ({
  params,
}) => {
  return {
    props: { domain: params.domain as string },
  }
}

const ForSalePage = ({
  domain: domainName,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: '',
      offer: '',
    },
    resolver: zodResolver(formSchema),
  })

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <DomainsBackground domainName={domainName} />

      <div className="bg-white shadow-lg rounded-lg p-4 space-y-6 z-10">
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
