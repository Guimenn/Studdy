/**
 * Configuração de rotas públicas
 * Rotas acessíveis sem autenticação
 */
export const publicRoutes = [
    '/pages/login',
    '/pages/recovery/passrecovery',
    '/pages/recovery/passrecoverynewpass',
];

/**
 * Configuração de rotas protegidas
 * Rotas que requerem autenticação
 */
export const protectedRoutes = [
    '/pages/painel',
    '/pages/calendario',
    '/pages/notas',
    '/pages/materias',
    '/pages/profile',
    '/pages/configuracoes',
];