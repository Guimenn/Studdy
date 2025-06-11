"use client";

/**
 * Página de Administração
 * Permite que administradores gerenciem usuários do sistema
 * Inclui funcionalidades de busca, visualização e gerenciamento de usuários
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/logo";
import { Users, Mail, Calendar, User, GraduationCap, BookOpen, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { PageLoader } from "@/components/ui/loader";
import Cookies from 'js-cookie';
import { toast } from 'sonner';

/**
 * Componente da página de administração
 * Restrito apenas para usuários com role de admin
 */
export default function AdministracaoPage() {
    const { userRole } = useUser();
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (userRole !== 'admin') {
            router.push('/');
            return;
        }
        fetchUsers();
    }, [userRole]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = Cookies.get('token');
            if (!token) {
                toast.error('Token não encontrado');
                return;
            }

            const response = await fetch('https://api-studdy.onrender.com/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao carregar usuários');
            }

            const data = await response.json();
            // Filtrar o admin da lista
            const filteredUsers = data.filter(user => user.role !== 'admin');
            setUsers(filteredUsers);
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            toast.error(error.message || 'Erro ao carregar usuários');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const filterUsers = (users) => {
        return users.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.cpf.includes(searchTerm)
        );
    };

    const teachers = filterUsers(users.filter(user => user.role === 'Teacher'));
    const students = filterUsers(users.filter(user => user.role === 'Student'));

    if (loading) return <PageLoader />;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="container mx-auto p-4 md:p-6">
                <div className="mx-auto">
                    <div className="flex flex-col items-center mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <Logo className="h-12 w-12" variant="icon" />
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#133D86]">Gerenciar Usuários</h1>
                        <p className="mt-2 text-center text-gray-600">Visualize e gerencie os usuários do sistema</p>
                    </div>

                    {/* Barra de Pesquisa */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                                type="text"
                                placeholder="Pesquisar por nome, email ou CPF..."
                                className="pl-10 py-6 text-lg border-2 border-gray-200 focus:border-[#133D86] focus:ring-[#133D86] rounded-xl shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Professores */}
                    <Card className="mb-8 border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 pt-0">
                        <CardHeader className="bg-gradient-to-r pt-1 from-[#133D86] to-[#1e56b3] text-white rounded-t-xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="h-6 w-6" />
                                    <CardTitle>Professores</CardTitle>
                                </div>
                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                                    {teachers.length} {teachers.length === 1 ? 'professor' : 'professores'}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Nascimento</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {teachers.map((teacher) => (
                                            <tr key={teacher.id} className="hover:bg-gray-50 transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{teacher.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(teacher.birth_date)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.cpf}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Button
                                                        variant="ghost"
                                                        className="text-[#133D86] hover:text-[#0e2a5c] hover:bg-[#133D86]/10 transition-colors duration-200"
                                                        onClick={() => router.push(`/pages/administracao/users/${teacher.id}`)}
                                                    >
                                                        Gerenciar
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {teachers.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                                                    Nenhum professor encontrado
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Alunos */}
                    <Card className="border-2 pt-0 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="bg-gradient-to-r pt-1 from-[#133D86] to-[#1e56b3] text-white rounded-t-xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-6 w-6" />
                                    <CardTitle>Alunos</CardTitle>
                                </div>
                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                                    {students.length} {students.length === 1 ? 'aluno' : 'alunos'}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Nascimento</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {students.map((student) => (
                                            <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(student.birth_date)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.cpf}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Button
                                                        variant="ghost"
                                                        className="text-[#133D86] hover:text-[#0e2a5c] hover:bg-[#133D86]/10 transition-colors duration-200"
                                                        onClick={() => router.push(`/pages/administracao/users/${student.id}`)}
                                                    >
                                                        Gerenciar
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {students.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                                                    Nenhum aluno encontrado
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
