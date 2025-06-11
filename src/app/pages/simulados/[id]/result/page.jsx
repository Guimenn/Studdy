"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Cookies from "js-cookie";
import Logo from "@/components/ui/logo";
import { CheckCircle, CircleCheck, Clock } from "lucide-react";
import { PageLoader } from "@/components/ui/loader";

export default function SimuladoResultadoPage() {
    const router = useRouter();
    const params = useParams();
    const attemptId = params.id;
    const [loading, setLoading] = useState(true);
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResultado = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = Cookies.get("token");
                if (!token) throw new Error("Token não encontrado");

                console.log('Buscando resultados para tentativa:', attemptId);
                const response = await fetch(`https://api-studdy.onrender.com/student/attempt/${attemptId}/responses`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Erro ao buscar resultado do simulado");
                }

                const data = await response.json();
                console.log('Resultados recebidos:', data);
                setResultado(data);
            } catch (err) {
                console.error('Erro ao buscar resultados:', err);
                setError(err.message);
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (attemptId) fetchResultado();
    }, [attemptId]);

    if (loading) return <PageLoader />;
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
    if (!resultado) return null;

    const correctAnswers = resultado.responses.filter(r => r.is_correct).length;
    const totalQuestions = resultado.responses.length;
    const totalPossiblePoints = resultado.responses.reduce((sum, resp) => sum + parseInt(resp.question.points), 0);
    const scorePercentage = totalPossiblePoints > 0 ? Math.round((parseInt(resultado.total_score) / totalPossiblePoints) * 100) : 0;
    const correctPercentage = Math.round((correctAnswers / totalQuestions) * 100);
    const timeInMinutes = Math.round((new Date(resultado.finished_at) - new Date(resultado.started_at)) / 1000 / 60);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="container mx-auto p-4 md:p-6">
                <div className="mx-auto">
                    <div className="flex flex-col items-center mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <Logo className="h-12 w-12" variant="icon" />
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#133D86]">{resultado.quiz.title}</h1>
                        <p className="mt-2 text-center text-gray-600">{resultado.quiz.description}</p>
                        
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-blue-600 font-medium">Pontuação Total</p>
                                        <p className="text-2xl font-bold text-blue-700 mt-1">
                                            {resultado.total_score} / {totalPossiblePoints}
                                        </p>
                                        <p className="text-sm text-blue-600 mt-1">
                                            {scorePercentage}% de acerto
                                        </p>
                                    </div>
                                    <div className="bg-blue-100 p-3 rounded-lg">
                                        <CheckCircle className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-green-600 font-medium">Respostas Corretas</p>
                                        <p className="text-2xl font-bold text-green-700 mt-1">
                                            {correctAnswers} / {totalQuestions}
                                        </p>
                                        <p className="text-sm text-green-600 mt-1">
                                            {correctPercentage}% de acerto
                                        </p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-lg">
                                        <CircleCheck className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-purple-600 font-medium">Tempo Total</p>
                                        <p className="text-2xl font-bold text-purple-700 mt-1">
                                            {timeInMinutes} min
                                        </p>
                                    </div>
                                    <div className="bg-purple-100 p-3 rounded-lg">
                                        <Clock className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm text-purple-600">
                                        Início: {new Date(resultado.started_at).toLocaleTimeString()}
                                    </p>
                                    <p className="text-sm text-purple-600">
                                        Fim: {new Date(resultado.finished_at).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {resultado.responses.map((resp, idx) => (
                            <Card key={resp.question.id} className="border border-gray-100 bg-white">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg font-semibold text-gray-800">
                                            Questão {idx + 1}
                                        </CardTitle>
                                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            resp.is_correct 
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {resp.is_correct ? 'Correta' : 'Incorreta'}
                                        </div>
                                    </div>
                                    <p className="mt-2 text-gray-600">{resp.question.statement}</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {resp.question?.alternatives?.map((alternativa) => {
                                            const isSelected = resp.marked_alternative?.id === alternativa.id;
                                            const isCorrect = alternativa.correct_alternative;
                                            
                                            let alternativeClass = "p-3 border rounded-lg ";
                                            if (isCorrect) {
                                                alternativeClass += "bg-green-50 border-green-200";
                                            } else if (isSelected && !isCorrect) {
                                                alternativeClass += "bg-red-50 border-red-200";
                                            } else {
                                                alternativeClass += "bg-gray-50 border-gray-200";
                                            }

                                            return (
                                                <div key={alternativa.id} className={alternativeClass}>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium
                                                            ${isCorrect ? 'bg-green-100 text-green-800' : 
                                                              isSelected ? 'bg-red-100 text-red-800' : 
                                                              'bg-gray-100 text-gray-800'}`}>
                                                            {String.fromCharCode(65 + resp.question.alternatives.findIndex(alt => alt.id === alternativa.id))}
                                                        </span>
                                                        <p className={`font-medium ${
                                                            isCorrect ? 'text-green-700' : 
                                                            isSelected ? 'text-red-700' : 
                                                            'text-gray-700'
                                                        }`}>
                                                            {alternativa.response}
                                                        </p>
                                                    </div>
                                                    {(isSelected || isCorrect) && (
                                                        <p className="text-xs mt-1 ml-8 text-gray-500">
                                                            {isCorrect ? '✓ Resposta correta' : isSelected ? '✗ Sua resposta' : ''}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-center">
                        <Button
                            onClick={() => router.push('/pages/simulados')}
                            className="bg-[#133D86] hover:bg-[#0e2a5c] text-white transition-all duration-300 shadow-md hover:shadow-lg rounded-lg font-medium text-sm flex items-center gap-2 py-4 px-6"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            Voltar para Simulados
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}