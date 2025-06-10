'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "@/contexts/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from 'sonner';
import { useUser } from "@/contexts/UserContext";
import { PageLoader } from "@/components/ui/loader";
import { useState, useEffect } from "react";
import { Loader } from "@/components/ui/loader";
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const inter = Inter({ subsets: ["latin"] });

// Define protected routes and their required roles
const protectedRoutes = {
	admin: [
		'/pages/administracao',
		'/pages/administracao/rotas',
		'/pages/cadastro',
		'/pages/concursos',
		'/pages/vestibular',
		'/pages/vestibulares',
		'/pages/turmas',
		'/pages/profile',
		'/pages/painel',
		'/pages/material',
	],
	teacher: [
		'/pages/painel',
		'/pages/turmas/teacher',
		'/pages/turmas/teacher/classes',
		'/pages/turmas/teacher/criar-simulados',
		'/pages/material',
		'/pages/material/videoaulas/criar-videoaulas',
		'/pages/material/resumos/criar-resumos',
		'/pages/material/apostilas/criar-apostilas',
		'/pages/concursos',
		'/pages/vestibulares',
		'/pages/profile',
	],
	student: [
		'/pages/painel',
		'/pages/simulados',
		'/pages/estatisticas',
		'/pages/material',
		'/pages/material/videoaulas',
		'/pages/material/resumos',
		'/pages/material/apostilas',
		'/pages/concursos',
		'/pages/vestibulares',
		'/pages/turmas',
		'/pages/profile',
	],
};

function RootLayoutContent({ children }) {
	const pathname = usePathname();
	const router = useRouter();
	const { userRole } = useUser();
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthorized, setIsAuthorized] = useState(false);

	useEffect(() => {
		// Simula um pequeno delay para carregar a role
		const timer = setTimeout(() => {
			setIsAuthorized(true);
			setIsLoading(false);
		}, 500);

		return () => clearTimeout(timer);
	}, [pathname, userRole]);

	if (isLoading) {
		return <Loader />;
	}

	// Se estiver na página de login ou recovery, não mostra a sidebar
	if (pathname === '/pages/login' || pathname.startsWith('/pages/recovery')) {
		return (
			<div className="flex h-screen w-screen bg-slate-100 min-h-screen min-w-screen">
				<main className="flex-1 overflow-y-auto">
					{children}
				</main>
			</div>
		);
	}

	// Verifica se a rota atual existe nas rotas protegidas
	const allProtectedRoutes = [
		...protectedRoutes.admin,
		...protectedRoutes.teacher,
		...protectedRoutes.student,
		'/pages/login',
		'/pages/recovery',
		'/pages/not-found'
	];

	// Se a rota não existir nas rotas protegidas, não mostra a sidebar
	const isProtectedRoute = allProtectedRoutes.some(route => 
		pathname === route || 
		pathname.startsWith(route + '/') ||
		pathname.startsWith('/pages/turmas/')
	);

	if (!isProtectedRoute) {
		return (
			<div className="flex h-screen w-screen bg-slate-100 min-h-screen min-w-screen">
				<main className="flex-1 overflow-y-auto">
					{children}
				</main>
			</div>
		);
	}

	return (
		<div className="flex h-screen w-screen bg-slate-100 min-h-screen min-w-screen">
			<AppSidebar />
			<main className="flex-1 overflow-y-auto">
				{children}
			</main>
		</div>
	);
}

export default function RootLayout({ children }) {
	return (
		<html lang="pt-BR">
			<head>
				<title>Studdy - Plataforma de Estudos</title>
				<meta name="description" content="Plataforma de estudos para alunos e professores" />
			</head>
			<body className={inter.className}>
				<UserProvider>
					<ProtectedRoute>
						<SidebarProvider>
							<RootLayoutContent>{children}</RootLayoutContent>
						</SidebarProvider>
					</ProtectedRoute>
				</UserProvider>
				<Toaster richColors />
			</body>
		</html>
	);
}
