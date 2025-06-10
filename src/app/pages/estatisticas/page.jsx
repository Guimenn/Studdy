'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart2, LineChart, PieChart, TrendingUp, BookOpen, Clock, Award, AlertCircle } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import Cookies from 'js-cookie';

export default function EstatisticasPage() {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);
                const token = Cookies.get('token');
                
                const response = await fetch('https://api-studdy.onrender.com/student/status', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Falha ao buscar estatísticas');
                }

                const data = await response.json();
                
                // Transformar os dados recebidos no formato esperado pelo componente
                const formattedData = {
                    simuladosCompletos: data.completedQuizzes || 0,
                    simuladosEmAndamento: (data.availableQuizzes || 0) - (data.completedQuizzes || 0),
                    mediaAcertos: data.averageCorrectResponses || 0,
                    tempoEstudo: Math.floor((data.totalTimeSpentMinutes || 0) / 60),
                    desempenhoPorArea: (data.completionPercentageBySubject || []).map(subject => ({
                        area: subject.subjectName,
                        acertos: subject.completionPercentage,
                        completedQuizzes: subject.completedQuizzes,
                        availableQuizzes: subject.availableQuizzes
                    })),
                    progressoGeral: data.completionPercentageOverall || 0,
                    ultimosSimulados: data.lastCompletedQuizzes || []
                };

                setStats(formattedData);
                setError(null);
            } catch (err) {
                console.error('Erro ao buscar estatísticas:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando estatísticas...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                    <p className="mt-4 text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-gray-600">Nenhuma estatística disponível</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Estatísticas
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Simulados Completos
                        </CardTitle>
                        <BookOpen className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stats.simuladosCompletos}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            de {stats.simuladosCompletos + stats.simuladosEmAndamento} disponíveis
                        </p>
                        <Progress value={(stats.simuladosCompletos / (stats.simuladosCompletos + stats.simuladosEmAndamento)) * 100} className="h-2 mt-2" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Média de Acertos
                        </CardTitle>
                        <Award className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stats.mediaAcertos}%
                        </div>
                        <Progress value={stats.mediaAcertos} className="h-2 mt-2" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Tempo de Estudo
                        </CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stats.tempoEstudo}h
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Total de horas estudadas
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LineChart className="h-5 w-5 text-green-500" />
                            Desempenho por Matéria
                        </CardTitle>
                        <CardDescription>
                            Comparativo de desempenho entre as matérias
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsLineChart
                                    data={stats.desempenhoPorArea}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="area" 
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                                    />
                                    <YAxis 
                                        domain={[0, 100]}
                                        tickFormatter={(value) => `${value}%`}
                                    />
                                    <Tooltip 
                                        formatter={(value) => [`${value}%`, 'Desempenho']}
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '6px',
                                            padding: '8px'
                                        }}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="acertos"
                                        name="Desempenho"
                                        stroke="#3B82F6"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </RechartsLineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart2 className="h-5 w-5 text-purple-500" />
                            Simulados por Matéria
                        </CardTitle>
                        <CardDescription>
                            Distribuição de simulados completos e disponíveis
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={stats.desempenhoPorArea}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="area" 
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                                    />
                                    <YAxis />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '6px',
                                            padding: '8px'
                                        }}
                                    />
                                    <Legend />
                                    <Bar 
                                        dataKey="completedQuizzes" 
                                        name="Completos" 
                                        fill="#3B82F6" 
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <Bar 
                                        dataKey="availableQuizzes" 
                                        name="Disponíveis" 
                                        fill="#E5E7EB" 
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-500" />
                            Últimos Simulados Completados
                        </CardTitle>
                        <CardDescription>
                            Seus simulados mais recentes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.ultimosSimulados.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                Nenhum simulado completado ainda
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {stats.ultimosSimulados.map((simulado, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <BookOpen className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">{simulado.quizTitle}</h4>
                                                <p className="text-sm text-gray-500 capitalize">{simulado.subjectName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Pontuação</p>
                                                <p className="font-medium text-gray-900">{simulado.score}/{simulado.maxScore}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Data</p>
                                                <p className="font-medium text-gray-900">
                                                    {new Date(simulado.completedAt).toLocaleDateString('pt-BR')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Tempo</p>
                                                <p className="font-medium text-gray-900">{simulado.timeSpentMinutes} min</p>
                                            </div>
                                            <div className="w-24">
                                                <Progress value={simulado.scorePercentage} className="h-2" />
                                                <p className="text-xs text-gray-500 text-right mt-1">{simulado.scorePercentage}%</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}