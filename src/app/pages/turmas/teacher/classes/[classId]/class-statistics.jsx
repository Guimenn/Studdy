'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/ui/loader";
import { Users, BookOpen, Target, BarChart3 } from "lucide-react";
import Cookies from 'js-cookie';
import { toast } from 'sonner';

export default function ClassStatistics({ classId }) {
    const [loading, setLoading] = useState(true);
    const [statistics, setStatistics] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const token = Cookies.get('token');
                if (!token) {
                    throw new Error('Token não encontrado');
                }

                const response = await fetch(`http://localhost:3000/teacher/classes/${classId}/statistics`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Erro ao carregar estatísticas');
                }

                const data = await response.json();
                setStatistics(data);
            } catch (error) {
                console.error('Erro ao carregar estatísticas:', error);
                setError(error.message);
                // Em caso de erro, definir estatísticas padrão com zeros
                setStatistics({
                    totalStudents: 0,
                    totalQuizzes: 0,
                    classAverageAccuracy: 0,
                    subjectStats: [],
                    studentStats: []
                });
                toast.error(error.message || 'Erro ao carregar estatísticas');
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, [classId]);

    if (loading) return <PageLoader />;
    
    // Garantir que sempre temos estatísticas, mesmo que vazias
    const stats = statistics || {
        totalStudents: 0,
        totalQuizzes: 0,
        classAverageAccuracy: 0,
        subjectStats: [],
        studentStats: []
    };

    return (
        <div className="space-y-6">
            {/* Cards de Estatísticas Gerais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white pt-0 shadow-lg border border-gray-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            Total de Alunos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-blue-600">{stats.totalStudents}</p>
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-lg border border-gray-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-green-600" />
                            Total de Simulados
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">{stats.totalQuizzes}</p>
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-lg border border-gray-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <Target className="h-5 w-5 text-purple-600" />
                            Média Geral
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-purple-600">{stats.classAverageAccuracy}%</p>
                    </CardContent>
                </Card>
            </div>

            {/* Estatísticas por Matéria */}
            <Card className="bg-white pt-0 shadow-lg border border-gray-100">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        Desempenho por Matéria
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {stats.subjectStats && stats.subjectStats.length > 0 ? (
                            stats.subjectStats.map((subject, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-700">{subject.subjectName}</span>
                                        <span className="text-sm font-medium text-gray-600">
                                            {subject.accuracy}% de acerto
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full">
                                        <div
                                            className="h-2 bg-blue-600 rounded-full transition-all duration-500"
                                            style={{ width: `${subject.accuracy}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>{subject.correctResponses} acertos</span>
                                        <span>{subject.totalResponses} total</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                <p>Nenhum dado de matéria disponível</p>
                                <p className="text-sm">Os dados aparecerão quando houver simulados respondidos</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Estatísticas por Aluno */}
            <Card className="bg-white pt-0 shadow-lg border border-gray-100">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-600" />
                        Desempenho por Aluno
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {stats.studentStats && stats.studentStats.length > 0 ? (
                            stats.studentStats.map((student, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-700">Aluno {index + 1}</span>
                                        <span className="text-sm font-medium text-gray-600">
                                            {student.accuracy}% de acerto
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full">
                                        <div
                                            className="h-2 bg-green-600 rounded-full transition-all duration-500"
                                            style={{ width: `${student.accuracy}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>{student.correctResponses} acertos</span>
                                        <span>{student.totalResponses} total</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                <p>Nenhum dado de aluno disponível</p>
                                <p className="text-sm">Os dados aparecerão quando houver alunos com simulados respondidos</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}