'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/ui/loader";
import { toast } from "sonner";
import Cookies from 'js-cookie';
import { Users, Clock, CheckCircle, XCircle, Award, Target, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function QuizResults({ classId, quizId }) {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuizResults();
    }, [classId, quizId]);

    const fetchQuizResults = async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                toast.error('Token não encontrado');
                return;
            }

            const response = await fetch(`https://api-studdy.onrender.com/teacher/classes/${classId}/quizzes/${quizId}/results`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar resultados do quiz');
            }

            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error('Erro ao carregar resultados:', error);
            toast.error(error.message || 'Erro ao carregar resultados do quiz');
        } finally {
            setLoading(false);
        }
    };

    const calculateAverageScore = () => {
        if (!results?.results?.length) return 0;
        const completedResults = results.results.filter(r => r.status === 'completed');
        if (completedResults.length === 0) return 0;
        const total = completedResults.reduce((acc, curr) => acc + curr.score_percentage, 0);
        return Math.round(total / completedResults.length);
    };

    if (loading) return <PageLoader />;
    if (!results) return null;

    const averageScore = calculateAverageScore();
    const completedCount = results.results.filter(r => r.status === 'completed').length;
    const totalStudents = results.results.length;

    return (
        <div className="space-y-6">
            <Card className="bg-white shadow-lg border border-gray-100">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                                {results.quiz_title}
                            </CardTitle>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Users className="h-5 w-5" />
                                    <span>Total de Questões: {results.total_questions}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Award className="h-5 w-5" />
                                    <span>Pontuação Máxima: {results.max_points}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <CheckCircle className="h-5 w-5" />
                                    <span>Concluídos: {completedCount}/{totalStudents}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="text-sm text-blue-600 font-medium mb-1">Média da Turma</div>
                            <div className="text-2xl font-bold text-blue-700">{averageScore}%</div>
                            <Progress value={averageScore} className="mt-2" />
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid gap-4">
                {results.results.map((result) => (
                    <Card key={result.student_id} className="bg-white shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-full ${
                                        result.status === 'not_started' 
                                            ? 'bg-yellow-100' 
                                            : result.score_percentage >= 70 
                                                ? 'bg-green-100' 
                                                : 'bg-red-100'
                                    }`}>
                                        {result.status === 'not_started' ? (
                                            <AlertCircle className="h-6 w-6 text-yellow-600" />
                                        ) : result.score_percentage >= 70 ? (
                                            <Award className="h-6 w-6 text-green-600" />
                                        ) : (
                                            <Target className="h-6 w-6 text-red-600" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">{result.name}</h3>
                                        <p className="text-sm text-gray-600">{result.email}</p>
                                        <p className="text-sm text-gray-500 mt-1">Matrícula: {result.enrollment}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    {result.status === 'not_started' ? (
                                        <div className="text-yellow-600 font-medium">Não iniciado</div>
                                    ) : (
                                        <>
                                            <div className={`text-2xl font-bold ${result.score_percentage >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                                                {result.score_percentage}%
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {result.correct_answers}/{result.total_questions} acertos
                                            </div>
                                            <Progress 
                                                value={result.score_percentage} 
                                                className={`w-32 ${result.score_percentage >= 70 ? 'bg-green-100' : 'bg-red-100'}`}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                            {result.status !== 'not_started' && (
                                <div className="mt-4 flex flex-wrap items-center justify-between text-sm text-gray-500 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>Início: {new Date(result.started_at).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {result.status === 'completed' ? (
                                            <>
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <span>Concluído: {new Date(result.finished_at).toLocaleString()}</span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="h-4 w-4 text-red-500" />
                                                <span>Não concluído</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}