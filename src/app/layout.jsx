'use client';

/**
 * Layout principal da aplicação Studdy
 * Gerencia autenticação, roteamento protegido e estrutura global
 * Inclui sidebar, providers de contexto e proteção de rotas baseada em papéis
 */

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

/**
 * Configuração de rotas protegidas por papel de usuário
 * Define quais rotas cada tipo de usuário pode acessar
 */
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
		'/pages/profile',
	],
};

/**
 * LayoutContent - Gerencia renderização da sidebar e proteção de rotas
 * Controla quando mostrar sidebar baseado na rota atual
 */
function LayoutContent({ children }) {
	const pathname = usePathname();
	const router = useRouter();
	const { userRole } = useUser();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	/**
	 * Verifica se usuário tem acesso à rota atual
	 */
	const hasAccess = (userRole, pathname) => {
		if (!userRole) return false;
		
		const allowedRoutes = protectedRoutes[userRole.toLowerCase()] || [];
		return allowedRoutes.some(route => pathname.startsWith(route));
	};

	const noSidebarRoutes = ['/pages/login', '/pages/recovery'];
	const shouldShowSidebar = !noSidebarRoutes.some(route => pathname.startsWith(route));

	if (isLoading) {
		return <PageLoader />;
	}

	if (shouldShowSidebar) {
		return (
			<SidebarProvider>
				<div className="flex h-screen w-full">
					<AppSidebar />
					<main className="flex-1 overflow-auto">
						<ProtectedRoute>
							{children}
						</ProtectedRoute>
					</main>
				</div>
				<Toaster position="top-right" />
			</SidebarProvider>
		);
	}

	return (
		<div className="h-screen w-full">
			{children}
			<Toaster position="top-right" />
		</div>
	);
}

/**
 * RootLayout - Layout principal da aplicação
 * Configura providers globais e estrutura base
 */
export default function RootLayout({ children }) {
	return (
		<html lang="pt-BR">
			<head>
				<title>Studdy - Plataforma de Estudos</title>
				<meta name="description" content="Plataforma completa para estudos e preparação para concursos e vestibulares" />
			</head>
			<body className={inter.className}>
				<UserProvider>
					<LayoutContent>{children}</LayoutContent>
				</UserProvider>
			</body>
		</html>
	);
}
