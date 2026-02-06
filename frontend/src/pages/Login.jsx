import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ShieldCheck, Stethoscope } from 'lucide-react'
import { login, getUserRole } from '../services/auth'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form'

const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(1, { message: 'Senha é obrigatória' })
})

export default function Login() {
  const [error, setError] = React.useState(null)
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (values) => {
    setError(null)
    try {
      await login(values)
      const role = getUserRole()
      if (role === 'root') navigate('/root')
      if (role === 'doctor') navigate('/doctor')
      if (role === 'client') navigate('/client')
    } catch (err) {
      setError(err?.message || 'Login failed')
    }
  }

  return (
    <div className="page-shell">
      <div className="page-inner">
        <div className="mx-auto flex max-w-lg flex-col gap-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <p className="section-subtitle">Modern Medical</p>
              <h1 className="section-title">Secure access</h1>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Sign in</h2>
                <p className="section-subtitle">Use your credentials to continue</p>
              </div>
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="card-body">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="name@clinic.com" {...field} />
                        </FormControl>
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
                          <Input type="password" placeholder="Enter your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {error && (
                    <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
                      {error}
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
