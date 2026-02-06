import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../services/api';
import Toast from './Toast';
import { useToast } from '../hooks/useToast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';

const createUserSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(12, { message: 'Senha deve ter no mínimo 12 caracteres' }),
  role: z.enum(['client', 'doctor', 'root']),
  specialty: z.string().optional(),
  age: z.string().optional()
}).refine((data) => {
  if (data.role === 'doctor') {
    return data.specialty && data.specialty.trim().length > 0;
  }
  return true;
}, {
  message: 'Especialidade é obrigatória para médicos',
  path: ['specialty']
}).refine((data) => {
  if (data.role === 'client') {
    return data.age && !isNaN(Number(data.age)) && Number(data.age) > 0;
  }
  return true;
}, {
  message: 'Idade válida é obrigatória para pacientes',
  path: ['age']
});

export default function CreateUserForm({ initialRole = 'client', onCreated }) {
  const { notification, showError, showSuccess, closeToast } = useToast();

  const form = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: initialRole,
      specialty: '',
      age: ''
    }
  });

  const watchRole = form.watch('role');

  const onSubmit = async (values) => {
    try {
      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        roleDetails: {}
      };

      if (values.role === 'doctor' && values.specialty) {
        payload.roleDetails.specialty = values.specialty;
      }
      if (values.role === 'client' && values.age) {
        payload.roleDetails.age = Number(values.age);
      }

      await api.post('/users', payload);
      showSuccess('Usuário criado com sucesso!');
      form.reset({
        name: '',
        email: '',
        password: '',
        role: values.role,
        specialty: '',
        age: ''
      });
      if (onCreated) onCreated();
    } catch (error) {
      showError(error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full name" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="name@clinic.com" {...field} />
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
                  <Input type="password" placeholder="Min 12 characters" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <select 
                    className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    {...field}
                  >
                    <option value="client">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="root">Root</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchRole === 'doctor' && (
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialty</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Cardiology" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {watchRole === 'client' && (
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Patient age" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Creating...' : 'Create user'}
          </Button>
        </form>
      </Form>

      {notification && (
        <Toast 
          message={notification.message} 
          type={notification.type} 
          duration={notification.duration}
          onClose={closeToast}
        />
      )}
    </>
  );
}