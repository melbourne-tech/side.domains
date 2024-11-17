import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
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
import { useToast } from '~/components/ui/use-toast'
import { useDomainAddMutation } from '~/lib/data/domain-name-add-mutation'

const formSchema = z.object({
  domainName: z.string().min(1, 'Domain must not be empty'),
})

const AddDomain = () => {
  const { toast } = useToast()
  const { mutateAsync } = useDomainAddMutation()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domainName: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await mutateAsync(values)

      toast({
        title: 'Domain added',
        description: 'Your domain has been added.',
      })
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset({
        domainName: '',
      })
    }
  }, [form.formState.isSubmitSuccessful, form.reset])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-4 shadow-lg p-4 rounded-lg border border-gray-200"
      >
        <FormField
          control={form.control}
          name="domainName"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Apex Domain Name</FormLabel>
              <FormControl>
                <Input placeholder="yourdomain.com" {...field} />
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
          <Plus className="h-4 w-4" />
          Add Domain
        </Button>
      </form>
    </Form>
  )
}

export default AddDomain
