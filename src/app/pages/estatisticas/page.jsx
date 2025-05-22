'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart2, LineChart, PieChart, TrendingUp, BookOpen, Clock, Award } from 'lucide-react';

export default function EstatisticasPage() {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);
                // Aqui você deve implementar a lógica para buscar as estatísticas
                // Por exemplo:
                // const response = await fetch('/api/estatisticas');
                // const data = await response.json();
                // setStats(data);

                // Dados de exemplo
                const mockData = {
                    simuladosCompletos: 12,
                    simuladosEmAndamento: 2,
                    mediaAcertos: 75,
                    tempoEstudo: 45, // em horas
                    desempenhoPorArea: [
                        { area: "Matemática", acertos: 80 },
                        { area: "Português", acertos: 75 },
                        { area: "Ciências", acertos: 70 },
                        { area: "História", acertos: 85 },
                    ],
                    evolucaoMensal: [
                        { mes: "Jan", acertos: 65 },
                        { mes: "Fev", acertos: 70 },
                        { mes: "Mar", acertos: 75 },
                        { mes: "Abr", acertos: 80 },
                    ],
                };
                setStats(mockData);
            } catch (error) {
                console.error('Erro ao carregar estatísticas:', error);
                setError('Erro ao carregar estatísticas');
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">Carregando estatísticas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Estatísticas
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Simulados Completos
                        </CardTitle>
                        <BookOpen className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stats.simuladosCompletos}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {stats.simuladosEmAndamento} em andamento
                        </p>
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

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Evolução
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            +15%
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Em relação ao mês anterior
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart2 className="h-5 w-5 text-blue-500" />
                            Desempenho por Área
                        </CardTitle>
                        <CardDescription>
                            Seu desempenho em cada área de conhecimento
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.desempenhoPorArea.map((area) => (
                                <div key={area.area} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {area.area}
                                        </span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {area.acertos}%
                                        </span>
                                    </div>
                                    <Progress value={area.acertos} className="h-2" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LineChart className="h-5 w-5 text-green-500" />
                            Evolução Mensal
                        </CardTitle>
                        <CardDescription>
                            Sua evolução nos últimos meses
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center">
                            <p className="text-gray-500 dark:text-gray-400">
                                Gráfico de evolução será implementado aqui
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 