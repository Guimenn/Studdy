import { NextResponse } from 'next/server';

// Define protected routes and their required roles
const protectedRoutes = {
    admin: [
        '/pages/administracao',
        '/pages/administracao/rotas',
        '/pages/cadastro',
        '/pages/concurso',
        '/pages/vestibular',
        '/pages/turmas',
    ],
    teacher: [
        '/pages/professor',
        '/pages/materiais',
        '/pages/simulados',
        '/pages/simulados/criar-simulados',
        '/pages/material/videoaulas/criar-videoaulas',
        '/pages/material/resumos/criar-resumos',
        '/pages/material/apostilas/criar-apostilas',
        '/pages/turmas',
    ],
    student: [
        '/pages/aluno',
        '/pages/estudos',
        '/pages/simulados',
        '/pages/material/videoaulas',
        '/pages/material/resumos',
        '/pages/material/apostilas',
        '/pages/turmas',
    ],
};

export function middleware(request) {
    const { pathname } = request.nextUrl;
    
    // Get user role from cookies
    // const userRole = request.cookies.get('userRole')?.value;
    
    // Check if the route is protected
    // const isProtectedRoute = Object.values(protectedRoutes).some(routes =>
    //   routes.some(route => pathname.startsWith(route))
    // );

    // if (isProtectedRoute) {
    //   // If no role is set, redirect to login
    //   if (!userRole) {
    //     return NextResponse.redirect(new URL('/pages/login', request.url));
    //   }

    //   // Check if user has access to this route
    //   const allowedRoutes = protectedRoutes[userRole] || [];
    //   const hasAccess = allowedRoutes.some(route => pathname.startsWith(route));

    //   // If user doesn't have access, redirect to 404
    //   if (!hasAccess) {
    //     return NextResponse.redirect(new URL('/not-found', request.url));
    //   }
    // }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/pages/:path*',
    ],
}; 