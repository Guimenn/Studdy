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

const formSchema = z.object({
	email: z.string().email('E-mail inválido'),
	password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
});


export default function LoginPage() {
	const form = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
		resolver: zodResolver(formSchema),
	});

	const onSubmit = (data) => {
		console.log(data);
	};

	return (
		<div className="bg-white min-w-screen h-screen flex items-center justify-center">
			<div className="w-full h-full flex flex-row">

				<div className="hidden w-[65	%] lg:flex rounded-lg items-center justify-center">
					<img
						className="w-full h-full object-cover"
						src="/assets/students.webp"
						alt="illustration"
					/>
				</div>

				<div className="w-screen lg:w-[35%] h-full  flex items-center justify-center">
					<div className="w-full max-w-md p-8 space-y-6 rounded-xl ">
						<Logo className="h-9 w-9 mx-auto" variant="icon" />
						<h1 className="text-2xl font-bold text-gray-900 text-center">
							Entrar no Studdy
						</h1>
						<p className="mt-2 text-center">
							Insira seu e-mail e senha para acessar o Studdy.
						</p>

						<Form {...form}>
							<form
								className="mt-8 space-y-4"
								onSubmit={form.handleSubmit(onSubmit)}
								noValidate
							>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>E-mail</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder="seu@email.com"
													{...field}
													className="bg-white w-full"
												/>
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
											<FormLabel>Senha</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="********"
													{...field}
													className="bg-white w-full"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit" className="w-full  hover:bg-blue-700 text-white font-medium py-2.5">
									Continuar com E-mail
								</Button>
							</form>
						</Form>

						<div className="mt-2 text-center">
							<Link href="/passrecovery" className="text-sm underline text-muted-foreground hover:text-gray-900 transition-colors">
								Esqueceu sua senha?
							</Link>
						</div>
					</div>
				</div>

			</div>
		</div>

	);
};

