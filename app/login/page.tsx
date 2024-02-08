'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { fetchLogin } from '../action'
import { useToast } from '@/components/ui/use-toast'
import { removeLocalStorage, setLocalStorage } from '@/lib/localStorage'

const formSchema = z.object({
  userName: z.string().min(1, {
    message: 'userName must be at least 1 characters.',
  }),
  password: z.string().min(1, {
    message: 'Password must be at least 1 characters.',
  }),
})

export default function LoginPage() {
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    removeLocalStorage('userData')
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = await fetchLogin(values)

    if (data?.error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: `There was a problem with your request. (${data.error})`,
      })
    } else {
      setLocalStorage('userData', JSON.stringify(data))

      router.replace('/')
    }

    return <></>
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded border border-gray-400 bg-white p-3"
        >
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="myuser123" {...field} />
                </FormControl>
                <FormDescription>Your Username</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="mypass123" type="password" {...field} />
                </FormControl>
                <FormDescription>Your password</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between">
            <Button type="submit" className="mt-2 w-full">
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
