'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { GraduationCap, BookOpen, Users, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/logo';

export default function StudentClassPage() {
    const { userRole } = useUser();
    const router = useRouter();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (userRole !== 'student') {
            router.push('/pages/painel');
            return;
        }

        const fetchClassData = async () => {
            try {
                const token = Cookies.get('token');
                const response = await fetch('http://localhost:3000/student/class', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Falha ao carregar dados da turma');
                }

                const data = await response.json();
                setClassData(data);
            } catch (err) {
                setError(err.message);
                console.error('Erro ao carregar dados da turma:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchClassData();
    }, [userRole, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="container mx-auto p-4 md:p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="container mx-auto p-4 md:p-6">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        <p>Erro ao carregar dados da turma: {error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!classData) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="container mx-auto p-4 md:p-6">
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
                        <p>Você não está matriculado em nenhuma turma.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="container mx-auto p-4 md:p-6">
                <div className="mx-auto">
                    <div className="flex flex-col items-center mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <Logo className="h-12 w-12" variant="icon" />
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#133D86]">{classData.name}</h1>
                        <p className="mt-2 text-center text-gray-600">{classData.course} • {classData.shift === 'Morning' ? 'Manhã' : classData.shift === 'Afternoon' ? 'Tarde' : 'Noite'}</p>
                    </div>

                    {/* Barra de Pesquisa */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                                type="text"
                                placeholder="Pesquisar por nome ou email..."
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
                                    {classData.teachers.length} {classData.teachers.length === 1 ? 'professor' : 'professores'}
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
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disciplinas</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {classData.teachers.map((teacher) => (
                                            <tr key={teacher.teacher_id} className="hover:bg-gray-50 transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{teacher.teacher_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.teacher_email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex flex-wrap gap-2">
                                                        {teacher.subjects.map((subject) => (
                                                            <span
                                                                key={subject.id}
                                                                className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                                                            >
                                                                {subject.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
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
                                    <Users className="h-6 w-6" />
                                    <CardTitle>Alunos</CardTitle>
                                </div>
                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                                    {classData.students.length} {classData.students.length === 1 ? 'aluno' : 'alunos'}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {classData.students.map((student) => (
                                            <tr key={student.student_id} className="hover:bg-gray-50 transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                                            </tr>
                                        ))}
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
