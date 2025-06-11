'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/ui/loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Clock, BookOpen, Users, Target, TrendingUp } from 'lucide-react';
import Cookies from 'js-cookie';

export default function StudentPerformance({ classId }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statistics, setStatistics] = useState(null);

    useEffect(() => {
        fetchStatistics();
    }, [classId]);

    const fetchStatistics = async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            const response = await fetch(`https://api-studdy.onrender.com/teacher/classes/${classId}/statistics`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar estatísticas');
            }

            const data = await response.json();
            setStatistics(data);
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <PageLoader />;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
    if (!statistics) return null;

    const getPerformanceColor = (accuracy) => {
        if (accuracy >= 80) return 'bg-green-500';
        if (accuracy >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getPerformanceLabel = (accuracy) => {
        if (accuracy >= 80) return 'Excelente';
        if (accuracy >= 60) return 'Bom';
        return 'Precisa melhorar';
    };

    return (
        <div className="space-y-6">
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-2 pt-0 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="bg-gradient-to-r pt-1 from-[#133D86] to-[#1e56b3] text-white rounded-t-xl">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Média da Turma</CardTitle>
                            <Target className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="text-3xl font-bold text-[#133D86]">
                            {statistics.classAverageAccuracy.toFixed(1)}%
                        </div>
                        <div className="mt-2">
                            <Progress value={statistics.classAverageAccuracy} className="h-2" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 pt-0 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="bg-gradient-to-r pt-1 from-[#133D86] to-[#1e56b3] text-white rounded-t-xl">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Total de Alunos</CardTitle>
                            <Users className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="text-3xl font-bold text-[#133D86]">
                            {statistics.totalStudents}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Alunos ativos</p>
                    </CardContent>
                </Card>

                <Card className="border-2 pt-0 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="bg-gradient-to-r pt-1 from-[#133D86] to-[#1e56b3] text-white rounded-t-xl">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Total de Simulados</CardTitle>
                            <BookOpen className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="text-3xl font-bold text-[#133D86]">
                            {statistics.totalQuizzes}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Simulados disponíveis</p>
                    </CardContent>
                </Card>

                <Card className="border-2 pt-0 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="bg-gradient-to-r pt-1 from-[#133D86] to-[#1e56b3] text-white rounded-t-xl">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Melhor Desempenho</CardTitle>
                            <Trophy className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="text-3xl font-bold text-[#133D86]">
                            {statistics.studentStats[0]?.accuracy.toFixed(1)}%
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            {statistics.studentStats[0]?.name}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs de Detalhamento */}
            <Tabs defaultValue="alunos" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="alunos">Desempenho por Aluno</TabsTrigger>
                    <TabsTrigger value="materias">Desempenho por Matéria</TabsTrigger>
                </TabsList>

                <TabsContent value="alunos">
                    <Card className="border-2 pt-0 border-gray-100 shadow-lg">
                        <CardHeader className="bg-gradient-to-r pt-1 from-[#133D86] to-[#1e56b3] text-white rounded-t-xl">
                            <CardTitle>Desempenho Individual</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Aluno</TableHead>
                                        <TableHead>Acertos</TableHead>
                                        <TableHead>Simulados</TableHead>
                                        <TableHead>Tempo Médio</TableHead>
                                        <TableHead>Desempenho</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {statistics.studentStats.map((student) => (
                                        <TableRow key={student.studentId}>
                                            <TableCell className="font-medium">{student.name}</TableCell>
                                            <TableCell>
                                                {student.correctResponses} / {student.totalResponses}
                                            </TableCell>
                                            <TableCell>{student.quizzesCompleted}</TableCell>
                                            <TableCell>{student.averageTimePerQuiz} min</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Progress 
                                                        value={student.accuracy} 
                                                        className={`h-2 w-24 ${getPerformanceColor(student.accuracy)}`}
                                                    />
                                                    <span className="text-sm font-medium">
                                                        {student.accuracy.toFixed(1)}%
                                                    </span>
                                                    <Badge variant="outline" className={getPerformanceColor(student.accuracy)}>
                                                        {getPerformanceLabel(student.accuracy)}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="materias">
                    <Card className="border-2 pt-0 border-gray-100 shadow-lg">
                        <CardHeader className="bg-gradient-to-r pt-1 from-[#133D86] to-[#1e56b3] text-white rounded-t-xl">
                            <CardTitle>Desempenho por Matéria</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={statistics.subjectStats}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="subjectName" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="accuracy" fill="#133D86" name="Acurácia (%)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-6">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Matéria</TableHead>
                                            <TableHead>Acertos</TableHead>
                                            <TableHead>Simulados</TableHead>
                                            <TableHead>Média de Tentativas</TableHead>
                                            <TableHead>Desempenho</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {statistics.subjectStats.map((subject) => (
                                            <TableRow key={subject.subjectName}>
                                                <TableCell className="font-medium">{subject.subjectName}</TableCell>
                                                <TableCell>
                                                    {subject.correctResponses} / {subject.totalResponses}
                                                </TableCell>
                                                <TableCell>{subject.totalQuizzes}</TableCell>
                                                <TableCell>{subject.averageAttemptsPerQuiz.toFixed(1)}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Progress 
                                                            value={subject.accuracy} 
                                                            className={`h-2 w-24 ${getPerformanceColor(subject.accuracy)}`}
                                                        />
                                                        <span className="text-sm font-medium">
                                                            {subject.accuracy.toFixed(1)}%
                                                        </span>
                                                        <Badge variant="outline" className={getPerformanceColor(subject.accuracy)}>
                                                            {getPerformanceLabel(subject.accuracy)}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}