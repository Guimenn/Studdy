'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [userRole, setUserRole] = useState(() => {
        // Verifica se estamos no cliente antes de acessar cookies
        if (typeof window !== 'undefined') {
            const cookieRole = Cookies.get('userRole');
            // Normaliza a role para lowercase
            return cookieRole ? cookieRole.toLowerCase() : null;
        }
        return null;
    });

    // Sincroniza com o cookie quando o componente monta no cliente
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const cookieRole = Cookies.get('userRole');
            if (cookieRole && cookieRole.toLowerCase() !== userRole) {
                setUserRole(cookieRole.toLowerCase());
            }
        }
    }, []);

    // Quando a role mudar, atualiza o cookie
    useEffect(() => {
        if (typeof window !== 'undefined' && userRole) {
            Cookies.set('userRole', userRole.toLowerCase(), { expires: 7 }); // Cookie expira em 7 dias
        }
    }, [userRole]);

    // Função para atualizar a role do usuário
    const updateUserRole = (newRole) => {
        const normalizedRole = newRole.toLowerCase();
        setUserRole(normalizedRole);
        if (typeof window !== 'undefined') {
            Cookies.set('userRole', normalizedRole, { expires: 7 });
        }
    };

    return (
        <UserContext.Provider value={{ userRole, setUserRole, updateUserRole }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}