/**
 * Utilitário para testar diferentes roles de usuário
 * Este arquivo pode ser usado para facilitar o teste das funcionalidades baseadas em role
 */

import Cookies from 'js-cookie';

/**
 * Define a role do usuário nos cookies
 * @param {string} role - 'student' ou 'teacher'
 */
export const setUserRole = (role) => {
    if (role !== 'student' && role !== 'teacher' && role !== 'admin') {
        console.warn('Role deve ser "student", "teacher" ou "admin"');
        return;
    }
    
    Cookies.set('userRole', role, { expires: 7 });
    console.log(`Role do usuário definida como: ${role}`);
    
    // Recarregar a página para aplicar as mudanças
    if (typeof window !== 'undefined') {
        window.location.reload();
    }
};

/**
 * Obtém a role atual do usuário
 * @returns {string} A role atual do usuário
 */
export const getCurrentUserRole = () => {
    return Cookies.get('userRole') || 'student';
};

/**
 * Alterna entre as roles de student e teacher
 */
export const toggleUserRole = () => {
    const currentRole = getCurrentUserRole();
    const newRole = currentRole === 'student' ? 'teacher' : 'student';
    setUserRole(newRole);
};

/**
 * Função para adicionar botões de teste no console do navegador
 * Execute no console: window.testRoles()
 */
if (typeof window !== 'undefined') {
    window.testRoles = () => {
        console.log('=== TESTE DE ROLES ===');
        console.log('Role atual:', getCurrentUserRole());
        console.log('Para alterar a role, use:');
        console.log('- setUserRole("student") - Define como estudante');
console.log('- setUserRole("teacher") - Define como professor');
console.log('- setUserRole("admin") - Define como administrador');
        console.log('- toggleUserRole() - Alterna entre student e teacher');
        console.log('- forceStudentRole() - Força role de student e recarrega');
        console.log('- forceTeacherRole() - Força role de teacher e recarrega');
        
        // Disponibilizar as funções globalmente para teste
        window.setUserRole = setUserRole;
        window.toggleUserRole = toggleUserRole;
        window.getCurrentUserRole = getCurrentUserRole;
        window.forceStudentRole = () => {
            document.cookie = 'userRole=student; expires=' + new Date(Date.now() + 7*24*60*60*1000).toUTCString() + '; path=/';
            console.log('Cookie definido como student, recarregando...');
            window.location.reload();
        };
        window.forceTeacherRole = () => {
            document.cookie = 'userRole=teacher; expires=' + new Date(Date.now() + 7*24*60*60*1000).toUTCString() + '; path=/';
            console.log('Cookie definido como teacher, recarregando...');
            window.location.reload();
        };
    };
}