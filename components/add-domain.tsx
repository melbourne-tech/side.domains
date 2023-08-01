import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
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
import { useDomainAddMutation } from '~/lib/data/domain-name-add-mutation'
import { ValidationError } from '~/lib/errors'

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
        description:
          'Your domain has been added. Please add the required records.',
      })
    } catch (error) {
      if (error instanceof ValidationError) {
        Object.entries(error.errors.fieldErrors).forEach(([key, value]) => {
          form.setError(key as any, { message: value?.[0] as any })
        })
        return
      }

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
        className="flex items-end gap-4 shadow-lg p-4 rounded-lg"
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
              <FormDescription>Do not include www.</FormDescription>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          isLoading={form.formState.isSubmitting}
          disabled={form.formState.isSubmitting}
        >
          Add Domain
        </Button>
      </form>
    </Form>
  )
}

export default AddDomain
