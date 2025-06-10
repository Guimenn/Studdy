'use client';

import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
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
import { handleApiError, handleFetchError, handleUnexpectedError } from '@/utils/errorHandler';

import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp"

// Validação para o e-mail
const formSchemaEmail = z.object({
	recoveryemail: z.string().email('E-mail inválido'),
});

// Validação para o código (6 dígitos)
const formSchemaCode = z.object({
	code: z.string().length(6, 'O código deve ter 6 dígitos'),
});

export default function PassRecoveryPage() {
	const [email, setEmail] = useState('');
	const [msg, setMsg] = useState('');
	const [loading, setLoading] = useState(false);
	const [token, setToken] = useState(null);
	const [validado, setValidado] = useState(false);

	// Form para envio de e-mail
	const formEmail = useForm({
		defaultValues: {
			recoveryemail: '',
		},
		resolver: zodResolver(formSchemaEmail),
	});

	// Form para validação do código
	const formCode = useForm({
		defaultValues: {
			code: '',
		},
		resolver: zodResolver(formSchemaCode),
	});

	// Função para validar e-mail com regex simples
	const validarEmail = (email) => /\S+@\S+\.\S+/.test(email);

	// Função para enviar token por e-mail usando emailjs
	const enviarToken = async (data) => {
		const emailValue = data.recoveryemail;
		setLoading(true);
		setMsg('');

		try {
			// Verifica se o email existe na API
			const response = await fetch(`http://localhost:3000/login/recovery`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email: emailValue })
			});

			await handleApiError(response, 'verificar e-mail');
			const responseData = await response.json();
			
			setEmail(emailValue);
			const novoToken = Math.floor(100000 + Math.random() * 900000);

			const templateParams = {
				to_email: emailValue,
				token: novoToken,
				name: 'Studdy Support',
				from_email: 'suporte@studdy.com',
			};

			await emailjs.send(
				'service_qxntt75',
				'template_8wqsmdm',
				templateParams,
				'yIhgqahZ0aUqL-5De'
			);

			setMsg('Token enviado para seu e-mail!');
			setToken(novoToken);
			setValidado(true);
			formCode.reset();
		} catch (error) {
			handleUnexpectedError(error, 'enviar token de recuperação');
			setMsg('Erro ao processar sua solicitação. Tente novamente.');
		} finally {
			setLoading(false);
		}
	};

	const reenviarToken = async () => {
		if (!email) {
			setMsg('E-mail não encontrado para reenviar o código.');
			return;
		}
		setLoading(true);
		setMsg('');

		try {
			const novoToken = Math.floor(100000 + Math.random() * 900000);

			const templateParams = {
				to_email: email,
				token: novoToken,
				name: 'MeuApp Support',
				from_email: 'suporte@meuapp.com',
			};

			await emailjs.send(
				'service_qxntt75',
				'template_8wqsmdm',
				templateParams,
				'yIhgqahZ0aUqL-5De'
			);

			setMsg('Novo token enviado para seu e-mail!');
			setToken(novoToken);
			formCode.reset();
		} catch (error) {
			handleUnexpectedError(error, 'reenviar token');
			setMsg('Erro ao enviar e-mail.');
		} finally {
			setLoading(false);
		}
	};

	return !validado ? (
		<div className="background h-screen w-screen flex items-center justify-center">
			<div className="w-full max-w-md p-8 space-y-6 shadow-lg rounded-xl bg-white">
				<Logo className="h-9 w-9 mx-auto" variant="icon" />
				<h1 className="text-2xl font-bold text-gray-900 text-center">
					Recuperação de senha
				</h1>
				<p className="mt-2 text-center">
					Insira seu E-mail e enviaremos um código de recuperação para você.
				</p>

				<Form {...formEmail}>
					<form
						className="mt-8 space-y-4"
						onSubmit={formEmail.handleSubmit(enviarToken)}
						noValidate
					>
						<FormField
							control={formEmail.control}
							name="recoveryemail"
							render={({ field }) => (
								<FormItem>
									<FormLabel>E-mail de recuperação</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="seu@email.com"
											{...field}
											disabled={loading}
											className="bg-white w-full"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" disabled={loading} className="w-full hover:bg-blue-700 text-white font-medium py-2.5">
							{loading ? 'Enviando...' : 'Enviar código de recuperação'}
						</Button>
					</form>
				</Form>

				{msg && (
					<p className="mt-4 text-center text-red-600 whitespace-pre-line">
						{msg}
					</p>
				)}

				<div className="mt-2 text-center">
					<Link href="/pages/login" className="text-sm underline text-muted-foreground hover:text-gray-900 transition-colors">
						Voltar para o login
					</Link>
				</div>
			</div>
		</div>
	) : (
		<div className="background h-screen w-screen flex items-center justify-center">
			<div className="w-full max-w-md p-4">
				<div className="w-full max-w-md p-8 space-y-6 shadow-lg rounded-xl bg-white text-center">
					<Logo className="h-9 w-9 mx-auto" variant="icon" />
					<h1 className="text-2xl font-bold text-gray-900 text-center">Recuperação de senha</h1>
					<p className="mt-4 text-l tracking-tight text-center">Insira o código de recuperação que enviamos para você em seu E-mail para redefinir sua senha.</p>
					<Form {...formCode}>
						<form
							className="mt-8 w-full space-y-3 justify-center items-center"
						>
							<FormField
								control={formCode.control}
								name="code"
								render={({ field }) => (
									<FormItem className="text-center w-full justify-center items-center">
										<FormLabel className="w-full text-center justify-center items-center">Código de recuperação</FormLabel>
										<FormControl>
											<InputOTP 
												maxLength={6} 
												value={field.value} 
												onChange={(value) => {
													field.onChange(value);
													if (value.length === 6) {
														if (value === String(token)) {
															// Salva o token válido no localStorage]
															localStorage.setItem('recoveryEmail', email);
															localStorage.setItem('validRecoveryToken', 'true');
															window.location.href = '/pages/recovery/passrecoverynewpass';
														} else {
															setMsg('Token inválido. Tente novamente.');
														}
													}
												}}
											>
												<InputOTPGroup>
													<InputOTPSlot index={0} />
													<InputOTPSlot index={1} />
													<InputOTPSlot index={2} />
												</InputOTPGroup>
												<InputOTPSeparator />
												<InputOTPGroup>
													<InputOTPSlot index={3} />
													<InputOTPSlot index={4} />
													<InputOTPSlot index={5} />
												</InputOTPGroup>
											</InputOTP>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</form>
					</Form>

				

					<div className="mt-5 space-y-1 flex flex-col idtems-center justify-center gap-2">
						<Button
							onClick={reenviarToken}
							disabled={loading}
							className="w-full  hover:bg-blue-700 text-white font-medium py-2.5"
						>
							{loading ? 'Enviando...' : 'Enviar novo código de recuperação'}
						</Button>
					
						<Link href="/pages/login" className="text-sm underline text-muted-foreground hover:text-gray-900 transition-colors">
							Voltar para o login
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

