'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { publicRoutes } from '@/config/routes';

/**
 * ProtectedRoute - Componente de proteção de rotas
 * Verifica autenticação e redireciona usuários não logados
 */
export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const userRole = Cookies.get('userRole');
        const userId = Cookies.get('userId');
        const token = Cookies.get('token');

        const isPublicRoute = publicRoutes.includes(pathname);

        if (!isPublicRoute && (!userRole || !userId || !token)) {
            router.push('/pages/login');
        }
    }, [router, pathname]);

    return children;
}