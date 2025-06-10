'use client';

import Logo from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const formSchema = z
    .object({
        newpassword: z
            .string()
            .min(6, 'A senha deve ter pelo menos 6 caracteres')
            .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
            .regex(/\d/, 'A senha deve conter pelo menos um número'),
        confirmnewpassword: z.string().min(6, 'A confirmação deve ter pelo menos 6 caracteres'),
    })
    .refine((data) => data.newpassword === data.confirmnewpassword, {
        message: 'As senhas não coincidem',
        path: ['confirmnewpassword'],
    });

const PassRecoveryNewPass = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        // Verifica se existe um token válido
        const validToken = localStorage.getItem('validRecoveryToken');
        if (!validToken) {
            // Se não houver token válido, redireciona para a página 404
            router.push('/not-found');
        }
    }, [router]);

    const form = useForm({
        defaultValues: {
            newpassword: '',
            confirmnewpassword: '',
        },
        resolver: zodResolver(formSchema),
    });
    
    const newPassword = form.watch('newpassword');

    const passwordRequirements = [
        {
            label: 'Pelo menos 6 caracteres',
            isValid: newPassword.length >= 6,
        },
        {
            label: 'Pelo menos uma letra maiúscula',
            isValid: /[A-Z]/.test(newPassword),
        },
        {
            label: 'Pelo menos um número',
            isValid: /\d/.test(newPassword),
        },
    ];

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setMsg('');
            
            const token = localStorage.getItem('validRecoveryToken');
            const email = localStorage.getItem('recoveryEmail');

            console.log('Dados sendo enviados:', {
                email,
                token: token ? 'Token presente' : 'Token ausente',
                passwordLength: data.newpassword.length
            });

            const response = await fetch('https://api-studdy.onrender.com/login/new-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: email,
                    password: data.newpassword,
                }),
            });

            const responseData = await response.json();
            console.log('Resposta do servidor:', responseData);

            if (!response.ok) {
                throw new Error(responseData.message || 'Erro ao atualizar senha');
            }

            // Limpa os dados de recuperação
            localStorage.removeItem('validRecoveryToken');
            localStorage.removeItem('recoveryEmail');
            
            setMsg('Senha atualizada com sucesso!');
            
            // Redireciona para a página de login após 2 segundos
            setTimeout(() => {
                router.push('/pages/login');
            }, 2000);
            
        } catch (error) {
            console.error('Erro detalhado:', error);
            setMsg(error.message || 'Erro ao atualizar senha. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen background w-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                        <Logo className="h-12 w-12" variant="icon" />
                        <h1 className="text-2xl font-bold text-gray-900">Recuperação de senha</h1>
                        <p className="text-gray-600 text-center">
                            Insira sua nova senha
                        </p>
                    </div>

                    <Form {...form}>
                        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="newpassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Nova Senha</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Digite sua nova senha"
                                                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                disabled={loading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />

                                        <ul className="mt-4 space-y-2">
                                            {passwordRequirements.map((req, idx) => (
                                                <li key={idx} className="flex items-center gap-2 text-sm">
                                                    <span className={req.isValid ? 'text-green-600' : 'text-red-600'}>
                                                        {req.isValid ? '⦿' : '⦾'}
                                                    </span>
                                                    <span className={req.isValid ? 'text-green-600' : 'text-red-600'}>
                                                        {req.label}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmnewpassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Confirmar Nova Senha</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Confirme sua nova senha"
                                                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                disabled={loading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />

                            {msg && (
                                <p className={`text-center text-sm ${msg.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
                                    {msg}
                                </p>
                            )}

                            <Button 
                                type="submit" 
                                disabled={loading} 
                                className="w-full hover:bg-blue-700 text-white font-medium py-2.5"
                            >
                                {loading ? 'Atualizando...' : 'Redefinir senha'}
                            </Button>
                        </form>
                    </Form>

                    <div className="text-center">
                        <Link 
                            href="/login" 
                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Voltar para o login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PassRecoveryNewPass;
